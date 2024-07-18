from .Room import Room
from .models import User
class Client:
    def __init__(self, channel_name, id: int = None):
        self.channel_name = channel_name
        self.id = id
        self.room: Room = None
        self.user_data: User = None
        
    async def send_message_to_self(self, ws, message):
        await ws.send_json({
            message
        })