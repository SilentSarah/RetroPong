from .TournamentMatch import *
from asgiref.sync import sync_to_async
from django.contrib.sites.models import Site

async def setup_player_data(player):
    if player is None:
        return {}

    def get_current_site():
        return Site.objects.get_current()

    site = await sync_to_async(get_current_site)()
    site = site.domain

    def get_user_data():
        return {
            "id": player.user_data.id,
            "username": player.user_data.uusername,
            "image": "http://{}/{}".format(site, player.user_data.uprofilepic)
        }

    return await sync_to_async(get_user_data)()

    
async def generate_match_data(match: TournamentMatch):
    winner = match.winner.id if match.winner is not None else None
    return {
        "player1": await setup_player_data(match.room.player1),
        "player2": await setup_player_data(match.room.player2),
        "winner": winner
    }
    
def find_matches(required_depth: int):
    match_data = {}
    
    def traverse_and_extract(match: TournamentMatch, current_depth: int):
        if (current_depth >= required_depth):
            return
        generate_match_data(match_data, match, current_depth)
        traverse_and_extract(match.left, required_depth, current_depth + 1)
        traverse_and_extract(match.right, required_depth, current_depth + 1)
    
    return match_data


def fill_nodes_at_depth(root, player, depth = 3):
    if root is None:
        return 
    
    if (depth == 0):
        if (root.room.player1 is None):
            print("Place Found")
            root.room.player1 = player
            return True
        elif (root.room.player2 is None):
            print("Place Found")
            root.room.player2 = player
            return True
    
    if (fill_nodes_at_depth(root.left, player, depth - 1)):
        return True
    if (fill_nodes_at_depth(root.right, player, depth - 1)):
        return True
    
    return False

async def generate_tournament_map(match: Tournament):
    tournament_map = {}
    
    async def extract_data(root, current_depth, depth):
        if (root is None or current_depth >= depth):
            return
        
        if current_depth not in tournament_map:
            tournament_map[current_depth] = {}

        tournament_map[current_depth].update({
            root.id: await generate_match_data(root)
        })
        
        await extract_data(root.left, current_depth + 1, depth)
        await extract_data(root.right, current_depth + 1, depth)
        return 
    
    await extract_data(match, 0, 4)
    return tournament_map
