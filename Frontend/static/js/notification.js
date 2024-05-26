class notifications {
    constructor() {
        this.notifications = new WebSocket("ws://127.0.0.1:8001/ws/notifications/");
        this.notifications.onopen = function(event) {
            const Authorization = {'Authorization': `Bearer ${getCookie('access')}`}
            this.send(JSON.stringify(Authorization));
        }
        
        this.notifications.onmessage = function(event) {
            let data = JSON.parse(event.data);
            console.log(data);
        }
        
        this.notifications.onclose = function(event) {
            console.log("Connection closed");
        }
        
        this.notifications.onerror = function(event) {
            console.log("Error: " + event.data);
        }
        
    }
}
