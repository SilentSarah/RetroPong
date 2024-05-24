from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .DbOps.uInfoUtils import DbOps
from .JwtOps.JwtUtils import JwtOps
from .models import *
import json
import datetime

MAX_DURATION = 7

@csrf_exempt
@require_http_methods(['POST', 'GET'])
def authenticate_user(request: HttpRequest):
    """Authenticates the user and issues a new token if the user is already authenticated

    Args:
        request (HttpRequest): 

    Returns:
        JsonResponse: Response to the client in json format
    """
    auth_token = request.headers.get('Authorization')
    if (auth_token == None):
        return DbOps.login_user(request)
    else:
        if (JwtOps.verify_token(auth_token, request) == False):
            response = JsonResponse({ 'error': 'Invalid token' })
            response.status_code = 401
            response.set_cookie('access', '', max_age=0, samesite="None", secure=True)
            return response
        else:
            response = JwtOps.return_new_token(auth_token)
            if (response == None):
                return JsonResponse({ 'error': 'Bad Request' }, status=400)
            return response

@csrf_exempt
@require_http_methods(['POST'])
def generate_42_user_token(request: HttpRequest):
    """Generates a new token for the user using the 42 API

    Args:
        request (HttpRequest): 

    Returns:
        JsonResponse: Response to the client in json format
    """
    body = json.loads(request.body)
    user_id = body.get('user_id')
    if (DbOps.check_if_42_user(int(user_id)) == False):
        return JsonResponse({ 'error': 'User is not a 42 user' }, status=401)
    user = DbOps.retrieve_user_info(user_id)
    token = JwtOps.create_token(user)
    response = JsonResponse(
        {
            'user_id': user_id,
            'access': token 
        }, status=201)
    response.set_cookie('access', token, max_age=datetime.timedelta(days=MAX_DURATION), samesite="None", secure=True)
    return response