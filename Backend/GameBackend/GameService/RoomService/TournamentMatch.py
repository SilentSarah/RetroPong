
import uuid

class Tournament:
    def __init__(self, name):
        self.id: str = str(uuid.uuid4())
        self.name: str = name
        self.lvl: float = 1
        self.prize: int = 256
        self.current_depth = 4
        self.joined_players: int = 0
        self.matches_count: int = 0
        self.parent_match = None


class TRoom:
    def __init__(self):
        self.player1 = None
        self.player2 = None

class TournamentMatch:
    def __init__(self):
        self.id: str = str(uuid.uuid4())
        self.room: TRoom = TRoom()
        self.winner = None
        self.parent: TournamentMatch = None
        self.left: TournamentMatch = None
        self.right: TournamentMatch = None
        
def generate_match_tree(count: int):
    if count >= 4:
        return None
    
    match = TournamentMatch()
    match.left = generate_match_tree(count + 1)
    match.right = generate_match_tree(count + 1)
    
    if match.left:
        match.left.parent = match
    if match.right:
        match.right.parent = match
    
    return match

def print_tree(root, space=0, level=0):
    if root is None:
        return

    space += 10

    print_tree(root.right, space, level + 1)

    print()
    for i in range(10, space):
        print(end=" ")
    print(f'Room Players: {root.room.player1.id if root.room.player1 else None} {root.room.player2.id if root.room.player2 else None} (L{level})')

    print_tree(root.left, space, level + 1)
    
    
def find_player_in_tree(root, player):
    if root is None:
        return 
    
    if (root.room.player1):
        if (root.room.player1.id == player.id):
            return True
    elif (root.room.player2):
        if (root.room.player2.id == player.id):
            return True

    if (find_player_in_tree(root.left, player)): return True
    if (find_player_in_tree(root.right, player)): return True

    return False

async def broadcast_tournament_changes(data: dict):
    from .Login import TOURNAMENT_USERS
    for user in TOURNAMENT_USERS:
            print("Sending to player: ", user.id)
            await user.send_message_to_self({
                "request":"tournament",
                "action":"update",
                "status":"success",
                "data": data
            })
            
async def broadcast_tournament_message(message: str):
    from .Login import TOURNAMENT_USERS
    for user in TOURNAMENT_USERS:
            await user.send_message_to_self({
                "request":"tournament",
                "action":"info",
                "status":"success",
                "message": message
            })

async def broadcast_tournament_action(action: str, data: dict):
    from .Login import TOURNAMENT_USERS
    for user in TOURNAMENT_USERS:
            await user.send_message_to_self({
                "request":"tournament",
                "action": action,
                "status":"success",
                "data": data
            })


TOURNAMENTS : list[Tournament] = []