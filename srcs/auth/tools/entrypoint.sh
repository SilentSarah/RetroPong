
exec daphne -e ssl:8001:privateKey=$HOST_ADDRESS.key:certKey=$HOST_ADDRESS.crt -b 0.0.0.0 JwtAuth.asgi:application
