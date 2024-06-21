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

	def id(self):
		return (self.details['id'])

	def check_start(self):
		if (self.full()):
			for i in range(0, len(self.players), 2):
				new_game = Game(self.players[i], 5) # 5: tournament mode
				new_game.add_paddle(self.players[i + 1])
				consumers.GameConsumer.games[new_game.id()] = new_game
				consumers.GameConsumer.user_matches[str(self.players[i])][5] = new_game.id()
				consumers.GameConsumer.user_matches[str(self.players[i + 1])][5] = new_game.id()
			return True
		return False

	def add_player(self, player_id):
		self.players.append(player_id)
	
	def full(self):
		return len(self.players) == 2