import json
from channels.db import database_sync_to_async
from channels.exceptions import StopConsumer
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class RoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        from .Login import Auth
        from .Game import GameService
        is_logged_in, user_id = await Auth.login(self.scope, self.channel_name, self)
        if (is_logged_in == False): 
            return await self.close() 
        else:
            await self.accept()
            await self.send_json({ 'Announcement': 'You are connected to RetroPong GameServer' })
            await GameService.restore_game(user_id)
        
    async def disconnect(self, close_code):
        from .Login import Auth
        await Auth.logout(self.channel_name)
        raise StopConsumer()
        
    async def receive(self, text_data):
        from .Interpreter import Interpreter
        # try:
        body = json.loads(text_data)
        await Interpreter.interpret(self, body)
        # except Exception as e:
        #     print("Error: ", e)
        #     await self.send_json({ 'Error': 'Invalid request' })
        
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
        from .Login import LOGGED_USERS
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
