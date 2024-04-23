# Ui for the App

=======

# This will highlight the overall working on this branch

1. A request is made to the root '/'
2. 'urls.py' uses the 'views.index_view'
3. 'views.index_view' renders the 'index.html' found in templates
4. A new socket connection starts by 'socket.js' at 'ws://host:port/ws/game/'
5. the first client will wait for another player to join for the game to start
6. A new player joins, the two players start playing until one of them quits

All requests made to 'ws://host:port/ws/game/' are handeled by the GameConsumer at 'consumer.py'
Look up 'consumers' for more details.

GameConsumer is Async and using Json, for more efficiency and simplicity

## What happens when a request is made to the GameConsumer

### GameConsumer will handle any new connection in the `connect` method, and will do the following:

1. Check if the player is active or not, and set them as active
2. If there is an already open game, it will add the player to it, otherwise it will create a new game and add them to it
3. It will add the current channel to a channel_group (look up channels and groups for more details)
4. It will accept the connection
5. ('still not fully implemented') If the room has all players, it will notify everyone to Get ready to start playing, otherwise will tell them to wait

### GameConsumer will handle any new disconnection in the `disconnect` method, and will do the following:

1. It will stop the game
2. ('still not fully implemented') Will let others know that the game is over.

### game_receive_broadcast

All messages broadcasted to the channel_group will be intercepted by this method and then sent back to the individual websockets

### receive_json

This method is like the portal for the client to the server, where messages sent using websocket are received
