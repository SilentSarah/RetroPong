#consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import *   
from channels.db import database_sync_to_async


class UpdateConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def save_status(self, id, status):
        user = User.objects.get(id=id)
        user.isOnline = status
        user.save()

    async def connect(self):
        self.room_group_name = 'updates'

        self.id = self.scope['url_route']['kwargs']['id']

        await self.channel_layer.group_add(
            'updates',
            self.channel_name
        )
        await self.save_status(self.id, True)

        await self.accept()

        await self.channel_layer.group_send(self.room_group_name,{
            'type': 'handle_empty_message',
            'message': 'statusOnlinePing',
            'status': True,
            'id': self.id
            })

    async def disconnect(self, close_code):
        await self.save_status(self.id, False)
        await self.channel_layer.group_send(self.room_group_name,{
            'type': 'handle_empty_message',
            'message': 'statusOnlinePing',
            'status': False,
            'id': self.id
            })

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        self.close()

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        message = text_data_json['message']
        id = text_data_json['id']
        if message == 'statusOnlinePing':
            status = text_data_json['status']
            await self.send(text_data=json.dumps({
                'message': 'pong',
                'status': status,
                'id': id
            }))
            return

        contact_id = text_data_json['contact_id']
        coversation_id = text_data_json['conversation_id']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'id': id,
                'contact_id': contact_id,
                'conversation_id': coversation_id
            }
        )

    async def handle_empty_message(self, event):
        message = event['message']
        status = event['status']
        id = event['id']
        await self.send(text_data=json.dumps({
            'message': message,
            'status': status,
            'id': id
        }))

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        id = event['id']
        contact_id = event['contact_id']
        coversation_id = event['conversation_id']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'id': id,
            'contact_id': contact_id,
            'conversation_id': coversation_id
        }))


class StatusOnline(AsyncWebsocketConsumer):

   

    async def connect(self):
        self.room_group_name = 'status'

        self.id = self.scope['url_route']['kwargs']['id']

        await self.channel_layer.group_add(
            'status',
            self.channel_name
        )

        await self.save_status(self.id, True)

        await self.accept()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'status_message',
                'id': self.id,
                'status': True
            }
        )


    async def disconnect(self, close_code):
        await self.save_status(self.id, False)
        print("this id is diconnected: ", self.id)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'status_message',
                'id': self.id,
                'status': False
            }
        )

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        self.close()

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        status = text_data_json['status']
        # id = text_data_json['id']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'status_message',
                'id': self.id,
                'status': status
            }
        )

    # Receive message from room group
    async def status_message(self, event):
        status = event['status']
        id = event['id']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'id': id,
            'status': status
        }))