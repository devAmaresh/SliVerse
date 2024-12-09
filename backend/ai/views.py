from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .gemini import generate_ai_content
import json
from .models import Project, Slide
from .serializers import SlideSerializer  # Importing the Slide serializer
from rest_framework.permissions import IsAuthenticated


class GenerateSlideView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Generate AI content based on the prompt
        prompt = request.data.get("prompt")
        if not prompt:
            return Response(
                {"error": "Prompt is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response = generate_ai_content(prompt)

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
            "title": slides_data.get("title", "Untitled"),
            "slides": serialized_slides,
        }

        return Response(response_data, status=status.HTTP_200_OK)
