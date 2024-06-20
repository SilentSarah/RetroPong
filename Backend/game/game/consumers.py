import sys
from datetime import datetime
# above is for dev purposes
import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from game.player import Player
from game.game import Game
from game.paddle import Paddle
import threading
from game.models import MatchHistory
from asgiref.sync import sync_to_async


class TournamentConsumer(AsyncJsonWebsocketConsumer):
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		print('A tournament consumer Instant was created!!!')

	async def connect(self):
		await self.accept()
		# await self.send_json(content={"type": "fetch_session_storage"})

	async def disconnect(self, close_code):
		print(f"\033[91m >> The channel just disconnected is: { self.channel_name } << \033[0m")
		# await self.channel_layer.group_discard(
		# 	self.game.id(), self.channel_name
		# )

	async def receive_json(self, content):
		type = content["type"]
		# paddle = {}
		if (type == 'test'):
			await self.send_json(content={"type": "log", "log": "the test type was received"})
		else:
			# print(f"The type received was: {type}")
			pass



class GameConsumer(AsyncJsonWebsocketConsumer):
	# active_players = {} # {"channel_name": Player, ...}
	# solos = [] # list of solo game objects
	# duos = [] # list of duo game objects
	user_matches = {}
	games = {}


	# check gpt later for this
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.game = False
		self.user_info = {}

	# def check_player(self):
	# 	if self.channel_name not in GameConsumer.active_players:
	# 		# name, pic and related stuff will be fetched from the DB
	# 		GameConsumer.active_players[self.channel_name] = Player('static/img/pfp/L7afouzli9.jpg', 'pfp', self.channel_name, 21)
	
	def join_game(self, mode, inviter_id):
		# will depend on game_mode to decide how to join the game
		game_id = GameConsumer.user_matches[str(self.user_info['id'])][mode]
		if (game_id):
			self.game = GameConsumer.games[game_id]
			return 
		elif (mode == 3 and inviter_id):#privat mode invite
			game_id = GameConsumer.user_matches[str(inviter_id)][mode]
			self.game = GameConsumer.games[game_id]
		else:
			if (mode <= 2): # random
				mode_games = {k:v for (k,v) in GameConsumer.games.items() if v.mode == mode}
				last_game = mode_games and list(mode_games.values())[-1]
				if (last_game and not last_game.over and not last_game.full()):
					self.game = last_game
		if (not self.game): self.game = Game(str(self.user_info['id']), mode)
		GameConsumer.games[self.game.id()] = self.game
		GameConsumer.user_matches[str(self.user_info['id'])][mode] = self.game.id()
		self.game.add_paddle(str(self.user_info['id']))
		# in local mode
		if (mode == 4): self.game.add_paddle(str(self.user_info['id']) + '_dup')

	def leave_game(self): # returns game object
		# remove from active players
		self.game.finish()
		GameConsumer.user_matches[str(self.user_info['id'])][self.game.mode] = False
		pass# self.game.finish()

	# temp async - to remove later
	async def check_user(self):
		if (not (str(self.user_info['id']) in GameConsumer.user_matches)):
			GameConsumer.user_matches[str(self.user_info['id'])] = {
				1: False, 2: False, 3: False, 4: False,
			}
			await self.send_json(content={"type": "log", "log": "The user wasn't found"})
		else:
			await self.send_json(content={"type": "log", "log": "The user was found"})
			await self.send_json(content={"type": "log", "log": self.user_matches[str(self.user_info['id'])]})
	async def connect(self):
		# self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		# self.room_group_name = f"game_{self.room_name}"

		# self.check_player()

		# self.game = self.join_game() <--

		# I ll see to randomize the name of the game later
		# await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		# Will be dealt with later -> # await self.channel_layer.group_add(self.group_name, self.channel_name)
		await self.accept()
		await self.send_json(content={"type": "fetch_session_storage"})
		# color = "\033[31;42m"
		# reset_color = "\033[0;0m"
		# print(f"{color}[{datetime.now()}] new socket got connected{reset_color}", file=sys.stderr)
		# await self.send_json(content={"type": "log", "log": "check alive"})

		# OLD START

		# if self.game.players_count() < 2:
		# 	# tell the currect player to wait
		# 	log = f"[{self.game.id()}]: waiting for another player to join... [No# Players: {self.game.players_count()}]"
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
		# self.leave_game()
		# will probe this later vvvvvvv
		await self.channel_layer.group_discard(
			self.game.id(), self.channel_name
		)

		# color = "\033[31;42m"
		# reset_color = "\033[0;0m"
		# print(f"{color}[{datetime.now()}] The socket got disconnected{reset_color}", file=sys.stderr)
		# await self.channel_layer.group_send(
		# 	self.game.id(), {
		# 		"type": "game.recv.broadcast",
		# 		"message": "The Game is over!"
		# 		})
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

	async def standby_update(self):
		await self.channel_layer.group_add(self.game.id(), self.channel_name)
		await self.channel_layer.group_send(
			self.game.id(), {
				"type": "game.recv.broadcast",
				"action": "standby_update"
				})

	async def receive_json(self, content):
		type = content["type"]
		# paddle = {}
		if (type == 'session_storage'):
			self.user_info = content
			await self.send_json(content={"type": "log", "log": f"The user_info is: >{self.user_info}<"})
			# will check if the user is already in the user_matches dict otherwise it'll add it.
			await self.check_user()
			# to confirm the receipt of sessionStorage
			await self.send_json(content={"type": "session_storage_ack"})
		elif (type == 'start'):
			# await self.send_json(content={"type": "log", "log": 'I reach here'})
			# await self.game.start(content['mode'])
			
			self.join_game(content['mode'], content['inviter_id'])
			await self.standby_update()
			
			# print(f'sent to the group {self.game.id()}', file=sys.stderr)
			# print(f'>>>>self.game: {self.game}', file=sys.stderr)
			# to be added to channel group, so I can broadcast
			# print(f'>>>>self.game.id(): {self.game.id()}', file=sys.stderr)
			# await self.send_json(content={"type": "ready", "players": [GameConsumer.active_players[self.channel_name].getProps()]})
				
			# else:
			# 	await self.send_json(content={"type": "standby", "players": [GameConsumer.active_players[self.channel_name].getProps()]})

			self.game.full() and threading.Timer(3, self.game.start).start()
		elif (type == 'leave'):
			self.leave_game()
		elif (type == 'spec'):
			strs = ['explosion', 'defence', 'speed']
			print(f"I received a spec of type: {strs[content['mode']]}")
			self.game.check_spec(str(self.user_info['id']), content['mode'])
		elif (type == "update" and self.game and self.game.full()): # to adapt this condition later
			# p1 = self.game.paddles[0]
			# p2 = self.game.paddles[1]

			await self.send_json(content={
				"type": "update",
				"x": self.game.ball['x'],
				"y": self.game.ball['y'],
				"r": self.game.ball['r'],
				"paddles": [paddle.getProps() for paddle in self.game.paddles.values()],
				"score": self.game.score,
				"hit_fx_span": self.game.ball['hit_fx_span'],
				'fireball': self.game.ball['curr_speed'] > self.game.ball['speed'],
				'barriers': self.game.barriers,
			})
		elif (self.game and type == "move"):
			if (self.game.mode == 4 and content['key'] in 'ik'):
				self.game.move_paddle(str(self.user_info['id']) + '_dup', content['key'])
			else:
				self.game.move_paddle(str(self.user_info['id']), content['key'])
		elif (self.game and type == 'stop'):
			if (self.game.mode == 4 and content['key'] in 'ik'):
				self.game.stop_paddle(str(self.user_info['id']) + '_dup')
			else:
				self.game.stop_paddle(str(self.user_info['id']))
		else:
			# print(f"The type received was: {type}")
			pass

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
			type = 'ready' if self.game.full() else 'standby'
			# stopped below AttributeError: 'str' object has no attribute 'pName'
			# players = list(filter(lambda p: p.pName in self.game.players, GameConsumer.active_players.values()))
			# players = [p.getProps() for p in GameConsumer.active_players.values() if p.pName in self.game.players]
			players = list(self.game.paddles.keys())
			# ^^^^^^^ This will be changes later by sending id instead
			await self.send_json(content={"type": type, "players": players})
			# await self.send_json(content={"type": 'log', 'log': 'From game_recv_broadcast'})