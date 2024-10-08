import json
import asyncio
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.exceptions import StopConsumer

online_users = []

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
        print("WebSocket Disconnected, code:", close_code)
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        raise StopConsumer()
        
    async def receive(self, text_data):
        from .ViewAssist.ViewAssist import ViewAssist
        from .DbOps.DbOps import DbOps
        notification_data = json.loads(text_data)
        token, user_id = ViewAssist.verify_token(token_from_ws=notification_data.get('Authorization'))
        if (user_id == None or token == None):
            await self.send(text_data=json.dumps({"message": "Invalid Token"}))
            await self.close()
        else:
            try:
                current_notification_id = -1
                new_notification_id = -1
                await self.send(text_data=json.dumps({"message": "Token Verified"}))
                while True:
                    notifications = await sync_to_async(DbOps.get_notifications)(user_id=user_id, last_notification_id=current_notification_id)
                    notifications_ids = [value.get('id') for id, value in notifications.get('Notifications').items()]
                    new_notification_id = max(notifications_ids) if len(notifications_ids) > 0 else current_notification_id
                    if (new_notification_id > current_notification_id):
                        current_notification_id = new_notification_id
                        await self.send(text_data=json.dumps(notifications))
                    await asyncio.sleep(10)
            except Exception as e:
                print(e)
                await self.send(text_data=json.dumps({"message": "Fatal Error"}))
                await self.close()

class OnlineConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "online_users"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        await self.send(text_data=json.dumps({"message": "Online System Connected"}))

    async def disconnect(self, close_code):
        print("WebSocket Disconnected, code:", close_code)
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        for connection in online_users:
            if connection[1] == self.channel_name:
                await self.broadcast_to_online_users(connection[0], False)
                print("User Disconnected:", connection[0])
                online_users.remove(connection)
                break
        raise StopConsumer()
    
    async def receive(self, text_data):
        user_id = None
        message_data = json.loads(text_data)
        user_id = await sync_to_async(self.auth_user)(message_data, user_id)
        if (user_id == False and type(user_id) == bool):
            self.send(text_data=json.dumps({"message": "Invalid Token"}))
            self.close()

        if (await sync_to_async(self.check_if_already_connected)(user_id) == False):
            online_users.append((user_id, self.channel_name))
            print("User Connected:", user_id)
            await self.broadcast_to_online_users(user_id, True)
        else:
            viewed_user = message_data.get('viewed_user')
            self.send(text_data=json.dumps({"message": "User Already Connected"}))
            if (viewed_user is not None):
                await self.display_viewed_user(viewed_user)

    def check_if_already_connected(self, user_id):
        if user_id is None:
            print("User ID is None")
            return False
        for connection in online_users:
            if connection[0] == user_id:
                return True
        return False
    
    def auth_user(self, message_data, user_id):
        from .ViewAssist.ViewAssist import ViewAssist
        token, user_id = ViewAssist.verify_token(token_from_ws=message_data.get('Authorization'))
        if (user_id == None or token == None):
            return False
        return int(user_id)
    
    async def add_user_to_online(self, user_id):
        if (user_id == None):
            return False
        await online_users.append((user_id, self.channel_name))
        return True
        
    async def broadcast_to_online_users(self, user_id, status):
        await self.channel_layer.group_send("online_users",
        {
            "type": "online.status",
            "profile": {
                "viewed_user": user_id,
                "online": status
            }
        })
        return True
    
    async def online_status(self, event):
        message = event["profile"]
        await self.send(text_data=json.dumps(message))
    
    async def display_viewed_user(self, viewed_user):
        message = {
            "viewed_user": viewed_user,
            "online": True
        }
        for connection in online_users:
            if connection[0] == viewed_user:
                message["online"] = True
                await self.send(text_data=json.dumps(message))
                return
        message["online"] = False
        await self.send(text_data=json.dumps(message))       