import { SetTheGameMode, clearChosenGameMode } from "../Game/MatchMaker.js";
import { passUserTo } from "../login_register.js";
import { user_id } from "../userdata.js";
import { TournamentConnection } from "./TournamentConnector.js";

export class TournamentManager {
    static requestTournamentAction(action, data) {
        TournamentConnection.send({
            "request": "tournament",
            "action": action,
            "data": data
        })
    }

    static tournamentAction(action, data) {
        switch (action) {
            case "update":
            case "list":
                this.listTournamentUpdates(data);
                break;
            case "start":
                this.initiateTournamentGame();
                break;
        }
    }

    static initiateTournamentGame() {
        clearChosenGameMode();
        SetTheGameMode("Online");
        passUserTo("/game");
    }

    static listTournamentUpdates(data) {
        const tournament_map = document.getElementById('tournament-map');
        for (const [round_id, match_list] of Object.entries(data)) {
            const rounds = tournament_map.querySelector('#round-' + round_id);
            if (rounds) {
                const matches = rounds.querySelectorAll('.match');
                Object.entries(match_list).forEach(([match_id, match_data], index) => {
                    const match = matches[index];
                    if (!match) return;
                    const player1 = match.querySelector('.player1');
                    const player2 = match.querySelector('.player2');
                    if (match_data.player1 && Object.keys(match_data.player1).length > 0) {
                        player1.style.backgroundImage = `url(${match_data.player1.image})`;
                        player1.style.backgroundSize = 'cover';
                        player1.style.backgroundPosition = 'center';
                    }
                    if (match_data.player2 && Object.keys(match_data.player2).length > 0) {
                        player2.style.backgroundImage = `url(${match_data.player2.image})`;
                        player2.style.backgroundSize = 'cover';
                        player2.style.backgroundPosition = 'center';
                    }
                    if (match_data.winner === match_data.player1.id) {
                        player1.classList.add('winner');
                        player2.classList.add('loser');
                    } else if (match_data.winner === match_data.player2.id) {
                        player2.classList.add('winner');
                        player1.classList.add('loser');
                    }
                });
            }
        }
        TournamentManager.checkIfAlreadyInTournament(data);
    }

    static checkIfAlreadyInTournament(tournament_data) {
        const tournament_join_btn = document.getElementById('tournament-join');
        if (tournament_join_btn) {
            for (const [round, match_list] of Object.entries(tournament_data)) {
                for (const [match, match_data] of Object.entries(match_list)) {
                    if (Object.keys(match_data.player1).length >= 0) {
                        if (match_data.player1.id === user_id) {
                            tournament_join_btn.classList.contains('d-none') ? null : tournament_join_btn.classList.add('d-none');
                            console.log("found the player in the tournament");
                            return;
                        }
                    } if (Object.keys(match_data.player2).length >= 0) {
                        if (match_data.player2.id === user_id) {
                            tournament_join_btn.classList.contains('d-none') ? null : tournament_join_btn.classList.add('d-none');
                            console.log("found the ")
                            return;
                        }
                    }
                }
            }
        }
        console.log("player wasn't found in tournament");
    }

    static joinTournament() {
        TournamentConnection.send({
            request: "tournament",
            action: "join",
            data: {}
        });
    }
}

function joinCurrentTournament() {
    TournamentManager.joinTournament();
}


window.joinCurrentTournament = joinCurrentTournament;