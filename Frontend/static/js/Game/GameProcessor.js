import { DisplayMatchMakerScreen, LeaveMatchMaker, clearChosenGameMode } from "./MatchMaker.js";
import { GameConnector } from "./GameConnection.js";
import { renderGame } from "./GameRenderer.js";

export class GameProcessor {
    static gameAction(action, data) {
        switch (action) {
            case 'update':
                this.updateGame(data);
                break;
            case 'start':
                this.startGame(data);
                break;
            case 'leave':
                this.leaveGame(data);
                break;
        }
    }

    static gameRequestAction(action, data) {
        const payload = {
            request: 'game',
            action: action,
            data: data
        }
        GameConnector.send(payload);
    }

    static startGame(data) {
        DisplayMatchMakerScreen("Online", data);
    }

    static leaveGame(data) {
        clearChosenGameMode();
        LeaveMatchMaker();
        renderGame();
    }
}