import { activateButtonFunctions, loadGameKeyHandlers } from "./KeyController.js";

export const RIGHT_SIDE = 0, LEFT_SIDE = 1, BALL = 2;
export let rPaddle, bPaddle, ball;
export const GameStates = {
    starting: 1,
    in_progress: 0,
    finished: 0,
}

const BALL_SPEED = 17;
const BALL_SPEED_LIMIT = 25;
const PADDLE_SPEED = 20;

class Paddle {
    constructor(canvasHTML, context, imagePath, cWidth, cHeight, side = LEFT_SIDE, loader) {
        this.canvas = canvasHTML;
        this.ctx = context;
        this.image = new Image();
        this.cWidth = cWidth;
        this.cHeight = cHeight;
        this.pHeight = cHeight * 0.115;
        this.pWidth = cWidth * 0.035;
        this.push_value = 50;
        this.image.src = imagePath;
        this.drawPosY = (this.cHeight / 2) - (this.pHeight / 2);
        this.drawPosX = side === LEFT_SIDE ? this.push_value : this.cWidth - (this.push_value + this.pWidth);
        this.posY = this.drawPosY + this.pHeight / 2;
        this.posX = side === LEFT_SIDE ? this.push_value : this.cWidth - (this.push_value + (this.pWidth / 2));
        this.type = side;
        this.speed = PADDLE_SPEED;
        this.angle = (Math.PI / 2)

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
        this.bHeight = cHeight * 0.0345;
        this.bWidth = cWidth * 0.0225;
        this.posX = (this.cWidth / 2);
        this.posY = (this.cHeight / 2);
        this.drawPosX = this.posX - (this.bWidth / 2);
        this.drawPosY = this.posY - (this.bHeight / 2);
        this.xspeed = BALL_SPEED;
        this.yspeed = BALL_SPEED;
        this.type = BALL;

        this.image.onload = () => {
            console.log("LOADING")
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

function resetInGamePhysics(rPaddle, bPaddle, ball) {
    GameStates.in_progress = 0;
    GameStates.starting = 1;
    ball.drawPosX = ball.cWidth / 2;
    ball.drawPosY = ball.cHeight / 2;
    ball.posX = ball.cWidth / 2;
    ball.posY = ball.cHeight / 2;

    rPaddle.drawPosY = (rPaddle.cHeight / 2) - (rPaddle.pHeight / 2);
    rPaddle.drawPosX = rPaddle.push_value;
    rPaddle.posY = rPaddle.drawPosY + rPaddle.pHeight / 2;
    rPaddle.posX = rPaddle.push_value;

    bPaddle.drawPosY = (bPaddle.cHeight / 2) - (bPaddle.pHeight / 2);
    bPaddle.drawPosX = bPaddle.cWidth - (bPaddle.push_value + bPaddle.pWidth);
    bPaddle.posY = bPaddle.drawPosY + bPaddle.pHeight / 2;
    bPaddle.posX = bPaddle.cWidth - (bPaddle.push_value + (bPaddle.pWidth / 2));

    ball.xspeed = BALL_SPEED;
    ball.yspeed = BALL_SPEED;
}

function collisionDetection(ball, rPaddle_hb, bPaddle_hb, ball_hb) {
    if (ball_hb.x < rPaddle_hb.x + rPaddle_hb.width &&
        ball_hb.x + (ball_hb.width / 2) > rPaddle_hb.x &&
        ball_hb.y < rPaddle_hb.y + rPaddle_hb.height &&
        ball_hb.y + ball_hb.height > rPaddle_hb.y) {
        ball.posX = rPaddle_hb.x + rPaddle_hb.width;
        ball.drawPosX = rPaddle_hb.x + rPaddle_hb.width;
        ball.xspeed = ~ball.xspeed; + 1;
        ball.xspeed > 0 ? ball.xspeed += 1 : ball.xspeed -= 1;
        ball.yspeed > 0 ? ball.yspeed += 1 : ball.yspeed -= 1;
        ball.xspeed = Math.min(ball.xspeed, BALL_SPEED_LIMIT);
        ball.yspeed = Math.min(ball.yspeed, BALL_SPEED_LIMIT);
    }

    if (ball_hb.x < bPaddle_hb.x + bPaddle_hb.width &&
        ball_hb.x + ball_hb.width > bPaddle_hb.x &&
        ball_hb.y < bPaddle_hb.y + bPaddle_hb.height &&
        ball_hb.y + ball_hb.height > bPaddle_hb.y) {
        ball.posX = bPaddle_hb.x - ball.bWidth;
        ball.drawPosX = bPaddle_hb.x - ball.bWidth;
        ball.xspeed = ~ball.xspeed + 1;
        ball.xspeed > 0 ? ball.xspeed += 1 : ball.xspeed -= 1;
        ball.yspeed > 0 ? ball.yspeed += 1 : ball.yspeed -= 1;
        ball.xspeed = Math.min(ball.xspeed, BALL_SPEED_LIMIT);
        ball.yspeed = Math.min(ball.yspeed, BALL_SPEED_LIMIT);
    }
}

function ballPhysics(ball, rPaddle, bPaddle) {

    const rPaddle_hb = {
        x: rPaddle.drawPosX,
        y: rPaddle.drawPosY,
        width: rPaddle.pWidth,
        height: rPaddle.pHeight,
    }

    const bPaddle_hb = {
        x: bPaddle.drawPosX,
        y: bPaddle.drawPosY,
        width: bPaddle.pWidth,
        height: bPaddle.pHeight,
    }

    const ball_hb = {
        x: ball.drawPosX,
        y: ball.drawPosY,
        width: ball.bWidth,
        height: ball.bHeight,
    }

    if (ball_hb.x <= 0 || ball_hb.x + ball_hb.width >= ball.cWidth) {
        resetInGamePhysics(rPaddle, bPaddle, ball);
    }
    if (ball_hb.y <= 0 || ball_hb.y + ball_hb.height >= ball.cHeight) {
        ball.yspeed = ~ball.yspeed + 1;
    }

    collisionDetection(ball, rPaddle_hb, bPaddle_hb, ball_hb);

    ball.posX += ball.xspeed;
    ball.posY += ball.yspeed;
    ball.drawPosX += ball.xspeed;
    ball.drawPosY += ball.yspeed;

    console.log(ball.xspeed, ball.yspeed);
}

function generateRandomBallAngle() {
    ball.angle = Math.random() * Math.PI * 2;
}

function invokeStartMatchTimer(ctx, matchTimer, width, height) {
    const time = 3;
    if (!matchTimer.startdate)
        matchTimer.startdate = Date.now();

    const elapsed = time - parseInt((Date.now() - matchTimer.startdate) / 1000);
    const string = `Round Starting in ${elapsed}`;
    const correctW = (width / 2) - ((string.length * 64) / 5);
    ctx.fillStyle = "white";
    ctx.font = "64px Taprom";
    console.log(width, height);
    ctx.fillText(`Round Starting in ${elapsed}`, correctW, height * 0.51);
    if (elapsed <= 0) {
        GameStates.starting = 0;
        GameStates.in_progress = 1;
        matchTimer.startdate = null;
        generateRandomBallAngle();
    }
}

export function loadGameEngine(gameMode) {
    const gameCanvas =  document.getElementById("game");
    const ctx = gameCanvas.getContext('2d');
    const dpi = window.devicePixelRatio;
    const [width, height] = fix_dpi(gameCanvas, dpi);
    let matchTimer = {startdate: null};
    
    const drawGame = () => {
        if (!rPaddle || !bPaddle || !ball) return ;
        ctx.clearRect(0, 0, width, height);
        if (GameStates.starting) {
            invokeStartMatchTimer(ctx, matchTimer, width, height, ball);
        } else if (GameStates.in_progress) {
            activateButtonFunctions(gameMode);
            ballPhysics(ball, rPaddle, bPaddle);
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
            loadGameKeyHandlers()
            drawGame();
        }
    }

    new Ball(gameCanvas, ctx, "/static/img/game/Ball.svg", width, height, loader);
    new Paddle(gameCanvas, ctx, "/static/img/game/RedPaddle.svg", width, height, LEFT_SIDE, loader);
    new Paddle(gameCanvas, ctx, "/static/img/game/BluePaddle.svg", width, height, RIGHT_SIDE, loader);

}