import { DisplayMatchMakerScreen, LeaveMatchMaker, clearChosenGameMode } from "./MatchMaker.js";
import { GameConnector } from "./GameConnection.js";
import { renderGame } from "./GameRenderer.js";
import { bPaddle, ball, GameStates } from "./GameEngine.js";
import { user_id } from "../userdata.js";

export let opponent_id = null;

export class GameProcessor {
    static gameAction(action, data) {
        switch (action) {
            case 'update_paddle':
                this.update_paddle_pos(data);
                break;
            case 'update_ball':
                this.update_ball_pos(data);
                break;
            case 'update_score':
                this.update_score(data);
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
        GameProcessor.setRoomOwnership(data);
        DisplayMatchMakerScreen("Online", data);
    }

    static leaveGame(data) {
        clearChosenGameMode();
        LeaveMatchMaker();
        renderGame();
    }

    static update_paddle_pos(data) {
        bPaddle.posY = data.posY;
        bPaddle.drawPosY = data.posY - bPaddle.pHeight / 2;
    }

    static update_score(data) {
        const my_score = data.self_score;
        const op_score = data.opponent_score;

        const my_score_html = document.getElementById('op_1_score');
        const op_score_html = document.getElementById('op_2_score');

        my_score_html.innerText = my_score;
        op_score_html.innerText = op_score;
        GameStates.in_progress = 0;
        GameStates.starting = 1;
    }

    static update_ball_pos(data) {
        data.posX = 1 - data.posX; // Inversion
        ball.posY = data.posY * ball.cHeight;
        ball.posX = data.posX * ball.cWidth;
        ball.drawPosY = ball.posY - ball.bHeight / 2;
        ball.drawPosX = ball.posX - ball.bWidth / 2;
    }

    static restoreGame(data) {
        GameProcessor.setRoomOwnership(data);
        DisplayMatchMakerScreen("Online", data);
    }

    static setRoomOwnership(data) {
        if (data.room_owner_id === user_id) {
            localStorage.setItem("host", "true");
            localStorage.removeItem("slave", "true");
        } else {
            localStorage.removeItem("host", "true");
            localStorage.setItem("slave", "true");
        }
        opponent_id = data.opponent_data.id;
    }
}