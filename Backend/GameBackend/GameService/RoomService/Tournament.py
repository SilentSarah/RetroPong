from .TournamentMatch import *
from asgiref.sync import sync_to_async
from django.contrib.sites.models import Site
from .Room import *
from .Game import *

RUNNING_GAME_TOURNAMENTS: list[Game] = []
TOURNAMENT_USERS: list = []

class TournamentTask:
    match_id: str
    task = None
    def __init__(self, match_id: str, task):
        self.match_id = match_id
        self.task = task
        
RUNNING_GAME_TASKS: list[TournamentTask] = []

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


def fill_nodes_at_depth(root, player, depth = 2):
    if root is None:
        return 
    
    if (depth == 0):
        if (root.room.player1 is None):
            print("Place Found")
            root.room.player1 = player
            TOURNAMENT_USERS.append(player)
            return True
        elif (root.room.player2 is None):
            print("Place Found")
            root.room.player2 = player
            TOURNAMENT_USERS.append(player)
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

async def check_game_statuses():
    print("Checking game statuses")
    while True:
        for game in RUNNING_GAME_TOURNAMENTS:
            print("Games length:", len(RUNNING_GAME_TOURNAMENTS))
            if (game.current_room.is_tournament == True):
                print("found a game instance for tournament:", game.current_room.match_tournament.id)
                if game.status == "ended":
                    print("Game has ended:", game.current_room.match_tournament.id)
                    game.current_room.match_tournament.winner = game.winner()
                    game.current_room.match_tournament.parent.room.player1 = game.winner()
                    RUNNING_GAME_TOURNAMENTS.remove(game) if game in RUNNING_GAME_TOURNAMENTS else None
        await asyncio.sleep(1)

async def match_players_against_each_other(match: TournamentMatch):
    if match is None:
        return
    
    tasks = []
    if (match.room.player1 is not None and match.room.player2 is not None and match.winner is None):
        player1 = match.room.player1
        player2 = match.room.player2
        
        print("Allocating resources for a game session")
        room = Room(True, match, player1, player2)
        room.add_player(player1.id)
        room.add_player(player2.id)
        room.owner = player1
        room.status = "started"
        await asyncio.sleep(15)
        
        game_task = asyncio.create_task(GameService.start_game(room))
        RUNNING_GAME_TASKS.append(TournamentTask(room.id, game_task))
        tasks.append(game_task)
        print(f"Match Session has been created for {match.room.player1.user_data.uusername} {match.room.player2.user_data.uusername}")

    left_task = match_players_against_each_other(match.left)
    right_task = match_players_against_each_other(match.right)
    tasks.extend([left_task, right_task])
    
    await asyncio.gather(*tasks)
    
async def disconnect_opponents(match: TournamentMatch):
    if match is None:
        return
    
    from .Login import LOGGED_USERS
    if (match.room.player1 is not None):
        match.room.player1.ws.close()
        LOGGED_USERS.remove(match.room.player1)
    if (match.room.player2 is not None):
        match.room.player2.ws.close()
        LOGGED_USERS.remove(match.room.player2)
    

async def start_tournament(tournament: Tournament):
    print("Tournament Started")
    await match_players_against_each_other(tournament.parent_match)
