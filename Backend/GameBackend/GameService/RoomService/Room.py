class Room:
    def __init__(self):
        self.id: int
        self.players: list[int]
        self.score: list[int]
        self.winner: int
        self.playerCount: int
        self.status: str
        
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
    async def create_room(ws, user, data: dict):
        try:
            if (RoomService.check_joined_room(user)):
                return await ws.send_message_status("rooms", "fail", 'You are already in a room')
            room = Room()
            room.id = len(AVAILABLE_ROOMS)
            room.players = [user.id]
            room.score = [0, 0]
            room.winner = -1
            room.playerCount = 1
            room.status = 'waiting'
            user.room = room
            print(f"User {user.id} created room {user.room.id}")
            AVAILABLE_ROOMS.append(room)
            response = room.__dict__
            return await ws.send_json({ "type": "rooms", 'status': 'success', "room_data": response })
        except Exception as e:
            print(e)
            return await ws.send_message_status("rooms", "fail", 'Error creating room')
    
    @staticmethod
    async def join_room(ws, user, data: dict):
        if (RoomService.check_joined_room(user)):
            return await ws.send_message_status("rooms", "fail", 'You are already in a room')
        
        room_id = data.get('room_id')
        if (room_id is None):
            return await ws.send_message_status("rooms", "fail", 'Missing room_id identifier')
        
        room_id: int = int(room_id)
        if (room_id < 0 or room_id >= len(AVAILABLE_ROOMS)):
            return await ws.send_message_status("rooms", "fail", 'Room id not found')
        
        room:Room = AVAILABLE_ROOMS[room_id]
        room.add_player(user.id)
        user.room = room
        print(f"User {user.id} joined room {user.room.id}")
        await ws.send_json({ "type": "rooms", 'status': 'success', "room_data": room.__dict__ })
    
    @staticmethod
    def leave_room(ws, user, data: dict):
        if (RoomService.check_joined_room(user) == False):
            return ws.send_message_status("rooms", "fail", 'You are not in a room')
        
        user.room.remove_player(user.id)
        if (user.room.get_player_count() == 0):
            AVAILABLE_ROOMS.remove(user.room)
            
        del user.room
        user.room = None
        return ws.send_message_status("rooms", "success", 'You left the room successfully')
    
    @staticmethod
    async def get_rooms(ws, user, data:dict) -> list[Room]:
        room_data:list[dict] = []
        available_rooms: list[Room] = RoomService.get_available_rooms()
        for room in available_rooms:
            room_data.append(room.__dict__)
        return await ws.send_json({ "type": "rooms", 'status': 'success', "rooms": room_data })
    
    # @staticmethod
    # def get_room(room_id: int) -> Room:
    #     return AVAILABLE_ROOMS[room_id]
    
    # @staticmethod
    # def get_room_count() -> int:
    #     return len(AVAILABLE_ROOMS)
    
    @staticmethod
    def get_available_rooms() -> list[Room]:
        return [room for room in AVAILABLE_ROOMS if room.get_player_count() < 2]
    
    # @staticmethod
    # def get_room_by_player(player_id: int) -> Room:
    #     for room in AVAILABLE_ROOMS:
    #         if player_id in room.get_players():
    #             return room
    #     return None
    
    @staticmethod
    def check_joined_room(user) -> bool:
        return user.room is not None
