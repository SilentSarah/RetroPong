from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('', authenticate_user, name='authenticate_user'),
    path('verify2fa', verify_2fa, name='verify_2fa'),
    path('42login/create', generate_42_user_token, name='generate_42_user_token'),
]