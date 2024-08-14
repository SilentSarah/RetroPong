
import { classic, modes } from "./GameRenderer.js";
import { rPaddle, bPaddle, RIGHT_SIDE, GameStates, game_sounds, gameSoundSettings, setGameBackdrop, resetGameResourcesAndData, timer_match } from "./GameEngine.js";
import { GameProcessor } from "./GameProcessor.js";
import { events } from "./GameEvents.js";
import { SPEED_BOOST } from "./SpecialAbilities.js";

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
        func: () => activate_special_ability(rPaddle, "railshot"),
    }, // i spec ability for the player 1

    "o": {
        tapped: false,
        func: () => activate_special_ability(rPaddle, "guard"),
    }, // o spec ability for the player 1

    "p": {
        tapped: false,
        func: () => activate_special_ability(rPaddle, "speedup"),
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
        func: () => activate_special_ability(bPaddle, "railshot"),
    }, // 1  spec abilities for the player 2

    "2": {
        tapped: false,
        func: () => activate_special_ability(bPaddle, "guard"),
    }, // 2  spec abilities for the player 2

    "3": {
        tapped: false,
        func: () => activate_special_ability(bPaddle, "speedup"),
    }, // 3  spec abilities for the player 2
    "Escape": {
        tapped: false,
        func: () => pauseMenu(),
    }, // Escape to pause the game
}

function exitGame() {
    const GameContainer = document.getElementById("game-container");
    const pause_menu_html = document.getElementById("pause-menu");
    if (pause_menu_html) pause_menu_html.remove();

    GameStates.finished = 1;
    GameContainer.innerHTML = `<p class="text-white text-center nokora display-5 fw-light">Game Over!</p>`;
    if (modes.V_OFFLINE) {
        GameStates.in_progress = 0;
        clearInterval(timer_match);
    } else if (modes.V_ONLINE) {
        GameStates.in_progress = 0;
        clearInterval(timer_match);
        GameProcessor.gameRequestAction('exit', {});
    }
    setTimeout(() => resetGameResourcesAndData(), 2500);
}

function exitMenu() {
    const pause_menu_html = document.getElementById("pause-menu");
    if (pause_menu_html) pause_menu_html.remove();
    if (modes.V_OFFLINE && !GameStates.in_progress) GameStates.in_progress = 1;
}

function DisplayGameOptions() {
    const game_options_html = document.getElementById("game-options");
    if (game_options_html) return ;

    const pause_menu = document.getElementById("pause-menu");
    const game_container = document.getElementById("game-utils");
    const game_options = document.createElement("div");
    game_options.classList.add("d-flex", "flex-column", "rounded-5", "border-transparent-0-5", "bg-black-transparent-0-05", "backdrop-filter-blur", "start-50", "top-50", "translate-middle", "position-absolute", "p-3");
    game_options.id = "game-options";
    game_options.style.width = "max-content";
    game_options.innerHTML = `
        <h2 class="text-white fw-bold nokora text-center">Settings</h2>
        <div class="d-flex flex-column justify-content-between align-items-center bg-white-transparent-0-05 py-3 px-2 border-transparent-0-5 w-100 rounded-5 gap-2 mb-3">
            <h3 class="text-white nokora fw-bold">Game Sounds</h3>
            <button class="sounds_btn text-shadow fw-bold text-white fs-4 ${game_sounds ? 'sound_on': 'sound_off'}" onclick="gameSoundSettings()">${game_sounds ? "ON":"OFF"}</button>
        </div>
        <div class="d-flex flex-column justify-content-between align-items-center bg-white-transparent-0-05 py-3 px-2 border-transparent-0-5 w-100 rounded-5 gap-2 mb-3">
            <h3 class="text-white nokora fw-bold">Backdrop</h3>
            <div class="d-flex gap-2 align-items-center px-2">
                <button class="backdrop_btn text-shadow fw-bold text-white fs-4" onclick="setGameBackdrop('Midnight')">Midnight</button>
                <button class="backdrop_btn text-shadow fw-bold text-white fs-4" onclick="setGameBackdrop('Sunrise')">Sunrise</button>
                <button class="backdrop_btn text-shadow fw-bold text-white fs-4" onclick="setGameBackdrop('Pastel')">Pastel</button>
            </div>
        </div>
        <button class="border-transparent-0-5 rounded-5 bg-black-transparent-0-05 p-2 text-white fw-bold fs-4" onclick="pauseMenu()">
            <img src="/static/img/game/Back.png" width="32px" height="32px">
        </button>`;
    game_container.appendChild(game_options);
    pause_menu.remove();
}

function pauseMenu() {
    const pause_menu_html = document.getElementById("pause-menu");
    if (pause_menu_html) return ;

    const game_options_html = document.getElementById("game-options");
    const game_container = document.getElementById("game-utils");
    const pause_menu = document.createElement("div");
    pause_menu.classList.add("d-flex", "flex-column", "justify-content-center", "border-transparent-1", "p-5", "start-50", "top-50", "translate-middle", "bg-black-transparent-0-75", "rounded-5", "position-absolute");
    pause_menu.id = "pause-menu";
    pause_menu.innerHTML = `
        <h3 class="text-center fs-1 mb-3 taprom text-pink-gradient">Pause Menu</h3>
        <div class="d-flex flex-column justidy-content-center align-items-center gap-3">
            <button id="resume" onclick="exitMenu()" class="text-white btn-retro d-flex align-items-center justify-content-start gap-2 ps-3 nokora bg-white-transparent-0-15 border-transparent-0-5">
                <img src="/static/img/game/resume.png" width="24px" height="24px">
                Resume
            </button>
            <button id="settings" onclick="DisplayGameOptions()" class="text-white btn-retro d-flex align-items-center justify-content-start gap-2 ps-3 nokora bg-white-transparent-0-15 border-transparent-0-5">
                <img src="/static/img/game/settingsgame.png" width="24px" height="24px">
                Settings
            </button>
            <button id="exit" onclick="exitGame()" class="text-white btn-retro d-flex align-items-center justify-content-start gap-2 ps-3 nokora bg-white-transparent-0-15 border-transparent-0-5">
                <img src="/static/img/game/leave.png" width="24px" height="24px">
                Exit
            </button>
        </div>
    `;
    game_container.appendChild(pause_menu);
    game_options_html ? game_options_html.remove(): null;
    if (modes.V_OFFLINE && GameStates.in_progress) GameStates.in_progress = 0;
}


function moveplayer(paddle, direction) {
    if (modes.V_OFFLINE == 0 && paddle.side == RIGHT_SIDE) return ;
    else if (GameStates.in_progress == 0) return ;
    else if (!modes.V_ONLINE) {
        const paddleMidPointY = paddle.posY;
        const paddleUpPointY = paddle.drawPosY;
        const paddleLowerPointY = paddleMidPointY + paddle.pHeight / 2;
        if (direction === UP) {
            if (paddleUpPointY - paddle.speed < 0) return ;
            if (paddle.special_abilities.check_special_ability("speedup")) {
                paddle.posY -= paddle.speed * SPEED_BOOST;
                paddle.drawPosY -= paddle.speed * SPEED_BOOST;
            } else {
                paddle.posY -= paddle.speed;
                paddle.drawPosY -= paddle.speed;
            }
        } else if (direction === DOWN) {
            if (paddleLowerPointY + paddle.speed > paddle.cHeight) return ;
            if (paddle.special_abilities.check_special_ability("speedup")) {
                paddle.posY += paddle.speed * SPEED_BOOST;
                paddle.drawPosY += paddle.speed * SPEED_BOOST;
            } else {
                paddle.posY += paddle.speed;
                paddle.drawPosY += paddle.speed;
            }
        }
    }
    events.paddle_move_up = direction === UP ? 1 : 0;
    events.paddle_move_down = direction === DOWN ? 1 : 0;
}

function activate_special_ability(paddle, ability) {
    if (modes.V_ONLINE) {
        GameProcessor.gameRequestAction('ability', ability);
    } else if (modes.V_OFFLINE) {
        paddle.special_abilities.activate_special_ability(ability, (paddle === rPaddle ? "left":"right"));
    }
}

function listentoGameKeysAndActivate(e) {
    if (['ArrowUp', 'ArrowDown', "1", "2", "3"].includes(e.key) && modes.V_OFFLINE === 0
    || ["1", "2", "3", "i", "o", "p"].includes(e.key) && modes.V_OFFLINE && classic === true) {
    return ;
    }
    if (controller[e.key]) {
        controller[e.key].tapped = true;
    }
}

function listentoGameKeysAndDeactivate(e) {
    if (['ArrowUp', 'ArrowDown', "1", "2", "3"].includes(e.key) && modes.V_OFFLINE === 0
    || ["1", "2", "3", "i", "o", "p"].includes(e.key) && modes.V_OFFLINE && classic === true) {
    return ;
    }
    if (controller[e.key]) {
        controller[e.key].tapped = false;
    }
}

export function loadGameKeyHandlers() {
    document.removeEventListener("keydown", listentoGameKeysAndActivate);
    document.removeEventListener("keyup", listentoGameKeysAndDeactivate);

    document.addEventListener("keydown", listentoGameKeysAndActivate);
    document.addEventListener("keyup", listentoGameKeysAndDeactivate);
}

export function activateButtonFunctions(paddle) {
    Object.keys(controller).forEach(key => {
        if (controller[key] === "Escape" && controller[key].tapped) return ;
        controller[key].tapped && controller[key].func(paddle);
    })
}

window.exitMenu = exitMenu;
window.DisplayGameOptions = DisplayGameOptions;
window.gameSoundSettings = gameSoundSettings;
window.setGameBackdrop = setGameBackdrop;
window.pauseMenu = pauseMenu;
window.exitGame = exitGame;