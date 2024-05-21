from django.urls import path
from .views import *

urlpatterns = [
    path("", user_data, name="user_data"),
    path("logout", logout_user, name="logout_user"),
    path("create", create_user, name="create_user"),
    path("42login", login_42_user, name="login_42_user"),
    path("42login/callback/", login_42_user_callback, name="login_42_user_callback"),
]
