import { Interpreter } from './Interpreter.js';
import { checkInvitations } from './RoomManager.js';
import { listTournamentMembers } from './TournamentManager.js';
export let GameConnector = null;
let interval = null;
export const TICK_RATE = 1 / 60;

class GameConnection {
    constructor(link) {
        this.link = link;
        this.socket = new WebSocket(link);
    }
    send(message) {
        Interpreter.request_data = message;
        this.socket.send(JSON.stringify(message));
    }
    close() {
        this.socket.close();
    }
}

export function initiateGameConnection() {
    if (GameConnector == null || GameConnector.socket.readyState != 2)
    if (!GameConnector || GameConnector.socket.readyState != 1)
        GameConnector = new GameConnection(`wss://${window.env.HOST_ADDRESS}:${window.env.GAME_PORT}/ws/game/`);
    GameConnector.socket.onopen = function(event) {
        checkInvitations();
        listTournamentMembers();
    }
    GameConnector.socket.onmessage = function(event) {
        // if (window.location.pathname !== "/game" && window.location.pathname !== "/tournament") {
        //     GameConnector.close();
        //     GameConnector = null;
        //     return;
        // }
        const response = JSON.parse(event.data);
        Interpreter.interpretResponse(response);

    }
    GameConnector.socket.onclose = function(event) {
        interval = setInterval(() => {
            if (GameConnector != null) GameConnector.close();
            if (interval != null) clearInterval(interval);
        }, 1500);
    }
}