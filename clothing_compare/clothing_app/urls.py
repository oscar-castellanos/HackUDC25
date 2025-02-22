from django.urls import path
from . import views

urlpatterns = [
    path('', views.Index.as_view(), name="index"),
    path('user_clothing/<username>', views.UserClothings.as_view(), name="user_clothings"),
    path('user_clothing/<username>/<image_id>', views.UserClothing.as_view(), name="user_clothing"),
    path('visual_search', views.VisualSearch.as_view(), name="visual_search"),
]