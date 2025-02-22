from rest_framework import serializers
from . models import *

class Clothing_detail_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Clothing_detail
        fields = ['clothing_id', 'name', 'price_currency', 'price_current', 'link', 'brand']

class User_clothing_Serializer(serializers.ModelSerializer):
    class Meta:
        model = User_clothing
        fields = ['user', 'image_string', 'image_url']