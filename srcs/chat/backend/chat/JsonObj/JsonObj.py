from chat.models import *
from django.db.models import Q
from django.http import JsonResponse
import os

SERVER_NAME = os.environ.get('HOST_ADDRESS')
USERMGR_PORT = os.environ.get('USERMGR_PORT')

def gen_img_link(user: User) -> str:
    return f"https://{SERVER_NAME}:{USERMGR_PORT}{user.uprofilepic.url}"

def process_users(queryset, is_filter, filter_ids):
    
    if is_filter:
        user_data = User.objects.filter(id__in=filter_ids).values(
            'id', 'uUsername', 'uFname', 'uLname', 'uEmail', 'uprofilepic', 'uprofilebgpic', 'udesc'
        )
    else:
        user_data = queryset.values('id', 'uUsername', 'uFname', 'uLname', 'uEmail', 'uprofilepic', 'uprofilebgpic', 'udesc')
    user_data = list(user_data)

    for user in user_data:
        if user['uprofilepic']:
            # Update the profilepic URL using gen_img_link
            user['uprofilepic'] = gen_img_link(User.objects.get(id=user['id']))

    return user_data


class JsonObj:
    def __init__(self):
        pass

    @staticmethod
    def user_info(user):
        otherUsers = User.objects.exclude(Q(id__in=user.AFriends) | Q(id__in=user.ARequests) | Q(id__in=user.ABlocked) | Q(id__in=user.ABlockedBy) | Q(id=user.id))
        invitation = [x.id for x in otherUsers if Invitation.objects.filter(Q(iSender=user.id) & Q(iReceiver=x.id))]
        channel = Channel.objects.filter()
        return {
            "id": user.id,
            "username": user.uUsername,
            "email": user.uEmail,
            "fname": user.uFname,
            "lname": user.uLname,
            "otherUser": process_users(otherUsers,False, ""),
            "friends":process_users(User, True, user.AFriends),
            "requests":process_users(User, True, user.ARequests),
            "blocked":process_users(User, True, user.ABlocked),
            "profilepic":gen_img_link(user),
            "invitation":invitation,
            "desc":user.udesc,
            "channel": list(channel.values())
        }

    @staticmethod
    def user_chat(user):
        print("there ", user.id)
        return {
            "id":  user.id,
            "username": user.uUsername,
            "email": user.uEmail,
            "fname": user.uFname,
            "lname": user.uLname,
            "profilepic":gen_img_link(user),
            "profilebgpic":gen_img_link(user),
            "desc": user.udesc,
            "isOnline": user.isOnline
        }             
        
    @staticmethod
    def messages(messages,user):
        return {
            "id": messages.id,
            "content": messages.mContent,
            "sender": messages.mSender,
            "receiver": messages.mReceiver,
            "conversation": messages.mConversation,
            "created": messages.mCreated,
            "updated": messages.mUpdated,
            "read": messages.mRead,
            "user": user
        }

 
def isConversationExist(id, contact_id):
    if Conversation.objects.filter(Q(cMembers=[contact_id, id]) | Q(cMembers=[id, contact_id])):
        return False
    else:
        return True

def checkUser(mSender, id, contact_id, contact_user, current_user):
    # print(mSender, id, contact_id, contact_user, current_user)
    if mSender == id:
        return current_user
    else :
        return contact_user

def conversationExist(request, id, contact_id):
    messagesArray = []
    auth = request.headers['Authorization']
    try:
        current_user = User.objects.get(id=id)
        current_user =  JsonObj.user_chat(current_user)
        contact_user = User.objects.get(id=contact_id)
        contact_user =  JsonObj.user_chat(contact_user)
    except:
        return JsonResponse("Not found this user", status=404)

    conversation = Conversation.objects.filter(Q(cMembers=[contact_id, id]) | Q(cMembers=[id, contact_id]))
    messages = Message.objects.filter(Q(mConversation=conversation[0].id) & ((Q(mSender=id) & Q(mReceiver=contact_id))| (Q(mSender=contact_id) & Q(mReceiver=id))))
    for x in messages:
        messagesArray.append(JsonObj.messages(x, checkUser(x.mSender,id, contact_id, contact_user, current_user)))
    # print("conversationExist", conversation.id)
    return JsonResponse({"comment":"Already exist conversation!","users":[contact_user, current_user],"messages":messagesArray,"conversation_id": conversation[0].id }, status=200)




