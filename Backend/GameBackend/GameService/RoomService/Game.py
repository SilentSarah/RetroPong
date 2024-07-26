from datetime import datetime
from requests import get

class GameBallData:
    def __init__(self, x: int, y: int, z: int):
        self.x = x
        self.y = y
        self.screenheight = None
        self.screenwidth = None
        self.height = None
        self.width = None

class GamePlayerData:
    def __init__(self, x: int, y: int, z: int):
        self.x = x
        self.y = y
        self.screenheight = None
        self.screenwidth = None
        self.height = None
        self.width = None

class Game:
    def __init__(self, room):
        from .Login import find_user
        self.current_room = room
        self.player1 = find_user(user_id=room.get_players()[0])
        self.player2 = find_user(user_id=room.get_players()[1])
        self.player1.game = self
        self.player2.game = self
        self.player1_score: int = 0
        self.player2_score: int = 0
        self.winner: int = -1
        self.status: str = "starting"
        self.startdate = datetime.now()
        self.player1.opponent = self.player2
        self.player2.opponent = self.player1
        self.playerCount = room.playerCount
        self.owner = room.owner
        
    def get_player1(self):
        return self.player1
    
    def get_player2(self):
        return self.player2
    
    def get_player1_score(self) -> int:
        return self.player1_score
    
    def get_player2_score(self) -> int:
        return self.player2_score
    
    def get_winner(self) -> int:
        return self.winner
    
    def get_status(self) -> str:
        return self.status
    
    def get_startdate(self) -> datetime:
        return self.startdate
    
    async def start_game(self):
        first_player_data = await self.generate_data_for_player(self.player1, self.player2)
        second_player_data = await self.generate_data_for_player(self.player2, self.player1)
        
        
        if (first_player_data is None or second_player_data is None):
            self.status = "fail"
            print("Failed to get player data", first_player_data, second_player_data)
            return (await self.player1.send_message_to_self({ "action": "game", "status": "fail", "message": "Failed to get player data" }), 
                    await self.player2.send_message_to_self({ "action": "game", "status": "fail", "message": "Failed to get player data" }),
                    self.clean_up())
            
        await self.player1.send_message_to_self({ "request": "game", "action": "start", "status": "success", "message": "Game started", "data": first_player_data })
        await self.player2.send_message_to_self({ "request": "game", "action": "start", "status": "success", "message": "Game started", "data": second_player_data })
            
    def clean_up(self):
        self.status = "ended"
        self.player1.opponent = None
        self.player2.opponent = None
        self.player1.room = None
        self.player2.room = None
        self.current_room = None
        self.player1.game = None
        self.player2.game = None
        
    async def generate_data_for_player(self, player_self, opponent):
        user_data = await self.get_player_data(player_self)
        opponent_data = await self.get_player_data(opponent)
        if (user_data is None or opponent_data is None):
            return None
        return {
            "room_owner_id": self.owner,
            "self_data": user_data,
            "opponent_data": opponent_data,
            "self_score": self.player1_score if player_self.id == self.player1.id else self.player2_score,
            "opponent_score": self.player2_score if player_self.id == self.player1.id else self.player1_score,
            "status": self.status
        }
        
    async def get_player_data(self, player):
        response = get(f"http://127.0.0.1:8001/userdata/{player.id}", headers={ "Authorization": f"Bearer {player.cookie}" })
        if (response.status_code == 200):
            return response.json()
        return None
    
    def link_players(self, player1, player2):
        player1.opponent = player2
        player2.opponent = player1
        
        self.player1 = player1 if player1.id == self.player1.id else player2
        self.player2 = player2 if player2.id == self.player2.id else player1




RUNNING_GAMES: list[Game] = []


class GameService:
    @staticmethod
    async def start_game(room):
        from .Room import AVAILABLE_ROOMS
        game_instance = Game(room)
        await game_instance.start_game()
        if (game_instance.status == "starting"):
            AVAILABLE_ROOMS.remove(room)
            RUNNING_GAMES.append(game_instance)
            room = None
        elif (game_instance.status == "fail"):
            RUNNING_GAMES.remove(game_instance)
        return None
    
    @staticmethod
    async def leave_game(ws, user, action, data:dict):
        game = await GameService.get_player_joined_game(user)
        if (game is None):
            print("User not in game")
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'You are not in a game' })
        
        user = game.get_player1() if user.id == game.get_player1().id else game.get_player2()
        opponent = game.get_player1() if user.id == game.get_player2().id else game.get_player2()
        
        print("Leaving Game", game)
        RUNNING_GAMES.remove(game)
        game.clean_up()
        game = None
        return (
                    await user.send_message_to_self({ "request": "game", "action": "info", 'status': 'success', "message": 'You have left the game' }),
                    await opponent.send_message_to_self({ "request": "game", "action": action, 'status': 'success', "message": 'Your opponent has left the game' }),
                    await opponent.send_message_to_self({ "request": "game", "action": "info", 'status': 'success', "message": 'Your opponent has left the game' })
                )
        
        
    @staticmethod
    async def relay_paddle_position(ws, user, action, data:dict):
        game = await GameService.get_player_joined_game(user)
        if (game is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'You are not in a game' })
        
        opponent = game.get_player1() if user.id == game.get_player2().id else game.get_player2()
        
        data = data.get('data')
        paddle_data = data.get('paddle')
        if (paddle_data is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'No paddle position found' })
        
        user_data = {
            "posY": paddle_data.get("posY"),
        }
        
        return await opponent.send_message_to_self({ "request": "game", "action": "update_paddle", 'status': 'success', "message": 'Opponent paddle position updated', "data": user_data })
        
    @staticmethod
    async def get_player_joined_game(user) -> Game:
        for game in RUNNING_GAMES:
            player1_id = game.get_player1().id
            player2_id = game.get_player2().id
            if (game.status != "ended" or game.status != "fail"):
                if (user.id == player1_id or user.id == player2_id):
                    return game
        return None
    
    @staticmethod
    async def restore_game(user_id):
        from .Login import find_user
        user = find_user(user_id=user_id)
        if (user is not None):
            game = await GameService.get_player_joined_game(user)
            if game is not None:
                opponent = game.get_player1() if user.id == game.get_player2().id else game.get_player2()
                game.link_players(user, opponent)
                game_data = await game.generate_data_for_player(user, opponent)
                game.playerCount += 1
                await user.send_message_to_self(
                                        { 
                                            "request": "game", 
                                            "action": "restore", 
                                            'status': 'success', 
                                            "message": 'Game restored', 
                                            "data": game_data 
                                        })
                
    @staticmethod
    def remove_player(game: Game):
        if (game is None): return
        game.playerCount -= 1
        if (game.playerCount == 0):
            game.clean_up()
            RUNNING_GAMES.remove(game)
        return None
    
    
    @staticmethod
    async def update_ball_position(ws, user, action, data:dict):
        game: Game = await GameService.get_player_joined_game(user)
        if (game is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'You are not in a game' })
        
        if (user.id is not game.owner): return
        
        opponent = game.player2 if game.player2.id != user.id else game.player1
        
        ball_pos = data.get('data')
        if (ball_pos is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'No ball position found' })
        
        await opponent.send_message_to_self({ "request": "game", "action": "update_ball", 'status': 'success', "message": 'Ball position updated', "data": ball_pos })
        
        
    @staticmethod
    async def update_score(ws, user, action, data:dict):
        game: Game = await GameService.get_player_joined_game(user)
        if (game is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'You are not in a game' })
        
        if (user.id is not game.owner): return
        loser_data: dict = data.get('data')
        
        print("Loser Data", loser_data)
        loser = loser_data.get("loser")
        if (loser is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'No data was found' })
        
        
        if (loser == game.player1.id):
            game.player2_score += 1
        elif (loser == game.player2.id):
            game.player1_score += 1

        current_top_score = game.player1_score if game.player1_score > game.player2_score else game.player2_score
        
        self_player_score = game.player1_score if user.id == game.player1.id else game.player2_score
        opponent_score = game.player2_score if user.id == game.player1.id else game.player1_score
        
        score = {
            "self_score": self_player_score,
            "opponent_score": opponent_score
        }
        
        opponent_score_data = {
            "self_score": opponent_score,
            "opponent_score": self_player_score
        }
        
        self_user = game.player1 if user.id == game.player1.id else game.player2
        opponent = game.player1 if user.id == game.player2.id else game.player2
        
        await self_user.send_message_to_self({ "request": "game", "action": "update_score", 'status': 'success', "message": 'Score updated', "data": score })
        await opponent.send_message_to_self({ "request": "game", "action": "update_score", 'status': 'success', "message": 'Score updated', "data": opponent_score_data })
        
        # if (current_top_score == 7):
        #     game.winner = game.player1.id if game.player1_score == 7 else game.player2.id
        #     game.status = "ended"
        #     await game.player1.send_message_to_self({ "request": "game", "action": "end", 'status': 'success', "message": 'Game ended', "data": { "winner": game.winner } })
        #     await game.player2.send_message_to_self({ "request": "game", "action": "end", 'status': 'success', "message": 'Game ended', "data": { "winner": game.winner } })
        #     GameService.remove_player(game)
        #     game = None
        
        