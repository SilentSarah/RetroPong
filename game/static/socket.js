export const gameSocket = new WebSocket(
	'ws://'
	+ window.location.host
	+ '/ws/game/'
	// + roomName
	// + '/'
);

gameSocket.onclose = function(e) {
	console.error('Game socket closed unexpectedly');
};

document.getElementById('demo-button').onclick = function(e) {
	console.log("I ran")
	const message = "Demo Message";
	gameSocket.send(JSON.stringify({
		'message': message
	}));
};