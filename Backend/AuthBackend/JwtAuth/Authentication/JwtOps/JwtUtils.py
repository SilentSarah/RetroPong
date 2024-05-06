import jwt
from ..models import *
from django.http import *
from dotenv import dotenv_values
import datetime
import time


env = dotenv_values("../../.env")

SECRET_KEY = env.get('SECRET_KEY')
CLIENT_ID = env.get('CLIENT_ID')
CLIENT_SECRET = env.get('CLIENT_SECRET')



# SECRET_KEY from project settings
AUDIENCE = ['retropong-game-service','retropong-user-service','retropong-auth-service','retropong-chat-service']
MAX_DURATION = 7

class JwtOps:
    def __init__(self):
        pass
    
    @staticmethod
    def verify_token(token: str, request: HttpRequest = None) -> bool:
        """Verifies token validity and expiration date

        Args:
            token (str): JWT recieved from the client

        Returns:
            bool: True if the token is valid, False otherwise
        """
        try:
            retreived_token = token.split(' ')[1]
            jwt.decode(retreived_token, SECRET_KEY, audience=AUDIENCE, algorithms=['HS256'])
            return True
        except Exception as e:
            print("JwtOps.verify_token: ", e)
            return False
        
    @staticmethod
    def refresh_new_token(token: str) -> str:
        """Refreshes the token

        Args:
            token (str): JWT recieved from the client

        Returns:
            str: New JWT token
        """
        try:
            token = token.split(' ')[1]
            decoded = jwt.decode(token, SECRET_KEY, audience=AUDIENCE, algorithms=['HS256'])
            user = decoded.get('user_id')
            from ..DbOps.uInfoUtils import DbOps
            user = DbOps.retrieve_user_info(user)
            new_token = JwtOps.create_token(user)
            return new_token
        except:
            return None
        
    @staticmethod
    def return_new_token(token: str) -> JsonResponse:
        """Returns a json response with the new token, sets the token as a cookie

        Args:
            token (str): JWT recieved from the client

        Returns:
            JsonResponse: JSON response with the new token
        """
        new_token = JwtOps.refresh_new_token(token)
        if (new_token == None):
            return JsonResponse({ 'error': 'Invalid token' })
        else:
            user_id = JwtOps.retrieve_user_id_using_token(new_token)
            response = JsonResponse({
                "user_id": user_id,
                "access": new_token,
                })
            response.set_cookie('access', new_token, max_age=datetime.timedelta(days=MAX_DURATION), samesite="None", secure=True)
            response.set_cookie('user_id', user_id, max_age=datetime.timedelta(days=MAX_DURATION), samesite="None", secure=True)
            return response
        
    @staticmethod
    def create_token(user: Users) -> str:
        """Creates a new token for the user

        Args:
            user (Users): User object

        Returns:
            str: JWT token
        """
        payload =  {
            'user_id': user.id,
            'sub': user.uUsername,
            'iss': 'retropong-auth-service',
            'aud': ['retropong-game-service','retropong-user-service','retropong-auth-service','retropong-chat-service'],
            'iat': int(time.time()),
            'exp': int(time.time() + datetime.timedelta(days=3).total_seconds())
        }
        try:
            print(
                SECRET_KEY
            )
            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
            return token
        except Exception as e:
            print("JwtOps.create_token: ", e)
            return None
        
    @staticmethod
    def retrieve_user_id_using_token(token: str) -> int:
        """Retrieves the user id using the token

        Args:
            token (str): JWT recieved from the client

        Returns:
            int: User id
        """
        try:
            decoded = jwt.decode(token, SECRET_KEY, audience=AUDIENCE, algorithms=['HS256'])
            user_id = decoded.get('user_id')
            return user_id
        except Exception as e:
            print("JwtOps.retrieve_user_id_using_token: ", e)
            return None