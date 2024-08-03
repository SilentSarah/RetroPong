
import { GameConnector } from './GameConnection.js';
import { toast, user_id } from '../userdata.js';

let room_states = null;
let opponent = null;
export class RoomManager {

    static processRoomRequest(action, data) {
        switch (action) {
            case 'list':
            case 'create':
            case 'leave':
            case 'join':
                this.requestRoomService('rooms', action, data);
                break;
            case 'matchseek':
                this.update_player_count(data);
                break;
        }
    }
    static roomAction(action, data) {
        switch (action) {
            case 'list':
            case 'create':
                this.listRooms(data);
                break;
            case 'update':
                this.updateRooms(data);
                break;
            case 'rapid_leave':
                this.updatePlayerCount(data);
                break;
            case 'rapid_join':
                this.hideMatchSeekScreen();
                break;
        }
        unfreezeAllRoomActions();
    }

    static hideMatchSeekScreen() {
        console.log("Match Found! Joining...");
        const matchseek = document.getElementById('matchseek');
        if (!matchseek) return ;

        const matchseekAnn = document.getElementById('seekAnnounce');
        matchseekAnn.innerText = "Match Found! Joining...";
        setTimeout(() => {
            matchseek.remove();
        }, 1000);
    }


    static updatePlayerCount(data) {
        console.log("Updating Player Count", data.online_players);
        const users_connected = document.getElementById('users-connected');
        if (!users_connected) return;

        users_connected.innerText = data.online_players;
    }

    static listRooms(data) {
        const rooms_container = document.getElementById('rooms-container');
        rooms_container.innerHTML = '';
        const room_creation = this.CreateRoomHTML({}, true);
        rooms_container.appendChild(room_creation);
        data.forEach(room => {
            const room_html = this.CreateRoomHTML(room);
            rooms_container.appendChild(room_html);
            setTimeout(() => {
                room_html.classList.remove("opacity-0");
            }, 250);
        });
        setTimeout(() => room_creation.classList.remove("opacity-0"), 500);

        room_states = data;
    }

    static CreateRoomHTML(room_data, create = false) {
        const room = document.createElement('div');
        const room_id = !create ? room_data.id : 'NONE';
        const player_count = !create ? room_data.playerCount : 0;
        const owner = parseInt(room_data.owner);
        room.classList.add("room", "border-transparent-0-5", "gap-3", "px-2", "transition-all", "opacity-0");
        room.id = create ? "room-creation" : `room-id-${room_id}`;
        !create ? room.setAttribute('room-owner-id', owner): null;
        !create ? room.setAttribute('room-id', room_id): null;
        create ? room.setAttribute('Creator', true): null
        room.innerHTML = `<div class="room_tile border-transparent-0-5">
                                <!-- Type -->
                                <div class="d-flex align-items-center gap-1">
                                    <img src="/static/img/game/Mode.png" width="32px" height="32px">
                                    <span class="text-white fs-5 fw-bold">${"Versus Online"}</span>
                                </div>
                                <!-- Player Count -->
                                <div class="d-flex align-items-center gap-1">
                                    <img src="/static/img/game/people.png" width="32px" height="32px">
                                    <span id="pCount" class="text-white fs-5 fw-bold">${player_count}</span>
                                </div>
                            </div>
                            <div class="line"></div>
                            <div class="room_tile border-transparent-0-5">
                                <!-- RoomID -->
                                <div class="d-flex align-items-center gap-1">
                                    <img src="/static/img/game/RoomID.png" width="32px" height="32px">
                                    <span class="text-white fw-bold" style="font-size: 0.8rem;">${room_id}</span>
                                </div>
                            </div>`;
        const room_join_create = document.createElement('button');
        let chosen_function = create ? CreateRoomWrapper : (owner == user_id ? LeaveRoomWrapper : JoinRoomWrapper.bind(null, room_id));
        const button_text = create ? "Create" : (owner == user_id ? "Leave" : "Acess");
        room_join_create.classList.add("rounded-5", "border-transparent-0-5", "bg-white-transparent-0-05", "px-3");
        room_join_create.innerHTML = `<img src="/static/img/game/${button_text}.png" width='22px' height='22px'>`;
        room_join_create.onclick = chosen_function;
        room.children[2].appendChild(room_join_create);

        return room;
    }

    static updateRooms(data) {
        if (!data) return;
        this.update_rooms_state(data);
    }

    static requestRoomService(type, action, data, room_id = null) {
        const payload = {
            "request": type,
            "action": action,
            "data": data
        }
        if (room_id != null) payload["room_id"] = room_id
        GameConnector.send(payload);
    }

    static update_rooms_state(data) {
        for (const room_data of data) {
            const existing_room = room_states.find(room => room.id == room_data.id);
            if (existing_room != undefined) {
                const room_HTML = document.getElementById(`room-id-${room_data.id}`);
                if (room_HTML != null) {
                    room_HTML.querySelector("#pCount").innerText = room_data.playerCount;
                    const button = room_HTML.querySelector("button");
                    if (room_data.players.includes(user_id)) {
                        button.onclick = LeaveRoomWrapper;
                        button.innerHTML = `<img src="/static/img/game/Leave.png" width='22px' height='22px'>`;
                    } else {
                        button.onclick = JoinRoomWrapper.bind(null, room_data.id);
                        button.innerHTML = `<img src="/static/img/game/Acess.png" width='22px' height='22px'>`;
                    }
                }
            } else {
                const room_HTML = this.CreateRoomHTML(room_data);
                const rooms_container = document.getElementById('rooms-container');
                rooms_container.appendChild(room_HTML);
                setTimeout(() => {
                    room_HTML.classList.remove("opacity-0");
                }, 250);
            }
        }
        for (const room of room_states) {
            const found_room = data.find(r => r.id == room.id);
            if (found_room == undefined) {
                const room_HTML = document.getElementById(`room-id-${room.id}`);
                if (room_HTML != null) {
                    room_HTML.classList.add("opacity-0");
                    setTimeout(() => {
                        room_HTML.remove();
                    }, 250);
                }
            }
        }
        room_states = data;
    }
}

function CreateRoomWrapper() {
    toast("Creating Room...", 'bg-info');
    freezeAllRoomActions();
    RoomManager.requestRoomService('rooms', 'create', {});
}

function JoinRoomWrapper(room_id) {
    toast("Joining Room...", 'bg-info');
    freezeAllRoomActions();
    RoomManager.requestRoomService('rooms', 'join', {}, room_id);
}

function LeaveRoomWrapper() {
    toast("Leaving Room...", 'bg-info');
    freezeAllRoomActions();
    RoomManager.requestRoomService('rooms', 'leave', {});
}

function freezeAllRoomActions() {
    const rooms_container = document.getElementById('rooms-container');
    for (const room of rooms_container.children) {
        const room_btn = room.querySelector('button');
        room_btn.disabled = true;
        room_btn.classList.add("opacity-50");
    }
}

function unfreezeAllRoomActions() {
    const rooms_container = document.getElementById('rooms-container');
    for (const room of rooms_container.children) {
        const room_btn = room.querySelector('button');
        room_btn.disabled = false;
        room_btn.classList.remove("opacity-50");
    }
}