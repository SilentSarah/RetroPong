from .Login import Auth
from .Room import RoomService
from .Client import Client

COMMANDS = [
    ("rooms", [
        ('create', RoomService.create_room),  
        ('join', RoomService.join_room),  
        ('leave', RoomService.leave_room),  
        ('list', RoomService.get_rooms)
    ])
]
class Interpreter:
    @staticmethod
    async def interpret(ws, text_data: dict) -> str:
        user: Client = await Auth.check_auth(ws.channel_name)
        if (user is None):
            await ws.send_json({ 'Error': 'You are not authenticated' })
            await ws.close()
            
        request:str = text_data.get('request')
        if request is None: return await Interpreter.respond(ws, { 'Error': 'No request found' })
        
        request_func_list: list[tuple[str, callable]] = Interpreter.identify_request(request)
        if (request_func_list is None): return await Interpreter.respond(ws, { 'Error': 'Invalid request' })
        
        action:str = text_data.get('action')
        if (action is None): return await Interpreter.respond(ws, { 'Error': 'No action was found' })
        
        action_callable:callable = Interpreter.identify_action(request_func_list, action)
        if (action_callable is None): return await Interpreter.respond(ws, { 'Error': 'Invalid action' })
        
        await Interpreter.execute_action(ws, action_callable, user, text_data)
        
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
    async def execute_action(ws, action:callable, user: Client, data: dict):
        return await action(ws, user, data)