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
	
	def updatePos(self, movement):
		step = 1/100
		if (movement == 'up' and self.y >= 0):
			newVal = self.y - self.lineWidth / 2 - step
			if (newVal >= 0):
				self.y = newVal
			else:
				self.y = 0 + self.lineWidth / 2
		elif (movement == 'down'):
			newVal = self.y + self.lineWidth / 2 + step
			if (newVal <= 1 - self.height):
				self.y = newVal
			else:
				self.y = 1 - self.height - self.lineWidth / 2