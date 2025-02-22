from django.urls import path
from . import views

urlpatterns = [
    path('', views.Index.as_view(), name="index"),
    path('user_clothing/<username>', views.UserClothings.as_view(), name="user_clothings"),
    path('user_clothing/<username>/<image_id>', views.UserClothing.as_view(), name="user_clothing"),
    path('wishlist/<username>', views.UserWishlist.as_view(), name="user_wishlist"),
    path('wishlist/<username>/<clothing_id>', views.UserWish.as_view(), name="user_wish"),
    path('product_search', views.ProductSearch.as_view(), name="product_search"),
    path('visual_search', views.VisualSearch.as_view(), name="visual_search"),
    path('visual_search/outfit_search', views.OutfitSearch.as_view(), name="outfit_search"),
    path('visual_search/outfit_photo_search/', views.OutfitPhotoSearch.as_view(), name="outfit_photo_search"),
]