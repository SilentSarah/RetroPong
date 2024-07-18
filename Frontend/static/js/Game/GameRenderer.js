import { LeaveMatchMaker, DisplayMatchMakerScreen } from "./MatchMaker.js";
import { loadGameEngine } from "./GameEngine.js";

export const modes = {
    V_ONLINE: 0,
    V_ROOMS: 0,
    V_OFFLINE: 1,
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

function CreateRoom() {
    console.log("Create Room");
}

function JoinRoom() {
    console.log("Join Room");
}

function CreateRoomHTML(room_mode = "Duo", room_id = "None", player_count = "-", create = false) {
    const room = document.createElement('div');
    room.classList.add("room", "border-transparent-0-5", "gap-3", "px-2");
    room.id = create ? "room-creation" : `room-id-${room_id}`;
    room.innerHTML = `
	<div class="room_tile border-transparent-0-5">
		<!-- Type -->
		<div class="d-flex align-items-center gap-1">
			<img src="/static/img/game/Mode.png" width="32px" height="32px">
			<span class="text-white fs-5 fw-bold">${room_mode}</span>
		</div>
		<!-- Player Count -->
		<div class="d-flex align-items-center gap-1">
			<img src="/static/img/game/people.png" width="32px" height="32px">
			<span class="text-white fs-5 fw-bold">${player_count}</span>
		</div>
	</div>
	<div class="line"></div>
	<div class="room_tile border-transparent-0-5">
		<!-- RoomID -->
		<div class="d-flex align-items-center gap-1">
			<img src="/static/img/game/RoomID.png" width="32px" height="32px">
			<span class="text-white fs-5 fw-bold">${room_id}</span>
		</div>
	</div>`;

    const room_join_create = document.createElement('button');
    room_join_create.classList.add("rounded-5", "border-transparent-0-5", "bg-white-transparent-0-05", "px-3");
    room_join_create.innerHTML = `<img src="/static/img/game/${create ? "Join" : "Acess"}.png" width="22px" height="22px">`;
    room_join_create.onclick = create ? CreateRoom : JoinRoom;

    room.children[2].appendChild(room_join_create);
    return room;
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
    div.querySelector("#rooms-container").appendChild(CreateRoomHTML("Duo", `None`, `${0}/2`, true));
    game_container.innerHTML = "";
    game_container.appendChild(div);


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

export function renderGame(state = "LOBBY") {
    const gameCanvas = document.getElementById('game');
    const ctx = gameCanvas.getContext('2d');
    const states = {
        "LOBBY": renderLobby,
        "MATCHMAKING": renderMatchmaking,
        "GAME": loadGameEngine,
    }
    // DisplayRoomOptions();
    states[state](ctx, gameCanvas);
    // loadGameEngine("Local");
}

window.DisplayMatchTypes = DisplayMatchTypes;
window.renderLobby = renderLobby;
window.DisplayRoomOptions = DisplayRoomOptions;
window.LeaveMatchMaker = LeaveMatchMaker;
window.DisplayMatchMakerScreen = DisplayMatchMakerScreen;