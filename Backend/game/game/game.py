import sys
import math
import threading
from game.set_interval import set_interval
# from asgiref.sync import async_to_sync
from game.paddle import Paddle
from datetime import datetime
from game.models import MatchHistory

class Game:
	serial_number = 0
	opponent_fieldnames = ['fOpponent', 'sOpponent', 'tOpponent', 'lOpponent']
	match_type_fieldnames = ['solo', 'duo']
	def __init__(self, creator_id, mode):
		self.mode = mode
		self.started = False
		self.over = False
		# self.consumer = consumer
		self.paddles = {}
		if (mode != 5):
			self.paddles = {creator_id: Paddle()}
		self.details = {
			'creator': creator_id,
			'id': f"room_{Game.serial_number}"
		}
		Game.serial_number += 1
		self.ball = {'r': 1 / 150}
		self.reset_ball()
		self.score = [0, 0]
		self.barriers = [False, False] # Maybe will switch them later to nums

	def add_paddle(self, id):
		self.paddles[id] = Paddle()
		if (len(self.paddles) % 2 == 0):
			self.paddles[id].switch_side()
	
	def full(self):
		if (self.mode == 2): #random duo
			return self.players_count() >= 4
		# print(f"full is: {self.players_count() >= 2}")
		return self.players_count() >= 2

	# def broadcast(self):
		# async_to_sync(self.consumer.channel_layer.group_send)(
		# 	self.name(), {
		# 		"type": "recv.broadcast",# will look into this later
		# 		})
		# async_to_sync(self.consumer.send_json)(content={"type": "update", "x": self.ball['x'], "y": self.ball['y']})
		# async_to_sync(self.consumer.send_json)(content={"type": "log", "log": "Broadcasting..."},)

	def move_paddles(self):
		for paddle in self.paddles.values():
			paddle.move()
	# move & stop will be optimized later when the auth will be set
	# old: move
	def move_paddle(self, id, pressed_key):
			self.paddles[id].pressed_key =  pressed_key

	# old: stop
	def stop_paddle(self, id):
		self.paddles[id].pressed_key =  ''

	# def init_match_history(self):
	# 	self.match_history = MatchHistory.objects.create()
	# 	self.match_history.mode = self.mode
		

	def start(self):
		# testing
		print("THE GAME HAS STARTED>>>>>>>>>>>")
		self.start_datetime = datetime.now()
		# self.init_match_history()
		# 1/60 for 60 fps
		if (not self.over):
			self.game_loop_interval = set_interval(1/60, self.update)

		# will stop interval in 5s
		# t = threading.Timer(5, interval.cancel)
		# t.start()
		
		# print("The start function was called however!", file=sys.stderr)
	
	def get_winners(self):
		oddness = self.score[0] < self.score[1]
		return [user_id for i, user_id in enumerate(self.paddles) if i % 2 == oddness ]

	def update_MatchHistory(self):
		new_MatchHistory = MatchHistory()
		setattr(new_MatchHistory, 'matchtype', Game.match_type_fieldnames[self.mode - 1])
		for i, user_id in enumerate(self.paddles):
			setattr(new_MatchHistory, Game.opponent_fieldnames[i], user_id)
		setattr(new_MatchHistory, 'mStartDate', self.start_datetime)
		setattr(new_MatchHistory, 'Score', self.score)
		setattr(new_MatchHistory, 'Winners', self.get_winners())
		new_MatchHistory.save()

	def finish(self):
		if (not self.over):
			self.reset_ball()
			self.game_loop_interval.cancel()
			self.over = True
			# self.update_MatchHistory()

	def id(self):
		return (self.details['id'])

	def players_count(self):
		return (len(self.paddles))

	# async def broadcast():

	def check_score(self):
		if( self.ball['x'] + self.ball['r'] > 1 ):
			self.score[0] += 1
		elif( self.ball['x'] - self.ball['r'] < 0 ):
			self.score[1] += 1
		else: return
		self.reset_ball()
		if (self.score[0] == 7 or self.score[1] == 7):
			# self.finish()
			pass

	def check_fx(self):
		# Check hit sound
		if (self.check_wall_collision() or self.check_paddle_collision()):
			self.ball['hit_fx_span'] = 5
		elif (self.ball['hit_fx_span']):
			self.ball['hit_fx_span'] -= 1

	def spec_explosion(self, user_id):
		self.paddles[user_id].activate_explosion()
		print('The explosion was activated')
		pass
	
	def spec_defence(self, user_id):
		self.barriers[self.paddles[user_id].side] = True
		pass

	def spec_speed(self, user_id):
		self.paddles[user_id].speed_boost()
		pass


	def check_spec(self, user_id, mode):
		if (mode == 0):
			self.spec_explosion(user_id)
		elif (mode == 1):
			self.spec_defence(user_id)
		else: # mode == 2
			self.spec_speed(user_id)

	def update(self):
		# the ball has a velocity
		self.ball["x"] += self.ball["velocity_x"]
		self.ball["y"] += self.ball["velocity_y"]
		self.check_fx()
		self.move_paddles()
		self.check_score()
		# self.broadcast()
		# print(f"-{time.time()}-", file=sys.stderr)
		# here we will be sending updates to all players

	def reset_ball(self):
		self.ball["x"] = 1/2
		self.ball["y"] = 1/2
		self.ball["speed"] = 0.007 * 1
		self.ball["velocity_x"] = self.ball["speed"]
		self.ball["velocity_y"] = self.ball["speed"]
		self.ball["hit_fx_span"] = 0
		self.ball["curr_speed"] = self.ball["speed"]
	
	def collision(self, b, p):
		# b->ball, p->player
		# print(f'The player is: {p}')
		p.top = p.y - p.line_width
		p.bottom = p.y + p.height + p.line_width
		p.left = p.x - p.line_width
		p.right = p.x + p.width + p.line_width
		
		b['top'] = b['y'] - b['r']
		b['bottom'] = b['y'] + b['r']
		b['left'] = b['x'] - b['r']
		b['right'] = b['x'] + b['r']
		
		return (
			p.left < b['right']
			and p.top < b['bottom']
			and p.right > b['left']
			and p.bottom > b['top']
		)

	def check_wall_collision(self):
		# When the ball collides with bottom and top walls we inverse the y velocity.
		if self.ball['y'] - self.ball['r'] <= 0 or self.ball['y'] + self.ball['r'] >= 1:
			self.ball['velocity_y'] = -self.ball['velocity_y']
			if self.ball['y'] - self.ball['r'] <= 0:
				self.ball['y'] = max(self.ball['y'], self.ball['r'])  # Prevent going below zero
			else:
				self.ball['y'] = min(self.ball['y'], 1 - self.ball['r'])
			return True

		# Check wall defence
		if (self.barriers[0] and self.ball['x'] - self.ball['r'] <= 0):
			self.ball['velocity_x'] = -self.ball['velocity_x']
			self.ball['x'] = max(self.ball['x'], self.ball['r'])
			self.barriers[0] = False
			return True
		elif (self.barriers[1] and self.ball['x'] + self.ball['r'] >= 1):
			self.ball['velocity_x'] = -self.ball['velocity_x']
			self.ball['x'] = min(self.ball['x'], 1 - self.ball['r'])
			self.barriers[1] = False
			return True

		return False

	def check_collective_collision(self, oddness):
		# The following need debugging!!! maybe not
		# print(f'enumerate(self.paddles): {list(enumerate(self.paddles.items()))}')
		blockers = {k: v for i, (k, v) in enumerate(self.paddles.items()) if i % 2 == oddness}
		for blocker in blockers.values():
			if self.collision(self.ball, blocker):
				# we check where the ball hits the paddle
				collide_point = (self.ball['y'] - (blocker.y + blocker.height/2))
				# normalize the value of collide_point, we need to get numbers between -1 and 1.
				# -blocker.height/2 < collide Point < blocker.height/2
				collide_point = collide_point / (blocker.height/2)
				
				# when the ball hits the top of a paddle we want the ball, to take a -45degees angle
				# when the ball hits the center of the paddle we want the ball to take a 0degrees angle
				# when the ball hits the bottom of the paddle we want the ball to take a 45degrees
				# Math.PI/4 = 45degrees
				angle_rad = (math.pi/4) * collide_point
				
				# check if there is a spec speed
				if (blocker.explosion):
					blocker.explosion = False
					self.ball["curr_speed"] = self.ball["speed"] * 10
				# change the X and Y velocity direction
				direction = 1 if (self.ball['x'] + self.ball['r'] < 1 / 2) else -1
				self.ball['velocity_x'] = direction * self.ball["curr_speed"] * math.cos(angle_rad)
				self.ball['velocity_y'] = self.ball["curr_speed"] * math.sin(angle_rad)
				
				# speed up the ball everytime after a paddle hits it.
				self.ball['speed'] += self.ball['speed'] * 0.1
				return True
		return False

	def check_paddle_collision(self):
		# if the ball hits a paddle
		# 'not' below so we the left would be 0
		return self.check_collective_collision(not (self.ball['x'] + self.ball['r'] < 1 / 2))