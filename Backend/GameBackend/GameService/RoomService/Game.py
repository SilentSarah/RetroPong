from .Room import Room
from .Client import Client
from .Login import find_user

class Game:
    def __init__(self, room: Room):
        self.current_room: Room = room
        self.player1: Client = find_user(room.get_players()[0])
        self.player2: Client = find_user(room.get_players()[1])
        self.player1_score: int = 0
        self.player2_score: int = 0
        self.winner: int = -1
        self.status: str = "starting"