from django.urls import path
from .views import *

urlpatterns = [
    path("", user_data, name="user_data"),
    path("<int:id>", user_id_data, name="user_id_data"),
    path("logout", logout_user, name="logout_user"),
    path("create", create_user, name="create_user"),
    path("delete", delete_user, name="delete_user"),
    path("update", update_user, name="update_user"),
    path("search", search_user, name="search_user"),
    path("42login", login_42_user, name="login_42_user"),
    path("42login/callback/", login_42_user_callback, name="login_42_user_callback"),
]