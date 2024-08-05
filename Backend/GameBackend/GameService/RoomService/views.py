from django.http import *
from .PrivateQueue import *
from .models import *
from .ViewAssist.ViewAssist import verify_token
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["POST"])
def create_room(request: HttpRequest, id: int):
    try: 
        token, user_id = verify_token(request)
        if (token is None or user_id is None):
            return JsonResponse({"error": "Invalid token"}, status=401)
        
        inviter_id = int(user_id)
        invitee_id = id
        if (invitee_id is None or User.objects.get(id=invitee_id) is None):
            return JsonResponse({"error": "Invalid invitee_id"}, status=404)
        if (invitee_id == inviter_id):
            return JsonResponse({"error": "You cannot invite yourself"}, status=409)
        
        queue = get_existing_invite(inviter_id)
        if (queue is not None):
            PRIVATE_QUEUE.remove(queue)

        queue: PrivateQueue = PrivateQueue(inviter_id, invitee_id)
        PRIVATE_QUEUE.append(queue)
        print(queue.__dict__)
        return JsonResponse(
            {
                "status": "success", 
                "message": "Private Match Session has been Created", 
                "data":
                    queue.__dict__
            }, status=201)
    except Exception as e:
        print(e)
        return JsonResponse({"status": "fail", "message": "Invalid Details or Internal Error"}, status=404)