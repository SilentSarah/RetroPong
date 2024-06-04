import json
import asyncio
from asgiref.sync import sync_to_async
from .ViewAssist.ViewAssist import *
from .DbOps.DbOps import *
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.group_name = "tournament"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        await self.send(text_data=json.dumps({"message": "Notification System Connected"}))
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        self.close()
        
    async def receive(self, text_data):
        notification_data = json.loads(text_data)
        token, user_id = ViewAssist.verify_token(token_from_ws=notification_data.get('Authorization'))
        if (user_id == None or token == None):
            await self.send(text_data=json.dumps({"message": "Invalid Token"}))
            await self.close()
        else:
            try:
                current_notification_id = None
                old_notification_id = None
                await self.send(text_data=json.dumps({"message": "Token Verified"}))
                while True:
                    notifications = await sync_to_async(DbOps.get_notifications)(user_id=user_id)
                    current_notification_id = max([notification for notification in notifications])
                    if (old_notification_id is None or old_notification_id < current_notification_id):
                        old_notification_id = current_notification_id
                        await self.send(text_data=json.dumps(notifications))
                    await asyncio.sleep(10)
            except Exception as e:
                print(e)
                await self.send(text_data=json.dumps({"message": "Fatal Error"}))
                await self.close()
        
    async def notification_message(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message}))
        