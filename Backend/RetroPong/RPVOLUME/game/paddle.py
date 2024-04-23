class Paddle:
	def __init__(self, side):
		self.width = 1 / 28
		self.height = self.width * 2.5
		self.radius = 1 / 80
		self.lineWidth = 1 / 400
		self.offset = 1 / 50
		if (side == 'right'):
			self.x = (1 - self.width) - (self.lineWidth + self.offset)
		else:
			self.x = (self.lineWidth + self.offset)
		self.y = (1  - self.height) / 2

		# for testing only
		self.moving_direction = ''
	
	def move(self):
		if self.moving_direction == '': return
		step = 1/100
		if (self.moving_direction == 'up' and self.y >= 0):
			newVal = self.y - self.lineWidth / 2 - step
			if (newVal >= 0):
				self.y = newVal
			else:
				self.y = 0 + self.lineWidth / 2
		elif (self.moving_direction == 'down'):
			newVal = self.y + self.lineWidth / 2 + step
			if (newVal <= 1 - self.height):
				self.y = newVal
			else:
				self.y = 1 - self.height - self.lineWidth / 2

	def stop(self):
		self.moving_direction = ''