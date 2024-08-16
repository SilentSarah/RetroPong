import requests, os
from django.http import *


SERVER_NAME = os.environ.get('HOST_ADDRESS')
AUTH_PORT = os.environ.get('AUTH_PORT')

def verify_token(request: HttpRequest = None, token_from_ws = None) -> str:
    auth_token = request.headers.get('Authorization') if request is not None else token_from_ws
    if auth_token is None:
        print("hermosa you forgot the jwt")
        return None, None
    else:
        request = requests.Session()
        request.headers['Authorization'] =  f"{auth_token}"
        response = request.get(f'https://{SERVER_NAME}:{AUTH_PORT}/auth/', verify=False)
        if response.status_code == 200:
            body = response.json()
            token = body.get('access')
            user_id = body.get('user_id')
            return token, user_id
        else:
            print("Auth server said sike")
            return None, None