from django.urls import re_path
from .consumers import GameConsumer, TournamentConsumer

websocket_urlpatterns = [
    re_path(r"ws/game/$", GameConsumer.as_asgi()),
    re_path(r"ws/tournament/$", TournamentConsumer.as_asgi()),
]