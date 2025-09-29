"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# import chat routing when ready (module must exist)
import chat.routing

os.environ.setdefault("DJANGO_SETTING_MODULE", "core.setting")

# Started Django ASGI application for HTTP handLing
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    # HTTP -> DJANGO
    "http": django_asgi_app,

    # WebSocket -> Chat consumers with user auth
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
