function joinTournament()
{
    tournamentSocket.send(JSON.stringify({ 'type': 'join' }));
}