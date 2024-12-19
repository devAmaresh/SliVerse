from PIL import Image
import requests
from colorthief import ColorThief
from io import BytesIO


def rgb_to_hex(rgb):
    """Convert RGB tuple to HEX string."""
    return "#{:02x}{:02x}{:02x}".format(rgb[0], rgb[1], rgb[2])


def get_dominant_color(image_uri):
    try:
        # Download the image with streaming to avoid holding it fully in memory
        response = requests.get(image_uri, stream=True)
        response.raise_for_status()  # Check for any HTTP errors

        # Open the image using Pillow directly from the response content
        image = Image.open(response.raw)

        # Resize the image to a smaller size to save memory (e.g., 200x200)
        image = image.resize((200, 200))

        # Initialize ColorThief with the resized image
        color_thief = ColorThief(image)

        # Get the dominant color (RGB tuple)
        dominant_color_rgb = color_thief.get_color()

        # Convert RGB to HEX
        dominant_color_hex = rgb_to_hex(dominant_color_rgb)

        return dominant_color_hex
    except Exception as e:
        print(f"Error occurred: {e}")
        return None
