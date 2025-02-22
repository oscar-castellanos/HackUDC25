from django.urls import path
from . import views

urlpatterns = [
    path('', views.Index.as_view(), name="index"),
    path('user_clothing/<username>', views.UserClothing.as_view(), name="user_clothing")
]