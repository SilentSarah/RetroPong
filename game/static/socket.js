export const gameSocket = new WebSocket(
	'ws://'
	+ window.location.host
	+ '/ws/game/'
);

gameSocket.onclose = function(e) {
	console.error('Game socket closed unexpectedly');
	
};

document.getElementById('join-game').onclick = function(e) {
	gameSocket.send(JSON.stringify({
		'type': 'join'
	}));
};
