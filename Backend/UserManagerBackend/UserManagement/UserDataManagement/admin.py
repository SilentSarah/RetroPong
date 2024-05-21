from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(User, UsersAdmin)
admin.site.register(MatchHistory, MatchHistoryAdmin)