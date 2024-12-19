import requests
from colorthief import ColorThief
from io import BytesIO
from PIL import Image


def rgb_to_hex(rgb):
    """Convert RGB tuple to HEX string."""
    return "#{:02x}{:02x}{:02x}".format(rgb[0], rgb[1], rgb[2])


def get_dominant_color(image_uri):
    try:
        # Download the image from the URL
        response = requests.get(image_uri)
        response.raise_for_status()

        # Open the image using PIL
        image = Image.open(BytesIO(response.content))

        # Resize the image quickly to a fixed size (e.g., 100x100) for faster processing
        image = image.resize(
            (100, 100), Image.Resampling.LANCZOS
        )  # Use LANCZOS instead of ANTIALIAS

        # Save the resized image to a BytesIO object
        with BytesIO() as byte_io:
            image.save(
                byte_io, format="JPEG", quality=70
            )  # Optional: Reduce quality for speed
            byte_io.seek(0)  # Reset pointer to the beginning

            # Initialize ColorThief with the resized image
            color_thief = ColorThief(byte_io)

            # Get the dominant color (RGB tuple)
            dominant_color_rgb = color_thief.get_color()

            # Convert RGB to HEX
            dominant_color_hex = rgb_to_hex(dominant_color_rgb)

        print(f"dominant_color_hex: {dominant_color_hex}")
        return dominant_color_hex
    except Exception as e:
        print(f"Error occurred: {e}")
        return None
