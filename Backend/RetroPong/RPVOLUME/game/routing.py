from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
	# I ll see to add the game id later
    re_path(r"ws/game/$", consumers.GameConsumer.as_asgi()),
]