import { user_id } from "../userdata.js";
import { GameProcessor } from "./GameProcessor.js";
import { modes, renderGame } from "./GameRenderer.js";
import { activateButtonFunctions, loadGameKeyHandlers } from "./KeyController.js";
import { sanitizeHTMLCode } from "./MatchMaker.js";
import { OnGameChange } from "./GameEvents.js";
import { ballPhysics, generateRandomBallAngle, resetInGamePhysics } from "./GamePhysics.js";
import { SpecialAbilities } from "./SpecialAbilities.js";

export const RIGHT_SIDE = 0, LEFT_SIDE = 1, BALL = 2;
export let rPaddle, bPaddle, ball;
export const GameStates = {
    starting: 1,
    in_progress: 0,
    finished: 0,
}
const scores = [0, 0];
const maps = {
    "RetroPong": ["#282828", "#000000", "#000000", "#000000"],
    "Sunrise": ["#000000","#FFA3AC", "#FFBA81", "#FFD156", "#FFD178" , "#1B1B1B"],
    "Midnight": ["#000000"],
    "Pastel": ["#CBFFE6", "#BFB9FF", "#FFCFEA"],
}

export let timer_match = null
export let game_sounds = true;
export let selectedBg = "Midnight";
export const BALL_SPEED = 4;
export const BALL_SPPED_INCREASE = 1;
export const BALL_SPEED_LIMIT = 11;
export const PADDLE_SPEED = 7;
export let animReqID = null;

class Sounds {
    constructor() {
        this.ball_hit = new Audio("/static/audio/Game/BallCollision.wav");
        this.win_round = new Audio("/static/audio/Game/Cheer1.wav");
        this.lose_round = new Audio("/static/audio/Game/LosingPlayer.wav");
        this.win_game = new Audio("/static/audio/Game/EndGame.wav");

        this.ball_hit.volume = 1;
        this.win_round.volume = 0.25;
        this.lose_round.volume = 0.25;
        this.win_game.volume = 0.25;
    }
}

export let sounds = null;

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
        this.special_abilities = new SpecialAbilities();

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

export function setGameBackdrop(map) {
    selectedBg = map;
    localStorage.setItem("chosenMap", map);
}

export function gameSoundSettings() {
    const sounds_btn = document.querySelector(".sounds_btn");
    game_sounds ? game_sounds = false : game_sounds = true;
    game_sounds ? sounds_btn.innerHTML = "ON" : sounds_btn.innerHTML = "OFF";
    game_sounds ? (sounds_btn.classList.remove("sound_off"), sounds_btn.classList.add("sound_on")) : (sounds_btn.classList.remove("sound_on"), sounds_btn.classList.add("sound_off"));
    // localStorage.setItem("game_sounds", game_sounds);
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

export function playSound(sound) {
    if (!game_sounds) return ;  
    switch (sound) {
        case "ball_hit":
            const sound_1 = sounds.ball_hit.cloneNode();
            sound_1.autoplay = true;
            sound_1.volume = 0.75;
            sound_1.play();
            break;
        case "win_round":
            const sound_2 = sounds.win_round.cloneNode();
            sound_2.autoplay = true;
            sound_2.volume = 0.4;
            sound_2.play();
            break;
        case "lose_round":
            const sound_3 = sounds.lose_round.cloneNode();
            sound_3.autoplay = true;
            sound_3.volume = 0.4;
            sound_3.play();
            break;
        case "win_game":
            const sound_4 = sounds.win_game.cloneNode();
            sound_4.autoplay = true;
            sound_4.volume = 0.4;
            sound_4.play();
            break;
    }
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

export function clearGameDashboard() {
    const game_dashboards = document.querySelectorAll("#game-dashboard");
    const game = document.getElementById("game");
    game_dashboards.forEach((element) => { element.remove()});
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
            playSound("win_round");

        } else {
            scores[0] += 1;
            rPaddle.score += 1;
            op_1_score.innerText = `${rPaddle.score}`;
            GameContainer.innerHTML = `<p class="text-white text-center nokora display-5 fw-light">Red Paddle Scored!</p>`;
            playSound("win_round");
        }
        rPaddle.special_abilities.reset_all_special_abilities();
        bPaddle.special_abilities.reset_all_special_abilities();
        if (scores[0] >= 7 || scores[1] >= 7) {
            GameStates.finished = 0;
            GameStates.in_progress = 0;
            GameContainer.innerHTML = "";
            GameContainer.innerHTML = `<p class="text-white text-center nokora display-5 fw-light">Game Over!</p>`;
            playSound("win_game");
            setTimeout(() => {
                resetInGamePhysics(rPaddle, bPaddle, ball);
                scores.forEach((score, i) => scores[i] = 0);
                unloadGameElements();
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

export function resetGameResourcesAndData() {
    resetInGamePhysics(rPaddle, bPaddle, ball);
    scores.forEach((score, i) => scores[i] = 0);
    unloadGameElements();
    clearGameDashboard();
    renderGame();
}

export function clearCanvasScreen() {
    ball.ctx.fillStyle = "black";
    ball.ctx.fillRect(0, 0, ball.cWidth, ball.cHeight);
}

function loadGameDashboard(self, opponent) {

    clearGameDashboard();
    
    const game_utils = document.getElementById("game-utils");
    const game = document.getElementById("game");
    const div = document.createElement('div');
    div.classList.add("d-flex", "jsutify-content-evenly", "bg-black-transparent-0-5", "w-100", "h-20");
    div.id = "game-dashboard";
    const player1 = document.createElement('div');
    player1.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center", "h-100", "w-100", "px-4", "rounded-start-5");
    player1.innerHTML = `
        <h3 id="op_1" class="text-center fs-2 mb-3 taprom text-white line-height-1">${sanitizeHTMLCode(self.username)}</h3>
        <div id="player_1_sa" class="d-flex align-items-center justify-content-evenly bg-white-transparent-0-05 gap-4 rounded-pill border-transparent-0-5 p-3">
			<img id="railshot" class="border-transparent-0-5 rounded-5 shadow-lg p-1" src="/static/img/game/explosion.png" width="48px" height="48px">
			<img id="guard" class="border-transparent-0-5 rounded-5 shadow-lg p-1" src="/static/img/game/defence.png" width="48px" height="48px">
			<img id="speedup" class="border-transparent-0-5 rounded-5 shadow-lg p-1" src="/static/img/game/speedup.png" width="48px" height="48px">
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
        <div id="player_2_sa" class="d-flex align-items-center justify-content-evenly bg-white-transparent-0-05 gap-4 rounded-pill border-transparent-0-5 p-3">
            <img id="railshot2" class="border-transparent-0-5 rounded-5 shadow-lg p-1" src="/static/img/game/explosion.png" width="48px" height="48px">
            <img id="guard2" class="border-transparent-0-5 rounded-5 shadow-lg p-1" src="/static/img/game/defence.png" width="48px" height="48px">
            <img id="speedup2" class="border-transparent-0-5 rounded-5 shadow-lg p-1" src="/static/img/game/speedup.png" width="48px" height="48px">
        </div>`;

    div.appendChild(player1);
    div.appendChild(score);
    div.appendChild(player2);

    game_utils.appendChild(div);
    game.classList.add("h-80");
    game.classList.contains("border-transparent-0-5") ? null : game.classList.add("border-transparent-0-5");
}

export function DisplayMatchStartTimer(ready_state) {
    let timeObj = { time: 3 };

    GameStates.starting = 1;
    GameStates.in_progress = 0;
    const GameContainer = document.getElementById("game-container");
    const timer = timer_match = setInterval(() => {
        if (GameStates.finished) {
            clearInterval(timer);
            renderGame();
            return ;
        }
        GameContainer.innerHTML = "";
        const p = document.createElement('p');
        const text_color = (localStorage.getItem("chosenMap") ?? selectedBg) === "Midnight" ? "text-white" : "text-black";
        p.classList.add(text_color, "fs-1", "taprom", "w-100", "h-100", "d-flex", "justify-content-center", "align-items-center", "mb-5");
        p.innerText = `Match Starting in ${timeObj.time}`;
        GameContainer.appendChild(p);
        if (timeObj.time <= 0) {
            clearInterval(timer);
            GameStates.starting = 0;
            GameStates.in_progress = 1;
            GameContainer.innerHTML = "";
            if (modes.V_OFFLINE) generateRandomBallAngle();
            if (modes.V_ONLINE && ready_state) {
                console.log("Sending Ready Game Request");
                GameProcessor.gameRequestAction('ready_game', {});
            }
        }
        timeObj.time -= 1;
    }, 1000);
}


export function unloadGameElements() {
    rPaddle = null;
    bPaddle = null;
    ball = null;
    sounds = null;
    console.log("Game Elements Unloaded", rPaddle, bPaddle, ball, sounds);
}

export function loadGameEngine(gameMode, self, opponent) {
    const gameCanvas =  document.getElementById("game");
    const ctx = gameCanvas.getContext('2d');
    const dpi = window.devicePixelRatio;
    const [width, height] = fix_dpi(gameCanvas, dpi);

    const drawGame = () => {
        if (!rPaddle || !bPaddle || !ball) return ;
        generateGradient(ctx, width, height, selectedBg);
        if (GameStates.starting) {
    
        } else if (GameStates.in_progress) {
            if (modes.V_OFFLINE == 1) {
                ballPhysics(ball, rPaddle, bPaddle);
            }
            activateButtonFunctions(gameMode);
            drawGameElements(rPaddle, bPaddle, ball);
        } else if (GameStates.finished) {
            clearCanvasScreen();
            window.cancelAnimationFrame(animReqID);
        }
        animReqID = window.requestAnimationFrame(drawGame);
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
            DisplayMatchStartTimer(true);
            OnGameChange();
            console.log("Engine has loaded");
        }
    }
    
    sounds = new Sounds();
    ball = new Ball(gameCanvas, ctx, "/static/img/game/Ball.svg", width, height, loader);
    rPaddle = new Paddle(gameCanvas, ctx, "/static/img/game/RedPaddle.svg", width, height, LEFT_SIDE, loader);
    bPaddle = new Paddle(gameCanvas, ctx, "/static/img/game/BluePaddle.svg", width, height, RIGHT_SIDE, loader);
}
