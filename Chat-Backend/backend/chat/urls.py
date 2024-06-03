
from django.urls import path
from .views import *


urlpatterns=[
    path('contact/<int:id>/',  get_user_contact, name='contact_list'),
    path('isExistConversation/<int:id>/<int:contact_id>/', isExistConversation, name='chat_list_create'),
    path('invite/<int:id>/<int:contact_id>', sendInvitation, name='Invitation'),
    path('accept/<int:id>/<int:contact_id>', acceptInvite, name='Accept'),
    path('decline/<int:id>/<int:contact_id>', declineInvite, name='Deline'),
    path('unblock/<int:id>/<int:contact_id>', unblockUser, name='Unblock'),
    path('sendMessage/<int:id>/<int:contact_id>/<int:conversation_id>', sendMessage, name='Send Message'),
]
