import sys
import json
import requests
import os

#from clothing_compare.clothing_app.external_apis.authenticator import authenticate
from .authenticator import authenticate

URL = "https://api.inditex.com/searchpmpa/products"
USER = os.environ.get("USER_INDITEX_API")
SECRET = os.environ.get("SECRET_INDITEX_API")

def product_finder(product_description, brand="", page=1, perPage=5):
    """
    Finds products based on the given description and optional brand.
    Args:
        product_description (str): The description of the product to search for.
        brand (str, optional): The brand of the product. Defaults to an empty string.
        page (int, optional): The page number of the results to retrieve. Defaults to 1.
        perPage (int, optional): The number of results per page. Defaults to 5.
    Returns:
        dict: The JSON response from the product search API.
    Raises:
        Exception: If authentication fails or if there is an error with the request.
    """
    token = authenticate(USER, SECRET)
    if token is None:
        raise Exception("Authentication failed")
    
    try:
        jwt = token["id_token"]
    except KeyError:
        raise Exception("Authentication failed. The Response did not contain the expected token. Response was: {}".format(token))
    
    headers = {
        "Authorization": f"Bearer {jwt}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
    params = {
        "query": f"{product_description}",
        "page": page,
        "perPage": perPage
    }
    
    if brand != "":
        params["brand"] = brand
        
    try:
        response = requests.get(URL, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        raise Exception(f"HTTP error occurred: {http_err}")
    except requests.exceptions.ConnectionError as conn_err:
        raise Exception(f"Connection error occurred: {conn_err}")
    except requests.exceptions.Timeout as timeout_err:
        raise Exception(f"Timeout error occurred: {timeout_err}")
    except requests.exceptions.RequestException as req_err:
        raise Exception(f"An error occurred: {req_err}")
    except json.JSONDecodeError as json_err:
        raise Exception(f"JSON decode error: {json_err}")
    
    raise Exception("An unexpected error occurred")