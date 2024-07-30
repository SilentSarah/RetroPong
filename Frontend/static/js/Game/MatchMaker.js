import { modes } from "./GameRenderer.js";
import { loadGameEngine } from "./GameEngine.js";
import { Interpreter } from "./Interpreter.js";
import { GameProcessor } from "./GameProcessor.js";

const gamepfppath = "/static/img/pfp";
const matchmaker_details = {

}
let matchmaker_timerID = null;

function runGameMode(type, self, opponent) {
    const game_container = document.getElementById('game-container');
    game_container.innerHTML = "";
    if (type === "Local") {
        modes.V_OFFLINE = 1;
        loadGameEngine(null, self, opponent);
    } else if (type === "Online") {
        modes.V_ONLINE = 1;
        loadGameEngine(null, self, opponent);
    } else if (type === "Rooms") {
        modes.V_ROOMS = 1;
        loadGameEngine(null, self, opponent);
    }
}

function startMatchTimer(timerObj, type, self, opponent) { 
    const match_start_timer = document.getElementById('match-start-timer');
    const timer_panel = document.getElementById('timer-panel');

    match_start_timer.innerText = --timerObj.timer;
    console.log(timerObj.timer);
    if (timerObj.timer <= 0) {
        timer_panel.innerText = "Starting...";
        clearInterval(matchmaker_timerID);
        matchmaker_timerID = null;
        if (modes.V_OFFLINE === 1) runGameMode(type, self, opponent);
        else if (modes.V_ONLINE === 1) GameProcessor.gameRequestAction("ready", {});
    }
}

function AnimateTheMatchMaking(type, self, opponent) {
    let timerObj = {timer: 4};
    const versus = document.getElementById('versus');
    const opponentBackgrounds = document.querySelectorAll('.ops');
    const opponents = document.querySelectorAll('.opponent');
    const matchmaker_info = document.querySelectorAll(".mminfo");
    
    setTimeout(() => { opponentBackgrounds.forEach((opponent) => { opponent.classList.add("open"); console.log("change") }) }, 150);
    setTimeout(() => { matchmaker_info.forEach((info) => { info.classList.add("open"); }); }, 900);
    setTimeout(() => { opponents.forEach((opponent) => { opponent.classList.add("open"); }); }, 750);
    setTimeout(() => { versus.classList.add("open") }, 1000);
    matchmaker_timerID === null ? matchmaker_timerID = setInterval(() => {startMatchTimer(timerObj, type, self, opponent);}, 1000) : clearInterval(matchmaker_timerID);
}

export function sanitizeHTMLCode(html) {
    html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return html;
}

function GenerateUserHTML(user, color, type) {
    console.log("GameMode:", type);
    if (type === "Local") user = { username: "Player", pfp: `${gamepfppath}/Default.png` }
    const user_div = document.createElement('div');
    user_div.classList.add("d-flex", "flex-column", "align-items-center", "justify-content-center", "w-100", "h-100", color, "ops");
    user_div.innerHTML = `
    <div class="transition-all opponent">
        <img src="${sanitizeHTMLCode(user.pfp)}" width="162px" height="162px" class="border-pink border-3 rounded-4 object-fit-cover glowbox">
        <h2 class="text-center nokora fw-bold text-white fs-3 py-3 transition-all opponent_name">${sanitizeHTMLCode(user.username)}</h2>
    </div>`;
    
    return user_div;
}

function GenerateMatchInfoHTML(matchInfo) {
    const match_info = document.createElement('div');
    match_info.classList.add("d-flex", "flex-column", "align-items-center", "justify-content-between", "position-absolute", "h-100", "start-50", "top-50", "translate-middle", "z-ultimate");
    match_info.innerHTML = `
    <p class="mminfo nokora text-white fw-bold fs-4 bg-black-transparent-0-5 rounded-5 border-transparent-0-5 p-3 mt-4 transition-all">${sanitizeHTMLCode(matchInfo.type)}</p>
    <p id="versus" class="text-pink-gradient text-glow text-center taprom w-25 transition-all w-100" style="font-size: 96px;">VS</p>
    <p id="timer-panel" class="mminfo nokora text-white fw-bold fs-4 bg-black-transparent-0-5 rounded-5 border-transparent-0-5 p-3 transition-all">Round Starts in <span id="match-start-timer">3</span></p>`;
    return match_info;
}

export function LeaveMatchMaker() {
    matchmaker_timerID !== null ? (clearInterval(matchmaker_timerID), matchmaker_timerID = null) : null;
    if (modes.V_ONLINE === 1) Interpreter.interpretRequest("game", "leave", {});
    clearChosenGameMode();
    renderLobby();
}

function SetTheGameMode(type) {
    const selection_modes = ["Local", "Rooms", "Online"];
    selection_modes.forEach((mode, index) => {
        if (mode === type) {
            clearChosenGameMode();
            modes[`V_${mode.toUpperCase()}`] = 1;
            console.log(modes);
        }
    });
}

export function clearChosenGameMode() {
    Object.keys(modes).forEach((key) => modes[key] = 0);
}


export function DisplayMatchMakerScreen(type, data = null, restore = false) {
    let self_player;
    let opponent_player;
    const div = document.createElement('div');
    const game_container = document.getElementById('game-container');

    if (data !== null) {
        self_player = { username: data.self_data.username, pfp: data.self_data.profilepic, score: data.self_score };
        opponent_player = { username: data.opponent_data.username, pfp: data.opponent_data.profilepic, score: data.opponent_score };
    } else {
        self_player = { username: "Player", pfp: `${gamepfppath}/Default.png` };
        opponent_player = { username: "Opponent", pfp: `${gamepfppath}/Default.png` };
    }

    div.classList.add("d-flex", "align-items-center", "h-100", "position-relative", "matchmaking_pattern", "overflow-y-hidden");
    div.innerHTML = `
    <button class="border-transparent-0-5 rounded-5 position-absolute z-1 bg-white-transparent-0-15 p-2" style="top: 1.75rem; left: 1.75rem;" onclick="LeaveMatchMaker()">
		<img src="/static/img/game/Back.png" width="32px" height="32px">
	</button>
    ${GenerateUserHTML(self_player, "bg_gradpink", type).outerHTML}
    ${GenerateUserHTML(opponent_player, "bg_gradblue", type).outerHTML}
    ${GenerateMatchInfoHTML({ type: `Versus ${type}` }).outerHTML}`;

    SetTheGameMode(type);
    game_container.innerHTML = "";
    game_container.appendChild(div);
    AnimateTheMatchMaking(type, self_player, opponent_player);
}