from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .gemini import generate_ai_content
import json


class GenerateSlideView(APIView):
    permission_classes = []

    def post(self, request):
        # Generate AI content based on the prompt
        response = generate_ai_content(request.data.get("prompt"))

        print(response)
        try:
            slides = json.loads(response)
        except json.JSONDecodeError:
            return Response(
                {"error": "Failed to decode JSON response."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Optionally, clean any unwanted characters like newlines within the JSON content
        cleaned_response = json.dumps(slides, ensure_ascii=False)

        # Return the cleaned JSON response in the same structure
        return Response(json.loads(cleaned_response), status=status.HTTP_200_OK)

    queryset = None
