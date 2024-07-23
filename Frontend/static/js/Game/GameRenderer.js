import { LeaveMatchMaker, DisplayMatchMakerScreen } from "./MatchMaker.js";
import { Interpreter } from "./Interpreter.js";

export const modes = {
    V_ONLINE: 0,
    V_ROOMS: 0,
    V_OFFLINE: 0,
}


function renderStart(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Starting", 10, 50);
}

function renderEnd(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 10, 50);
}

function renderLiveGame(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Live Game", 10, 50);
}

function renderMatchmaking(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Matchmaking", 10, 50);
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
        <button class="btn-retro d-flex align-items-center justify-content-center gap-2 bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 py-2" id="Versus" onclick="DisplayMatchMakerScreen('Online')">
            <img src="/static/img/game/Versus.png" width="24px" height="24px">
            Versus
        </button>
        <button class="btn-retro d-flex align-items-center justify-content-center gap-2 bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 py-2" id="Rooms" onclick="DisplayRoomOptions()">
            <img src="/static/img/game/Rooms.png" width="24px" height="24px">
            Rooms
        </button>
        <button class="btn-retro d-flex align-items-center justify-content-center gap-2 bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 py-2" id="Local" onclick="DisplayMatchMakerScreen('Local')">
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