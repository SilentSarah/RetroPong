 
from django.shortcuts import render
from django.http import *
import requests
from .models import *
import json
from .JsonObj.JsonObj import *
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

 
@csrf_exempt
def verify_token(request: HttpRequest) -> str:
        auth_token = request.headers.get('Authorization')
        if auth_token is None:
            print("hermosa you forgot the jwt")
            return None
        else:
            request = requests.Session()
            request.headers['Authorization'] = f"{auth_token}"
            response = request.get('http://127.0.0.1:8000/auth/')
            if response.status_code == 200:
                body = response.json()
                token = body.get('access')
                user_id = body.get('user_id')
                return token, user_id
            else:
                print("Auth server said sike")
                return None

@csrf_exempt
def get_user_contact(request, id):
    token, user_id = verify_token(request)
    if (token is None or user_id is None or user_id != id):
        return JsonResponse({"status":"Unauthorized"}, status=401)

    try:
        user = User.objects.get(id=id)
        return JsonResponse(JsonObj.user_info(user), status=200)
    except:
        return JsonResponse({"status":"Not found this user"}, status=404)



@csrf_exempt
def isExistConversation(request, id, contact_id):
    token, user_id = verify_token(request)
    if (token is None or user_id is None or user_id != id):
        return JsonResponse({"status":"Unauthorized"}, status=401)

    if isConversationExist(id, contact_id):
        conversation = Conversation.objects.create(cName=f"{id} and {contact_id}", cMembers=[id, contact_id])
        conversation.save()
        try:
            contact_user= User.objects.get(id=contact_id)
            user = User.objects.get(id=id)
            return JsonResponse({"conversation_id": conversation.id, "comment":"Create",'users':[JsonObj.user_chat(contact_user), JsonObj.user_chat(user)]}, status=200)
        except:
            return JsonResponse("Not found this user", status=404)
    else :
        return conversationExist(request, id, contact_id)


@csrf_exempt
def sendInvitation(request, id, contact_id):
    token, user_id = verify_token(request)
    if (token is None or user_id is None or user_id != id):
        return JsonResponse({"status":"Unauthorized"}, status=401)
    
    try:
        target_user = User.objects.get(id=contact_id)
        if Invitation.objects.filter(iSender=id, iReceiver=contact_id).exists():
            return JsonResponse({"status":"Already sent invitation"}, status=200)
        invitation = Invitation.objects.create(iSender=id, iReceiver=contact_id)
        invitation.save()
        # add id to request contact user
        target_user.ARequests.append(id)
        target_user.save()
        return JsonResponse({"invitation_id": invitation.id, "comment":"Invitation sent successfully!"}, status=200)
    except:
        return JsonResponse("Not found this user", status=404)
    

@csrf_exempt
def acceptInvite(request, id, contact_id):
    token, user_id = verify_token(request)
    if (token is None or user_id is None or user_id != id):
        return JsonResponse({"status":"Unauthorized"}, status=401)
    
    try:
        target_user = User.objects.get(id=contact_id)
        user = User.objects.get(id=id)
        invitation = Invitation.objects.get(iSender=contact_id, iReceiver=id)
        invitation.delete()
        user.AFriends.append(contact_id)
        user.ARequests.remove(contact_id)
        target_user.AFriends.append(id)
        user.save()
        target_user.save()
        return JsonResponse({"status":"Accepted invitation"}, status=200)
    except:
        return JsonResponse({"status":"Not found this user"}, status=404)


@csrf_exempt
def declineInvite(request, id, contact_id):
    token, user_id = verify_token(request)
    if (token is None or user_id is None or user_id != id):
        return JsonResponse({"status":"Unauthorized"}, status=401)
    
    try:
        target_user = User.objects.get(id=contact_id)
        user = User.objects.get(id=id)
        # to block user
        if contact_id in user.AFriends and id in target_user.AFriends:
            user.ABlocked.append(contact_id)
            target_user.ABlockedBy.append(id)
            user.AFriends.remove(contact_id)
            # target_user.AFriends.remove(id)

            user.save()
            target_user.save()
            return JsonResponse({"status":"Blocked user"}, status=200)     
        # to deline invite
        invitation = Invitation.objects.get(iSender=contact_id, iReceiver=id)
        invitation.delete()
        user.ARequests.remove(contact_id)
        user.ABlocked.append(contact_id)
        target_user.ABlockedBy.append(id)
        target_user.save()
        user.save()
        return JsonResponse({"status":"Declined invitation"}, status=200)
    except:
        return JsonResponse({"status":"Not found this user"}, status=404)


@csrf_exempt
def unblockUser(request, id, contact_id):
    token, user_id = verify_token(request)
    if (token is None or user_id is None or user_id != id):
        return JsonResponse({"status":"Unauthorized"}, status=401)
    
    try:
        user = User.objects.get(id=id)
        target_user = User.objects.get(id=contact_id)
        if contact_id in user.ABlocked:
            user.ABlocked.remove(contact_id)
            target_user.ABlockedBy.remove(id)
            user.AFriends.append(contact_id)
            # target_user.AFriends.append(id)
            user.save()
            target_user.save()
            return JsonResponse({"status":"Unblocked user"}, status=200)
        else:
            return JsonResponse({"status":"User not blocked"}, status=200)
    except:
        return JsonResponse({"status":"Not found this user"}, status=404)


@csrf_exempt
def sendMessage(request, id, contact_id, conversation_id):
    token, user_id = verify_token(request)
    if (token is None or user_id is None or user_id != id):
        return JsonResponse({"status":"Unauthorized"}, status=401)

    try:
        conversation = Conversation.objects.get(id=conversation_id)    

        contact_user = User.objects.get(id=contact_id).ABlocked
        print(contact_user)
        if id in contact_user:
            return JsonResponse({"status":"This user is blocked."}, status=401)

        if id not in conversation.cMembers or contact_id not in conversation.cMembers:
            return JsonResponse({"status":"not found this conversation!"}, status=401)
    
        content = request.body
        content = (json.loads(content).get('content'))
        message = Message.objects.create(mContent=content, mSender=id, mReceiver=contact_id, mConversation=conversation_id)
        message.save()
        return JsonResponse({"status":"Message sent"}, status=200)
    except:
        return JsonResponse({"status":"Not found this user or conversation."}, status=404)


# Channel messages
def get_channel_messages(request, channel_id):
    token, user_id = verify_token(request)
    if (token is None or user_id is None):
        return JsonResponse({"status":"Unauthorized"}, status=401)

    try:
        messages = ChannelMessage.objects.filter(chID=channel_id)
        users = Channel.objects.get(chID=channel_id).chMembers
        user = [JsonObj.user_chat(User.objects.get(id=x)) for x in users]

        return JsonResponse({"messages": list(messages.values()),"users":list(user)}, status=200)
    except:
        return JsonResponse({"status":"Not found this channel"}, status=404)

@csrf_exempt
def Send_message_channel(request, channel_id, user_id):
     
    if(request.method == 'POST'):
        try:
            content = json.loads(request.body).get('content')
            print(content)
            message = ChannelMessage.objects.create(chID=channel_id, cmContent=content, cmSender=user_id)
            return JsonResponse({"status":"Message sent"}, status=200)
        except:
            return JsonResponse({"status":"Not found this channel"}, status=404)
    return JsonResponse({"status":"Not found this channel"}, status=404)