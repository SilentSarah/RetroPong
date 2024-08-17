exec daphne -e ssl:$USERMGR_PORT:privateKey=$HOST_ADDRESS.key:certKey=$HOST_ADDRESS.crt -b 0.0.0.0 UserManagement.asgi:application
