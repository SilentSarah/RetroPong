import { LeaveMatchMaker, DisplayMatchMakerScreen } from "./MatchMaker.js";
import { Interpreter } from "./Interpreter.js";
import { GameProcessor } from "./GameProcessor.js";
import { RoomManager } from "./RoomManager.js";


export let classic;
export const modes = {
    V_ONLINE: 0,
    V_ROOMS: 0,
    V_OFFLINE: 0,
}

export function DisplayMatchSeekScreen(invite = false) {
    const game_utils = document.getElementById('game-utils');
    const GameContainer = document.getElementById('game-container');
    const div = document.createElement('div');
    div.id = "matchseek";
    div.classList.add("overlay", "d-flex", "flex-column", "justify-content-between", "w-100", "h-100", "fade_in");
    div.innerHTML = `
    <!-- <div class="ms-auto my-1 me-1 rounded-pill d-flex align-items-center justify-content-evenly gap-2 p-2 border-transparent-0-5 bg-black-transparent-0-05"
        style="height:65px; width:max-content;">
        <div class="bg-success rounded-circle" style="height: 20px; width: 20px;"></div>
        <p class="text-white fw-bold nokora fs-5 m-0 p-0">Users Connected</p>
        <span id="users-connected" class="text-white fw-bold nokora fs-5 m-0 p-0">1</span>
    </div> -->
    <h2 id="seekAnnounce" class="text-chrome text-glow line-height-1 backdrop-filter-brightness my-auto text-center taprom display-5">Looking for Players...</h2>
    <div class="d-flex justify-content-center gap-3">
        <button id="exit" onclick="exitMatchSeekScreen()" class="text-white
            p-2 mb-5 rounded-circle bg-white-transparent-0-15 border-transparent-0-5">
            <img src="/static/img/game/Back.png" width="32px" height="32px">
        </button>
    </div>`;
    modes.V_ONLINE = 1;
    GameContainer.innerHTML = "";
    game_utils.appendChild(div);
    if (!invite) RoomManager.requestRoomService("rooms", "rapid_join", {});
}

function exitMatchSeekScreen() {
    const matchseek = document.getElementById('matchseek');
    matchseek.remove();
    RoomManager.requestRoomService("rooms", "rapid_leave", {});
    renderLobby();
}


function DisplayRoomOptions() {
    const game_container = document.getElementById('game-container');
    const div = document.createElement('div');
    div.classList.add("d-flex", "flex-column", "align-items-center", "justify-content-center", "gap-3", "h-100")
    div.id = "roomoptions";
    div.innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center gap-3 h-100 w-100 p-5">
		<div class="w-100 h-100 mt-5 position-relative px-5">
			<button
				class="bg-white-transparent-0-15 border-transparent-0-5 rounded-5 position-absolute p-2"
				style="top: 1.3rem; right: 5rem;"
				onclick="renderLobby()">
                    <img src="/static/img/game/back.png" width="18px" height="18px">
                </button>
			<h1 class="text-white text-center py-2 taprom line-height-1 text-glow border-transparent-0-5">Available Rooms</h1>
			<div id="rooms-container" class="d-flex flex-column align-items-center border-transparent-0-5 overflow-y-auto gap-3 py-4 h-75 flex-fill">
			</div>
		</div>
	</div>`;
    game_container.innerHTML = "";
    game_container.appendChild(div);
    Interpreter.interpretRequest("rooms", "list", {});


}

function DisplayMatchTypes() {
    const game_container = document.getElementById('game-container');
    const div = document.createElement('div');
    {
        div.classList.add("d-flex", "flex-column", "align-items-center", "justify-content-center", "gap-3", "h-100")
        div.id = "matchtypes";
        div.innerHTML = `
        <button class="btn-retro d-flex align-items-center fw-bold justify-content-center gap-2 bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 py-2" id="1v1" onclick="">
            1v1
        </button>
        <button class="btn-retro d-flex align-items-center fw-bold justify-content-center gap-2 bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 py-2" id="2v2" onclick="">
            2v2
        </button>
        <button class="btn-retro d-flex align-items-center fw-bold justify-content-center gap-2 bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 py-2" id="2v2" onclick="renderLobby()">
            Back
        </button>`;
    }
    game_container.innerHTML = "";
    game_container.appendChild(div);
}

function LoadOfflineMode(mode) {
    if (mode === "Classic") classic = true; 
    else if (mode === "Rp") classic = false;
    DisplayMatchMakerScreen('Offline');
}

export function resetOfflineMode() {
    classic = undefined;
}

function renderOfflineModes() {
    const game_container = document.getElementById('game-container');
    const div = document.createElement('div');
    {
        div.classList.add("d-flex", "flex-column", "w-100", "h-100", "justify-content-center", "align-items-center", "gap-2");
        div.id = "offline-modes";
        div.innerHTML = `
        <button onclick="LoadOfflineMode('Classic')" class="btn-retro bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 p-2 nokora">Classic</button>
        <button onclick="LoadOfflineMode('Rp')" class="btn-retro bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 p-2 fs-4"><span class="text-pink-gradient taprom">Rp</span></button>
        <button onclick="renderLobby()" class="btn-retro bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 p-2 fs-4 nokora">
            <img src="/static/img/game/Back.png" width="28px" height="28px">
        </button>
        `;
    }
    game_container.innerHTML = "";
    game_container.appendChild(div);
}

function renderLobby() {
    const lobby = document.createElement('div');
    {
        lobby.classList.add("d-flex", "flex-column", "align-items-center", "justify-content-center", "gap-3", "h-100", "w-100");
    }
    const game_logo = document.createElement("h1");
    {
        game_logo.classList.add("text-center", "display-1", "taprom", "text-pink-gradient", "line-height-1", "text-glow");
        game_logo.style.fontSize = "96px";
        game_logo.id = "game-logo";
        game_logo.innerHTML = "RetroPong";
    }
    const game_container = document.getElementById('game-container');
    const div = document.createElement('div');
    {
        div.classList.add("d-flex", "align-items-center", "justify-content-center", "gap-3", 'z-1')
        div.id = "lobby";
        div.innerHTML = `
        <button class="btn-retro d-flex align-items-center justify-content-center gap-2 bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 py-2" id="Versus" onclick="DisplayMatchSeekScreen()">
            <img src="/static/img/game/Versus.png" width="24px" height="24px">
            Versus
        </button>
        <button class="btn-retro d-flex align-items-center justify-content-center gap-2 bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 py-2" id="Rooms" onclick="DisplayRoomOptions()">
            <img src="/static/img/game/Rooms.png" width="24px" height="24px">
            Rooms
        </button>
        <button class="btn-retro d-flex align-items-center justify-content-center gap-2 bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 py-2" id="Local" onclick="renderOfflineModes()">
            <img src="/static/img/game/Local.png" width="32px" height="32px">
            Local
        </button>`;
    }
    game_container.innerHTML = "";
    lobby.appendChild(game_logo);
    lobby.appendChild(div);
    game_container.appendChild(lobby);
}

export function renderGame() {
    renderLobby();
}

window.DisplayMatchTypes = DisplayMatchTypes;
window.renderLobby = renderLobby;
window.DisplayRoomOptions = DisplayRoomOptions;
window.LeaveMatchMaker = LeaveMatchMaker;
window.DisplayMatchMakerScreen = DisplayMatchMakerScreen;
window.DisplayMatchSeekScreen = DisplayMatchSeekScreen;
window.exitMatchSeekScreen  = exitMatchSeekScreen;
window.renderOfflineModes = renderOfflineModes;
window.LoadOfflineMode = LoadOfflineMode;