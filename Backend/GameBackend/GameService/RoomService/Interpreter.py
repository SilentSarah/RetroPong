class Interpreter:
    @staticmethod
    def interpret(self, text_data: dict) -> str:
        action = text_data.get('action')
        if action is None: return None
        
        print(action)