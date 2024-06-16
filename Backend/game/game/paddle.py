class Paddle:
	stroke_palette = [['#feec63', '#ff0100'], ['#68ebff', '#013afe']]
	def __init__(self):
		self.width = 1 / 28
		self.height = self.width * 3
		self.radius = 1 / 80
		self.line_width = 1 / 400
		self.offset = 1 / 50
		self.x = (self.line_width + self.offset)
		self.y = (1  - self.height) / 2
		self.stroke_colors = Paddle.stroke_palette[0]
		self.moving_direction = ''
		self.speed_boost_span = 0
		self.explosion = False

	def speed_boost(self):
		self.speed_boost_span = 100 # will be tested

	def activate_explosion(self):
		self.explosion = True

	def get_step(self):
		if (self.speed_boost_span):
			self.speed_boost_span -= 1
			return (1/100 * 2) # will be tested
		return (1/100)

	def move(self):
		if self.moving_direction == '': return
		step = self.get_step()
		if (self.moving_direction == 'up' and self.y >= 0):
			newVal = self.y - self.line_width / 2 - step
			if (newVal >= 0):
				self.y = newVal
			else:
				self.y = 0 + self.line_width / 2
		elif (self.moving_direction == 'down'):
			newVal = self.y + self.line_width / 2 + step
			if (newVal <= 1 - self.height):
				self.y = newVal
			else:
				self.y = 1 - self.height - self.line_width / 2
	
	def switchSide(self):
		self.x = (1 - self.width) - (self.line_width + self.offset)
		self.stroke_colors = Paddle.stroke_palette[1]

	def getProps(self):
		return ({
			'x': self.x,
			'y': self.y,
			'w': self.width,
			'h': self.height,
			'r': self.radius,
			'lineWidth': self.line_width,
			'strokeColors': self.stroke_colors,
			'speedBoostSpan': self.speed_boost_span,
		})
