from .Login import Auth
from .Room import RoomService
from .Game import GameService
from .TournamentService import TournamentService
from .Client import Client

COMMANDS = [
    ("rooms", [
        ('create', RoomService.create_room),  
        ('join', RoomService.join_room),  
        ('leave', RoomService.leave_room),  
        ('list', RoomService.get_rooms),
        ('rapid_join', RoomService.rapid_join),
        ('rapid_leave', RoomService.rapid_leave),
        ('private_invite', RoomService.private_invite),
    ]),
    ("game", [
        ('leave', GameService.leave_game),
        ('exit', GameService.exit_game),
        ('ready', GameService.ready_game),
        ('move', GameService.move_player),  
        ('ready_game', GameService.ready_in_game),
        ('ability', GameService.use_ability),
    ]),
    ("tournament", [
        ('join', TournamentService.join_tournament),
        ('leave', GameService.exit_game),  
    ]),
]
class Interpreter:
    @staticmethod
    async def interpret(ws, text_data: dict, tournament_request = False) -> str:
        user: Client = await Auth.check_auth(ws.channel_name)
        if (user is None):
            await ws.send_json({ 'Error': 'You are not authenticated' })
            await ws.close()
            
        request:str = text_data.get('request')
        if request is None: return await Interpreter.respond(ws, { 'Error': 'No request found' })
        if request != 'tournament' and tournament_request == True: return await Interpreter.respond(ws, { 'Error': 'Invalid request' })
        
        request_func_list: list[tuple[str, callable]] = Interpreter.identify_request(request)
        if (request_func_list is None): return await Interpreter.respond(ws, { 'Error': 'Invalid request' })
        
        action:str = text_data.get('action')
        if (action is None): return await Interpreter.respond(ws, { 'Error': 'No action was found' })
        
        action_callable:callable = Interpreter.identify_action(request_func_list, action)
        if (action_callable is None): return await Interpreter.respond(ws, { 'Error': 'Invalid action' })
        
        print("Request: ", request, "Action: ", action)
        await Interpreter.execute_action(ws, action_callable, user, action, text_data)
        
    def identify_request(request: str) -> list[str, callable]:
        for command in COMMANDS:
            if command[0] == request:
                return command[1]
        return None
    
    def identify_action(action_list: tuple[str, callable], action: str):
        for act in action_list:
            if act[0] == action:
                return act[1]
        return None
        
    @staticmethod
    async def respond(ws, response: dict):
        await ws.send_json(response)
        return True
    
    @staticmethod
    async def execute_action(ws, action:callable, user: Client, req_action: str, data: dict):
        return await action(ws, user, req_action, data)