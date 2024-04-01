import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer


class GameConsumer(AsyncJsonWebsocketConsumer):
	async def connect(self):
		self.group_name = "default"
		# self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		# self.room_group_name = f"game_{self.room_name}"
		# await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		await self.channel_layer.group_add(self.group_name, self.channel_name)
		await self.accept()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
			# self.room_group_name, self.channel_name
			self.group_name, self.channel_name
		)

	async def receive_json(self, content):
		msg = content["posY"]
		await self.channel_layer.group_send(
			self.group_name, {
				"type": "chat.receive_broadcast",
				"message": msg,
				"channel_name": self.channel_name
				})

	# Receive message from room group
	async def chat_receive_broadcast(self, event):
		message = event["message"]
		channel_name = event["channel_name"]
		if (channel_name != self.channel_name):
			# Send message to WebSocket
			await self.send_json(content={"posY": message})