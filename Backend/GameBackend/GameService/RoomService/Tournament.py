from .TournamentMatch import *
from django.contrib.sites.models import Site
    
def setup_player_data(player):
    if (player is None): return {}
    
    def generate_user_image_link(user_data):
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


