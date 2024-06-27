import sys
import math
import threading
# from game.set_interval import set_interval
# from asgiref.sync import async_to_sync
# from game.paddle import Paddle
from datetime import datetime
from game.game import Game
# from game.models import MatchHistory
import game.consumers as consumers
from .dbg_tools import print_blue, print_yellow

class Tournament:
	serial_number = 0

	def __init__(self, creator_id):
		self.over = False
		self.players = []
		self.finished_games = 0
		self.details = {
			'creator': creator_id,
			'id': f"tournament_{Tournament.serial_number}"
		}
		Tournament.serial_number += 1
		self.started = False
		self.round = 0
		self.round_size = (2, 4, 2)
		# games_status = {'playing': 'off', 'winners': []}
		self.games_status = {}
		self.add_player(creator_id)

	def id(self):
		return (self.details['id'])

	def init_game_status(self, game_id):
		self.games_status[game_id] = {'playing': 'off', 'winners': []}

	def update_games_status(self):
		for game_id, game_status in self.games_status.items():
			game = consumers.GameConsumer.games[game_id]
			game_status['playing'] = game.started and not game.over
			game_status['winners'] = game.winners if game.winners else []

	def check_round_start(self):
		if (self.full()):
			for i in range(0, len(self.players), 2):
				print_yellow(f"inited the Games")
				new_game = Game(self.details['id'], 5) # 5: tournament mode
				self.init_game_status(new_game.id())
				# self.games_status[new_game.id()] = {'status': 'off', 'winners': []};
				consumers.GameConsumer.games[new_game.id()] = new_game
				consumers.GameConsumer.user_matches[str(self.players[i])][5] = new_game.id()
				consumers.GameConsumer.user_matches[str(self.players[i + 1])][5] = new_game.id()
				self.started = True
				# print(f'>>>Tournament, consumers.GameConsumer.user_matches: {consumers.GameConsumer.user_matches}', file=sys.stderr)
			return True

	def add_player(self, player_id):
		self.players.append(player_id)

	def get_status(self, user_id):
		# The problem arises because the games are created only when everyone enters
		print_blue(f"I entered get_status")
		last_game_id = consumers.GameConsumer.user_matches[user_id][5]
		print_blue(f"user_id: {user_id}, last_game_id: {last_game_id}")
		status_dict = {
			'current_game': last_game_id if last_game_id and (not consumers.GameConsumer.games[last_game_id].over) else False,
			'games_status': self.games_status
		}
		return status_dict
	
	def full(self):
		print_yellow(f"len(self.players) == self.round_size[self.round] is: {len(self.players) == self.round_size[self.round]}")
		return len(self.players) == self.round_size[self.round]
	

	"""

	If a new socket connects, it will be redirected to the appropriate Tournament.
	The user will get back a dictionary of all games sorted by rounds highlighting the current game.

	-------


	if all the games of the current round are finished,
	You ll collect winners and put them in a new round, # while the lost players can still watch the tournamnet
	After the end of each game you will calculate the XP.
	...
	On the last round, you will finish the tournament, and set the winner.
	might add more xp for the winner of the tournament.
	"""