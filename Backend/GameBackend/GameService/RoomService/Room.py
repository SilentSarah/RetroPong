AVAILABLE_ROOMS : list = []
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
    
    
class RoomService:
    @staticmethod
    async def create_room(ws, data) -> Room:
        # room = Room()
        # room.id = len(AVAILABLE_ROOMS)
        # room.players = [player_id]
        # room.score = [0, 0]
        # room.winner = -1
        # room.playerCount = 1
        # room.status = 'waiting'
        # AVAILABLE_ROOMS.append(room)
        print("Creating room")
        await ws.send_json({ 'message': 'Room created' })
        return
    
    @staticmethod
    def join_room(ws, data) -> Room:
        room = AVAILABLE_ROOMS[room_id]
        room.add_player(player_id)
        room.playerCount += 1
        return room
    
    @staticmethod
    def leave_room(ws, data) -> Room:
        room = AVAILABLE_ROOMS[room_id]
        room.remove_player(player_id)
        room.playerCount -= 1
        return room
    
    @staticmethod
    def get_rooms() -> list[Room]:
        return AVAILABLE_ROOMS
    
    @staticmethod
    def get_room(room_id: int) -> Room:
        return AVAILABLE_ROOMS[room_id]
    
    @staticmethod
    def get_room_count() -> int:
        return len(AVAILABLE_ROOMS)
    
    @staticmethod
    def get_available_rooms() -> list[Room]:
        return [room for room in AVAILABLE_ROOMS if room.get_player_count() < 2]
    
    @staticmethod
    def get_room_by_player(player_id: int) -> Room:
        for room in AVAILABLE_ROOMS:
            if player_id in room.get_players():
                return room
        return None