import json
from .Room import Room
from .Login import Auth
from .Interpreter import Interpreter
from channels.db import database_sync_to_async
from channels.exceptions import StopConsumer
from channels.generic.websocket import AsyncJsonWebsocketConsumer

AVAILABLE_ROOMS : list[Room] = []

class RoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        if (await Auth.login(self.scope, self.channel_name) == False): 
            return await self.close() 
        else: 
            await self.accept()
            await self.send_json({ 'Announcement': 'You are connected to RetroPong GameServer' })
        
    async def disconnect(self, close_code):
        await Auth.logout(self.channel_name)
        raise StopConsumer()
        
    async def receive(self, text_data):
        body = json.loads(text_data)
        
        
    async def send_msg(self, message):
        await self.send_json({
            message
        })
        
    async def game_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send_json({
            'message': message
        })
        
        
