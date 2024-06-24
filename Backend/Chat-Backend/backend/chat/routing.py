#routing.py
from django.urls import path
from .consumers import *


websocket_urlpatterns = [
    path('ws/chat/<int:id>', UpdateConsumer.as_asgi()),
    path('ws/chat/status/<int:id>', StatusOnline.as_asgi()),

]