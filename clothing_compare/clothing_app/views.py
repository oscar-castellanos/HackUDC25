from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . serializer import *
from . models import *

from . external_apis import product_finder

## Aux methods:
def getImageUrl(image_url):

    ## Dummy method while we integrate the actual img upload...
    image_url = "https://static.zara.net/assets/public/5d1c/c3b3/e8064a30b197/760db88b39af/01618475800-p/01618475800-p.jpg"

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

    def post(self, request):

        image_url = request.data['image_url']

        ## Use image_url to pull from Visual Search
        found_extra_data = product_finder.product_finder(image_url)
        return Response(found_extra_data)