"""
ASGI config for GameBackend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

import django
django.setup()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from .routing import websocket_urlpatterns



os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameBackend.settings')

application = ProtocolTypeRouter(
	{
		'http': get_asgi_application(),
		"websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
	}
)
