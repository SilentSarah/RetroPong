import sys
from datetime import datetime
# above is for dev purposes
import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from game.player import Player
from game.game import Game
from game.paddle import Paddle

class GameConsumer(AsyncJsonWebsocketConsumer):
	active_players = {} # {"channel_name": Player, ...}
	games = [] # list of game objects

	def check_player(self):
		if self.channel_name not in GameConsumer.active_players:
			GameConsumer.active_players[self.channel_name] = Player()
	
	def join_game(self): # returns game object
		for game in GameConsumer.games:
			if (game.joined_players() < 2):
				self.side = "right"
				game.add_player(self.channel_name) # will be using channel_names for now, until the auth is set
				game.add_paddle(Paddle(self.side))
				return game
		self.side = "left"
		GameConsumer.games.append(Game(self))
		return GameConsumer.games[-1]

	
	async def connect(self):
		# self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		# self.room_group_name = f"game_{self.room_name}"
		self.check_player()
		self.game = self.join_game()
		await self.channel_layer.group_add(self.game.name(), self.channel_name) # to be added to channel group, so I can broadcast
		# await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		# Will be dealt with later -> # await self.channel_layer.group_add(self.group_name, self.channel_name)
		await self.accept()
		# color = "\033[31;42m"
		# reset_color = "\033[0;0m"
		# print(f"{color}[{datetime.now()}] new socket got connected{reset_color}", file=sys.stderr)
		# await self.send_json(content={"type": "log", "log": "check alive"})
		
		if self.game.joined_players() < 2:
			# tell the currect player to wait
			log = f"[{self.game.name()}]: waiting for another player to join... [No# Players: {self.game.joined_players()}]"
			await self.send_json(content={"type": "log", "log": log})
		else:
			#tell them all to be ready
			await self.send_json(content={"type": "log", "log": "Be ready to start playing..."})
			self.game.start()
		# print(">>> I reach here", file=sys.stderr)
		# await self.send_json(content={"type": "position"})

		# self.connected_clients.append(self.channel_name)
		# await self.send_json(content={"type": "status", "connected": len(self.connected_clients)})
		# print("the total connected clients are: ")

	async def disconnect(self, close_code):
		# color = "\033[31;42m"
		# reset_color = "\033[0;0m"
		# print(f"{color}[{datetime.now()}] The socket got disconnected{reset_color}", file=sys.stderr)
		print("Pass")
		pass
		# await self.channel_layer.group_discard(
		# 	# self.room_group_name, self.channel_name
		# 	self.group_name, self.channel_name
		# )
		# self.connected_clients.remove(self.channel_name)

	async def receive_json(self, content):
		type = content["type"]
		# paddle = {}
		if (type == "update" and self.game.joined_players() == 2):
			# if (self.side == 'left'):
			p1 = self.game.paddles[0]
			p2 = self.game.paddles[1]
			# elif (self.side == 'right'):
			# 	p1 = self.game.paddles[1]
			# 	p2 = self.game.paddles[0]
		
			await self.send_json(content={
				"type": "update",
				"x": self.game.ball['x'],
				"y": self.game.ball['y'],
				"p1X": p1.x,
				"p1Y": p1.y,
				"p2X": p2.x,
				"p2Y": p2.y,
				"side": self.side
			})
		elif (type == "move"):
			self.game.move(self.side, content['direction'])
		elif (type == 'stop'):
			self.game.stop(self.side)
		# type = content["type"]
		# if (type == "join"):
		# 	self.join_game()
		# log = f"the type of the message received by server is: [{type}]"

		# await self.send_json(content={"type": "log", "log": log})
		# await self.channel_layer.group_send(
		# 	self.group_name, {
		# 		"type": "chat.receive_broadcast",
		# 		"message": msg,
		# 		"channel_name": self.channel_name
		# 		})


	# Receive message from room group
	# def recv_broadcast(self, event):
		# print(f"I have received in the function recv_broadcast: '{event["message"]}'", file=sys.stderr)
		# message = event["message"]
		# channel_name = event["channel_name"]
		# if (channel_name != self.channel_name):
		# 	# Send message to WebSocket
		# async_to_sync(self.send_json)(content={"type": "update", "ball": self.game.ball})