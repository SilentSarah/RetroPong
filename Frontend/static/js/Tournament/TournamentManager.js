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
        }
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
                        player2.style.backgroundImage = `url(${match_data.player1.image})`;
                        player2.style.backgroundSize = 'cover';
                        player2.style.backgroundPosition = 'center';
                    }
                });
            }
        }
    }

    static joinTournament(data) {
        TournamentConnection.send({
            action: "join",
            data: data
        });
    }
}

/*
{
  "0": {
    "dbb8e859-842d-44fa-a5fb-d74f07068f80": {
      "player1": {},
      "player2": {}
    }
  },
  "1": {
    "c081ca66-0fa8-41bc-97a9-9703d03ca442": {
      "player1": {},
      "player2": {}
    },
    "2dad1fe8-d74b-4b30-94ce-47cd6d8462a6": {
      "player1": {},
      "player2": {}
    }
  },
  "2": {
    "4227f65f-108c-48a8-948a-bd62c42b8648": {
      "player1": {},
      "player2": {}
    },
    "8f2eef52-8008-4559-89c2-5a30b1da95a7": {
      "player1": {},
      "player2": {}
    },
    "258088e9-8053-4031-ad02-00ca099b809e": {
      "player1": {},
      "player2": {}
    },
    "35cc79ea-c453-461a-833a-27e32ad15b53": {
      "player1": {},
      "player2": {}
    }
  },
  "3": {
    "c405c1ef-b02b-4591-9cc0-4673191e96ce": {
      "player1": {},
      "player2": {}
    },
    "444928f1-dcb6-46b8-89cf-5971257b2c1c": {
      "player1": {},
      "player2": {}
    },
    "180c089e-b4f1-45a3-a190-51cacec8212d": {
      "player1": {},
      "player2": {}
    },
    "e4c9fbb3-015b-4a6d-a04c-d3294c8605ce": {
      "player1": {},
      "player2": {}
    },
    "f8d837ed-a4f1-42f8-a631-e4ed46a30f52": {
      "player1": {},
      "player2": {}
    },
    "5119f640-47cd-49ae-955f-08d21c0776bc": {
      "player1": {},
      "player2": {}
    },
    "6f6bb23b-1ca0-4af0-a179-91af096adbb3": {
      "player1": {},
      "player2": {}
    },
    "e3a03f5f-2e2f-4213-8f0d-f4c521dda1db": {
      "player1": {},
      "player2": {}
    }
  }
}
*/