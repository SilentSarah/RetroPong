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
from .dbg_tools import print_blue, print_yellow, print_red, print_magenta, print_cyan

class Tournament:
	serial_number = 0

	def __init__(self, creator_id):
		self.over = False
		# self.players = []
		self.finished_games = 0
		self.details = {
			'creator': creator_id,
			'id': f"tournament_{Tournament.serial_number}"
		}
		Tournament.serial_number += 1
		self.started = False
		self.round = 0
		self.round_size = (4, 2, 2)
		# games_status = {'playing': 'off', 'winners': []}
		# self.games = [] # ids of games
		self.rounds = [{}, {}, {}]
		self.add_player(creator_id)

	def id(self):
		return (self.details['id'])

	# def init_game_status(self, player_id, game_id):
	# 	print_magenta(f"I inited the game status")
	# 	self.rounds[self.round][player_id]['game_id'] = game_id
		# self.rounds[self.round][player_id]['status'] = 0

	# def clean_players(self, game_status):
	# 	# get the players from the game_status
	# 	for player_id in game_status['players']:
	# 		consumers.GameConsumer.user_matches[str(player_id)][5] = None

	# Here
	def update_players_status(self): # will be changed to round status
		print_magenta(f"I enter update_players_status")
		# {player: {..., status: 0, True | False}}
		for round in self.rounds:
			for player_id, player in round.items():
				if (not player['game_id']): continue
				game = consumers.GameConsumer.games[player['game_id']]
				player['status'] = player_id in game.winners if game.over else 0
		# for game_id, game_status in self.games_status.items():
		# 	print_magenta(f"I got inside the for loop")
		# 	game = consumers.GameConsumer.games[game_id]
		# 	game_status['playing'] = game.started and not game.over
		# 	game_status['winners'] = game.winners if game.winners else []
		# 	if game.over: self.clean_players(game_status)

	def check_round_start(self):
		print_cyan(f"self.full() of tournament.py is: {self.full()}")
		if (self.full()):
			print_red(f"I got inside the if of self.full")
			# should now change self.players to self.rounds[round] // it will loop through the keys of the round which are players ids
			players_ids = list(self.rounds[self.round])
			for i in range(0, len(players_ids), 2):
				print_red(f"I got inside the for of self.full")
				print_yellow(f"inited the Games")
				new_game = Game(self.details['id'], 5) # 5: tournament mode
				self.rounds[self.round][str(players_ids[i])]['game_id'] = new_game.id()
				self.rounds[self.round][str(players_ids[i + 1])]['game_id'] = new_game.id()
				consumers.GameConsumer.games[new_game.id()] = new_game
				consumers.GameConsumer.user_matches[str(players_ids[i])][5] = new_game.id()
				consumers.GameConsumer.user_matches[str(players_ids[i + 1])][5] = new_game.id()
				self.started = True
				# print(f'>>>Tournament, consumers.GameConsumer.user_matches: {consumers.GameConsumer.user_matches}', file=sys.stderr)
			self.round += 1 # go to next round
			return True

	def add_player(self, player_id):
		last_game_id = consumers.GameConsumer.user_matches[str(player_id)][5]
		last_game = consumers.GameConsumer.games[last_game_id] if last_game_id else False
		if (last_game and last_game.over and player_id not in last_game.winners):
			return
		if player_id not in self.rounds[self.round]:
			self.rounds[self.round][player_id] = {'game_id': None, 'status': 0}

	def get_status(self, user_id):
		# The problem arises because the games are created only when everyone enters
		print_blue(f"I entered get_status")
		last_game_id = consumers.GameConsumer.user_matches[user_id][5]
		print_blue(f"user_id: {user_id}, last_game_id: {last_game_id}")
		status_dict = {
			'current_game': last_game_id if last_game_id and (not consumers.GameConsumer.games[last_game_id].over) else False,
			'rounds': self.rounds,
		}
		return status_dict
	
	def full(self):
		if (len(self.rounds[self.round]) == self.round_size[self.round]):
			print_yellow("Full: I return True")
			return True
		print(f"self.rounds[self.round])>{len(self.rounds[self.round])}< == self.round_size[self.round]>{self.round_size[self.round]}<")
		print_yellow("Full: I return False")
		return False
	

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