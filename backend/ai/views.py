from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .gemini import generate_ai_content
import json
from .models import Project, Slide
from .serializers import SlideSerializer, ProjectSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
import os
import requests
from dotenv import load_dotenv

load_dotenv()


class GenerateSlideView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Generate AI content based on the prompt
        prompt = request.data.get("prompt")
        num_slides = request.data.get("num_pages")
        if not prompt:
            return Response(
                {"error": "Prompt is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response = generate_ai_content(prompt,num_slides)

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
            project = Project.objects.create(
                user=request.user,
                title=slides_data.get("title", "Untitled"),
                description=prompt,  # Assuming 'description' refers to the prompt
            )

            slides = [
                Slide(
                    project=project,
                    slide_number=i + 1,
                    content=slide,
                )
                for i, slide in enumerate(slides_data["slides"])
            ]
            Slide.objects.bulk_create(slides)  # Bulk create for efficiency

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
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id=None):
        # Case where project_id is provided (single project with slides)
        if project_id:
            try:
                # Get the project
                project = Project.objects.get(id=project_id, user=request.user)
            except Project.DoesNotExist:
                return Response(
                    {"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND
                )

            # Get the slides for the project
            slides = Slide.objects.filter(project=project)

            serialized_slides = SlideSerializer(
                slides, many=True
            ).data  # Serialize slides
            response_data = {
                "project_id": project_id,
                "title": project.title,
                "slides": serialized_slides,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        # Case where no project_id is provided (list all projects)
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
