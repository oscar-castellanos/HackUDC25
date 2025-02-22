from django.db import models

# Create your models here.


class Clothing_detail(models.Model):
    # Basic data returned by Product Search
    clothing_id = models.CharField(max_length=20)
    name = models.CharField(max_length=50)
    price_currency = models.CharField(max_length=5)
    price_current = models.CharField()
    price_original = models.CharField()
    #link = models.CharField(max_length=100)
    link = models.URLField()
    brand = models.CharField(max_length=20)
    # Scraped data
    color = models.CharField(max_length=20)
    description = models.TextField() # example: {nylon: 55%, cotton: 45%}
    composition = models.JSONField(null=True)
    image_url = models.URLField()
    # Generated data
    score = models.IntegerField(default=-1)


class User_clothing(models.Model):
    user = models.CharField(max_length=20)
    image_string = models.TextField()
    image_url = models.CharField(max_length=500, null=True)
