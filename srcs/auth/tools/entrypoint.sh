
exec daphne -e ssl:$AUTH_PORT:privateKey=$HOST_ADDRESS.key:certKey=$HOST_ADDRESS.crt -b 0.0.0.0 JwtAuth.asgi:application
