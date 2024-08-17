import { SetTheGameMode, clearChosenGameMode } from "./MatchMaker.js";
import { passUserTo } from "../login_register.js";
import { user_id } from "../userdata.js";
import { GameConnector } from "./GameConnection.js";
import { bPaddle, ball, rPaddle, resetGameResourcesAndData } from "./GameEngine.js";
import { GameProcessor } from "./GameProcessor.js";

export class TournamentManager {
    static requestTournamentAction(action, data) {
        if (GameConnector == null) return ;
        if (rPaddle && bPaddle && ball) {
            GameProcessor.gameRequestAction('exit', {});
            resetGameResourcesAndData();
        }
        GameConnector.send({
            "request": "tournament",
            "action": action,
            "data": data
        })
    }

    static tournamentAction(action, data) {
        if (window.location.pathname !== "/tournament") return;
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
        console.log("listing tournament updates")
        const tournament_map = document.getElementById('tournament-map');
        for (const [round_id, match_list] of Object.entries(data)) {
            const rounds = tournament_map.querySelector('#round-' + (+round_id + 1));
            if (rounds) {
                const matches = rounds.querySelectorAll('.match');
                Object.entries(match_list).forEach(([match_id, match_data], index) => {
                    const match = matches[index];
                    match.id = match_id;
                    // console.log(`found Match ${match_id} for match html ${match.id}, Listing Players`, match_data);
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
                        player1.classList.add('border-success');
                        player2.classList.add('border-danger');
                    } else if (match_data.winner === match_data.player2.id) {
                        player2.classList.add('border-success');
                        player1.classList.add('border-danger');
                    }
                });
            }
        }
        if (data.winner) {
            const round_0 = tournament_map.querySelector('#round-0');
            const final_match = round_0.querySelector('.match');
            const winner = final_match.querySelector('.player2');

            winner.style.backgroundImage = `url(${data.winner.image})`;
            winner.style.backgroundSize = 'cover';
            winner.style.backgroundPosition = 'center';
            winner.classList.add('border-warning');
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
                            return;
                        }
                    } if (Object.keys(match_data.player2).length >= 0) {
                        if (match_data.player2.id === user_id) {
                            tournament_join_btn.classList.contains('d-none') ? null : tournament_join_btn.classList.add('d-none');
                            return;
                        }
                    }
                }
            }
        }
    }

    static joinTournament() {
        this.requestTournamentAction("join", {});
    }
}

function joinCurrentTournament() {
    TournamentManager.joinTournament();
}

export function listTournamentMembers() {
    if (!GameConnector || GameConnector.socket.readyState != 1) return;
    TournamentManager.requestTournamentAction("list", {});
}


window.joinCurrentTournament = joinCurrentTournament;