import { Interpreter } from "../Game/Interpreter.js";
import { TournamentManager } from "./TournamentManager.js";

export let TournamentConnection;

class TournamentConnector {
    constructor(link) {
        this.ws = new WebSocket(link);
        this.ws.onopen = () => {
            TournamentManager.requestTournamentAction('list', {});
        }
        this.ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            Interpreter.interpretResponse(data);
        }
        this.ws.onclose = () => {
        }    
    }

    send(data) {
        this.ws.send(JSON.stringify(data))
    }

    close() {
        this.ws.close()
    }
}

export function InitiateTournamentConnection() {
    if (!TournamentConnection)
        TournamentConnection = new TournamentConnector("ws://127.0.0.1:8003/ws/tournament/");
    return TournamentConnection;
}