from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from .ViewAssist.ViewAssist import *
from django.db.utils import *
from .WebOps.WebOps import *
from .DbOps.DbOps import *
from django.http import *
import os

MAX_DURATION = 7

@csrf_exempt
@require_http_methods(["GET"])
def user_data(request: HttpRequest):
    try:
        token, user_id = ViewAssist.verify_token(request)
        if (token is None or user_id is None):
            return HttpResponse(status=401)
        user_data = DbOps.get_user(user_id=user_id)
        print("SOMEONE IS HERE")
        user_data.pop('password')
        return JsonResponse(user_data, status=200)
    except Exception as e:
        print("error:", e)
        return JsonResponse({"error":"Bad Request"}, status=401)

@csrf_exempt
@require_http_methods(["POST"])
def search_user(request: HttpRequest):
    try:
        token, user_id = ViewAssist.verify_token(request)
        if (token is None or user_id is None):
            return HttpResponse(status=401)
        body = json.loads(request.body)
        search_term = body.get('search_term')
        user_data = DbOps.get_users(search_term)
        return JsonResponse(user_data, status=200)
    except Exception as e:
        print("error:", e)
        return JsonResponse({"error":"Bad Request"}, status=401)

@csrf_exempt
@require_http_methods(["GET"])
def user_id_data(request: HttpRequest, id: int):
    try:
        token, user_id = ViewAssist.verify_token(request)
        if (token is None or user_id is None):
            return HttpResponse(status=401)
        user_data = DbOps.get_user(user_id=id)
        user_data.pop('password')
        return JsonResponse(user_data, status=200)
    except Exception as e:
        return JsonResponse({"error":"Bad Request"}, status=401)
    
@csrf_exempt
@require_http_methods(["POST"])
def invite_user(request: HttpRequest):
    token, user_id = ViewAssist.verify_token(request)
    if (token is not None and user_id is not None):
        try:
            body = json.loads(request.body)
            invite_type = body.get('type')
            invitee_id = body.get('receiver')
            if (DbOps.create_user_invite(user_id, invitee_id, invite_type, token) == False):
                return JsonResponse({"error":"Invite Creation Failed"}, status=400)
            return JsonResponse({"message":"Invite Sent Successfully"}, status=201)
        except Exception as e:
            print("error:", e)
            return JsonResponse({"error":"Bad Request"}, status=400)
    else:
        return HttpResponse(status=401)

@csrf_exempt
@require_http_methods(["POST"])
def create_user(request: HttpRequest):
    try:
        user_login_data = ViewAssist.create_user_and_setup_login_creds(request)
        if (user_login_data is None):
            return JsonResponse({"error":"Bad Request"}, status=400)
        user = DbOps.get_user(username=user_login_data.get('username'))
        jwt = ViewAssist.request_jwt_from_auth_server(user_login_data, f"https://{os.environ.get('HOST_ADDRESS')}:{os.environ.get('AUTH_PORT')}/auth/")
        if (jwt is not None):
            new_response = JsonResponse(
                {
                    "message":"User Created Successfully",
                    "user_id": user.get('id'),
                    "access": jwt
                }, status=201)
            new_response.set_cookie('user_id', user.get('id'), samesite='none', secure=True)
            new_response.set_cookie('access', jwt, samesite='none', secure=True)
            
            chat_response = WebOps.request_endpoint(f"https://{os.environ.get('HOST_ADDRESS')}:8003/chat/insert", "POST", {"Authorization": f"Bearer {jwt}"}, json={"id": user.get('id')})
            if (chat_response.status_code != 200):
                print("error:", chat_response.content)
            else:
                print("user has been added to chat")
            
            return new_response
        else:
            return JsonResponse({"error":"JWT wasn't acquired please sign in manually"}, status=404)
    except IntegrityError as e:
        print("error:", e)
        return JsonResponse({"error":"User Account Creation Failed"}, status=400)
    except Exception as e:
        print("error:", e)
        return JsonResponse({"error":"Bad Request"}, status=400)

@csrf_exempt
def login_42_user(request: HttpRequest):
    final_url = ViewAssist.generate_42_auth_link(
        "https://api.intra.42.fr/oauth/authorize", 
        f"https://{os.environ.get('HOST_ADDRESS')}:{os.environ.get('USERMGR_PORT')}/userdata/42login/callback/",
        "public", 
        "code")
    return HttpResponse(final_url, status=200)

@csrf_exempt
def login_42_user_callback(request: HttpRequest) -> HttpResponse:
    code = request.GET.get('code')
    if (code is None):
        return HttpResponse(status=400)
    elif (code is not None):
        try:
            token = ViewAssist.generate_42_request_token(code, f"https://{os.environ.get('HOST_ADDRESS')}:{os.environ.get('USERMGR_PORT')}/userdata/42login/callback/")
            if (token is None):
                return HttpResponseRedirect(f"https://{os.environ.get('HOST_ADDRESS')}/")
            print("test")
            required_data = ViewAssist.generate_42_user_data(token)
            if (required_data is None):
                return JsonResponse({"Error":"Missing Values"}, status=400)
            user_data = ViewAssist.grab_user_data_from_db(required_data)
            if (user_data is None):
                return JsonResponse({"Error":"Missing Params when creating/searching for user"}, status=400)
            jwt_token = ViewAssist.request_jwt_from_auth_server(user_data, f"https://{os.environ.get('HOST_ADDRESS')}:{os.environ.get('AUTH_PORT')}/auth/42login/create")
            if (jwt_token is None):
                return JsonResponse({"error":"JWT couldn't be acquired, please log in manually"}, status=400)
            else:
                if (user_data.get('two_factor') == True):
                    res = ViewAssist.send2fa_pin_to_user(user_data.get('id'))
                    return res if res else JsonResponse({"error":"Couldn't send 2FA pin"}, status=400)
                else:
                    res = HttpResponseRedirect(f"https://{os.environ.get('HOST_ADDRESS')}/dashboard")
                    res.set_cookie('user_id', user_data.get('id'), samesite='none', secure=True)
                    res.set_cookie('access', jwt_token, samesite='none', secure=True)
                    return res
        except Exception as e:
            print("error:", e)
            return HttpResponse(status=400)

@csrf_exempt
@require_http_methods(["POST"])
def update_user(request: HttpRequest):
    token, user_id = ViewAssist.verify_token(request)
    if (token is not None and user_id is not None):
        try:
            settings_cfg = ViewAssist.generate_acc_settings_cfg(request)
            if (DbOps.update_user(user_id=user_id, new_data=settings_cfg, uploaded_files=request.FILES) == False):
                return JsonResponse({"error":"User Update Failed"}, status=400)
            user = DbOps.get_user(user_id=user_id)
            if (user is None):
                return JsonResponse({"error":"User Not Found"}, status=404)
            user.pop('password')
            return JsonResponse(user, status=200)
        except Exception as e:
            print("error:", e)
            return JsonResponse({"error":"Bad Request"}, status=400)
    else:
        return HttpResponse(status=401)
        
@csrf_exempt
@require_http_methods(["DELETE"])
def logout_user(request: HttpRequest):
    try:
        token, user_id = ViewAssist.verify_token(request)
        if (token is None or user_id is None):
            return HttpResponse(status=401)
        response = JsonResponse({"message":"Logged Out Successfully"}, status=200)
        response.set_cookie('access', '', max_age=1, samesite='none', secure=True)
        return response
    except Exception as e:
        return JsonResponse({"error":"Bad Request"}, status=401)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_user(request: HttpRequest):
    try:
        token, user_id = ViewAssist.verify_token(request)
        if (token is None or user_id is None):
            return HttpResponse(status=401)
        DbOps.delete_user(user_id)
        response = JsonResponse({"message":"User Deleted Successfully"}, status=200)
        response.set_cookie('access', '', max_age=1, samesite='none', secure=True)
        return response
    except Exception as e:
        return JsonResponse({"error":"Bad Request"}, status=401)
    
@csrf_exempt
@require_http_methods(["POST"])
def gen_notification(request: HttpRequest):
    try:
        token, user_id = ViewAssist.verify_token(request)
        if (token is None or user_id is None):
            return HttpResponse(status=401)
        body = json.loads(request.body)
        notification = body.get('notification')
        if (notification is None):
            return JsonResponse({"error":"Missing Notification"}, status=400)
        if (DbOps.create_notification(user_id, notification) == False):
            return JsonResponse({"error":"Notification Creation Failed"}, status=400)
        return JsonResponse({"message":"Notification Sent"}, status=200)
    except Exception as e:
        print("error:", e)
        return JsonResponse({"error":"Bad Request"}, status=401)