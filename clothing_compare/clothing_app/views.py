from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . serializer import *
from . models import *

from .external_apis import visual_finder, tmpfiles
from . import scraper
from .external_apis import ollama_llm
from .external_apis import product_finder

import random
import string

## Aux methods:
def getImageUrl(image_string):

    image_url = tmpfiles.upload_base64_file_to_web(image_string, file_name="{0}.jpg".format("".join(random.choice(string.ascii_letters) for i in range(20))))

    return image_url

## Index, get all clothes in DB
class Index(APIView):
  
    serializer_class = Clothing_detail_Serializer

    ## List all clothes
    def get(self, request):
        detail = [ {
            "id": detail.clothing_id,
            "name": detail.name,
            "price_currency": detail.price_currency,
            "price_current": detail.price_current,
            "link": detail.link,
            "brand": detail.brand } 
            for detail in Clothing_detail.objects.all()]
        return Response(detail)

    ## Post a clothing
    def post(self, request):
        serializer = Clothing_detail_Serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

## User clothings (images uploaded by them)
class UserClothings(APIView):
  
    serializer_class = User_clothing_Serializer

    ## List all clothes images uploaded by a specific user
    def get(self, request, username):
        user_uploaded_images = [ {
            "id": clothing.id,
            "user": clothing.user, 
            "image_string": clothing.image_string,
            "image_url": clothing.image_url
            } 
            for clothing in User_clothing.objects.filter(user=username)]
        return Response(user_uploaded_images)

    ## Upload an image
    def post(self, request, username):
        data = request.data.copy()
        data['user'] = username

        ## Get url from tmpfiles
        image_url = getImageUrl(data['image_string'])
        data['image_url'] = image_url

        serializer = User_clothing_Serializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


## User clothing (single images uploaded by them)
class UserClothing(APIView):

    serializer_class = User_clothing_Serializer

    ## Get a specific image uploaded by a specific user
    def get(self, request, username, image_id):
        clothing = User_clothing.objects.get(id=image_id)
        user_uploaded_image = {
            "id": clothing.id,
            "user": clothing.user, 
            "image_string": clothing.image_string,
            "image_url": clothing.image_url
            }  
        return Response(user_uploaded_image)

    ## Delete image uploaded by user
    def delete(self, request, username, image_id):
        try:
            image = User_clothing.objects.get(id=image_id)
        except User_clothing.DoesNotExist:
            return Response({"Error": "clothing image with id {0} of user {1} not found".format(image_id, username)}, status=status.HTTP_404_NOT_FOUND)

        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserWishlist(APIView):
  
    serializer_class = User_wish_Serializer

    ## List all clothes wishlisted by a specific user
    def get(self, request, username):
        detail = [ {
            "id": detail.clothing_id,
            "user": detail.user,
            "name": detail.name,
            "link": detail.link,
            "brand": detail.brand,
            "image_url": detail.image_url } 
            for detail in User_wish.objects.filter(user=username)]
        return Response(detail)

    ## Wishlist a clothing
    def post(self, request, username):

        data = request.data.copy()
        data['user'] = username

        serializer = User_wish_Serializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class UserWish(APIView):

    serializer_class = User_clothing_Serializer

    ## Get a specific image uploaded by a specific user
    def get(self, request, username, clothing_id):
        clothing = User_wish.objects.get(clothing_id=clothing_id)
        user_whishlisted_clothing = {
            "id": clothing.id,
            "user": clothing.user,
            "name": clothing.name,
            "link": clothing.link,
            "brand": clothing.brand,
            "image_url": clothing.image_url
            }  
        return Response(user_whishlisted_clothing)

    ## Delete image uploaded by user
    def delete(self, request, username, clothing_id):
        try:
            wish = User_wish.objects.get(clothing_id=clothing_id)
        except User_wish.DoesNotExist:
            return Response({"Error": "clothing with id {0} wishlisted by user {1} not found".format(clothing_id, username)}, status=status.HTTP_404_NOT_FOUND)

        wish.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProductSearch(APIView):

    ## Get list of clothes matching description
    ## Need to add description and optionally a brand
    def get(self, request):

        description = request.GET.get('description', "")
        brand = request.GET.get('brand', "")

        ## Use image_url to pull from Product Search
        found_suggestions = product_finder.product_finder(description, brand)

        ## Scrape extra data
        full_data = [scraper.get_info(result) for result in found_suggestions]

        detail = [ {
            "id": detail.clothing_id,
            "name": detail.name,
            "price_currency": detail.price_currency,
            "price_current": detail.price_current,
            "price_original": detail.price_original,
            "link": detail.link,
            "brand": detail.brand,
            "color": detail.color,
            "description": detail.description,
            "composition": detail.composition,
            "image_url": detail.image_url,
            "score": detail.score }
            for detail in full_data]

        return Response(detail)

class VisualSearch(APIView):

    ## Get similar clothes to an image url embedded into POST request
    def post(self, request):

        image_url = request.data['image_url']

        ## Use image_url to pull from Visual Search
        found_similars = visual_finder.visual_finder(image_url)

        ## Scrape extra data
        full_data = [scraper.get_info(result) for result in found_similars]

        detail = [ {
            "id": detail.clothing_id,
            "name": detail.name,
            "price_currency": detail.price_currency,
            "price_current": detail.price_current,
            "price_original": detail.price_original,
            "link": detail.link,
            "brand": detail.brand,
            "color": detail.color,
            "description": detail.description,
            "composition": detail.composition,
            "image_url": detail.image_url,
            "score": detail.score }
            for detail in full_data]

        return Response(detail)
    
class OutfitSearch(APIView):
    
    ## Get outfit based on Clothing_details
    def post(self, request):
        originalRequest = request.data.copy()
        
        desc = originalRequest['description']
        color = originalRequest['color']
        
        ## Get outfits from Ollama
        ol = ollama_llm.OllamaLLM()
        outfits, originalPrompt = ol.generate_outfit(desc, color)
        
        scrapped_outfits = []
        
        for outfit in outfits:
            # Get the image url for each key in 
            outfit_parts = outfit["outfit_parts"]
            scrapped_parts = []
            for key in outfit_parts.keys():
                if key == originalPrompt:
                    originalRequest['category': key]
                    scrapped_parts.append(originalRequest)
                try:
                    piece_found = product_finder.product_finder(outfit_parts[key]["Name"])[0]
                    scrapped_object = scraper.get_info(piece_found)
                    scrapped_detail = {
                        "id": scrapped_object.clothing_id,
                        "name": scrapped_object.name,
                        "price_currency": scrapped_object.price_currency,
                        "price_current": scrapped_object.price_current,
                        "price_original": scrapped_object.price_original,
                        "link": scrapped_object.link,
                        "brand": scrapped_object.brand,
                        "color": scrapped_object.color,
                        "description": scrapped_object.description,
                        "composition": scrapped_object.composition,
                        "image_url": scrapped_object.image_url,
                        "score": scrapped_object.score,
                        "category": key
                    }
                    scrapped_parts.append(scrapped_detail)
                except:
                    # TODO: If it fails, it should do something...
                    # aux = outfit_parts.copy()
                    # aux2 = dict()
                    # for k in aux[key]: aux2[k] = aux[key][k]
                    # aux2['category'] = key
                    scrapped_detail = {
                        "id": "-1",
                        "name": outfit_parts[key]['Name'],
                        "price_currency": "",
                        "price_current": "",
                        "price_original": "",
                        "link": "",
                        "brand": "",
                        "color": "",
                        "description": outfit_parts[key]['Description'] if 'Description' in outfit_parts[key] else "",
                        "composition": "",
                        "image_url": "",
                        "score": "",
                        "category": key
                    }
                    scrapped_parts.append(scrapped_detail)
            scrapped_outfits.append({"description": outfit["description"], "outfit_parts": scrapped_parts})
        
        return Response(scrapped_outfits) 
            
        
class OutfitPhotoSearch (APIView):
    
    ## Get outfit based on image
    def post(self, request, username):
        data = request.data.copy()
        data['user'] = username
        
        ## Get image link
        image_url = getImageUrl(data['image_string'])
        data['image_url'] = image_url
        
        ## Get prompt from ollama
        ol = ollama_llm.OllamaLLM()
        prompt = ol.describe_outfit_from_image(image_url)
        
        
        ## Get outfits from Ollama
        outfits, originalPrompt = ol.generate_outfit(prompt)
        
        scrapped_outfits = []
        
        for outfit in outfits:
            # Get the image url for each key in 
            outfit_parts = outfit["outfit_parts"]
            scrapped_parts = []
            for key in outfit_parts.keys():
                if key == originalPrompt:
                    originalRequest['category': key]
                    scrapped_parts.append(originalRequest)
                try:
                    piece_found = product_finder.product_finder(outfit_parts[key]["Name"])[0]
                    scrapped_object = scraper.get_info(piece_found)
                    scrapped_detail = {
                        "id": scrapped_object.clothing_id,
                        "name": scrapped_object.name,
                        "price_currency": scrapped_object.price_currency,
                        "price_current": scrapped_object.price_current,
                        "price_original": scrapped_object.price_original,
                        "link": scrapped_object.link,
                        "brand": scrapped_object.brand,
                        "color": scrapped_object.color,
                        "description": scrapped_object.description,
                        "composition": scrapped_object.composition,
                        "image_url": scrapped_object.image_url,
                        "score": scrapped_object.score,
                        "category": key
                    }
                    scrapped_parts.append(scrapped_detail)
                except:
                    # TODO: If it fails, it should do something...
                    # aux = outfit_parts.copy()
                    # aux2 = dict()
                    # for k in aux[key]: aux2[k] = aux[key][k]
                    # aux2['category'] = key
                    scrapped_detail = {
                        "id": "-1",
                        "name": outfit_parts[key]['Name'],
                        "price_currency": "",
                        "price_current": "",
                        "price_original": "",
                        "link": "",
                        "brand": "",
                        "color": "",
                        "description": outfit_parts[key]['Description'],
                        "composition": "",
                        "image_url": "",
                        "score": "",
                        "category": key
                    }
                    scrapped_parts.append(scrapped_detail)
            scrapped_outfits.append({"description": outfit["description"], "outfit_parts": scrapped_parts})
        
        serializer = User_clothing_Serializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            
        return Response(scrapped_outfits)
        

       
class PromptSearch (APIView):
    
    # Get keywords from a prompt to search correctly for suggestion with the Inditex API
    def post(self, request):
        # Get the data from the request
        data = request.data.copy()
        # Get description from the request
        description = data['description']
        
        # Pass the request to the Ollama API for simplification
        ol = ollama_llm.OllamaLLM()
        keywords = ol.get_keywords(description)
        
        # Get the suggested products from inditex API
        suggested_products = product_finder.product_finder(keywords)
        
        #Scrape extra data
        full_data = [scraper.get_info(result) for result in suggested_products]
        
        detail = [ {
            "id": detail.clothing_id,
            "name": detail.name,
            "price_currency": detail.price_currency,
            "price_current": detail.price_current,
            "price_original": detail.price_original,
            "link": detail.link,
            "brand": detail.brand,
            "color": detail.color,
            "description": detail.description,
            "composition": detail.composition,
            "image_url": detail.image_url,
            "score": detail.score }
            for detail in full_data]
        
        return Response(detail)