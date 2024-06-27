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