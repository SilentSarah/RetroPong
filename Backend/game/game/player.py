class Player:
	def __init__(self, pfpSrc, pfpAlt, pName, lvl):
		self.pfpSrc = pfpSrc
		self.pfpAlt = pfpAlt
		self.pName = pName
		self.lvl = lvl
		# self.side = 'left'
		pass
	def getProps(self):
		return ({
			'pfpSrc': self.pfpSrc,
			'pfpAlt': self.pfpAlt,
			'pName': self.pName,
			'lvl': self.lvl,
			# 'side': self.side
		})