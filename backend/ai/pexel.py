import requests
import os
from dotenv import load_dotenv


def get_img_link(img_keyword):
    load_dotenv()
    pexel_api = os.getenv("PEXELS_API") 
    url = "https://api.pexels.com/v1/search"  
    headers = {"Authorization": pexel_api}
    params = {"query": img_keyword, "per_page": 1}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        if "photos" in data and len(data["photos"]) > 0:
            original_image_url = data["photos"][0]["src"]["original"]
            return original_image_url
        else:
            return None 

    except Exception as e:
        print(f"Error occurred: {e}")
        return None


