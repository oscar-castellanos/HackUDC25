from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from . serializer import *
from . models import *

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
            "image_string": clothing.image_string
            } 
            for clothing in User_clothing.objects.filter(user=username)]
        return Response(user_uploaded_images)

    ## Upload an image
    def post(self, request, username):
        data = request.data.copy()
        data['user'] = username
        serializer = User_clothing_Serializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


## WIP
## User clothing (single images uploaded by them)
class UserClothing(APIView):

    serializer_class = User_clothing_Serializer

    ## Get a specific image uploaded by a specific user
    def get(self, request, username, image_id):
        clothing = User_clothing.objects.filter(user=username, id=image_id)
        user_uploaded_images = {
            "id": clothing.id,
            "user": clothing.user, 
            "image_string": clothing.image_string
            }  
        return Response(user_uploaded_images)

    # ## Delete an image
    # def delete(self, request, username):
    #     serializer = User_clothing_Serializer(data=request.data)
    #     if serializer.is_valid(raise_exception=True):
    #         serializer.save()
    #         return Response(serializer.data)
