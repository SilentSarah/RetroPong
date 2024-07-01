import jwt
from ..models import *
from django.http import *
from dotenv import dotenv_values
import datetime
import time
import requests
from django.utils import timezone
from random import randint


env = dotenv_values("../../.env")

SECRET_KEY = env.get('SECRET_KEY')
CLIENT_ID = env.get('CLIENT_ID')
CLIENT_SECRET = env.get('CLIENT_SECRET')
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
        
    @staticmethod
    def send_2fa_code(user: Users) -> bool:
        """Sends a 2fa code to the user

        Args:
            user (Users): User object

        Returns:
            bool: True if the code was sent, False otherwise
        """
        try:
            two_factor =  TwoFactor(secret=randint(100000, 999999), user=user, created_at=timezone.now())
            response = requests.post(f"https://api.mailgun.net/v3/mg.retropong.games/messages",
                                    auth=("api", env.get('EMAIL_API_KEY')),
                                    data = {
                                        "from":f'RetroPong <{env.get("RP_EMAIL")}>',
                                        "to": [user.uEmail],
                                        "subject": "Account 2FA Verification",
                                        "text": f"Your 2FA code is: {two_factor.secret}\nThis code will expire in 5 minutes.",
                                    })
            if (response.status_code != 200):
                print(response.text)
                return False
            two_factor.save()
            return True
        except Exception as e:
            print("JwtOps.send_2fa_code: ", e)
            return False
    
    @staticmethod
    def verify_2fa_code(code: int, user_id: int) -> int:
        """Verifies the 2fa code

        Args:
            code (int): 2fa code

        Returns:
            User | None: User object if the code is valid, None otherwise
        """
        try:
            two_factor = TwoFactor.objects.get(secret=code)
            if (int(user_id) != int(two_factor.user.id)):
                print(user_id, two_factor.user.id)
                raise ValueError("User id does not match")
            if (two_factor.verified == True):
                raise ValueError("Code already verified")
            if ((two_factor.created_at + datetime.timedelta(minutes=5)) < timezone.now()):
                raise ValueError("Code expired")    
            two_factor.verified = True
            two_factor.delete()
            user = two_factor.user.id
            return user
        except Exception as e:
            print("JwtOps.verify_2fa_code: ", e)
            return None