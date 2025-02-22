from rest_framework import serializers
from . models import *

class Clothing_detail_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Clothing_detail
        fields = ['clothing_id', 'name', 'price_currency', 'price_current', 'price_original', 'link', 'brand', 'color', 'description', 'composition', 'image_url', 'score']

class User_clothing_Serializer(serializers.ModelSerializer):
    class Meta:
        model = User_clothing
        fields = ['user', 'image_string', 'image_url']

class User_wish_Serializer(serializers.ModelSerializer):
    class Meta:
        model = User_wish
        fields = ['clothing_id', 'user', 'name', 'link', 'brand', 'image_url']
