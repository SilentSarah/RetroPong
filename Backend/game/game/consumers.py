import sys
from datetime import datetime
# above is for dev purposes
import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from game.player import Player
from game.game import Game
from game.paddle import Paddle
from game.tournament import Tournament
import threading
from game.models import MatchHistory
from asgiref.sync import sync_to_async

class GameConsumer(AsyncJsonWebsocketConsumer):
	user_matches = {}
	games = {}

	# check gpt later for this
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.game = False
		self.user_info = {}

	def join_game(self, mode, inviter_id):
		# will depend on game_mode to decide how to join the game
		game_id = GameConsumer.user_matches[str(self.user_info['id'])][mode]
		if (game_id):
			self.game = GameConsumer.games[game_id]
			if (mode == 5 and (str(self.user_info['id']) not in self.game.paddles)):
				self.game.add_paddle(str(self.user_info['id']))
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
				1: False, 2: False, 3: False, 4: False, 5: False
			}
			await self.send_json(content={"type": "log", "log": "The user wasn't found"})
		else:
			await self.send_json(content={"type": "log", "log": "The user was found"})
			# await self.send_json(content={"type": "log", "log": self.user_matches[str(self.user_info['id'])]})
	
	async def connect(self):
		await self.accept()
		await self.send_json(content={"type": "fetch_session_storage"})

	async def disconnect(self, close_code):
		print(f"\033[91m >> The channel just disconnected is: { self.channel_name } << \033[0m")
		# self.leave_game()
		# will probe this later vvvvvvv
		await self.channel_layer.group_discard(
			self.game.id(), self.channel_name
		)

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
			await self.send_json(content={"type": "log", "log": f"game_id after joining is: >{self.game.id()}<"})
			await self.standby_update()
			self.game.full() and not self.game.started and threading.Timer(3, self.game.start).start()
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

	# Receive message from room group
	async def game_recv_broadcast(self, event):
		# print(f"I have received in the function recv_broadcast: '{event["message"]}'", file=sys.stderr)
		if (not self.game.started
	  		and 'action' in event.keys() and event['action'] == 'standby_update'):
			print('I received smthg from the recv_broadcast>>>>>>>>>>')
			type = 'ready' if self.game.full() else 'standby'
			if (type == 'ready'): self.game.started = True
			# stopped below AttributeError: 'str' object has no attribute 'pName'
			# players = list(filter(lambda p: p.pName in self.game.players, GameConsumer.active_players.values()))
			# players = [p.getProps() for p in GameConsumer.active_players.values() if p.pName in self.game.players]
			players = list(self.game.paddles.keys())
			# ^^^^^^^ This will be changes later by sending id instead
			await self.send_json(content={"type": type, "players": players})
			await self.send_json(content={"type": 'log', "log": f'The ball\'s speed is: {self.game.ball["speed"]}'})
			await self.send_json(content={"type": 'log', "log": f'The paddles are: {self.game.paddles}'})



class TournamentConsumer(AsyncJsonWebsocketConsumer):
	# user_tournaments = { user_id: tournament_id or False }
	user_tournaments = {}
	# tournaments = { tournament_id: Tournament }
	tournaments = {}
	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.tournament = False
		self.user_info = {}

	def join_tournament(self):
		tournament_id = TournamentConsumer.user_tournaments[str(self.user_info['id'])]
		if (tournament_id):
			self.tournament = TournamentConsumer.tournaments[tournament_id]
			return 
		else:
			last_tournament = TournamentConsumer.tournaments and list(TournamentConsumer.tournaments.values())[-1]
			if (last_tournament and not last_tournament.over and not last_tournament.full()):
				self.tournament = last_tournament
				self.tournament.add_player(str(self.user_info['id']))
		if (not self.tournament):
			self.tournament = Tournament(str(self.user_info['id']))
		TournamentConsumer.tournaments[self.tournament.id()] = self.tournament
		TournamentConsumer.user_tournaments[str(self.user_info['id'])] = self.tournament.id()

	async def check_user(self):
		if (not (str(self.user_info['id']) in TournamentConsumer.user_tournaments)):
			TournamentConsumer.user_tournaments[str(self.user_info['id'])] = False
			await self.send_json(content={"type": "log", "log": "The user wasn't found"})
		else:
			await self.send_json(content={"type": "log", "log": "The user was found"})
			await self.send_json(content={"type": "log", "log": self.user_tournaments[str(self.user_info['id'])]})

	async def connect(self):
		await self.accept()
		await self.send_json(content={"type": "fetch_session_storage"})
		await self.send_json(content={"type": "log", 'log': f'the user matches are: {GameConsumer.user_matches}'})

	async def disconnect(self, close_code):
		print(f"\033[91m >> The channel just disconnected is: { self.channel_name } << \033[0m")
		# await self.channel_layer.group_discard(
		# 	self.game.id(), self.channel_name
		# )

	async def standby_update(self):
		await self.channel_layer.group_add(self.tournament.id(), self.channel_name)
		await self.channel_layer.group_send(
			self.tournament.id(), {
				"type": "tournament.recv.broadcast",
				"action": "standby_update"
				})

	async def receive_json(self, content):
		type = content["type"]
		if (type == 'test'):
			await self.send_json(content={"type": "log", "log": "the test type was received"})
		elif (type == 'session_storage'):
			self.user_info = content
			await self.send_json(content={"type": "log", "log": f"The user_info is: >{self.user_info}<"})
			# will check if the user is already in the user_matches dict otherwise it'll add it.
			await self.check_user()
			# to confirm the receipt of sessionStorage
			await self.send_json(content={"type": "session_storage_ack"})
		elif (type == 'join'):
			print('received the join type')
			self.join_tournament()
			await self.send_json(content={"type": "log", "log": f"The tournament_id after joining is: >{self.tournament.id()}<"})
			await self.standby_update()
			# self.tournament.full() and threading.Timer(3, self.game.start).start()
		else:
			# print(f"The type received was: {type}")
			pass
	
	# Receive message from tournament group
	async def tournament_recv_broadcast(self, event):
		if ('action' in event.keys() and event['action'] == 'standby_update'):
			print('I received smthg from the Tournament\'s recv_broadcast>>>>>>>>>>')
			type = 'ready' if self.tournament.check_start() else 'standby'
			await self.send_json(content={"type": type, "players": self.tournament.players})
			await self.send_json(content={"type": 'log', 'log': f'the tournoi id: {self.tournament.id()}'})