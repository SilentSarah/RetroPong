import { DisplayMatchMakerScreen, LeaveMatchMaker, clearChosenGameMode } from "./MatchMaker.js";
import { GameConnector } from "./GameConnection.js";
import { renderGame } from "./GameRenderer.js";
import { bPaddle, rPaddle } from "./GameEngine.js";

export class GameProcessor {
    static gameAction(action, data) {
        switch (action) {
            case 'update_paddle':
                this.update_paddle_pos(data);
                break;
            case 'start':
                this.startGame(data);
                break;
            case 'leave':
                this.leaveGame(data);
                break;
            case 'restore':
                this.restoreGame(data);
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

    static update_paddle_pos(data) {
        console.log("Red Paddle PosX", rPaddle.posX, " Blue Paddle PosX", bPaddle.posX);
        bPaddle.posY = data.posY;
        bPaddle.drawPosY = data.posY - bPaddle.height / 2;
    }
    static restoreGame(data) {
        console.log("Restoring Game");
        DisplayMatchMakerScreen("Online", data);
    }
}