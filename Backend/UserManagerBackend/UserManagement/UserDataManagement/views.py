from django.http import *
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.db.utils import *
from .DbOps.DbOps import *
from .WebOps.WebOps import *
from .ViewAssist.ViewAssist import *
import json


MAX_DURATION = 7

@csrf_exempt
@require_http_methods(["GET"])
def user_data(request: HttpRequest):
    try:
        token, user_id = ViewAssist.verify_token(request)
        if (token is None or user_id is None):
            return HttpResponse(status=401)
        user_data = DbOps.get_user(user_id=user_id)
        user_data.pop('password')
        return JsonResponse(user_data, status=200)
    except Exception as e:
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
def create_user(request: HttpRequest):
    try:
        user_login_data = ViewAssist.create_user_and_setup_login_creds(request)
        if (user_login_data is None):
            return JsonResponse({"error":"Bad Request"}, status=400)
        user = DbOps.get_user(username=user_login_data.get('username'))
        jwt = ViewAssist.request_jwt_from_auth_server(user_login_data, "http://127.0.0.1:8000/auth/")
        if (jwt is not None):
            new_response = JsonResponse(
                {
                    "message":"User Created Successfully",
                    "user_id": user.get('id'),
                    "access": jwt
                }, status=201)
            new_response.set_cookie('user_id', user.get('id'), samesite='none', secure=True)
            new_response.set_cookie('access', jwt, samesite='none', secure=True)
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
        "http://127.0.0.1:8001/userdata/42login/callback/",
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
            token = ViewAssist.generate_42_request_token(code, "http://127.0.0.1:8001/userdata/42login/callback/")
            if (token is None):
                return JsonResponse({"Error":"Couldn't acquire access token"}, status=400)
            required_data = ViewAssist.generate_42_user_data(token)
            if (required_data is None):
                return JsonResponse({"Error":"Missing Values"}, status=400)
            user_data = ViewAssist.grab_user_data_from_db(required_data)
            if (user_data is None):
                return JsonResponse({"Error":"Missing Params when creating/searching for user"}, status=400)
            jwt_token = ViewAssist.request_jwt_from_auth_server(user_data, "http://127.0.0.1:8000/auth/42login/create")
            if (jwt_token is None):
                return JsonResponse({"error":"JWT couldn't be acquired, please log in manually"}, status=400)
            else:
                res = HttpResponseRedirect("http://127.0.0.1:5500/dashboard")
                res.set_cookie('user_id', user_data.get('id'), samesite="None", secure=True)
                res.set_cookie('access', jwt_token, samesite="None", secure=True)
                print("token:", jwt_token)
                return res
        except Exception as e:
            print("error:", e)
            return HttpResponse(status=400)

@csrf_exempt
@require_http_methods(["UPDATE"])
def update_user(request: HttpRequest):
    if (ViewAssist.verify_token(request) is not None):
        user_data = json.loads(request.body.decode('utf-8'))
        if (DbOps.update_user(id, user_data) == False):
            return HttpResponse(status=400)
        else:
            return HttpResponse(status=200)
        
        
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