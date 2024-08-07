import { toast } from "../userdata.js";
import { RoomManager } from "./RoomManager.js";
import { GameProcessor } from "./GameProcessor.js";
import { TournamentManager } from "../Tournament/TournamentManager.js";

export class Interpreter {
    static interpretRequest(type, action, data) {

        console.log("Request:", type, action, data);
        switch (type) {
            case 'rooms':
                RoomManager.processRoomRequest(action, data);
                break;
            case 'game':
                GameProcessor.gameRequestAction(action, data);
                break
            case 'tournament':
                TournamentManager.requestTournamentAction(action, data);
                break;
        }
    }

    static interpretResponse(response) {

        const type = response.request;
        const action = response.action;
        const status = response.status;
        const message = response.message;
        const data = response.data;

        // if (window.location.pathname !== "/game") return;

        if (!this.invokeStatus(action, status, message)) return;

        this.invokeResponseAction(type, action, data);
    }

    static invokeStatus(action, status, message) {
        switch (status) {
            case 'success':
                action === "info" ? toast(message, 'bg-info') : null;
                return true;
            case 'fail':
                toast(message, 'bg-danger');
                return false;
        }
        return false;
    }

    static invokeResponseAction(type, action, data) {
        switch (type) {
            case 'rooms':
                RoomManager.roomAction(action, data);
                break;
            case 'game':
                GameProcessor.gameAction(action, data);
                break;
            case 'tournament':
                TournamentManager.tournamentAction(action, data);
                break;
        }
    }
}