#routing.py
from django.urls import path
from .consumers import UpdateConsumer


websocket_urlpatterns = [
    path('ws/chat/', UpdateConsumer.as_asgi()),
]