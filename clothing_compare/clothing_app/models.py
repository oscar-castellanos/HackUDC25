from django.db import models

# Create your models here.


class Clothing_detail(models.Model):
    clothing_id = models.CharField(max_length=20)
    name = models.CharField(max_length=50)
    price_currency = models.CharField(max_length=5)
    price_current = models.IntegerField()
    link = models.CharField(max_length=100)
    brand = models.CharField(max_length=20)

class User_clothing(models.Model):
    user = models.CharField(max_length=20)
    image_string = models.TextField()
