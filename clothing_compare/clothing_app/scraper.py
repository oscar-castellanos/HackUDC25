import sys
import json
import requests
from bs4 import BeautifulSoup
from clothing_compare.clothing_app.models import Clothing_detail

ALLOWED_DOMAINS = ["zara.com"]

ZARA_DICTIONARY= {
    "color": ("p", "class", "product-color-extended-name product-detail-info__color"),
    "description": ("div", "class", "product-detail-description product-detail-info__description"),
    "materials": ("div", "class","product-detail-composition"),
}

FABRICS_DICTIONARY= {
    "cotton": 0.2,
    "viscose": 0.4,
    "silk": 0.6,
    "polyester": 0.8,
    "wool": 1.0,
}

# Dummy function, to be replaced by an accurate one
def calculate_score(clothing_result):
    score = 0
    for material in clothing_result.composition:
        material_name = material["material"].lower()
        material_percentage = int(material["percentage"])
        score += material_percentage * FABRICS_DICTIONARY.get(material_name, 0)
    return score

def get_base_name(url):
    from urllib.parse import urlparse

    parsed_url = urlparse(url)
    base_url = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_url)
    
    return base_url

def get_domain(url):
    from urllib.parse import urlparse

    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    
    return domain

def get_webpage(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.text
    else:
        raise Exception(f"Failed to retrieve data: {response.status_code}")


def obtain_webpage(url):
    # Get the original webpage of the Inditex product
    og_webpage = get_webpage(url)
    
    # Check the meta tag for the redirect to the REAL url
    soup = BeautifulSoup(og_webpage, "html.parser")
    meta_tag = soup.find("meta", attrs={"http-equiv": "refresh"})
    if meta_tag:
        # Find the first = and take the latter part of the string
        i = meta_tag['content'].find("=")
        redirect_url = meta_tag['content'][i+2:-1]
        og_url = get_base_name(url)
        final_url = og_url + redirect_url
        return get_webpage(final_url)
    else:
        raise Exception("No redirect found")

def get_image_zara(webpage):
    soup = BeautifulSoup(webpage, "html.parser")
    script_tag = soup.find("script", attrs={"type": "application/ld+json"})
    if script_tag:
        script_tag = json.loads(script_tag.text)
        image = script_tag[0]["image"]
    else:
        image = "Not found"
    return image

def parse_tags(webpage, tags, dictionary):
    soup = BeautifulSoup(webpage, "html.parser")
    tag_info = {}
    for tag in tags:
        tag_type, tag_attr, tag_class = dictionary[tag]
        tag_text = soup.find(tag_type, attrs={tag_attr: tag_class})
        if tag_text:
            tag_info[tag] = tag_text.text
        else:
            tag_info[tag] = "Not found"
            print(f"Tag {tag} not found")
    return tag_info


def get_materials_zara(tags):
    # Zara Example : Materials: Composition: 55% viscose, 45% cotton
    # The objetive is an array of dict with each material and its percentage
    
    # Get the materials tag
    materials = tags["materials"]
    
    if tags["materials"] == "Not found":
        return {}
    
    # Take out the "Composition" word
    materials = materials.split(":")[1]

    # Split the materials by comma
    materials = materials.split(",")
    
    # Create the array of dict
    materials_array = []
    
    for material in materials:
        # Split the material by percentage
        material = material.strip()
        i = material.find("%")
        # Get the percentage and the material name
        percentage = material[i-2:i]
        material_name = material[i+1:]
        materials_array.append({"material": material_name.strip(), "percentage": percentage})
        
    return materials_array
        
def get_color_zara(tags):
    # Zara Example Black | 1618/475/800
    # Get the color from the scrapped text.
    
    # Get the color tag
    color = tags["color"]
    
    # Split the color by the pipe
    color = color.split("|")[0]
    
    color.strip()
    
    return color

def get_info (vision_result):
    """
    Example of Visual Result:
    {
        "id": "412874889",
        "name": "3-PACK OF PLAIN T-SHIRTS",
        "price": {
            "currency": "EUR",
            "value": {
                "current": 14.95,
                "original": null
            }
        },
        "link": "https://zara.com/es/en/-P01887707.html",
        "brand": "zara"
    }
    """
    
    clothing_result = Clothing_detail()
    clothing_result.clothing_id = vision_result["id"]
    clothing_result.name = vision_result["name"]
    clothing_result.price_currency = vision_result["price"]["currency"]
    clothing_result.price_current = vision_result["price"]["value"]["current"]
    clothing_result.price_original = vision_result["price"]["value"]["original"]
    
    if vision_result["link"]:
        clothing_result.link = vision_result["link"]
    else:
        raise Exception("No link provided in the vision result")

    clothing_result.brand = vision_result["brand"]
    
    tags_results = {}
    
    # Get the domain
    domain = get_domain(clothing_result.link)
    
    if domain not in ALLOWED_DOMAINS:
        raise Exception(f"Domain {domain} not allowed")
    
    # Get the webpage
    webpage = obtain_webpage(clothing_result.link)
    
    # Check domain, get tags and get image
    if domain == "zara.com":
        tags_results = parse_tags(webpage, ZARA_DICTIONARY.keys(), ZARA_DICTIONARY)
        clothing_result.image_url = get_image_zara(webpage)
        clothing_result.color = get_color_zara(tags_results)
        clothing_result.description = tags_results["description"]
        clothing_result.composition = get_materials_zara(tags_results)
    else:
        raise Exception(f"Domain {domain} not implemented")
    
    # Check if composition is empty dictionary
    if not clothing_result.composition:
        clothing_result.score = -1
    else:
        clothing_result.score = calculate_score(clothing_result)
        
        
    return clothing_result