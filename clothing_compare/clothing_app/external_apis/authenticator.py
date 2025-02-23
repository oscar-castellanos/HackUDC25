import sys
import json
import requests
import os
from .singleton import Singleton

# Authenticator class to handle authentication with the API
class Authenticator(metaclass=Singleton):
    def __init__(self):
        self.__token = None

    def __obtain_token(self, user, secret):
        url = os.environ.get("ACCESTOKEN_URL_INDITEX_API")
        auth = (user, secret)
        data = {
            "grant_type": "client_credentials",
            "scope": "technology.catalog.read",
        }
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        }
        try:
            response = requests.post(url,data=data, headers=headers, auth=auth)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
        except requests.exceptions.ConnectionError as conn_err:
            print(f"Connection error occurred: {conn_err}")
        except requests.exceptions.Timeout as timeout_err:
            print(f"Timeout error occurred: {timeout_err}")
        except requests.exceptions.RequestException as req_err:
            print(f"An error occurred: {req_err}")
        except json.JSONDecodeError as json_err:
            print(f"JSON decode error: {json_err}")
        return None

    def authenticate(self, user, secret):
        if self.__token is None:
            self.__token = self.__obtain_token(user, secret)
        return self.__token
    