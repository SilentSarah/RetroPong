from datetime import datetime
from .GamePhysics import GamePhysics
from requests import get
from .models import User, MatchHistory
import asyncio

class GameBallData:
    def __init__(self, x: int, y: int, z: int):
        self.x = x
        self.y = y
        self.speed = 17

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
        self.player1 = room.player1 if room.player1 is not None else find_user(user_id=room.get_players()[0])
        self.player2 = room.player2 if room.player2 is not None else find_user(user_id=room.get_players()[1])
        self.player1.game = self if self.player1 is not None else None
        self.player2.game = self if self.player2 is not None else None
        self.player1_score: int = 0
        self.player2_score: int = 0
        self.winner: int = -1
        self.status: str = "starting"
        self.startdate = datetime.now()
        self.player1.opponent = self.player2
        self.player2.opponent = self.player1
        self.playerCount = room.playerCount
        self.owner = room.owner
        self.game_physics = GamePhysics(self)
        self.readyCounter = 0
        self.latest_scorer = None
        self.player1_last_disconnected = None
        self.player2_last_disconnected = None
        
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
    
    async def set_game_status(self, status: str):
        self.status = status
    
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
        print("sent info to player 1 name", self.player1.user_data.uusername)
        print("sent info to player 2 name", self.player2.user_data.uusername)
        
            
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
        from django.contrib.sites.models import Site
        from django.forms.models import model_to_dict
        from asgiref.sync import sync_to_async
        
        domain = await sync_to_async(Site.objects.get_current)()
        self_data = {
            "id": player_self.user_data.id,
            "username": player_self.user_data.uusername,
            "profilepic": 'http://{}/{}'.format(domain, player_self.user_data.uprofilepic.url)
        }
        opponent_data = {
            "id": opponent.user_data.id,
            "username": opponent.user_data.uusername,
            "profilepic": 'http://{}/{}'.format(domain, opponent.user_data.uprofilepic.url)
        }
        return {
            "room_owner_id": self.owner.id,
            "self_data": self_data,
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
        player1.game = self
        player2.game = self
        
        p1_owner_id = self.game_physics.paddle_1.owner.id
        p2_owner_id = self.game_physics.paddle_2.owner.id
        
        self.game_physics.paddle_1.owner = player1 if player1.id == p1_owner_id else player2
        self.game_physics.paddle_2.owner = player2 if player2.id == p2_owner_id else player1
        
        self.player1 = player1 if player1.id == self.player1.id else player2
        self.player2 = player2 if player2.id == self.player2.id else player1
        
        if (player1.id == p1_owner_id):
            self.player1_last_disconnected = None
            self.game_physics.paddle_1.ready = True
        else:
            self.player2_last_disconnected = None
            self.game_physics.paddle_2.ready = True

    async def check_disconnected_users(self):
        if (self.player1_last_disconnected is not None):
            last_disconnected = datetime.now().timestamp() - self.player1_last_disconnected
            if (last_disconnected >= 10):
                await GameService.end_game(self, self.player1)

        if (self.player2_last_disconnected is not None):
            last_disconnected = datetime.now().timestamp() - self.player2_last_disconnected
            if (last_disconnected >= 10):
                await GameService.end_game(self, self.player2)
        return None

    async def game_simulation(self):
        await asyncio.sleep(4)
        print("Game Status:", self.status, f"opponents: {self.player1.user_data.uusername} {self.player2.user_data.uusername}")
        while (self.status == "started"):
            if (self.game_physics.state == "running"):
                await self.game_physics.calculate_ball_physics()
                self.game_physics.check_active_abilities()
                await GameService.broadcast_game_changes(self)
            await self.check_disconnected_users()
            await asyncio.sleep(1 / 60)
        return None


RUNNING_GAMES: list[Game] = []


class GameService:
    @staticmethod
    async def start_game(room):
        from .Room import AVAILABLE_ROOMS
        game_instance = Game(room)
        await game_instance.start_game()
        if (game_instance.status == "starting"):
            AVAILABLE_ROOMS.remove(room) if room in AVAILABLE_ROOMS else None
            RUNNING_GAMES.append(game_instance)
            room = None
        elif (game_instance.status == "fail"):
            RUNNING_GAMES.remove(game_instance) if game_instance in RUNNING_GAMES else None
    
    @staticmethod
    async def ready_game(ws, user, action, data:dict ):
        game: Game = await GameService.get_player_joined_game(user)
        if (game is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'You are not in a game' })
        
        game.readyCounter += 1 if game.readyCounter < 2 else 2
        opponent_name = game.player1.user_data.uusername if user.id == game.player2.id else game.player2.user_data.uusername
        print(f"recieved ready status from player: {user.user_data.uusername} match counter: {game.readyCounter}")
        print(f"Waiting for opponent {opponent_name}, total ready count: {game.readyCounter}")
        if (game.readyCounter == 2):
            print(f"Both players are ready {game.player1.user_data.uusername} {game.player2.user_data.uusername}")
            game.status = "started"
            player1_data = await game.generate_data_for_player(game.player1, game.player2)
            player2_data = await game.generate_data_for_player(game.player2, game.player1)
            await game.player1.send_message_to_self({ "request": "game", "action": "ready", 'status': 'success', "message": 'Game started', "data": player1_data })
            await game.player2.send_message_to_self({ "request": "game", "action": "ready", 'status': 'success', "message": 'Game started', "data": player2_data })
            asyncio.create_task(game.game_simulation())
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
    async def exit_game(ws, user, action, data:dict):
        game = await GameService.get_player_joined_game(user)
        if (game is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'You are not in a game' })
        
        
        if (game.player1_score > 0 or game.player2_score > 0):
            return await GameService.end_game(game, user)
        else:
            await user.opponent.send_message_to_self({ "request": "game", "action": action, 'status': 'success', "message": 'Your opponent has left the game' })
            game.status = "fail"
            game.clean_up()
            RUNNING_GAMES.remove(game)
            game = None

    
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
                if (game.readyCounter == 2):
                    loop = asyncio.get_event_loop()
                    loop.call_later(2,
                        await user.send_message_to_self(
                            { 
                                "request": "game", 
                                "action": "ready", 
                                'status': 'success', 
                                "message": 'Game restored', 
                                "data": game_data 
                            }))
    
    @staticmethod
    async def generate_game_changes(game: Game, player):
        ball_data = game.game_physics.generate_ball_data()
        if player == game.game_physics.paddle_1.owner:
            paddle_data = game.game_physics.generate_paddle_data(player)
            opponent_paddle_data = game.game_physics.generate_paddle_data(game.game_physics.paddle_2.owner)
        else:
            paddle_data = game.game_physics.generate_paddle_data(player)
            opponent_paddle_data = game.game_physics.generate_paddle_data(game.game_physics.paddle_1.owner)
            ball_data['x'] = 1 - ball_data['x']
            paddle_data['x'] = 1 - paddle_data['x']
            opponent_paddle_data['x'] = 1 - opponent_paddle_data['x']
        payload = {
            "request": "game",
            "action": "update",
            "status": "success",
            "data": {
                "ball_data": ball_data,
                "paddle_data": paddle_data,
                "opponent_paddle_data": opponent_paddle_data
            }
        }
        return payload
    
    @staticmethod
    async def move_player(ws, user, action, data:dict):
        game = await GameService.get_player_joined_game(user)
        if (game is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'You are not in a game' })
        
        if (game.status != "started"):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'Game not started' })
        
        raw_Data = data.get('data')
        if (raw_Data is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'No direction found' })
        
        direction = raw_Data.get('direction')
        if (direction is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'No direction found' })
        
        player = game.get_player1() if user.id == game.get_player1().id else game.get_player2()
        game.game_physics.move_paddle(player, direction)
        return None
    
    async def use_ability(ws, user, action, data: dict):
        game = await GameService.get_player_joined_game(user)
        if (game is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'You are not in a game' })
        
        if (game.status != "started"):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'Game not started' })
        
        ability = data.get('data')
        if (ability is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'No ability found' })
        
        if (user.id == game.game_physics.paddle_1.owner.id):
            paddle_1_sa = game.game_physics.paddle_1.special_abilities
            state = paddle_1_sa.activate_special_ability(ability)
        else:
            paddle_2_sa = game.game_physics.paddle_2.special_abilities
            state = paddle_2_sa.activate_special_ability(ability)
        
        if (state):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'success', "data": ability })
                
    @staticmethod
    async def broadcast_game_changes(game: Game):
        ball_data_for_player_1 = await GameService.generate_game_changes(game, game.game_physics.paddle_1.owner)
        ball_data_for_player_2 = await GameService.generate_game_changes(game, game.game_physics.paddle_2.owner)
        
        await game.player1.send_message_to_self(ball_data_for_player_1)
        await game.player2.send_message_to_self(ball_data_for_player_2)
        return None
    
    @staticmethod
    async def update_score(game: Game):
        player_1_data = {
            "scorer_id": game.latest_scorer,
            "self_score": game.player1_score,
            "opponent_score": game.player2_score
        }
        player_2_data = {
            "scorer_id": game.latest_scorer,
            "self_score": game.player2_score,
            "opponent_score": game.player1_score
        }
        game.game_physics.paddle_1.ready = False
        game.game_physics.paddle_2.ready = False
        # print(f"Setting ready to false for players: {game.player1.user_data.uusername} {game.player2.user_data.uusername}")
        await game.player1.send_message_to_self({ "request": "game", "action": "score", "status": "success", "message": "Score updated", "data": { "score": player_1_data } })
        await game.player2.send_message_to_self({ "request": "game", "action": "score", "status": "success", "message": "Score updated", "data": { "score": player_2_data } })
        return None
    
    @staticmethod
    async def ready_in_game(ws, user, action, data:dict):
        game = await GameService.get_player_joined_game(user)
        if (game is None):
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'You are not in a game' })
        
        if (game.status != "started"):
            print(f"Game status: {game.status}")
            return await user.send_message_to_self({ "request": "game", "action": action, 'status': 'fail', "message": 'Game not started' })
        
        game_physics = game.game_physics
        paddle_1 = game_physics.paddle_1
        paddle_2 = game_physics.paddle_2
        
        paddle_1.ready = True if paddle_1.owner.id == user.id else paddle_1.ready
        paddle_2.ready = True if paddle_2.owner.id == user.id else paddle_2.ready
        
        if (paddle_1.ready and paddle_2.ready):
            print(f"{game.player1.user_data.uusername} {game.player2.user_data.uusername} are ready, Scores: {game.player1_score} {game.player2_score}")
            await game.game_physics.set_state("running")
        return None
    

    @staticmethod 
    async def end_game(game: Game, disconnected_user=None):
        from asgiref.sync import sync_to_async
        game.status = "ended"
        winner = game.player1 if game.player1_score >= 7 else game.player2
        loser = game.player1 if game.player1.id != winner.id else game.player2
        game.winner = [game.latest_scorer]
        
        if disconnected_user is not None:
            winner = game.player1 if game.player1.id != disconnected_user.id else game.player2
            loser = game.player1 if game.player1.id != winner.id else game.player2
            game.winner = winner
        
        loser_score = min(game.player1_score, game.player2_score)
        winner_score = max(game.player1_score, game.player2_score)
        
        match = MatchHistory(matchtype="solo", 
                            fOpponent=game.player1.id, 
                            sOpponent=game.player2.id, 
                            mStartDate=datetime.now(), 
                            Score=[winner_score, loser_score], 
                            Winners=[winner.id])
        await sync_to_async(match.save)()
        
        if (game.current_room.is_tournament == True):
            match = game.current_room.match_tournament
            parent = match.parent
            match.winner = winner
            if (parent is not None):
                if (parent.room.player1 is None): 
                    parent.room.player1 = winner
                    print(f"filling parent room with {winner.user_data.uusername}, type: {type(parent.room.player1)}")
                elif (parent.room.player2 is None): 
                    parent.room.player2 = winner
                    print(f"filling parent room with {winner.user_data.uusername}, type: {type(parent.room.player2)}")
                await winner.send_message_to_self({ "request": "game", "action": "info", 'status': 'success', "message": 'You have won round' })
                
                if (parent.room.player1 is not None and parent.room.player2 is not None):
                    from .Tournament import match_players_against_each_other, broadcast_tournament_message, TOURNAMENTS, Tournament, print_tree
                    print("--------|Parent match has been filled|----------")
                    print(f"Parent match players: {parent.room.player1.user_data.uusername} {parent.room.player2.user_data.uusername}")
                    print("starting another match")
                    print("------------------------------------------------")
                    print("-----------|Tree Status|------------")
                    print_tree(parent, 5, 0)
                    await match_players_against_each_other(match.parent)
                    
                if (parent.parent is None):
                    await broadcast_tournament_message(f"{winner.user_data.uusername} has won the tournament")
                    winner.user_data.level += winner.user_data.level * 0.015
                    winner.user_data.xp += 256
                    winner.user_data.matchesplayed += 1
                    winner.user_data.matcheswon += 1
                    await sync_to_async(winner.user_data.save)()

                    tournament = Tournament("RetroPong")
                    TOURNAMENTS.clear()
                    TOURNAMENTS.append(tournament)
                    
        else:
            winner.user_data.level += winner.user_data.level * 0.15
            winner.user_data.xp += 35
            winner.user_data.matchesplayed += 1
            winner.user_data.matcheswon += 1
            await sync_to_async(winner.user_data.save)()

            if (disconnected_user is None):
                loser.user_data.level += winner.user_data.level * 0.125
                loser.user_data.xp += 17
                loser.user_data.matchesplayed += 1
                loser.user_data.matcheslost += 1
                await sync_to_async(loser.user_data.save)()
        
        data = {
            "winner": winner.id,
            "loser": loser.id,
            "winner_score": game.player1_score if winner.id == game.player1.id else game.player2_score,
            "loser_score": game.player2_score if winner.id == game.player1.id else game.player1_score,
            "winner_exp_earned": 35,
            "loser_exp_earned": 17,
            "winner_xp": winner.user_data.xp,
            "loser_xp": loser.user_data.xp
        }
        
        await winner.send_message_to_self({ "request": "game", "action": "end", 'status': 'success', "message": 'You have won the game', "data": data })
        if (disconnected_user is None):
            await loser.send_message_to_self({ "request": "game", "action": "end", 'status': 'success', "message": 'You have lost the game', "data": data })
        
        winner.room = None
        loser.room = None
        game.clean_up()
        RUNNING_GAMES.remove(game)
        return None
                
    @staticmethod
    async def get_player_joined_game(user) -> Game:
        for game in RUNNING_GAMES:
            player1_id = game.get_player1().id
            player2_id = game.get_player2().id
            # print(f"Game ID: {game.current_room.id} \n \
            #         \t\t Player 1: {game.get_player1().user_data.uusername}\n \
            #         \t\t Player 2: {game.get_player2().user_data.uusername}\n")
            if (game.status != "ended" or game.status != "fail"):
                if (user.id == player1_id or user.id == player2_id):
                    return game
        return None
                
    @staticmethod
    def remove_player(game: Game, user):
        try:
            if (game is None): return
            if (user.id == game.player1.id):
                game.player1_last_disconnected = datetime.now().timestamp()
                game.game_physics.paddle_1.ready = False
            else:
                game.player2_last_disconnected = datetime.now().timestamp()
                game.game_physics.paddle_2.ready = False
            game.playerCount -= 1
            if (game.playerCount == 0):
                game.clean_up()
                RUNNING_GAMES.remove(game)
        except Exception as e:
            print("Error: ", e)
        return None