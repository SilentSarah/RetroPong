import { DisplayMatchMakerScreen, LeaveMatchMaker, clearChosenGameMode } from "./MatchMaker.js";
import { GameConnector } from "./GameConnection.js";
import { renderGame } from "./GameRenderer.js";
import { bPaddle, ball, GameStates, DisplayMatchStartTimer, rPaddle, loadGameEngine } from "./GameEngine.js";
import { user_id } from "../userdata.js";
import { modes } from "./GameRenderer.js";

export let opponent_data = null;

export class GameProcessor {
    static gameAction(action, data) {
        switch (action) {
            case 'update':
                this.upadateGameElementPositions(data);
                break;
            case 'update_paddle':
                this.update_paddle_pos(data);
                break;
            case 'score':
                this.update_score(data);
                break ;
            case 'start':
                this.startGame(data);
                break;
            case 'ready':
                console.log("Game is ready");
                this.startIgEngine(data);
                break
            case 'leave':
                this.leaveGame(data);
                break;
            case 'restore':
                this.restoreGame(data);
        }
    }

    static gameRequestAction(action, data) {
        if (!modes.V_ONLINE) return ;
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

    static startIgEngine(data) {
        const self_data = {
            username: data.self_data.username,
            pfp: data.self_data.profilepic,
            score: data.self_score
        }

        const opponent_data = {
            username: data.opponent_data.username,
            pfp: data.opponent_data.profilepic,
            score: data.opponent_score
        }
        loadGameEngine(null, self_data, opponent_data);
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
        const my_score = data.score.self_score;
        const op_score = data.score.opponent_score;

        const my_score_html = document.getElementById('op_1_score');
        const op_score_html = document.getElementById('op_2_score');

        my_score_html.innerText = my_score;
        op_score_html.innerText = op_score;
        this.displayScorer(data);
        setTimeout(() => DisplayMatchStartTimer(true), 1500);
    }

    static update_ball_pos(data) {
        data.posX = 1 - data.posX; // Inversion
        ball.posY = data.posY * ball.cHeight;
        ball.posX = data.posX * ball.cWidth;
        ball.drawPosY = ball.posY - ball.bHeight / 2;
        ball.drawPosX = ball.posX - ball.bWidth / 2;
    }

    static upadateGameElementPositions(data) {
        if (data.paddle_data) {
            rPaddle.posY = data.paddle_data.y * rPaddle.cHeight;
            rPaddle.drawPosY = rPaddle.posY - rPaddle.pHeight / 2;
            rPaddle.posX = data.paddle_data.x * rPaddle.cWidth;
            rPaddle.drawPosX = rPaddle.posX - rPaddle.pWidth / 2;
            rPaddle.pHeight = data.paddle_data.height * rPaddle.cHeight;
            rPaddle.pWidth = data.paddle_data.width * rPaddle.cWidth;
        }
        if (data.ball_data) {
            ball.posX = data.ball_data.x * ball.cWidth;
            ball.posY = data.ball_data.y * ball.cHeight;
            ball.drawPosX = ball.posX - ball.bWidth / 2;
            ball.drawPosY = ball.posY - ball.bHeight / 2;
        }
        if (data.opponent_paddle_data) {
            bPaddle.posY = data.opponent_paddle_data.y * bPaddle.cHeight;
            bPaddle.drawPosY = bPaddle.posY - bPaddle.pHeight / 2;
            bPaddle.posX = data.opponent_paddle_data.x * bPaddle.cWidth;
            bPaddle.drawPosX = bPaddle.posX - bPaddle.pWidth / 2;
            bPaddle.pHeight = data.opponent_paddle_data.height * bPaddle.cHeight;
            bPaddle.pWidth = data.opponent_paddle_data.width * bPaddle.cWidth;
        }
    }

    static restoreGame(data) {
        GameProcessor.setRoomOwnership(data);
        DisplayMatchMakerScreen("Online", data);
    }

    static setRoomOwnership(data) {
        // if (data.room_owner_id === user_id) {
        //     localStorage.setItem("host", "true");
        //     localStorage.removeItem("slave", "true");
        // } else {
        //     localStorage.removeItem("host", "true");
        //     localStorage.setItem("slave", "true");
        // }
        opponent_data = data.opponent_data;
    }

    static displayScorer(data) {
        const scorer_data = {
            scorer_username: data.score.scorer_id === user_id ? sessionStorage.getItem("username") : opponent_data.username,
            pfp: data.score.scorer_id === user_id ? sessionStorage.getItem("profilepic") : opponent_data.profilepic
        }
        const game_container = document.getElementById('game-container');
        game_container.innerHTML = "";
        const scorer_div = document.createElement('div');
        scorer_div.classList.add("d-flex", "flex-column", "align-items-center", "justify-content-evenly", "gap-3", "border-pink", "rounded-4", "bg-white-transparent-0-15", "glowbox", "p-4", "position-absolute", "start-50", "top-50", "translate-middle");
        scorer_div.innerHTML = `
            <img class="border-pink rounded-4 object-fit-cover" src="${scorer_data.pfp}" width="128px" height="128px">
            <p class="text-white text-center nokora display-5 fw-light">${scorer_data.scorer_username} Scored!</p>`;
        game_container.appendChild(scorer_div);
    }
}

// I NEED TO WORK ON SENDING READY STATE BACK TO THE SERVER SO IT CAN RESUME THE ROUND