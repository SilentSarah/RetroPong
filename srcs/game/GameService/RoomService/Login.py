import requests, os
from .models import User
from .Client import Client
from .Game import GameService
from .Room import RoomService
from .Room import AVAILABLE_ROOMS, MATCHMAKER_QUEUE
from django.http import HttpRequest
from asgiref.sync import sync_to_async

LOGGED_USERS : list = []
SERVER_NAME = os.environ.get('HOST_ADDRESS')
AUTH_PORT = os.environ.get('AUTH_PORT')
class Auth:
    @staticmethod
    async def login(ws_data: dict, ws_connection, ws):
        headers:list = ws_data.get('headers')
        if (headers is None): return False, None
        
        access_token_tuple = find_cookie_tuple(headers)
        if (access_token_tuple is None): return False, None
        
        access_token = extract_cookie_value(access_token_tuple, 'access')
        if (access_token is None): return False, None
        
        token, user_id = await verify_token(token_from_ws=access_token)
        if (token is None or user_id is None): return False, None
        
        user = Client(id=user_id, channel_name=ws_connection)
        user.cookie = access_token
        user.ws = ws
        
        if (find_user(user_id=user_id) is not None): return False, None
        LOGGED_USERS.append(user)
        user.room = await Auth.restore_user_data(user)
        user.user_data = await sync_to_async(User.objects.get)(id=user_id)
        return True, user_id
    
    @staticmethod
    async def logout(ws_connection):
        user = find_user(ws_connection=ws_connection)

        if (user is not None):
            try:
                if (user.opponent is not None and user.game is not None and user.opponent.game is not None): 
                    await user.opponent.send_message_to_self({
                        "request":"game",
                        "action":"info",
                        "status":"success",
                        "message":"Your opponent has left the game waiting for 10s"
                    })
                # if (user.game is not None and user.game.game_physics is not None):
                #     user.game.game_physics.paddle_1 = False if user.game.game_physics.paddle_1.owner.id == user.id else user.game.game_physics.paddle_1
                #     user.game.game_physics.paddle_2 = False if user.game.game_physics.paddle_2.owner.id == user.id else user.game.game_physics.paddle_2
                RoomService.remove_player(user)
                GameService.remove_player(user.game, user)
                LOGGED_USERS.remove(user) if find_user(ws_connection=ws_connection) else None
                MATCHMAKER_QUEUE.remove(user) if user in MATCHMAKER_QUEUE else None
            except Exception as e:
                print(e)
            return True
        return False
    
    @staticmethod
    async def check_auth(ws_connection):
        user = find_user(ws_connection=ws_connection)
        return user
    
    @staticmethod
    async def restore_user_data(user: Client):
        for room in AVAILABLE_ROOMS:
            if (user.id in room.get_players()):
                print("User found in room, restoring data")
                return room
        return None
        

async def verify_token(request: HttpRequest = None, token_from_ws = None) -> str:
    auth_token = request.headers.get('Authorization') if request is not None else token_from_ws
    if auth_token is None:
        print("hermosa you forgot the jwt")
        return None, None
    else:
        request = requests.Session()
        request.headers['Authorization'] =  f"Bearer {auth_token}"
        print("Verifiying token: ", auth_token)
        response = request.get(f'https://{SERVER_NAME}:{AUTH_PORT}/auth/', verify=False)
        if response.status_code == 200:
            print("SUCCESS")
            body = response.json()
            token = body.get('access')
            user_id = body.get('user_id')
            return token, user_id
        else:
            print("Auth server said sike")
            return None, None
        
def find_cookie_tuple(headers:list) -> tuple:
    for tuple in headers:
        if tuple[0] == b'cookie':
            return tuple
    return None

def extract_cookie_value(cookie_tuple:tuple, cookie_name:str) -> str:
    cookie = cookie_tuple[1].decode('utf-8')
    cookie = cookie.split('; ')
    for c in cookie:
        if cookie_name in c:
            return c.split('=')[1]
    return None

def find_user(ws_connection = None, user_id:int = None) -> Client:
    for user in LOGGED_USERS:
        if user.id == user_id or user.channel_name == ws_connection:
            return user
    return None

def find_user_tournament(ws_connection = None, user_id:int = None) -> Client:
    from .Tournament import TOURNAMENT_USERS
    for user in TOURNAMENT_USERS:
        if user.id == user_id or user.channel_name == ws_connection:
            return user
    return None

def change_ws_connection(old_user: Client, new_user: Client):
    old_user.ws = new_user.ws