let gameSocket, tournamentSocket;

function initGameSocket(initGame) {
	gameSocket = new WebSocket(
		'ws://'
		+ window.location.hostname + ':8003'
		+ '/ws/game/'
	);
	
	console.log("window.location.host is: ", window.location.host)
	
	gameSocket.onclose = function(e) {
		console.error('Game socket closed unexpectedly');
		
	};
	gameSocket.addEventListener('open', () => initGame())
}

function initTournamentSocket(initTournament) {
	tournamentSocket = new WebSocket(
		'ws://'
		+ window.location.hostname + ':8003'
		+ '/ws/tournament/'
	);
	
	console.log("window.location.host is: ", window.location.host)
	
	tournamentSocket.onclose = function(e) {
		console.error('Tournament socket closed unexpectedly');
		
	};
	tournamentSocket.addEventListener('open', () => initTournament())
}

