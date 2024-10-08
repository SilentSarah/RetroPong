import bcrypt, json
from ..models import *
from django.http import *
import datetime
from django.db.models import Q

MAX_DURATION = 7

class DbOps:
    
    def __init__(self):
        pass
    

    @staticmethod
    def authenticate_user(request: HttpRequest):
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get("username")
            password = data.get("password")
            user = Users.objects.get(Q(uUsername=username) | Q(uEmail=username))
            hash_comparision = bcrypt.checkpw(password.encode('utf-8'), user.uPassword.encode('utf-8'))
            if (hash_comparision == False):
                return None
            else:
                from ..JwtOps.JwtUtils import JwtOps
                if (user.TwoFactor == True):
                    if (JwtOps.send_2fa_code(user) == False):
                        return None
                    return user.id
                else:
                    return user
        except Exception as e:
            print("Error: ", e)
            return None
    
    @staticmethod
    def retrieve_user_info(id: str):
        try:
            user = Users.objects.get(id=id)
            return user
        except Exception as e:
            print("Error: ", e)
            return None
        
    @staticmethod
    def login_user(request: HttpRequest) -> JsonResponse:
        """Logs the user in, Generates a JWT and assings it as a response cookie

        Args:
            request (HttpRequest): Client Request

        Returns:
            JsonResponse: Response to the client in json format, containing the JWT
        """
        user = DbOps.authenticate_user(request)
        if (user == None):
            return JsonResponse({ 'error': 'Invalid username or password' }, status=401)
        elif (type(user) == int):
            response = JsonResponse({'message': '2FA Required'}, status=200)
            response.set_cookie('user_id', user, max_age=datetime.timedelta(minutes=5), samesite='None', secure=True)
            response.set_cookie('2fa', 'true', max_age=datetime.timedelta(minutes=5), samesite='None', secure=True)
            return response
        from ..JwtOps.JwtUtils import JwtOps
        access_token = JwtOps.create_token(user)
        user_id = JwtOps.retrieve_user_id_using_token(access_token)
        response = JsonResponse(
            {
                "user_id": user_id,
                "access": access_token,
            }, status=201)
        response.set_cookie('access', access_token, max_age=datetime.timedelta(days=MAX_DURATION), samesite='None', secure=True)
        response.set_cookie('user_id', user_id, max_age=datetime.timedelta(days=MAX_DURATION), samesite='None', secure=True)
        return response
    
    @staticmethod
    def check_if_42_user(user_id: int) -> bool:
        return Users.objects.filter(id=user_id, uIs42=True).exists()
