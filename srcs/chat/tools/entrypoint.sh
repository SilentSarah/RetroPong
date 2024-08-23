python ./manage.py makemigrations > /dev/null 2>&1
python ./manage.py migrate > /dev/null 2>&1
exec daphne -e ssl:$CHAT_PORT:privateKey=$HOST_ADDRESS.key:certKey=$HOST_ADDRESS.crt -b 0.0.0.0 backend.asgi:application
