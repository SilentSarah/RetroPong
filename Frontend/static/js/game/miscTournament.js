function joinTournament()
{
    tournamentSocket.send(JSON.stringify({ 'type': 'join' }));
}

function enterTournamentGame()
{
	tournamentSocket.send(JSON.stringify({ 'type': 'enter_game' }));
}

function leaveTournament()
{
	tournamentSocket.send(JSON.stringify({ 'type': 'leave' }));
}

function updateTournamentStatus(tournamentStatus)
{
	const {
		current_game: currentGame,
		games_status: gamesStatus,
		players
	} = tournamentStatus;
	console.log("I checked if currentGame-----");
	if (!currentGame)
	{
		console.log("I enter the disbale game part");
		disableElById('enterTournamentGame');
	}
	else
	{
		console.log("I enter the undisbale game part");
		undisableElById('enterTournamentGame');
	}
	console.log("gameStatus: ", gamesStatus);
	
	
	const round1 = document.getElementsByClassName('round1');
	if (ObjIsEmpty(gamesStatus))
	{
		players.forEach((p, i) => {
			round1[i].textContent = i + 1;
		});
		console.log("the tournamentStatus is:", tournamentStatus);
	}
	else
	{
		const roundGears = [8, 12, 14]; // to switch rounds
		const rounds = [{}, {}, {}]; // array of objs
		const roundIndex = 0;

		// fill each round with its appropriate games
		Object.entries(gamesStatus).forEach(([key, value], i) => {
			rounds[roundIndex][key] = value;
			(i == roundGears[roundIndex]) && ++roundIndex;
		});

		Object.entries(rounds[0]).forEach(([gameId, gameStatus], i) => {
			round1[(i * 2)].textContent = gameStatus.players[0];
			round1[(i * 2) + 1].textContent = gameStatus.players[1];
		})
		// rounds[0]
		console.log("tournamentStatus is: ", tournamentStatus);
		console.log("the gameStatus is:", gamesStatus);
		console.log("the rounds are:", rounds);
	}
}