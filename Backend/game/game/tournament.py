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

class Tournament:
	serial_number = 0

	def __init__(self, creator_id):
		self.over = False
		self.players = [creator_id]
		self.details = {
			'creator': creator_id,
			'id': f"tournament_{Tournament.serial_number}"
		}
		Tournament.serial_number += 1
		self.started = False

	def id(self):
		return (self.details['id'])

	def check_user(self, user_id):
		if (not (str(user_id) in consumers.GameConsumer.user_matches)):
			consumers.GameConsumer.user_matches[str(user_id)] = {
				1: False, 2: False, 3: False, 4: False, 5: False
			}

	def check_start(self):
		if (self.started):
			return True
		if (self.full()):
			for i in range(0, len(self.players), 2):
				self.check_user(self.players[i])
				self.check_user(self.players[i + 1])
				new_game = Game(self.details['id'], 5) # 5: tournament mode
				consumers.GameConsumer.games[new_game.id()] = new_game
				consumers.GameConsumer.user_matches[str(self.players[i])][5] = new_game.id()
				consumers.GameConsumer.user_matches[str(self.players[i + 1])][5] = new_game.id()
				self.started = True
				# print(f'>>>Tournament, consumers.GameConsumer.user_matches: {consumers.GameConsumer.user_matches}', file=sys.stderr)
			return True
		return False

	def add_player(self, player_id):
		self.players.append(player_id)
	
	def full(self):
		return len(self.players) == 2