from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.shortcuts import get_object_or_404
from .gemini import (
    generate_ai_outline,
    generate_xml_presentation,
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
from .xml_parser import parse_xml_presentation, extract_heading_from_xml, get_fallback_image_query

load_dotenv()


class GenerateXMLPresentationView(APIView):
    """
    Modern AI-powered XML presentation generation
    Only XML-based generation is supported with intelligent image handling
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
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
        num_slides = len(slide_titles)

        # Generate XML presentation using AI
        xml_content = generate_xml_presentation(title, slide_titles, num_slides)

        if not xml_content:
            return Response(
                {"error": "Failed to generate XML presentation."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
        # Clean XML content
        xml_content = xml_content.replace("```xml", "").replace("```", "").strip()
        print("Generated XML Content:")
        print(xml_content)

        # Parse XML and create slides
        slides_data = parse_xml_presentation(xml_content, title)

        if not slides_data:
            return Response(
                {"error": "Failed to parse generated XML."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Save XML content to project
        project.xml_content = xml_content
        project.save()

        try:
            # Delete existing slides
            Slide.objects.filter(project=project).delete()

            # Create new slides from parsed XML
            for slide_data in slides_data:
                img_url = None
                dominant_color = "#667eea"  # Default color

                # Only fetch image if XML contains IMG tags
                if slide_data["has_images"] and slide_data["img_queries"]:
                    print(f"Slide {slide_data['slide_number']}: Found IMG tags, fetching image...")
                    img_query = slide_data["img_queries"][0]  # Use first query
                    img_url = get_img_link(img_query)
                    print(f"Image URL from Pexels: {img_url}")
                elif slide_data["section_layout"] in ["left", "right", "vertical"]:
                    # If section layout expects an image but no IMG tag, use fallback
                    print(f"Slide {slide_data['slide_number']}: No IMG tags but layout expects image, using fallback...")
                    fallback_query = get_fallback_image_query(
                        slide_data["content"], 
                        slide_data["layout_type"], 
                        title
                    )
                    img_url = get_img_link(fallback_query)
                    print(f"Fallback image URL: {img_url}")
                else:
                    print(f"Slide {slide_data['slide_number']}: No images required for this layout")

                # Set default image if none found and layout needs one
                if img_url is None and slide_data["section_layout"] in ["left", "right", "vertical"]:
                    img_url = "https://img.freepik.com/free-photo/fantasy-style-scene-international-day-education_23-2151040298.jpg"

                # Get dominant color only if we have an image
                if img_url and mode:
                    try:
                        dominant_color = get_dominant_color(img_url)
                        print(f"Dominant color extracted: {dominant_color}")
                    except Exception as e:
                        print(f"Failed to extract dominant color: {e}")
                        dominant_color = "#667eea"

                # Extract heading from XML content
                heading = extract_heading_from_xml(slide_data["xml_content"])

                # Create slide content
                slide_content = {
                    "heading": heading,
                    **slide_data["content"]  # Merge the parsed content
                }

                # Save slide
                slide_instance = Slide(
                    project=project,
                    slide_number=slide_data["slide_number"],
                    content=slide_content,
                    xml_content=slide_data["xml_content"],
                    layout_type=slide_data["layout_type"],
                    section_layout=slide_data["section_layout"],
                    img_url=img_url,
                    dominant_color=dominant_color,
                )
                slide_instance.save()
                print(f"Saved slide {slide_data['slide_number']} with layout {slide_data['layout_type']}")

            # Fetch and serialize slides
            saved_slides = Slide.objects.filter(project=project).order_by("slide_number")
            serialized_slides = SlideSerializer(saved_slides, many=True).data

        except Exception as e:
            print(f"Error creating slides: {str(e)}")
            return Response(
                {"error": f"Failed to create slides: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        response_data = {
            "project_id": project.id,
            "title": project.title,
            "xml_content": xml_content,
            "slides": serialized_slides,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class ProjectsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, project_id=None):
        if project_id:
            try:
                if request.user.is_authenticated:
                    project = Project.objects.get(id=project_id, user=request.user)
                else:
                    project = Project.objects.get(id=project_id, is_public=True)

            except Project.DoesNotExist:
                return Response(
                    {"detail": "Project not found or not accessible."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            slides = Slide.objects.filter(project=project).order_by("slide_number")
            serialized_slides = SlideSerializer(slides, many=True).data
            response_data = {
                "project_id": project_id,
                "is_public": project.is_public,
                "title": project.title,
                "slides": serialized_slides,
                "description": project.description,
                "xml_content": project.xml_content,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        return Response(
            {"detail": "Project ID is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_object(self):
        project = super().get_object()
        if project.user != self.request.user:
            raise PermissionDenied("You do not have permission to edit this project.")
        return project

    def patch(self, request, *args, **kwargs):
        project = self.get_object()
        serializer = self.get_serializer(project, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

        img_url = request.data.get("img_url")
        if img_url:
            try:
                dominant_color = get_dominant_color(img_url)
                if dominant_color:
                    request.data["dominant_color"] = dominant_color
            except Exception as e:
                print(f"Failed to extract dominant color: {e}")

        serializer = SlideSerializer(slide, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Slide updated successfully", "slide": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id, *args, **kwargs):
        slide = get_object_or_404(Slide, pk=id, project__user=request.user)
        slide.delete()
        return Response(
            {"message": "Slide deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )

class UserProfileView(generics.RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class ReorderSlidesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        try:
            project = Project.objects.get(id=project_id, user=request.user)
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found or you don't have access to it."},
                status=status.HTTP_404_NOT_FOUND,
            )

        new_order = request.data.get("new_order")
        if not new_order or len(new_order) != len(project.slides.all()):
            return Response(
                {"detail": "Invalid slide order."}, status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            for index, slide_id in enumerate(new_order):
                try:
                    slide = Slide.objects.get(id=slide_id, project=project)
                    slide.slide_number = index + 1
                    slide.save()
                except Slide.DoesNotExist:
                    return Response(
                        {"detail": f"Slide with ID {slide_id} not found."},
                        status=status.HTTP_404_NOT_FOUND,
                    )

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
                description=prompt,
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


class GenerateSlideTitleView(APIView):
    """
    Generate AI-suggested slide titles based on existing presentation content
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            project = Project.objects.get(id=pk, user=request.user)
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Get existing slides for context
        existing_slides = Slide.objects.filter(project=project).order_by("slide_number")
        
        # Create context from existing slides
        context_info = {
            "project_title": project.title,
            "project_description": project.description,
            "existing_slides": [
                {
                    "slide_number": slide.slide_number,
                    "heading": slide.content.get("heading", ""),
                    "layout_type": slide.layout_type
                }
                for slide in existing_slides
            ]
        }

        # Generate suggested titles using AI
        try:
            from .gemini import generate_slide_title_suggestions
            
            # Call AI function to generate titles
            slide_titles = generate_slide_title_suggestions(
                project.title,
                project.description,
                context_info
            )
            
            return Response(
                {"slide_titles": slide_titles},
                status=status.HTTP_200_OK,
            )
            
        except Exception as e:
            print(f"Error generating slide titles: {str(e)}")
            # Fallback titles if AI fails
            fallback_titles = [
                f"Key Insights for {project.title}",
                f"Strategic Overview of {project.title}",
                f"Implementation Framework",
                f"Next Steps and Recommendations",
                f"Conclusion and Takeaways"
            ]
            
            return Response(
                {"slide_titles": fallback_titles},
                status=status.HTTP_200_OK,
            )


class AddSlideView(APIView):
    """
    Add a new slide to an existing presentation
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            project = Project.objects.get(id=pk, user=request.user)
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )

        slide_title = request.data.get("title")
        if not slide_title:
            return Response(
                {"error": "Slide title is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Get the next slide number
            last_slide = Slide.objects.filter(project=project).order_by("-slide_number").first()
            next_slide_number = (last_slide.slide_number + 1) if last_slide else 1

            # Generate single slide content using AI
            from .gemini import generate_single_slide_xml
            
            # Create context for AI generation
            context = {
                "project_title": project.title,
                "project_description": project.description,
                "slide_title": slide_title,
                "existing_slides_count": Slide.objects.filter(project=project).count()
            }
            
            # Generate XML for this single slide
            xml_content = generate_single_slide_xml(slide_title, context)
            
            if not xml_content:
                raise Exception("Failed to generate slide content")

            # Clean XML content
            xml_content = xml_content.replace("```xml", "").replace("```", "").strip()

            # Parse the generated XML
            from .xml_parser import parse_single_slide_xml
            slide_data = parse_single_slide_xml(xml_content, next_slide_number, slide_title)

            if not slide_data:
                raise Exception("Failed to parse generated slide XML")

            # Handle image generation
            img_url = None
            dominant_color = "#667eea"
            
            # Get image if layout requires it
            if slide_data["section_layout"] in ["left", "right", "vertical"]:
                if slide_data["has_images"] and slide_data["img_queries"]:
                    img_query = slide_data["img_queries"][0]
                    img_url = get_img_link(img_query)
                else:
                    # Generate fallback image query
                    from .xml_parser import get_fallback_image_query
                    fallback_query = get_fallback_image_query(
                        slide_data["content"], 
                        slide_data["layout_type"], 
                        project.title
                    )
                    img_url = get_img_link(fallback_query)

                # Extract dominant color if we have an image
                if img_url and settings.DEBUG:
                    try:
                        dominant_color = get_dominant_color(img_url)
                    except Exception as e:
                        print(f"Failed to extract dominant color: {e}")
                        dominant_color = "#667eea"

            # Extract heading from XML
            from .xml_parser import extract_heading_from_xml
            heading = extract_heading_from_xml(slide_data["xml_content"])

            # Create slide content
            slide_content = {
                "heading": heading,
                **slide_data["content"]
            }

            # Create and save the new slide
            new_slide = Slide(
                project=project,
                slide_number=next_slide_number,
                content=slide_content,
                xml_content=slide_data["xml_content"],
                layout_type=slide_data["layout_type"],
                section_layout=slide_data["section_layout"],
                img_url=img_url,
                dominant_color=dominant_color,
            )
            new_slide.save()

            # Return all slides for the project (updated)
            all_slides = Slide.objects.filter(project=project).order_by("slide_number")
            serialized_slides = SlideSerializer(all_slides, many=True).data

            return Response(
                {
                    "message": "Slide added successfully",
                    "slide": SlideSerializer(new_slide).data,
                    "slides": serialized_slides
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            print(f"Error adding slide: {str(e)}")
            return Response(
                {"error": f"Failed to add slide: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
