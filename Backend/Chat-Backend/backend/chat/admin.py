from django.contrib import admin

# Register your models here.

from .models import *

admin.site.register(User)
admin.site.register(Message)
admin.site.register(Conversation)
admin.site.register(Invitation)
admin.site.register(Channel)
admin.site.register(ChannelMessage)
