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
        desc = request.data['description']
        color = request.data['color']
        
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
                    # Coger la que nos mandan de base.
                    continue
                piece_found = product_finder.product_finder(outfit_parts[key])[0]
                scrapped_parts.append({key:scraper.get_info(piece_found)})
            #Identificar cada uno. 
            scrapped_outfits.append({"description": outfit["description"], "outfit_parts":scrapped_parts})
        
        ## No se muy bien como devolverlo, pero supongoq ue será algo así...
        return Response(scrapped_outfits) 
            
        
            
