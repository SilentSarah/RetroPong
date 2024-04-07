import sys
import math
import threading
from game.set_interval import set_interval
from asgiref.sync import async_to_sync
from game.paddle import Paddle
import time

class Game:
	game_number = 0
	def __init__(self, consumer):
		self.consumer = consumer
		self.players = [consumer.channel_name]
		self.paddles = [Paddle("left")]
		self.details = {
			'creator': consumer.channel_name,
			'name': f"room_{Game.game_number}"
		}
		Game.game_number += 1
		self.ball = {'r': 1 / 150}
		self.reset_ball()
	
	def add_paddle(self, paddle):
		self.paddles.append(paddle)

	# def broadcast(self):
		# async_to_sync(self.consumer.channel_layer.group_send)(
		# 	self.name(), {
		# 		"type": "recv.broadcast",# will look into this later
		# 		})
		# async_to_sync(self.consumer.send_json)(content={"type": "update", "x": self.ball['x'], "y": self.ball['y']})
		# async_to_sync(self.consumer.send_json)(content={"type": "log", "log": "Broadcasting..."},)

	def move(self, side, direction):
		if (side == 'left'):
			self.paddles[0].move(direction)
		elif (side == 'right'):
			self.paddles[1].move(direction)

	def start(self):
		# testing
		# 1/60 for 60 fps
		interval = set_interval(1/60, self.update)

		# will stop interval in 5s
		# t = threading.Timer(5, interval.cancel)
		# t.start()
		
		# print("The start function was called however!", file=sys.stderr)
		
	def name(self):
		return (self.details['name'])
	
	def add_player(self, player):
		self.players.append(player)
	
	def joined_players(self):
		return (len(self.players))

	# async def broadcast():

	def check_score(self):
		if( self.ball['x'] - self.ball['r'] < 0 ):
			# self.com.score += 1 # will check this later
			pass
		elif( self.ball['x'] + self.ball['r'] > 1 ):
			# self.user.score += 1 # will check this later
			pass
		else: return
		self.reset_ball()

	def update(self):
		self.check_score() # will see this later
		# the ball has a velocity
		self.ball["x"] += self.ball["velocityX"]
		self.ball["y"] += self.ball["velocityY"]
		self.check_wall_collision()
		self.check_paddle_collision()
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
		p.top = p.y - p.lineWidth
		p.bottom = p.y + p.height + p.lineWidth
		p.left = p.x - p.lineWidth
		p.right = p.x + p.width + p.lineWidth
		
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

	def check_paddle_collision(self):
		# we check if the paddle hit the user or the com paddle
		player = self.paddles[0] if (self.ball['x'] + self.ball['r'] < 1 / 2) else self.paddles[1]
		# if the ball hits a paddle
		if self.collision(self.ball, player):
			# we check where the ball hits the paddle
			collide_point = (self.ball['y'] - (player.y + player.height/2))
			# normalize the value of collide_point, we need to get numbers between -1 and 1.
			# -player.height/2 < collide Point < player.height/2
			collide_point = collide_point / (player.height/2)
			
			# when the ball hits the top of a paddle we want the ball, to take a -45degees angle
			# when the ball hits the center of the paddle we want the ball to take a 0degrees angle
			# when the ball hits the bottom of the paddle we want the ball to take a 45degrees
			# Math.PI/4 = 45degrees
			angle_rad = (math.pi/4) * collide_point
			
			# change the X and Y velocity direction
			direction = 1 if (self.ball['x'] + self.ball['r'] < 1 /2) else -1
			self.ball['velocityX'] = direction * self.ball['speed'] * math.cos(angle_rad)
			self.ball['velocityY'] = self.ball['speed'] * math.sin(angle_rad)
			
			# speed up the ball everytime a paddle hits it.
			self.ball['speed'] += self.ball['speed'] * 0.1
