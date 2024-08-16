exec daphne -e ssl:$GAME_PORT:privateKey=$HOST_ADDRESS.key:certKey=$HOST_ADDRESS.crt -b 0.0.0.0 GameService.asgi:application
