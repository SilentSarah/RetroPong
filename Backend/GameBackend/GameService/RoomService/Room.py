import uuid
from .Game import GameService
from .PrivateQueue import *
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .Client import Client

class Room:
    
    player1 = None
    player2 = None
    
    def __init__(self, is_tournament: bool = False, match_tournament = None, player1 = None, player2 = None):
        self.id: str = str(uuid.uuid4())
        self.players: list = []
        self.score: list[int] = [0, 0]
        self.winner: int = None
        self.playerCount: int = 0
        self.status: str = "waiting"
        self.owner: Client = None
        self.player1 = player1
        self.player2 = player2
        self.is_tournament: bool = is_tournament
        self.match_tournament = match_tournament
        
        
    def add_player(self, player: int):
        self.players.append(player)
        self.playerCount += 1
        
    def remove_player(self, player_id: int):
        self.players.remove(player_id)
        self.playerCount -= 1
        
    def update_score(self, player_id: int, score: int):
        self.score[player_id] = score
        
    def set_winner(self, player_id: int):
        self.winner = player_id
        
    def set_status(self, status: str):
        self.status = status
        
    def get_status(self) -> str:
        return self.status
    
    def get_players(self) -> list[int]:
        return self.players
    
    def get_score(self, player_id: int) -> int:
        return self.score[player_id]
    
    def get_winner(self) -> int:
        return self.winner
    
    def get_player_count(self) -> int:
        return self.playerCount
    
    def get_id(self) -> int:
        return self.id

AVAILABLE_ROOMS : list[Room] = []
MATCHMAKER_QUEUE : list = []
    
class RoomService:
    @staticmethod
    async def create_room(ws, user, action, data: dict) -> Room:
        try:
            if (RoomService.check_joined_room(user)):
                return await ws.send_message_status("rooms", "fail", 'You are already in a room')
            room = Room()
            room.id = str(uuid.uuid4())
            room.players = [user.id]
            room.score = [0, 0]
            room.winner = -1
            room.playerCount = 1
            room.player1 = user
            room.status = 'waiting'
            room.owner = user
            user.room = room
            AVAILABLE_ROOMS.append(room)
            print(f"Room created {room.id}, room owner: {room.owner}")
            await RoomService.broadcast_room_changes(ws)
            return room
        except Exception as e:
            print(e)
            return await ws.send_message_status("rooms", "fail", 'Error creating room')
        
    @staticmethod 
    async def private_invite(ws, user, action, data: dict):
        from .Login import find_user
        if (RoomService.check_joined_room(user)):
            return await ws.send_message_status("rooms", "fail", 'You are already in a room')
        
        data = data.get('data')
        if (data is None):
            return await ws.send_message_status("rooms", "fail", 'Missing data identifier')
        
        inviter_id = data.get('inviter_id')
        if (inviter_id is None):
            return await ws.send_message_status("rooms", "fail", 'Missing inviter_id identifier')
        
        inviter_id = int(inviter_id)
        private_session = get_existing_invite(inviter_id)
        if (private_session is None):
            return await ws.send_message_status("rooms", "fail", 'Invite not found')
        
        inviter = find_user(user_id=inviter_id)
        if (inviter is None):
            return await ws.send_message_status("rooms", "fail", 'Friend is not Online')
        
        if (RoomService.check_joined_room(inviter)):
            return await ws.send_message_status("rooms", "fail", 'Inviter is already in a room')
        
        PRIVATE_QUEUE.remove(private_session)
        room = Room()
        room.id = str(uuid.uuid4())
        room.players = [user.id, inviter_id]
        room.score = [0, 0]
        room.winner = -1
        room.playerCount = 2
        room.status = 'waiting'
        room.owner = user
        room.player1 = inviter
        room.player2 = user
        user.room = room
        inviter.room = room
        AVAILABLE_ROOMS.append(room)
        return await GameService.start_game(room)
    
    @staticmethod
    async def join_room(ws, user, action, data: dict):
        if (RoomService.check_joined_room(user)):
            return await ws.send_message_status("rooms", "fail", 'You are already in a room')
        
        room_id = data.get('room_id')
        if (room_id is None):
            return await ws.send_message_status("rooms", "fail", 'Missing Room ID identifier')
        
        room_id: str = room_id
        room:Room = RoomService.get_room(room_id)
        if (room is None):
            return await ws.send_message_status("rooms", "fail", 'Room id not found')
        
        if (room.get_player_count() >= 2):
            return await ws.send_message_status("rooms", "fail", 'Room is full')
        
        room.add_player(user.id)
        user.room = room
        
        if (room.player1 is None): room.player1 = user
        if (room.player2 is None): room.player2 = user
        
        room_data = RoomService.serialize_room(room)
        await ws.send_json({ "request": "rooms", "action": action, 'status': 'success', "data": room_data })
        await RoomService.broadcast_room_changes(ws)
        
        if (room.get_player_count() == 2):
            print("Room filled, starting round")
            await GameService.start_game(room)
        
    
    @staticmethod
    async def leave_room(ws, user, action, data: dict):
        if (RoomService.check_joined_room(user) == False):
            return await user.ws.send_message_status("rooms", "fail", 'You are not in a room')
        
        user.room.remove_player(user.id)
        if (user.room.get_player_count() == 0):
            AVAILABLE_ROOMS.remove(user.room)
            del user.room
        else:
            user.room.owner = user.room.get_players()[0]
            
        user.room = None
        await user.ws.send_json({
            "request": "rooms", 
            "action": action, 
            'status': 'success', 
            "message": 'You have left the room'
        })
        return await RoomService.broadcast_room_changes(ws)
    
    @staticmethod
    async def rapid_join(ws, user, action, data: dict):
        if (RoomService.check_joined_room(user)):
            return await ws.send_message_status("rooms", "fail", 'You are already in a room')
        
        MATCHMAKER_QUEUE.append(user)
        if (len(MATCHMAKER_QUEUE) >= 2):
            client1 = MATCHMAKER_QUEUE[0]
            client2 = MATCHMAKER_QUEUE[1]
            if (client1 == client2):
                MATCHMAKER_QUEUE.remove(client1)
                MATCHMAKER_QUEUE.remove(client2)
                print("Detected same user")
                return await ws.send_message_status("rooms", "fail", 'You are already in the queue')
            await client1.ws.send_json({ "request": "rooms", "action": "rapid_join", 'status': 'success', "message": 'Match found' })
            await client2.ws.send_json({ "request": "rooms", "action": "rapid_join", 'status': 'success', "message": 'Match found' })
            room = Room()
            room.id = str(uuid.uuid4())
            room.players = [client1.id, client2.id]
            
            room.score = [0, 0]
            room.winner = -1
            room.playerCount = 2
            room.status = 'waiting'
            room.owner = client1
            client1.room = room
            client2.room = room
            AVAILABLE_ROOMS.append(room)
            MATCHMAKER_QUEUE.remove(client1)
            MATCHMAKER_QUEUE.remove(client2)
            await GameService.start_game(room)
            
    @staticmethod
    async def update_matchseek_player_count():
        for user in MATCHMAKER_QUEUE:
            print("user found", user.id)
            await user.send_message_to_self({
                "request": "rooms", 
                "action": "matchseek", 
                'status': 'success', 
                "data": {
                    "online_players":len(MATCHMAKER_QUEUE)
                }
            })
            
    @staticmethod
    async def check_if_user_in_matchseek(user):
        return user in MATCHMAKER_QUEUE
            
    @staticmethod
    async def rapid_leave(ws, user, action, data: dict):
        if (RoomService.check_if_user_in_matchseek(user) == False):
            return await ws.send_message_status("rooms", "fail", 'You are not in the matchseek queue')
        
        MATCHMAKER_QUEUE.remove(user) if user in MATCHMAKER_QUEUE else None
        await ws.send_json({
            "request": "rooms", 
            "action": action, 
            'status': 'success', 
            "message": 'You have left the room'
        })
        return await RoomService.update_matchseek_player_count()
    
    @staticmethod
    async def get_rooms(ws, user, action, data:dict) -> list[Room]:
        room_data:list[dict] = []
        for room in AVAILABLE_ROOMS:
            room_data.append(room.__dict__)
        return await ws.send_json({ "request": "rooms", "action": action, 'status': 'success', "data": room_data })
    
    @staticmethod
    async def broadcast_room_changes(ws):
        rooms_data:list[dict] = []
        for room in AVAILABLE_ROOMS:
            room_data = RoomService.serialize_room(room)
            rooms_data.append(room_data)
        await ws.broadcast({
            "request": "rooms", 
            "action": "update", 
            'status': 'success',
            "data": rooms_data
        })
        
    @staticmethod
    def serialize_room(room: Room):
        room_data = {
            "id": room.id,
            "players": room.players,
            "score": room.score,
            "winner": room.winner,
            "playerCount": room.playerCount,
            "status": room.status,
            "owner": room.owner.id,
            "player1": room.player1.id if room.player1 is not None else None,
            "player2": room.player2.id if room.player2 is not None else None
        }
        return room_data

    @staticmethod
    def get_available_rooms() -> list[Room]:
        return [room for room in AVAILABLE_ROOMS if room.get_player_count() < 2]
    

    @staticmethod
    def get_room(room_id: str) -> Room:
        for room in AVAILABLE_ROOMS:
            if room.get_id() == room_id:
                return room
        return None
    
    @staticmethod
    def check_joined_room(user) -> bool:
        return user.room is not None
    
    @staticmethod
    def remove_player(user):
        if (user.room is not None):
            user.room.remove_player(user.id)
            if (user.room.get_player_count() == 0):
                if (user.room in AVAILABLE_ROOMS):
                    AVAILABLE_ROOMS.remove(user.room)
                del user.room
            else:
                user.room.owner = user.room.get_players()[0]
            user.room = None
        return None