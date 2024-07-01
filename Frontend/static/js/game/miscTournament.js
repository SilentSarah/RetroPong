function joinTournament()
{
    tournamentSocket.send(JSON.stringify({ 'type': 'join' }));
}

function enterTournamentGame()
{
	window.location.href = '/game'
	// tournamentSocket.send(JSON.stringify({ 'type': 'enter_game' }));
}

function leaveTournament()
{
	tournamentSocket.send(JSON.stringify({ 'type': 'leave' }));
}

function updateTournamentStatus(tournamentStatus)
{
	console.log("The tournamentStatus: ", tournamentStatus);

	const {
		current_game: currentGame,
		rounds
	} = tournamentStatus;
	console.log("I checked if currentGame-----");
	currentGame
		? enableElById('enterTournamentGame')
		: disableElById('enterTournamentGame');

	// const roundGears = [8, 12, 14]; // to switch rounds
	// // const rounds = [{}, {}, {}]; // array of objs
	// const roundIndex = 0;

	// console.log("The tournamentStatus just before forEach: ", tournamentStatus);
	rounds.forEach((round, i) => {
		let cI = 0; // cellIndex
		const cells = document.getElementsByClassName(`round-${i + 1}`)
		for (const playerId in round)
		{
			console.log(`round-${i}, playerStatus: `, round[playerId]);
			cells[cI++].textContent = playerId
		}
	});


	// // fill each round with its appropriate games
	// Object.entries(gamesStatus).forEach(([key, value], i) => {
	// 	rounds[roundIndex][key] = value;
	// 	(i == roundGears[roundIndex]) && ++roundIndex;
	// });

	// Object.entries(rounds[0]).forEach(([gameId, gameStatus], i) => {
	// 	round1[(i * 2)].textContent = gameStatus.players[0];
	// 	round1[(i * 2) + 1].textContent = gameStatus.players[1];
	// })
	// // rounds[0]
	// console.log("tournamentStatus is: ", tournamentStatus);
	// console.log("the gameStatus is:", gamesStatus);
	// console.log("the rounds are:", rounds);
}