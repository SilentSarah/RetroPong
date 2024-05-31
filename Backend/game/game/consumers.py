import sys
from datetime import datetime
# above is for dev purposes
import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from game.player import Player
from game.game import Game
from game.paddle import Paddle
import threading

class GameConsumer(AsyncJsonWebsocketConsumer):
	active_players = {} # {"channel_name": Player, ...}
	solos = [] # list of solo game objects
	duos = [] # list of duo game objects
	tournaments = [] # list of tournament game objects

	# check gpt later for this
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.game = False


	def check_player(self):
		if self.channel_name not in GameConsumer.active_players:
			# name, pic and related stuff will be fetched from the DB
			GameConsumer.active_players[self.channel_name] = Player('static/img/pfp/L7afouzli9.jpg', 'pfp', self.channel_name, 21)
	
	async def join_solo(self): # returns game object
		for game in GameConsumer.solos:
			if (not game.ready):
				game.add_player(self.channel_name) # will be using channel_names for now, until the auth is set
				game.add_paddle(self.channel_name) # this will add a paddle in the game and return the id/no
				game.ready = game.players_count() == 2
				return game
		new_game = Game(self, 1)
		GameConsumer.solos.append(new_game)
		return GameConsumer.solos[-1]

	async def join_duo(self): # returns game object
		for game in GameConsumer.duos:
			if (not game.ready):
				game.add_player(self.channel_name) # will be using channel_names for now, until the auth is set
				game.add_paddle(self.channel_name) # this will add a paddle in the game and return the id/no
				game.ready = game.players_count() == 4
				print(f'game.ready: {game.ready}, game.players_count(): {game.players_count()}')
				return game
		print('I got inside duo')
		new_game = Game(self, 2)
		GameConsumer.duos.append(new_game)
		return GameConsumer.duos[-1]
	
	def join_tournament(self):
		print(f"\033[91m >> join tournament << \033[0m", file=sys.stderr)
		pass

	def leave_game(self): # returns game object
		# remove from active players
		for player in self.game.players:
			if player in GameConsumer.active_players:
				del GameConsumer.active_players[player]
		# set the game as finished
		self.game.finish()

	async def connect(self):
		# self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		# self.room_group_name = f"game_{self.room_name}"

		# Test Start
		user = self.scope["user"]
		print(f"The user is: {user}")
		# Test End


		self.check_player()

		# self.game = self.join_game() <--

		# I ll see to randomize the name of the game later
		# await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		# Will be dealt with later -> # await self.channel_layer.group_add(self.group_name, self.channel_name)
		await self.accept()
		# color = "\033[31;42m"
		# reset_color = "\033[0;0m"
		# print(f"{color}[{datetime.now()}] new socket got connected{reset_color}", file=sys.stderr)
		# await self.send_json(content={"type": "log", "log": "check alive"})
		

		# OLD START

		# if self.game.players_count() < 2:
		# 	# tell the currect player to wait
		# 	log = f"[{self.game.name()}]: waiting for another player to join... [No# Players: {self.game.players_count()}]"
		# 	await self.send_json(content={"type": "log", "log": log})
		# else:
		# 	#tell them all to be ready
		# 	await self.send_json(content={"type": "log", "log": "Be ready to start playing..."})
		# 	self.game.start()

		# OLD END


		# print(">>> I reach here", file=sys.stderr)
		# await self.send_json(content={"type": "position"})

		# self.connected_clients.append(self.channel_name)
		# await self.send_json(content={"type": "status", "connected": len(self.connected_clients)})
		# print("the total connected clients are: ")

	async def disconnect(self, close_code):
		print(f"\033[91m >> The channel just disconnected is: { self.channel_name } << \033[0m")
		self.leave_game()
		await self.channel_layer.group_discard(
			self.game.name(), self.channel_name
		)
		# color = "\033[31;42m"
		# reset_color = "\033[0;0m"
		# print(f"{color}[{datetime.now()}] The socket got disconnected{reset_color}", file=sys.stderr)
		print("Pass")
		await self.channel_layer.group_send(
			self.game.name(), {
				"type": "game.recv.broadcast",
				"message": "The Game is over!"
				})
		print(f'sent to the group 2 {self.game.name()}', file=sys.stderr)
		pass
		# await self.channel_layer.group_discard(
		# 	# self.room_group_name, self.channel_name
		# 	self.group_name, self.channel_name
		# )
		# self.connected_clients.remove(self.channel_name)

	async def game_receive_broadcast(self, event_obj):
		# print("I got inside the receive broadcast", sys.stderr)
		msg = event_obj['message']
		await self.send_json(content={
				"type": "log",
				"log": msg
			})


	async def receive_json(self, content):
		type = content["type"]
		# paddle = {}
		if (type == 'start'):
			# await self.send_json(content={"type": "log", "log": 'I reach here'})
			# await self.game.start(content['mode'])
			if (content['mode'] == 'tournament'):
				self.join_tournament()
			else:
				if (content['mode'] == 1):
					self.game = await self.join_solo()
				elif (content['mode'] == 2):
					self.game = await self.join_duo()
				
				await self.channel_layer.group_add(self.game.name(), self.channel_name)
				await self.channel_layer.group_send(
					self.game.name(), {
						"type": "game.recv.broadcast",
						"action": "standby_update"
						})
				# print(f'sent to the group {self.game.name()}', file=sys.stderr)
				# print(f'>>>>self.game: {self.game}', file=sys.stderr)
				# to be added to channel group, so I can broadcast
				# print(f'>>>>self.game.name(): {self.game.name()}', file=sys.stderr)
				# await self.send_json(content={"type": "ready", "players": [GameConsumer.active_players[self.channel_name].getProps()]})
					
				# else:
				# 	await self.send_json(content={"type": "standby", "players": [GameConsumer.active_players[self.channel_name].getProps()]})

				self.game.ready and	threading.Timer(3, self.game.start).start()

		elif (type == "update" and self.game and self.game.ready): # to adapt this condition later
			# p1 = self.game.paddles[0]
			# p2 = self.game.paddles[1]

			await self.send_json(content={
				"type": "update",
				"x": self.game.ball['x'],
				"y": self.game.ball['y'],
				"r": self.game.ball['r'],
				"paddles": [paddle.getProps() for paddle in self.game.paddles.values()],
				"score": self.game.score
			})
		# stopped here
		elif (self.game and type == "move"):
			self.game.move_paddle(self.channel_name, content['direction'])
		elif (self.game and type == 'stop'):
			self.game.stop_paddle(self.channel_name)
			

			# await self.send_json(content={"type": "log", "log": log})
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
	async def game_recv_broadcast(self, event):
		# print(f"I have received in the function recv_broadcast: '{event["message"]}'", file=sys.stderr)
		print('I received smthg from the recv_broadcast>>>>>>>>>>', file=sys.stderr)
		if ('action' in event.keys() and event['action'] == 'standby_update'):
			print('I received smthg from the recv_broadcast>>>>>>>>>>')
			type = 'ready' if self.game.ready else 'standby'
			# stopped below AttributeError: 'str' object has no attribute 'pName'
			# players = list(filter(lambda p: p.pName in self.game.players, GameConsumer.active_players.values()))
			players = [p.getProps() for p in GameConsumer.active_players.values() if p.pName in self.game.players]
			await self.send_json(content={"type": type, "players": players})
