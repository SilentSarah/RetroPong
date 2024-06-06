import requests
import json
from ..WebOps.WebOps import *
from ..DbOps.DbOps import *
from django.http import HttpRequest
import random
from dotenv import dotenv_values

env = dotenv_values("../../.env")

CLIENT_ID = env.get('CLIENT_ID')
SECRET_ID = env.get('SECRET_ID')

class ViewAssist:
    
    @staticmethod
    def generate_42_auth_link(auth_url: str, redirect_uri: str, scope: str = "public", response_type: str = "code"):
        """Generates a 42 OAuth 2.0 authorization link

        Args:
            auth_url (str): 42 Authorization URL
            redirect_uri (str): Redirect URI
            scope (str): Permission level (public/private)
            response_type (str): Response type (code)

        Returns:
            str: returns a link to the 42 OAuth 2.0 authorization page
        """
        client_id = CLIENT_ID
        state = "42RetroPong"
        final_url = f"{auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type={response_type}&state={state}&scope={scope}"
        return final_url
    
    @staticmethod
    def generate_42_request_token(code: str, redirect_uri: str, token_url: str = "https://api.intra.42.fr/oauth/token") -> str:
        """Generates a 42 OAuth 2.0 data request token

        Args:
            code (str): Authorization code
            redirect_uri (str): Redirect URI

        Returns:
            str: returns the request token
        """
        params = {
            "grant_type": "authorization_code",
            "client_id": CLIENT_ID,
            "client_secret": SECRET_ID,
            "code": code,
            "redirect_uri": redirect_uri
        }
        access_token = requests.post(token_url, params=params)
        print(access_token.status_code)
        access_token = access_token.json()
        
        token = access_token.get('access_token')
        
        return token
    
    @staticmethod
    def generate_42_user_data(access_token: str):
        """Acquires user data from 42 API

        Args:
            access_token (str): Access token

        Returns:
            json: returns a json object containing the user data from 42 API
        """
        response = WebOps.request_endpoint("https://api.intra.42.fr/v2/me", "GET", {"Authorization": f"Bearer {access_token}"})
        response = json.loads(response.content.decode('utf-8'))
        try :
            username = response.get('login')
            email = response.get('email')
            first_name = response.get('first_name')
            last_name = response.get('last_name')
            image = response.get('image')

            if (username is None or email is None or first_name is None or last_name is None):
                raise Exception("Invalid data")
            required_data = {
                "uUsername": response.get('login') + str(response.get('id')),
                "uEmail": response.get('email'),
                "uPassword": f"R{random.randint(100000, 999999)}t{random.randint(100000, 999999)}e{random.randint(100000, 999999)}s{random.randint(100000, 999999)}t{random.randint(100000, 999999)}",
                "uFname": response.get('first_name'),
                "uLname": response.get('last_name'),
                "uRegdate": timezone.now(),
                "uProfilepic": image.get('link') if image is not None else DEFAULT_PFP_LINK,
                "uProfilebgpic": DEFAULT_BG_LINK,
                "uDesc": "",
                "uIp": "",
                "ucIDs": [],
                "uIs42": True
            }
        except Exception as e:
            print(e)
            return None
        
        return required_data
    
    @staticmethod
    def grab_user_data_from_db(required_data: str):
        """Grabs 42 user data from the database / Creates a new user if not found

        Args:
            required_data (dict): Data required to create a new user if not found

        Returns:
            dict: returns a dictionary containing the user data
        """
        user_data = DbOps.get_user(username=required_data.get('uUsername'))
        if (user_data is None):
            if (DbOps.create_user(required_data, 1) == False):
                return None
            user_data = DbOps.get_user(username=required_data.get('uUsername'))
        
        return user_data
    
    @staticmethod
    def request_jwt_from_auth_server(user_data: dict, endpoint: str):
        """Requests JWT from the authentication server

        Args:
            user_login_data (dict): User login data
            endpoint (str): Endpoint to request JWT from

        Returns:
            requests.Response: returns a response object containing the JWT token
        """
        user_login_data = {
            "user_id": user_data.get('id'),
            "username": user_data.get('username'),
            "password": user_data.get('password')
        }
        user_login_data = json.dumps(user_login_data)
        response = WebOps.request_endpoint(endpoint, 'POST', {'Content-Type': 'application/json'}, user_login_data)
        if (response.status_code == 201):
            jwt = response.cookies.get('access')
            return jwt
        else:
            return None
    
    @staticmethod
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
            
    @staticmethod
    def create_user_and_setup_login_creds(request: HttpRequest) -> dict:
        registarion_data = json.loads(request.body.decode('utf-8')) 
        if (DbOps.create_user(registarion_data) == False):
            return None
        user_login_data = {
            "username": registarion_data.get('uUsername'),
            "password": registarion_data.get('uPassword')
        }
        return user_login_data
    
    @staticmethod
    def generate_acc_settings_cfg(request: HttpRequest) -> dict:
        full_name = request.POST.get('full_name')
        if (full_name is not None):
            split_name = full_name.split(' ')
            first_name = full_name.split(' ')[0] if len(split_name) > 0 else None
            last_name = full_name.split(' ')[1] if len(split_name) > 1 else None
        else:
            first_name = None
            last_name = None
        password = request.POST.get('password')
        if (password is not None):
            if (re.match(r'[A-Za-z0-9]{8,}', password) is None):
                password_hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            raise Exception("Invalid password")
        else:
            password_hashed = None
        data =  {
            "ufname": first_name,
            "ulname": last_name,
            "uusername": request.POST.get('username'),
            "udiscordid": request.POST.get('discordid'),
            "utitle": request.POST.get('title'),
            "udesc": request.POST.get('desc'),
            "uemail": request.POST.get('email'),
            "upassword": password_hashed,
            "TwoFactor": True if request.POST.get('two_factor') == "true" else False,
        }
        return data
    
    @staticmethod
    def validate_form_data(request: HttpRequest) -> bool:
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        if (email is None or username is None or password is None):
            return False
        if (re.match(r'[A-Za-z0-9]{8,}', password) is None):
            return False
        return True