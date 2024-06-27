function joinTournament()
{
    tournamentSocket.send(JSON.stringify({ 'type': 'join' }));
}

function EnterTournamentGame()
{
	tournamentSocket.send(JSON.stringify({ 'type': 'enter_game' }));
}