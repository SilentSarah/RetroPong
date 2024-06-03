#consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json



class UpdateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'updates'
        await self.channel_layer.group_add(
            'updates',
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        id = text_data_json['id']
        contact_id = text_data_json['contact_id']
        coversation_id = text_data_json['conversation_id']
        print('id', id, 'contact_id', contact_id, 'conversation_id', coversation_id)
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