export function TournamentMenu(){
    let tournament = document.getElementById('Tournament');
    let tournament_map = document.getElementById('tournament-map');
    let btnToTournament = document.getElementById('btnToTournament');
    let btnToInformation = document.getElementById('btnToInformation');
    btnToTournament.addEventListener('click', function(){
        tournament_map.classList.contains('d-none') ? tournament_map.classList.remove('d-none') : tournament_map.classList.add('d-none');
        tournament.style.display = 'block';
        btnToTournament.style.background = '#FFFFFF40';
        btnToTournament.style.boxShadow = '0px 0px 4px 0px #FFFFFF40';
        btnToInformation.style.background = '';
        btnToInformation.style.boxShadow = '';
    });
    btnToInformation.addEventListener('click', function(){
        tournament_map.classList.contains('d-none') ? tournament_map.classList.remove('d-none') : tournament_map.classList.add('d-none');
        tournament.style.display = 'none';
        btnToInformation.style.background = '#FFFFFF40';
        btnToInformation.style.boxShadow = '0px 0px 4px 0px #FFFFFF40';
        btnToTournament.style.background = 'transparent';
        btnToTournament.style.boxShadow = 'none';
    });
}