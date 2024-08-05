from django.shortcuts import render
from django.urls import path
from .views import *

# Create your views here.
urlpatterns = [
    path('create/<int:id>', create_room, name='create_room'),
]
