const retropong_gradient = ["#172573", "#6A66D9", "#F080F2", "#FFFFFF"];
const sunrise_gradient = ["#ffa3ac", "#ffae97", "#ffba81", "#ffc56c", "#ffd156"];
const pastel_gradient = ["#cbffe6", "#afe9ff", "#bfb9ff", "#ffcfea", "#feffbe"];
const black_color = ["#000000"];
const gamepfppath = "/static/img/pfp";
const images = ["Default.png","DefaultBG.png","L7afouzli9.jpg","asekkak.jpeg","me.gif","test.jpeg"]

const colors = [retropong_gradient, sunrise_gradient, pastel_gradient, black_color];

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

function AnimateTheMatchMaking() {
    const versus = document.getElementById('versus');
    const opponentBackgrounds = document.querySelectorAll('.ops');
    const opponents = document.querySelectorAll('.opponent');
    const matchmaker_info = document.querySelectorAll(".mminfo");
    
    setTimeout(() => { opponentBackgrounds.forEach((opponent) => { opponent.classList.add("open"); console.log("change") }) }, 150);
    setTimeout(() => { matchmaker_info.forEach((info) => { info.classList.add("open"); }); }, 750);
    setTimeout(() => { opponents.forEach((opponent) => { opponent.classList.add("open", "glowbox"); }); }, 500);
    setTimeout(() => { versus.classList.add("open") }, 900);

}

function sanitizeHTMLCode(html) {
    html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return html;
}

function GenerateUserHTML(user, color) {
    const user_div = document.createElement('div');
    user_div.classList.add("d-flex", "flex-column", "align-items-center", "justify-content-center", "w-100", "h-100", color, "ops");
    user_div.innerHTML = `
    <img src="${sanitizeHTMLCode(user.pfp)}" width="162px" height="162px" class="opponent border-pink border-3 rounded-4 object-fit-cover transition-all">
    <h2 class="text-center nokora fw-bold text-white fs-3 py-3 transition-all opponent_name">${sanitizeHTMLCode(user.username)}</h2>`;
    return user_div;
}

function GenerateMatchInfoHTML(matchInfo) {
    const match_info = document.createElement('div');
    match_info.classList.add("d-flex", "flex-column", "align-items-center", "justify-content-between", "position-absolute", "h-100", "start-50", "top-50", "translate-middle", "z-ultimate");
    match_info.innerHTML = `
    <p class="mminfo nokora text-white fw-bold fs-4 bg-black-transparent-0-5 rounded-5 border-transparent-0-5 p-3 mt-4 transition-all">${sanitizeHTMLCode(matchInfo.type)}</p>
    <p id="versus" class="text-pink-gradient text-glow text-center taprom w-25 transition-all w-100" style="font-size: 96px;">VS</p>
    <p class="mminfo nokora text-white fw-bold fs-4 bg-black-transparent-0-5 rounded-5 border-transparent-0-5 p-3 transition-all">Round Starts in <span>3</span></p>`;
    return match_info;
}

function LeaveMatchMaker() {
    renderLobby();
}

function DisplayMatchMakerScreen() {
    const game_container = document.getElementById('game-container');
    const fake_player = { username: "Searching...", pfp: `${gamepfppath}/Default.png` };
    const div = document.createElement('div');

    div.classList.add("d-flex", "align-items-center", "h-100", "position-relative", "matchmaking_pattern", "overflow-y-hidden");
    div.innerHTML = `
    <button class="border-transparent-0-5 rounded-5 position-absolute z-1 bg-white-transparent-0-15 p-2" style="top: 1.75rem; left: 1.75rem;" onclick="LeaveMatchMaker()">
		<img src="/static/img/game/Back.png" width="32px" height="32px">
	</button>
    ${GenerateUserHTML(fake_player, "bg_gradpink").outerHTML}
    ${GenerateUserHTML(fake_player, "bg_gradblue").outerHTML}
    ${GenerateMatchInfoHTML({ type: "Versus Online" }).outerHTML}`;

    game_container.innerHTML = "";
    game_container.appendChild(div);
    AnimateTheMatchMaking();
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
    room_join_create.classList.add("join_game_btn", "rounded-5", "border-none");
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
				class="bg-white-transparent-0-15 border-transparent-0-5 rounded-5 position-absolute"
				style="top: 1.6rem; right: 5rem;"
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
        <button class="btn-retro d-flex align-items-center justify-content-center gap-2 bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 py-2" id="Versus" onclick="DisplayMatchTypes()">
            <img src="/static/img/game/Versus.png" width="24px" height="24px">
            Versus
        </button>
        <button class="btn-retro d-flex align-items-center justify-content-center gap-2 bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 py-2" id="Rooms" onclick="DisplayRoomOptions()">
            <img src="/static/img/game/Rooms.png" width="24px" height="24px">
            Rooms
        </button>
        <button class="btn-retro d-flex align-items-center justify-content-center gap-2 bg-white-transparent-0-15 border-transparent-0-5 text-white rounded-5 py-2" id="Local" onclick="DisplayMatchMakerScreen()">
            <img src="/static/img/game/Local.png" width="32px" height="32px">
            Local
        </button>`;
    }
    game_container.innerHTML = "";
    game_container.appendChild(game_logo);
    game_container.appendChild(div);
}

export function renderGame(state = "LOBBY") {
    const gameCanvas = document.getElementById('game');
    const ctx = gameCanvas.getContext('2d');
    const states = {
        "LOBBY": renderLobby,
        "MATCHMAKING": renderMatchmaking,
        "GAMESTART": renderStart,
        "GAME": renderLiveGame,
        "GAMEEND": renderEnd,
    }
    states[state](ctx, gameCanvas);
}

window.DisplayMatchTypes = DisplayMatchTypes;
window.renderLobby = renderLobby;
window.DisplayRoomOptions = DisplayRoomOptions;
window.LeaveMatchMaker = LeaveMatchMaker;
window.DisplayMatchMakerScreen = DisplayMatchMakerScreen;