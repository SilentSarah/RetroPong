python ./manage.py makemigrations > /dev/null 2>&1
python ./manage.py migrate > /dev/null 2>&1
exec daphne -e ssl:$GAME_PORT:privateKey=$HOST_ADDRESS.key:certKey=$HOST_ADDRESS.crt -b 0.0.0.0 GameService.asgi:application
