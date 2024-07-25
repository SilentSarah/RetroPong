import uuid
from .Game import GameService
class Room:
    def __init__(self):
        self.id: str
        self.players: list[int]
        self.score: list[int]
        self.winner: int
        self.playerCount: int
        self.status: str
        self.owner: int
        
    def add_player(self, player_id: int):
        self.players.append(player_id)
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
    
class RoomService:
    @staticmethod
    async def create_room(ws, user, action, data: dict):
        try:
            if (RoomService.check_joined_room(user)):
                return await ws.send_message_status("rooms", "fail", 'You are already in a room')
            room = Room()
            room.id = str(uuid.uuid4())
            room.players = [user.id]
            room.score = [0, 0]
            room.winner = -1
            room.playerCount = 1
            room.status = 'waiting'
            room.owner = user.id
            user.room = room
            AVAILABLE_ROOMS.append(room)
            return await RoomService.broadcast_room_changes(ws)
        except Exception as e:
            print(e)
            return await ws.send_message_status("rooms", "fail", 'Error creating room')
    
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
        
        await ws.send_json({ "request": "rooms", "action": action, 'status': 'success', "data": room.__dict__ })
        await RoomService.broadcast_room_changes(ws)
        
        if (room.get_player_count() == 2):
            print("Room filled, starting round")
            await GameService.start_game(room)
        
    
    @staticmethod
    async def leave_room(ws, user, action, data: dict):
        if (RoomService.check_joined_room(user) == False):
            return await ws.send_message_status("rooms", "fail", 'You are not in a room')
        
        user.room.remove_player(user.id)
        if (user.room.get_player_count() == 0):
            AVAILABLE_ROOMS.remove(user.room)
            del user.room
        else:
            user.room.owner = user.room.get_players()[0]
            
        user.room = None
        await ws.send_json({
            "request": "rooms", 
            "action": action, 
            'status': 'success', 
            "message": 'You have left the room'
        })
        return await RoomService.broadcast_room_changes(ws)
    
    
    @staticmethod
    async def get_rooms(ws, user, action, data:dict) -> list[Room]:
        room_data:list[dict] = []
        for room in AVAILABLE_ROOMS:
            room_data.append(room.__dict__)
        return await ws.send_json({ "request": "rooms", "action": action, 'status': 'success', "data": room_data })
    
    @staticmethod
    async def broadcast_room_changes(ws):
        room_data:list[dict] = []
        for room in AVAILABLE_ROOMS:
            room_data.append(room.__dict__)
        await ws.broadcast({
            "request": "rooms", 
            "action": "update", 
            'status': 'success',
            "data": room_data
        })

    @staticmethod
    def get_available_rooms() -> list[Room]:
        return [room for room in AVAILABLE_ROOMS if room.get_player_count() < 2]
    

    @staticmethod
    def get_room(room_id: str) -> Room:
        print("Room ID REQUEST: ", room_id, "Rooms: ", len(AVAILABLE_ROOMS))
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