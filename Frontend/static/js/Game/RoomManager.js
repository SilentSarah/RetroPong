
import { GameConnector } from './GameConnection.js';

export class RoomManager {

    static processRoomRequest(action, data) {
        switch (action) {
            case 'list':
                this.requestRoomList('rooms', action, data);
                break;
            case 'create':
                this.CreateRoom('rooms', action, data);
                break;
            case 'join':
                this.joinRoom(data);
                break;
        }
    }

    static roomAction(action, data) {
        console.log("New action from response:");
        console.log(action);
        console.log(data);
        switch (action) {
            case 'list':
            case 'create':
                this.listRooms(data);
                break;
            case 'join':
                this.joinRoom(data);
                break;
        }
    }

    static requestRoomList(type, action, data) {
        const payload = {
            "request": type,
            "action": action,
            "data": data
        }
        GameConnector.send(payload);
    }

    static listRooms(data) {
        console.log("listing rooms with data:", data);
        const rooms_container = document.getElementById('rooms-container');
        rooms_container.innerHTML = '';
        data.forEach(room => {
            rooms_container.appendChild(this.CreateRoomHTML(room));
        });
        rooms_container.appendChild(this.CreateRoomHTML("Solo", `None`, `${0}/2`, true));
    }

    static CreateRoomHTML(room_data, create = false) {
        console.log("Creating room with data:", room_data);
        let chosen_function = create ? CreateRoomWrapper : JoinRoomWrapper;
        const room = document.createElement('div');
        const room_id = !create ? room_data.id : 'NONE';
        const player_count = !create ? room_data.playerCount : 0;
        room.classList.add("room", "border-transparent-0-5", "gap-3", "px-2");
        room.id = create ? "room-creation" : `room-id-${room_id}`;
        room.innerHTML = `
        <div class="room_tile border-transparent-0-5">
            <!-- Type -->
            <div class="d-flex align-items-center gap-1">
                <img src="/static/img/game/Mode.png" width="32px" height="32px">
                <span class="text-white fs-5 fw-bold">${"Versus Online"}</span>
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
        room_join_create.onclick = chosen_function;
        room.children[2].appendChild(room_join_create);
        return room;
    }

    static JoinRoom(data) {
        console.log(data);
    }

    static CreateRoom(type, action, data) {
        const payload = {
            "request": type,
            "action": action,
            "data": data
        }
        console.log("Create Room called with payload:");
        console.log(payload);
        GameConnector.send(payload);
    }
}

function CreateRoomWrapper() {
    console.log("Create Room wrapper called");
    RoomManager.CreateRoom('rooms', 'create', {});
}

function JoinRoomWrapper() {
    RoomManager.JoinRoom();
}