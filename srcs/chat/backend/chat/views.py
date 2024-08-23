 
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.http import *
from .models import *
import json, os, requests
from .JsonObj.JsonObj import *
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

SERVER_NAME = os.environ.get('HOST_ADDRESS')
AUTH_PORT = os.environ.get('AUTH_PORT')
USERMGR_PORT = os.environ.get('USERMGR_PORT')
 
@csrf_exempt
def verify_token(request: HttpRequest) -> str:
        auth_token = request.headers.get('Authorization')
        if auth_token is None:
            print("hermosa you forgot the jwt")
            return None
        else:
            request = requests.Session()
            request.headers['Authorization'] = f"{auth_token}"
            response = request.get(f'https://{SERVER_NAME}:{AUTH_PORT}/auth/', verify=False)
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
        user_list = []
        for x in users:
            try:
                user = User.objects.get(id=x)
                user_list.append(JsonObj.user_chat(user))
            except:
                pass

        return JsonResponse({"messages": list(messages.values()),"users":user_list}, status=200)
    except Exception as e:
        print(e)
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


@csrf_exempt
@require_http_methods(["POST"])
def Generate_notification(request):
    auth_token = request.headers.get('Authorization')
    body =  request.body
    request = requests.Session()
    request.headers['Authorization'] = f"{auth_token}"
    response = request.post(f'https://{SERVER_NAME}:{USERMGR_PORT}/userdata/notify', data=body, verify=False)
    if(response.status_code == 200):
        print(response.status_code)
        return JsonResponse({"status":"success"}, status=200)
    else:
        print(response.status_code)
        return JsonResponse({"status":"somthing wrong!"}, status=404)


#endpoint to add id to channel array
@csrf_exempt
@require_http_methods(["POST"])
def insert_id_to_channel(request):
    token, user_id = verify_token(request)
    if token is None or user_id is None:
        return JsonResponse({"status": "Unauthorized"}, status=401)
    
    try:
        data = json.loads(request.body)
        channel_id = 1  # You might want to use a dynamic channel ID
        try :
            channel = Channel.objects.get(chID=channel_id)
        except Exception:
            Channel.objects.create(chID=channel_id, chName="Global", chMembers=[user_id], chDesc="Global channel", chAdmin=user_id)
            return JsonResponse({"status": "User has been inserted to global channel"}, status=200)

        # Assuming chMembers is a JSONField or similar list field
        if not isinstance(data, dict) or "id" not in data:
            return JsonResponse({"status": "Invalid data"}, status=400)
        
        member_id = int(data["id"])
        if member_id not in channel.chMembers:
            channel.chMembers.append(member_id)
            channel.save()
            return JsonResponse({"status": "User has been inserted to global channel"}, status=200)
        else:
            return JsonResponse({"status": "ID already exists in channel"}, status=400)
    
    except Channel.DoesNotExist:
        return JsonResponse({"status": "Channel not found"}, status=404)


    