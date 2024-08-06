import uuid
from .Client import Client
from .models import User
from django.contrib.sites.models import Site

class TRoom:
    def __init__(self):
        self.player1: Client = None
        self.player2: Client = None
        

class TournamentMatch:
    def __init__(self):
        self.id: str = str(uuid.uuid4())
        self.room: TRoom = TRoom()
        self.winner: Client = None
        self.parent: TournamentMatch = None
        self.left: TournamentMatch = None
        self.right: TournamentMatch = None

class Tournament:
    def __init__(self, name):
        self.id: str = str(uuid.uuid4())
        self.name: str = name
        self.lvl: float = 1
        self.prize: int = 256
        self.joined_players: int = 0
        self.matches_count: int = 0
        self.parent_match = TournamentMatch()
        
def generate_match_tree(match: TournamentMatch, count: int):
    if count >= 3:
        return 
        
    match.left = generate_match_tree(match.left, count + 1)
    match.right = generate_match_tree(match.right, count + 1)
    match.left.parent = match
    match.right.parent = match
    
    return TournamentMatch()
    
    
def setup_player_data(player: Client):
    if (player is None): return {}
    
    def generate_user_image_link(user_data: User):
        site = Site.objects.get_current().domain
        return "http://{}{}".format(site, user_data.uprofilepic)
        
    return {
        "id": player.user_data.id,
        "username": player.user_data.uusername,
        "image": generate_user_image_link(player.user_data)
    }

    
def generate_match_data(match_data: dict, match: TournamentMatch, depth: int):
    winner = match.room.winner.id if match.room.winner is not None else None
    match_data.update(
        {
            depth: {
                match.id: {
                    "player1": setup_player_data(match.room.player1),
                    "player2": setup_player_data(match.room.player1),
                    "winner": winner
                }
            }
        }
    )
    return 
    
def find_matches(required_depth: int):
    match_data = {}
    
    def traverse_and_extract(match: TournamentMatch, current_depth: int):
        if (current_depth >= required_depth):
            return
        generate_match_data(match_data, match, current_depth)
        traverse_and_extract(match.left, required_depth, current_depth + 1)
        traverse_and_extract(match.right, required_depth, current_depth + 1)
    
    return match_data