from channels.db import database_sync_to_async
# from ..RoomService.models import User
# from ..RoomService.ViewAssist import verify_token

# @database_sync_to_async
# def get_user(user_id):
#     try:
#         return User.objects.get(id=user_id)
#     except User.DoesNotExist:
#         return None

class QueryAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        # Look up user from query string (you should also do things like
        # checking if it is a valid user ID, or if scope["user"] is already
        # populated).
        # if (scope["query_string"] is not None):
        #     token = scope["query_string"]
        #     scope['token'],
        # scope['user'] = await get_user(int(scope["query_string"]))
        print(scope["query_string"])

        return await self.app(scope, receive, send)
    
    # async def verify_token(self, token):
    #     if (token is None):
    #         return None, None
    #     token, user_id = await verify_token(token_from_ws=token)
    #     if token is not None and user_id is not None:
    #         return token, user_id
    #     else:
    #         return None, None