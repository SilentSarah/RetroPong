import json
from .Login import Auth
from .Game import GameService
from .Interpreter import Interpreter
from channels.db import database_sync_to_async
from channels.exceptions import StopConsumer
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .Login import LOGGED_USERS

class RoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        is_logged_in, user_id = await Auth.login(self.scope, self.channel_name, self)
        if (is_logged_in == False): 
            return await self.close() 
        else:
            await self.accept()
            await self.send_json({ 'Announcement': 'You are connected to RetroPong GameServer' })
            await GameService.restore_game(user_id)
        
    async def disconnect(self, close_code):
        await Auth.logout(self.channel_name)
        raise StopConsumer()
        
    async def receive(self, text_data):
        try:
            body = json.loads(text_data)
            await Interpreter.interpret(self, body)
        except Exception as e:
            print("Error: ", e)
            await self.send_json({ 'Error': 'Invalid request' })
        
    async def send_msg(self, message):
        await self.send_json({
            message
        })
        
    async def send_message_status(self, type, status, message):
        await self.send_json({
            'type': type,
            'status': status,
            'message': message
        })
        
    async def broadcast(self, message):
        try:
            for user in LOGGED_USERS:
                await user.send_message_to_self(message)
        except Exception as e:
            print(e)
        
    async def game_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send_json({
            'message': message
        })
        
class TournamentConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        is_logged_in, user_id = await Auth.login(self.scope, self.channel_name, self)
        if (is_logged_in == False): 
            return await self.close() 
        else: 
            await self.accept()
            await self.send_json({ 'Announcement': 'You are connected to RetroPong Tournament System' })
            await GameService.restore_game(user_id)
        pass
    
    async def disconnect(self, close_code):
        pass
    
    async def receive(self, text_data):
        try:
            body = json.loads(text_data)
            await Interpreter.interpret(self, body, True)
        except Exception as e:
            print("Error: ", e)
            await self.send_json({ 'Error': 'Invalid request' })
        pass
    
    async def send_msg(self, message):
        pass