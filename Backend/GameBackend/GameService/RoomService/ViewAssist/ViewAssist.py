import requests
from django.http import *

def verify_token(request: HttpRequest = None, token_from_ws = None) -> str:
    auth_token = request.headers.get('Authorization') if request is not None else token_from_ws
    if auth_token is None:
        print("hermosa you forgot the jwt")
        return None, None
    else:
        request = requests.Session()
        request.headers['Authorization'] =  f"{auth_token}"
        response = request.get('http://127.0.0.1:8000/auth/')
        if response.status_code == 200:
            body = response.json()
            token = body.get('access')
            user_id = body.get('user_id')
            return token, user_id
        else:
            print("Auth server said sike")
            return None, None