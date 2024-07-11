class GameConnection {
    constructor(link) {
        this.link = link;
        this.socket = new WebSocket(link);
        this.socket.onopen = function(event) {
            console.log("Connection established");
        }
        this.socket.onmessage = function(event) {
            console.log(event.data);
        }
        this.socket.onclose = function(event) {
            console.log("Connection closed");
        }
    }

    send(message) {
        this.socket.send(JSON.stringify(message));
    }

    close() {
        this.socket.close();
    }
}

function initiateGameConnection() {
}