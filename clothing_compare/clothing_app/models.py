from django.db import models

# Create your models here.


class Clothing_detail(models.Model):
    # Basic data returned by Product Search
    clothing_id = models.CharField(max_length=20)
    name = models.CharField(max_length=50)
    price_currency = models.CharField(max_length=5)
    price_current = models.CharField(max_length=10)
    price_original = models.CharField(max_length=10, null=True)
    link = models.URLField()
    brand = models.CharField(max_length=20)
    # Scraped data
    color = models.CharField(max_length=20, null=True)
    description = models.TextField(null=True)
    composition = models.JSONField(null=True) # example: {nylon: 55%, cotton: 45%}
    image_url = models.URLField(null=True)
    # Generated data
    score = models.IntegerField(default=-1)

class User_clothing(models.Model):
    user = models.CharField(max_length=20)
    image_string = models.TextField()
    image_url = models.CharField(max_length=500, null=True)
    

class User_outfit(models.Model):
    description = models.CharField(max_length=100)
    top = models.ForeignKey(Clothing_detail, on_delete=models.CASCADE, related_name="top")
    bottom = models.ForeignKey(Clothing_detail, on_delete=models.CASCADE, related_name="bottom")
    shoes = models.ForeignKey(Clothing_detail, on_delete=models.CASCADE, related_name="shoes")
    accesory = models.ForeignKey(Clothing_detail, on_delete=models.CASCADE, related_name="accesory")
    
class User_wish(models.Model):
    clothing_id = models.CharField(max_length=20)
    user = models.CharField(max_length=20)
    name = models.CharField(max_length=50)
    link = models.URLField()
    brand = models.CharField(max_length=20)
    image_url = models.URLField(null=True)
