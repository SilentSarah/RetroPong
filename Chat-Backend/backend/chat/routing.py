#routing.py
from django.urls import path
from .consumers import UpdateConsumer


websocket_urlpatterns = [
    path('ws/chat/<int:id>', UpdateConsumer.as_asgi()),
]