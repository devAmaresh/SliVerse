import google.generativeai as genai
import os
import dotenv
import json
from django.conf import settings

# Load environment variables from .env file
dotenv.load_dotenv()


def generate_ai_content(prompt: str):
    # Retrieve the API key from the environment variable
    api_key = os.getenv("GEMINI_API")
    if not api_key:
        raise ValueError("GEMINI_API environment variable is not set.")

    # Configure the API with the provided key
    genai.configure(api_key=api_key)

    # Instantiate the model (ensure "gemini-1.5-flash" is valid)
    model = genai.GenerativeModel("gemini-1.5-flash")

    try:
        # Get the absolute path for the prompt.txt file
        prompt_file_path = os.path.join(settings.BASE_DIR, "ai", "prompt.txt")

        # Read the prompt from the txt file
        with open(prompt_file_path, "r") as file:
            slide_prompt = file.read()

        # Format the slide prompt with the provided topic
        slide_prompt = slide_prompt.replace("{prompt}", prompt)

        # Send the slide generation request to the model
        response = model.generate_content(slide_prompt)

        # Check if the response contains text
        if response and hasattr(response, "text"):
            content = response.text
            content = content.replace("```json", "").replace("```", "").strip()
            return content
        else:
            return "Error: No content generated."

    except Exception as e:
        # Return the error message in case of any issues
        return f"Error during API request: {e}"
