from .Room import Room

class Client:
    def __init__(self, channel_name, id: int = None):
        self.channel_name = channel_name
        self.id = id
        self.room: Room = None
        self.logged_in = False
        self.room_id = None
        self.room