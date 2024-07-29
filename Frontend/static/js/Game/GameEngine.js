import { user_id } from "../userdata.js";
import { GameProcessor } from "./GameProcessor.js";
import { modes, renderGame } from "./GameRenderer.js";
import { activateButtonFunctions, loadGameKeyHandlers } from "./KeyController.js";
import { sanitizeHTMLCode } from "./MatchMaker.js";
import { opponent_data } from "./GameProcessor.js";
import { OnGameChange } from "./GameEvents.js";
import { ballPhysics, generateRandomBallAngle } from "./GamePhysics.js";

export const RIGHT_SIDE = 0, LEFT_SIDE = 1, BALL = 2;
export let rPaddle, bPaddle, ball;
export const GameStates = {
    starting: 1,
    in_progress: 0,
    finished: 0,
}
const scores = [0, 0];
const maps = {
    "RetroPong": ["#172573", "#6A66D9", "#F080F2", "#000000"],
    "Sunrise": ["#FFA3AC", "#FFBA81", "#FFD156"],
    "Midnight": ["#000000"],
    "Pastel": ["#CBFFE6", "#BFB9FF", "#FFCFEA"],
}

export const BALL_SPEED = 6;
export const BALL_SPPED_INCREASE = 1;
export const BALL_SPEED_LIMIT = 20;
export const PADDLE_SPEED = 17;

class Paddle {
    constructor(canvasHTML, context, imagePath, cWidth, cHeight, side = LEFT_SIDE, loader) {
        this.canvas = canvasHTML;
        this.ctx = context;
        this.image = new Image();
        this.cWidth = cWidth;
        this.cHeight = cHeight;
        this.pHeight = cHeight * 0.150;
        this.pWidth = cWidth * 0.030;
        this.push_value = 50;
        this.image.src = imagePath;
        this.drawPosY = (this.cHeight / 2) - (this.pHeight / 2);
        this.drawPosX = side === LEFT_SIDE ? this.push_value : this.cWidth - (this.push_value + this.pWidth);
        this.posY = this.drawPosY + this.pHeight / 2;
        this.posX = side === LEFT_SIDE ? this.push_value : this.cWidth - (this.push_value + (this.pWidth / 2));
        this.type = side;
        this.speed = PADDLE_SPEED;
        this.angle = (Math.PI / 2);
        this.score = 0;

        this.image.onload = () => { 
            loader(this);
        }
    }
    draw() {
        this.ctx.drawImage(this.image, this.drawPosX, this.drawPosY, this.pWidth, this.pHeight);
    }
}

class Ball {
    constructor(canvasHTML, context, imagePath, cWidth, cHeight, loader) {
        this.canvas = canvasHTML;
        this.ctx = context;
        this.image = new Image();
        this.image.src = imagePath;
        this.cHeight = cHeight;
        this.cWidth = cWidth;
        this.bHeight = 0.03 * this.cHeight;
        this.bWidth = 0.0165 * this.cWidth;
        this.posX = (this.cWidth / 2);
        this.posY = (this.cHeight / 2);
        this.drawPosX = this.posX - (this.bWidth / 2);
        this.drawPosY = this.posY - (this.bHeight / 2);
        this.xspeed = BALL_SPEED;
        this.yspeed = BALL_SPEED;
        this.type = BALL;

        this.image.onload = () => {
            loader(this);
        }
    }

    draw() {
        this.ctx.drawImage(this.image, this.drawPosX, this.drawPosY, this.bWidth, this.bHeight);
    }
}


function fix_dpi(canvas, dpi) {
    let style = {
        height() {
            return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
        },
        width() {
            return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
        }
    }
    canvas.setAttribute('width', style.width() * dpi);
    canvas.setAttribute('height', style.height() * dpi);
    const width = style.width() * dpi;
    const height = style.height() * dpi;
    return [width, height];
}

function drawGameElements(rPaddle, bPaddle, ball) {
    rPaddle.draw();
    bPaddle.draw();
    ball.draw();
}

function generateGradient(ctx, width, height, chosenMap) {
    const gradient = ctx.createLinearGradient(width / 2, 0, width / 2, height);
    const savedColor = localStorage.getItem("chosenMap");
    if (savedColor) chosenMap = savedColor;
    const colorPack = Object.values(maps[chosenMap]);
    colorPack.forEach((color, index) => {
        gradient.addColorStop(index / colorPack.length, color);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function clearGameDashboard() {
    const game_utils = document.getElementById("game-utils");
    const game = document.getElementById("game");
    game_utils.children[1].remove();
    game.classList.remove("h-80");
}

export function processLocalScore(ball_x_pos) {
    if (modes.V_OFFLINE == 1) {
        const op_1_score = document.getElementById("op_1_score");
        const op_2_score = document.getElementById("op_2_score");
        const GameContainer = document.getElementById("game-container");
        if (ball_x_pos <= 0) {
            scores[1] += 1;
            bPaddle.score += 1;
            op_2_score.innerText = `${bPaddle.score}`;
            GameContainer.innerHTML = `<p class="text-white text-center nokora display-5 fw-light">Blue Paddle Scored!</p>`;

        } else {
            scores[0] += 1;
            rPaddle.score += 1;
            op_1_score.innerText = `${rPaddle.score}`;
            GameContainer.innerHTML = `<p class="text-white text-center nokora display-5 fw-light">Red Paddle Scored!</p>`;
        }
        if (scores[0] >= 3 || scores[1] >= 3) {
            GameStates.finished = 0;
            GameStates.in_progress = 0;
            GameContainer.innerHTML = "";
            GameContainer.innerHTML = `<p class="text-white text-center nokora display-5 fw-light">Game Over!</p>`;
            setTimeout(() => {
                clearGameDashboard();
                renderGame();
            }, 2500);
        } else {
            GameStates.starting = 1;
            GameStates.in_progress = 0;
            setTimeout(() => {
                GameContainer.innerText = "";
                DisplayMatchStartTimer();
            }, 1500);
        }
    }
}

function invokeStartMatchTimer(ctx, matchTimer, width, height) {
    const time = 3;
    if (!matchTimer.startdate)
        matchTimer.startdate = Date.now();

    const elapsed = time - parseInt((Date.now() - matchTimer.startdate) / 1000);
    const string = `Round Starting in ${elapsed}`;
    const correctW = (width / 2) - ((string.length * 64) / 5.2);
    ctx.fillStyle = "white";
    ctx.font = "64px Taprom";
    ctx.fillText(`Round Starting in ${elapsed}`, correctW, height * 0.51);
    if (elapsed <= 0) {
        GameStates.starting = 0;
        GameStates.in_progress = 1;
        matchTimer.startdate = null;
        generateRandomBallAngle();
    }
}

function loadGameDashboard(self, opponent) {
    const game_utils = document.getElementById("game-utils");
    const game = document.getElementById("game");

    const div = document.createElement('div');
    div.classList.add("d-flex", "jsutify-content-evenly", "bg-black-transparent-0-5", "w-100", "h-20");
    const player1 = document.createElement('div');
    player1.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center", "h-100", "w-100", "px-4", "rounded-start-5");
    player1.innerHTML = `
        <h3 id="op_1" class="text-center fs-2 mb-3 taprom text-white line-height-1">${sanitizeHTMLCode(self.username)}</h3>
        <div class="d-flex align-items-center justify-content-evenly bg-white-transparent-0-05 gap-4 rounded-pill border-transparent-0-5 p-3">
			<img class="border-transparent-0-5 rounded-5 shadow-lg p-1" src="/static/img/game/explosion.png" width="48px" height="48px">
			<img class="border-transparent-0-5 rounded-5 shadow-lg p-1" src="/static/img/game/defence.png" width="48px" height="48px">
			<img class="border-transparent-0-5 rounded-5 shadow-lg p-1" src="/static/img/game/speedup.png" width="48px" height="48px">
		</div>`;
    
    const score = document.createElement('div');
    score.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center", "w-100");
    score.id = "score-panel";
    score.innerHTML = `
        <h3 class="text-center fs-1 mb-3 taprom text-chrome text-glow">Score</h3>
        <h3 id="lives" class="text-center fs-1 mb-3 taprom text-chrome text-glow w-100">
            <span id="op_1_score">${self.score}</span>
            -
            <span id="op_2_score">${opponent.score}</span>
        </h3>`;
    
    const player2 = document.createElement('div');
    player2.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center", "h-100", "w-100", "px-4", "rounded-start-5");
    player2.innerHTML = `
        <h3 id="op_2" class="text-center fs-2 mb-3 taprom text-white line-height-1">${sanitizeHTMLCode(opponent.username)}</h3>
        <div class="d-flex align-items-center justify-content-evenly bg-white-transparent-0-05 gap-4 rounded-pill border-transparent-0-5 p-3">
            <img class="border-transparent-0-5 rounded-5 shadow-lg p-1" src="/static/img/game/explosion.png" width="48px" height="48px">
            <img class="border-transparent-0-5 rounded-5 shadow-lg p-1" src="/static/img/game/defence.png" width="48px" height="48px">
            <img class="border-transparent-0-5 rounded-5 shadow-lg p-1" src="/static/img/game/speedup.png" width="48px" height="48px">
        </div>`;

    div.appendChild(player1);
    div.appendChild(score);
    div.appendChild(player2);

    game_utils.appendChild(div);
    game.classList.add("h-80");
    game.classList.contains("border-transparent-0-5") ? null : game.classList.add("border-transparent-0-5");
}

export function DisplayMatchStartTimer() {
    let timeObj = { time: 3 };

    GameStates.starting = 1;
    GameStates.in_progress = 0;
    const GameContainer = document.getElementById("game-container");
    const timer = setInterval(() => {
        GameContainer.innerHTML = "";
        const p = document.createElement('p');
        p.classList.add("text-white", "fs-1", "taprom", "text-pink-gradient", "w-100", "h-100", "d-flex", "justify-content-center", "align-items-center", "mb-5");
        p.innerText = `Match Starting in ${timeObj.time}`;
        GameContainer.appendChild(p);
        if (timeObj.time <= 0) {
            clearInterval(timer);
            GameStates.starting = 0;
            GameStates.in_progress = 1;
            GameContainer.innerHTML = "";
            generateRandomBallAngle();
        }
        timeObj.time -= 1;
    }, 1000);
}

function checkGameVisibility() {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === "hidden") {
            GameProcessor.gameRequestAction("inactive", { user_id: user_id });
        } else {
        }
    });
}

export function loadGameEngine(gameMode, self, opponent) {
    const gameCanvas =  document.getElementById("game");
    const ctx = gameCanvas.getContext('2d');
    const dpi = window.devicePixelRatio;
    const [width, height] = fix_dpi(gameCanvas, dpi);

    const drawGame = () => {
        if (!rPaddle || !bPaddle || !ball) return ;
        generateGradient(ctx, width, height, "Midnight");
        if (GameStates.starting) {
    
        } else if (GameStates.in_progress) {
            if (modes.V_OFFLINE == 1) {
                ballPhysics(ball, rPaddle, bPaddle);
            }
            activateButtonFunctions(gameMode);
            drawGameElements(rPaddle, bPaddle, ball);
        } else if (GameStates.finished) {
            
        }
        window.requestAnimationFrame(drawGame);
    }

    const loader = (element) => {
        if (element.type === LEFT_SIDE)
            rPaddle = element;
        else if (element.type === RIGHT_SIDE)
            bPaddle = element;
        else if (element.type === BALL) {
            ball = element;
        }
        if (rPaddle && bPaddle && ball) {
            loadGameKeyHandlers();
            loadGameDashboard(self, opponent);
            drawGame();
            DisplayMatchStartTimer();
            OnGameChange();
        }
    }
    

    new Ball(gameCanvas, ctx, "/static/img/game/Ball.svg", width, height, loader);
    new Paddle(gameCanvas, ctx, "/static/img/game/RedPaddle.svg", width, height, LEFT_SIDE, loader);
    new Paddle(gameCanvas, ctx, "/static/img/game/BluePaddle.svg", width, height, RIGHT_SIDE, loader);

    // const gameUpdater = setInterval(
    // () => { 
    //     if (GameStates.in_progress)
    //         // sendGameData(rPaddle, gameUpdater);
    //     else if (GameStates.finished) 
    //         clearInterval(gameUpdater) 
    // }, 5);
    // let updater = setInterval(() => { sendGameData(rPaddle, updater); requestBallPosUpdate(width, height) }, 5);
    // checkGameVisibility();
    // grabPlayerData(width, height);
}

// function sendGameData(rPaddle, updater) {
//     if (!GameStates.in_progress) return;
//     if (modes.V_OFFLINE == 1) {
//         updater ? clearInterval(updater) : null;
//         return ;
//     }
//     // const ball_data = {
//     //     posX: ball.posX / ball.cWidth,
//     //     posY: ball.posY / ball.cHeight
//     // }
//     GameProcessor.gameRequestAction("update_paddle", { paddle: rPaddle });
//     // GameProcessor.gameRequestAction("update_ball", ball_data);
// }

function requestBallPosUpdate(width, height) {
    if (modes.V_OFFLINE == 1) return ;
    const ball_data = {
        screenW: width,
        screenH: height,
    }
    GameProcessor.gameRequestAction("update_ball", ball_data);
}

function grabPlayerData(width, height) {
        const screen_data = {
            screenW: width,
            screenH: height,
            paddleH: rPaddle.pHeight,
            paddleW: rPaddle.pWidth,
            paddleX: rPaddle.PosX,
            paddleY: rPaddle.posY,
        }
        GameProcessor.gameRequestAction('register_data', screen_data);
}

// function upload_ball_data(ball) {
//     const ball_data = {
//         posX: ball.posX,
//         posY: ball.posY,
//     }
//     GameProcessor.gameRequestAction("update_ball", ball_data);
// }