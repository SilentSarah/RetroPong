import time, threading


# def action(name):
# 	print("Hello world~")

class set_interval:
	def __init__(self, interval, action):
		self.interval = interval
		self.action = action
		self.stop_event = threading.Event()
		threading.Thread(target=self.set_interval).start()
	
	def set_interval(self):
		next_time = time.time() + self.interval
		while not self.stop_event.wait(next_time-time.time()):
			next_time += self.interval
			self.action()
	
	def cancel(self):
		self.stop_event.set()

# # start action every 0.6s
# interval = set_interval(1/60, action, "Pocadious")

# # will stop interval in 5s
# t = threading.Timer(1, interval.cancel)
# t.start()

# print("hello world")