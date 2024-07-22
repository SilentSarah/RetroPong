import { Interpreter } from './Interpreter.js';
export let GameConnector = null;
let interval = null;

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
    if (GameConnector == null)
    GameConnector = new GameConnection("ws://127.0.0.1:8003/ws/game/");
    GameConnector.socket.onopen = function(event) {

    }
    GameConnector.socket.onmessage = function(event) {
        const response = JSON.parse(event.data);
        console.log("response in GameConnection.js", response);
        Interpreter.interpretResponse(response);

    }
    GameConnector.socket.onclose = function(event) {
        console.log("Connection closed, Reconnecting...");
        interval = setInterval(() => {
            if (GameConnector != null) GameConnector.close();
            if (interval != null) clearInterval(interval);
        }, 1500);
    }
}