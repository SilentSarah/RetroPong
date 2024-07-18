
import { modes } from "./GameRenderer.js";
import { rPaddle, bPaddle, RIGHT_SIDE, GameStates } from "./GameEngine.js";

const UP = 1, DOWN = 2;

const controller = {
    "w": {
        tapped: false,
        func: () => moveplayer(rPaddle, UP),
    }, // w up for the player 1

    "s": {
        tapped: false,
        func: () => moveplayer(rPaddle, DOWN),
    }, // s down for the player 1

    "i": {
        tapped: false,
        func: () => func(),
    }, // i spec ability for the player 1

    "o": {
        tapped: false,
        func: () => func(),
    }, // o spec ability for the player 1

    "p": {
        tapped: false,
        func: () => func(),
    }, // p spec ability for the player 1

    "ArrowUp": {
        tapped: false,
        func: () => moveplayer(bPaddle, UP),
    }, // up movement keys for player 2

    "ArrowDown": {
        tapped: false,
        func: () => moveplayer(bPaddle, DOWN),
    }, // down movement keys for player 2

    "1": {
        tapped: false,
        func: () => func(),
    }, // 1  spec abilities for the player 2

    "2": {
        tapped: false,
        func: () => func(),
    }, // 2  spec abilities for the player 2

    "3": {
        tapped: false,
        func: () => func(),
    }, // 3  spec abilities for the player 2
    "Escape": {
        tapped: false,
        func: () => func(),
    }, // Escape to pause the game
}

function pauseMenu() {}


function moveplayer(paddle, direction) {
    if (modes.V_OFFLINE == 0 && paddle.side == RIGHT_SIDE) return ;
    if (GameStates.in_progress == 0) return ;
    const paddleMidPointY = paddle.posY;
    const paddleUpPointY = paddle.drawPosY;
    const paddleLowerPointY = paddleMidPointY + paddle.pHeight / 2;
    if (direction === UP) {
        if (paddleUpPointY - paddle.speed < 0) return ;
        paddle.posY -= paddle.speed;
        paddle.drawPosY -= paddle.speed;
    } else if (direction === DOWN) {
        if (paddleLowerPointY + paddle.speed > paddle.cHeight) return ;
        paddle.posY += paddle.speed;
        paddle.drawPosY += paddle.speed;
    }
}

export function loadGameKeyHandlers() {
    document.addEventListener("keydown", function(e) {
        console.log(e.key)
        if (controller[e.key]) controller[e.key].tapped = true;
    });
    document.addEventListener("keyup", function(e) {
        if (controller[e.key]) controller[e.key].tapped = false;
    });
}

export function activateButtonFunctions(paddle) {
    Object.keys(controller).forEach(key => {
        if (controller[key] === "Escape" && controller[key].tapped) return ;
        controller[key].tapped && controller[key].func(paddle)
    })
}