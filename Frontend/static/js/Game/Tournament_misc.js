export function TournamentMenu(){
    let tournament = document.getElementById('Tournament');
    let Tclasses = document.getElementById('Tclasses');
    let btnToTournament = document.getElementById('btnToTournament');
    let btnToInformation = document.getElementById('btnToInformation');
    console.log("object")
    btnToTournament.addEventListener('click', function(){
        console.log("object")
        Tclasses.style.display = 'none';
        tournament.style.display = 'block';
        btnToTournament.style.background = '#FFFFFF40';
        btnToTournament.style.boxShadow = '0px 0px 4px 0px #FFFFFF40';
        btnToInformation.style.background = '';
        btnToInformation.style.boxShadow = '';
    });
    btnToInformation.addEventListener('click', function(){
        Tclasses.style.display = 'flex';
        tournament.style.display = 'none';
        btnToInformation.style.background = '#FFFFFF40';
        btnToInformation.style.boxShadow = '0px 0px 4px 0px #FFFFFF40';
        btnToTournament.style.background = 'transparent';
        btnToTournament.style.boxShadow = 'none';
    });
}