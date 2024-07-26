from .Room import Room
from .models import User
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .Game import GameBallData, GamePlayerData, Game

class Client:
    def __init__(self, channel_name, id: int = None):
        self.channel_name = channel_name
        self.id = id
        self.room: Room = None
        self.user_data: User = None
        self.ws = None
        self.game: Game = None
        self.opponent = None
        self.cookie = None
        self.game_data: GamePlayerData = None
        self.ball_data: GameBallData = None
        
    async def send_message_to_self(self, message):
        await self.ws.send_json(message) 
        