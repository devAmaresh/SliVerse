from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.shortcuts import get_object_or_404
from .gemini import (
    generate_ai_content,
    generate_ai_content_slide,
    generate_ai_title_slide,
    generate_ai_outline,
)
import json
from .models import Project, Slide, UserProfile
from .serializers import SlideSerializer, ProjectSerializer, UserProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
import os
import requests
from dotenv import load_dotenv
from .pexel import get_img_link
from .getImgColor import get_dominant_color
from django.conf import settings
from django.db import transaction

load_dotenv()


class GenerateSlideView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        # Generate AI content based on the prompt
        project_id = pk
        slide_titles = request.data.get("slide_titles", [])

        mode = settings.DEBUG
        try:
            project = Project.objects.get(id=project_id, user=request.user)
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )
        title = project.title
        response = generate_ai_content(title, slide_titles)

        try:
            slides_data = json.loads(response)
        except json.JSONDecodeError:
            return Response(
                {"error": "Failed to decode JSON response."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate response structure
        if not isinstance(slides_data, dict) or "slides" not in slides_data:
            return Response(
                {"error": "Invalid JSON structure: Missing 'slides' or 'title'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create Project and associated Slides
        try:

            for i, slide in enumerate(slides_data["slides"]):
                img_url = None
                img_keywords = slide.get("img_keywords", [])

                if img_keywords:
                    img_query = " ".join(img_keywords)
                    img_url = get_img_link(img_query)
                if img_url is None:
                    img_url = "https://img.freepik.com/free-photo/fantasy-style-scene-international-day-education_23-2151040298.jpg"
                dominant_color = "#ffdbac"
                if mode:
                    dominant_color = get_dominant_color(img_url)

                # Create Slide object with image URL
                slide_content = {
                    "style": slide.get("style", "default"),
                    "heading": slide.get("heading", ""),
                    "body": slide.get("body", {}),
                    "key_message": slide.get("key_message", ""),
                    "img_keywords": img_keywords,
                }

                # Save each slide one-by-one
                slide_instance = Slide(
                    project=project,
                    slide_number=i + 1,
                    content=slide_content,
                    img_url=img_url,  # Save generated image URL
                    dominant_color=dominant_color,
                )
                slide_instance.save()  # Save the slide one by one

            # Fetch the slides from the database
            saved_slides = Slide.objects.filter(project=project).order_by(
                "slide_number"
            )

            serialized_slides = SlideSerializer(
                saved_slides, many=True
            ).data  # Serialize slides

        except Exception as e:
            return Response(
                {"error": f"Failed to create slides: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Construct response matching the structure of slides_data
        response_data = {
            "project_id": project.id,
            "title": slides_data.get("title", "Untitled"),
            "slides": serialized_slides,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class ProjectsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, project_id=None):
        # Case where project_id is provided (single project with slides)
        if project_id:
            try:
                # First, check if the user is authenticated
                if request.user.is_authenticated:
                    # If the user is authenticated, get the project belonging to that user
                    project = Project.objects.get(id=project_id, user=request.user)
                else:
                    # If the user is not authenticated, check if the project is public
                    project = Project.objects.get(id=project_id, is_public=True)

            except Project.DoesNotExist:
                return Response(
                    {"detail": "Project not found or not accessible."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Get the slides for the project
            slides = Slide.objects.filter(project=project)

            # Serialize the slides
            serialized_slides = SlideSerializer(slides, many=True).data
            response_data = {
                "project_id": project_id,
                "is_public": project.is_public,
                "title": project.title,
                "slides": serialized_slides,
                "description": project.description,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        # If no project_id is provided, return an error or another appropriate response
        return Response(
            {"detail": "Project ID is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()  # Use all projects as the base queryset
    serializer_class = (
        ProjectSerializer  # Specify the serializer to use for updating the project
    )

    def get_object(self):
        """
        Override the get_object method to get the project based on the pk (primary key)
        and ensure the project belongs to the authenticated user.
        """
        # Use the default get_object method, which looks up by 'pk' automatically
        project = super().get_object()

        # Check if the project belongs to the authenticated user
        if project.user != self.request.user:
            raise PermissionDenied("You do not have permission to edit this project.")
        return project

    def patch(self, request, *args, **kwargs):
        """
        Handle partial updates (PATCH request) using the ProjectSerializer.
        """
        project = self.get_object()  # Get the project instance based on pk

        # Serialize the incoming data for validation and update
        serializer = self.get_serializer(
            project, data=request.data, partial=True
        )  # partial=True allows partial updates

        if serializer.is_valid():
            serializer.save()  # Save the updated project
            return Response(
                serializer.data, status=status.HTTP_200_OK
            )  # Return the updated project data
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )  # Return validation errors


class ProjectsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(user=request.user).order_by("-updated_at")
        serialized_projects = ProjectSerializer(projects, many=True).data

        return Response(serialized_projects, status=status.HTTP_200_OK)

    def delete(self, request, project_id):
        try:
            project = Project.objects.get(id=project_id, user=request.user)
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND
            )

        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        sys_client_id = os.getenv("GOOGLE_CLIENT_ID")

        if not token:
            return Response(
                {"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Verify token with Google
        google_token_info_url = (
            f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
        )
        response = requests.get(google_token_info_url)
        if response.status_code != 200:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )

        google_data = response.json()
        if google_data.get("aud") != sys_client_id:
            return Response(
                {"error": "Invalid client ID"}, status=status.HTTP_400_BAD_REQUEST
            )

        email = google_data.get("email")
        if not email:
            return Response(
                {"error": "Email not found in token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if user already exists
        # print(google_data)
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": google_data.get("given_name", ""),
                "last_name": google_data.get("family_name", ""),
            },
        )
        UserProfile.objects.get_or_create(
            user=user,
            profile_picture=google_data.get(
                "picture",
                "https://avatar.iran.liara.run/public",
            ),
        )

        # Generate JWT Token
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "username": user.username,
            },
            status=status.HTTP_200_OK,
        )

    queryset = None


class SlideEditView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id, *args, **kwargs):
        slide = get_object_or_404(Slide, pk=id, project__user=request.user)

        # Check if 'img_url' is in the request data
        img_url = request.data.get("img_url")
        if img_url:
            # Get the dominant color if the img_url is being updated
            dominant_color = get_dominant_color(img_url)
            if dominant_color:
                request.data["dominant_color"] = dominant_color

        # Deserialize and validate input data
        serializer = SlideSerializer(slide, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Slide updated successfully", "slide": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class AddSlideView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        project_id = pk
        prompt = request.data.get("title")  # User-provided text for the new slide
        mode = settings.DEBUG

        # Validate inputs
        if not project_id or not prompt:
            return Response(
                {"error": "Both 'project_id' and 'prompt' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Fetch the project
            project = Project.objects.get(id=project_id, user=request.user)
            project_title = project.title
            response = generate_ai_content_slide(prompt, project_title)
            slide_data = response
            # Fetch the last slide number
            last_slide = (
                Slide.objects.filter(project=project).order_by("-slide_number").first()
            )
            next_slide_number = (last_slide.slide_number if last_slide else 0) + 1

            # Generate image for the slide
            img_url = None
            img_keywords = slide_data.get("img_keywords", [])
            if img_keywords:
                img_query = " ".join(img_keywords)
                img_url = get_img_link(img_query)
            if img_url is None:
                img_url = "https://img.freepik.com/free-photo/fantasy-style-scene-international-day-education_23-2151040298.jpg"
            dominant_color = "#ffdbac"
            if mode:
                dominant_color = get_dominant_color(img_url)

            # Save the new slide
            slide_instance = Slide(
                project=project,
                slide_number=next_slide_number,
                content=slide_data,
                img_url=img_url,
                dominant_color=dominant_color,
            )
            slide_instance.save()

            # Serialize and return the updated slides
            updated_slides = Slide.objects.filter(project=project).order_by(
                "slide_number"
            )
            serialized_slides = SlideSerializer(updated_slides, many=True).data

            return Response(
                {"message": "Slide added successfully.", "slides": serialized_slides},
                status=status.HTTP_200_OK,
            )

        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to add slide: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class GenerateSlideTitleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            # Fetch project by ID
            project = Project.objects.get(id=pk, user=request.user)
            project_title = project.title

            # Extract existing slide titles
            existing_slides = Slide.objects.filter(project=project).order_by(
                "slide_number"
            )
            existing_titles = [
                slide.content.get("heading", "") for slide in existing_slides
            ]

            response = generate_ai_title_slide(project_title, existing_titles)

            # Parse the response and ensure it's in valid JSON format
            try:
                slide_titles_data = json.loads(response)
                if "slide_titles" not in slide_titles_data:
                    raise ValueError("Missing 'slide_titles' key in AI response.")
            except (json.JSONDecodeError, ValueError) as e:
                return Response(
                    {"error": "Failed to parse AI response. Invalid format."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Return the generated slide titles
            return Response(
                {"slide_titles": slide_titles_data["slide_titles"]},
                status=status.HTTP_200_OK,
            )

        except Project.DoesNotExist:
            return Response(
                {
                    "error": "Project not found or you do not have permission to access it."
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ReorderSlidesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        # Get the project
        try:
            project = Project.objects.get(id=project_id, user=request.user)
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found or you don't have access to it."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Extract the new order of slide IDs from the request
        new_order = request.data.get("new_order")
        if not new_order or len(new_order) != len(project.slides.all()):
            return Response(
                {"detail": "Invalid slide order."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Begin a transaction to update the slides atomically
        with transaction.atomic():
            # For each slide in the new order, update the slide_number
            for index, slide_id in enumerate(new_order):
                try:
                    slide = Slide.objects.get(id=slide_id, project=project)
                    slide.slide_number = (
                        index + 1
                    )  # Set the slide number based on the new order
                    slide.save()
                except Slide.DoesNotExist:
                    return Response(
                        {"detail": f"Slide with ID {slide_id} not found."},
                        status=status.HTTP_404_NOT_FOUND,
                    )

        # Return success response
        return Response(
            {"detail": "Slides reordered successfully."}, status=status.HTTP_200_OK
        )


class ProjectOutlineView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        prompt = request.data.get("prompt")
        num_pages = request.data.get("num_pages")
        if not prompt or not num_pages:
            return Response(
                {"error": "Both 'prompt' and 'num_pages' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        project_id = request.data.get("project_id")

        response = generate_ai_outline(prompt, num_pages)
        try:
            outline_data = json.loads(response)
        except json.JSONDecodeError:
            return Response(
                {"error": "Failed to decode JSON response."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if project_id:
            try:
                project = Project.objects.get(id=project_id, user=request.user)
                project.title = outline_data.get("title", "Untitled")
                project.description = prompt
                project.save()
            except Project.DoesNotExist:
                return Response(
                    {"error": "Project not found or access denied."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return Response(
                {
                    "project_id": project.id,
                    "title": project.title,
                    "slide_titles": outline_data.get("slide_titles", []),
                },
                status=status.HTTP_200_OK,
            )
        try:
            project = Project.objects.create(
                user=request.user,
                title=outline_data.get("title", "Untitled"),
                description=prompt,  # Assuming 'description' refers to the prompt
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to create project: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            {
                "project_id": project.id,
                "title": project.title,
                "slide_titles": outline_data.get("slide_titles", []),
            },
            status=status.HTTP_200_OK,
        )
