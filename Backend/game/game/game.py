import sys
import math
import threading
from game.set_interval import set_interval
# from asgiref.sync import async_to_sync
from game.paddle import Paddle
import time
# from game.models import MatchHistory

# Make sure to implement the full() method

class Game:
	serial_number = 0
	def __init__(self, creator_id, mode):
		self.mode = mode
		self.over = False
		# self.consumer = consumer
		self.paddles = {creator_id: Paddle()}
		self.details = {
			'creator': creator_id,
			'id': f"room_{Game.serial_number}"
		}
		Game.serial_number += 1
		self.ball = {'r': 1 / 150}
		self.hit = [False, 5] # for soundFx
		self.reset_ball()
		self.score = [0, 0]

	def add_paddle(self, id):
		self.paddles[id] = Paddle()
		if (len(self.paddles) % 2 == 0):
			self.paddles[id].switchSide()
	
	def full(self):
		if (self.mode == 2): #random duo
			return self.players_count() >= 4
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
	def move_paddle(self, id, direction):
			self.paddles[id].moving_direction =  direction

	# old: stop
	def stop_paddle(self, id):
		self.paddles[id].moving_direction =  ''

	# def init_match_history(self):
	# 	self.match_history = MatchHistory.objects.create()
	# 	self.match_history.mode = self.mode
		

	def start(self):
		# testing
		print("THE GAME HAS STARTED>>>>>>>>>>>")

		# self.init_match_history()
		# 1/60 for 60 fps
		if (not self.over):
			self.game_loop_interval = set_interval(1/60, self.update)

		# will stop interval in 5s
		# t = threading.Timer(5, interval.cancel)
		# t.start()
		
		# print("The start function was called however!", file=sys.stderr)
	
	def calc_xp(self):
		pass # this one needs auth working
		# oddness = 0 if self.score[0] > self.score[1] else 1
		

	def finish(self):
		if (not self.over):
			self.game_loop_interval.cancel()
			self.calc_xp() # will be dealt with later
			self.over = True

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

	def update(self):
		self.check_score() # will see this later
		# the ball has a velocity
		self.ball["x"] += self.ball["velocityX"]
		self.ball["y"] += self.ball["velocityY"]
		if (self.check_wall_collision() or self.check_paddle_collision()):
			self.hit = [True, 5]
		elif (self.hit[1]):
			self.hit[1] -= 1
		else:
			self.hit[0] = False
		self.move_paddles()
		# self.broadcast()
		# print(f"-{time.time()}-", file=sys.stderr)
		# here we will be sending updates to all players

	def reset_ball(self):
		self.ball["x"] = 1/2
		self.ball["y"] = 1/2
		self.ball["speed"] = 0.007 * 1
		self.ball["velocityX"] = self.ball["speed"]
		self.ball["velocityY"] = self.ball["speed"]
	
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
			self.ball['velocityY'] = -self.ball['velocityY']
			if self.ball['y'] - self.ball['r'] <= 0:
				self.ball['y'] = max(self.ball['y'], self.ball['r'])  # Prevent going below zero
			else:
				self.ball['y'] = min(self.ball['y'], 1 - self.ball['r'])
			return True
		return False

	def check_collective_collision(self, oddness):
		# The following need debugging!!!
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
				
				# change the X and Y velocity direction
				direction = 1 if (self.ball['x'] + self.ball['r'] < 1 / 2) else -1
				self.ball['velocityX'] = direction * self.ball['speed'] * math.cos(angle_rad)
				self.ball['velocityY'] = self.ball['speed'] * math.sin(angle_rad)
				
				# speed up the ball everytime a paddle hits it.
				self.ball['speed'] += self.ball['speed'] * 0.1
				return True
		return False

	def check_paddle_collision(self):
		# if the ball hits a paddle
		# 'not' below so we the left would be 0
		return self.check_collective_collision(not (self.ball['x'] + self.ball['r'] < 1 / 2))