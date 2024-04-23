let gameSocket;

function initSocket() {
	gameSocket = new WebSocket(
		'ws://'
		+ window.location.hostname + ':8000'
		+ '/ws/game/'
	);
	
	console.log("window.location.host is: ", window.location.host)
	
	gameSocket.onclose = function(e) {
		console.error('Game socket closed unexpectedly');
		
	};
}

// document.getElementById('join-game').onclick = function(e) {
// 	gameSocket.send(JSON.stringify({
// 		'type': 'join'
// 	}));
// };
