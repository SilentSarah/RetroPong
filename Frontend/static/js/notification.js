const img_paths = {
    'MESSAGE': '/static/img/general/Chat.png',
    'ACCOUNT': '/static/img/general/Account.png',
    'GAME': '/static/img/general/Game.png',
    'FRIEND': '/static/img/general/Chat.png',
}

class notifications {
    constructor() {
        this.notifications = new WebSocket("ws://127.0.0.1:8001/ws/notifications/");
        this.notifications.onopen = function(event) {
            const Authorization = {'Authorization': `Bearer ${getCookie('access')}`}
            this.send(JSON.stringify(Authorization));
        }
        this.notifications.onmessage = function(event) {
            let delay = 0;
            let data = JSON.parse(event.data);
            if (data['Notifications'] == undefined)
                return;
            const notifications_container = document.getElementById('notifications_container');
            if (notifications_container.children[0].classList.contains('spinner-border')) {
                notifications_container.children[0].remove();
            }
            for (const [key, value] of Object.entries(data['Notifications'])) {
                let notification = document.createElement('div');
                const each_notification = value;
                console.log(each_notification);
                const notification_Data = {
                    id: each_notification.id,
                    type: each_notification.type,
                    content: each_notification.content,
                    date: each_notification.date,
                    reciever: each_notification.reciever,
                    sender: each_notification.sender,
                    sender_username: each_notification.sender_username,
                    sender_pfp: each_notification.sender_pfp == undefined ? "/static/img/general/Account.png" : each_notification.sender_pfp,
                }
                if (each_notification == undefined)
                continue;
                setTimeout(() => {
                    notifications_container.appendChild(notification);
                    notification.outerHTML = `
                    <div id="notification_content" class="d-flex flex-column justify-content-between rounded-3 bg-white-transparent-0-15 p-2 m-0 fade_in" style="width:280px; height:100px;">
                        <div id="noti_header" class="d-flex align-items-center gap-1 opacity-75">
                            <img src="${img_paths[notification_Data.type]}" width="20px">
                            <p class="text-white nokora fw-bold m-0" style="font-size: 15px;">${notification_Data.type}</p>
                            <p class="ms-auto m-0 nokora fw-light text-white" style="font-size: 12px;">${notification_Data.date}</p>
                        </div>
                        <div id="noti_body" class="d-flex align-items-center justify-content-start gap-2">
                            <img src="${notification_Data.sender_pfp}" width="40px" height="40px" class="object-fit-cover border-pink rounded-3">
                            <p class="text-white m-0 fw-light text-turncate" style="font-size: 0.85rem;">
                                <span class="nokora text-pink text-turncate">${notification_Data.sender_username}</span>
                                ${notification_Data.content}
                            </p>
                            <button class="border-pink goto ms-auto" back-link="${notification.type}" notification_id="${notification_Data.id}">
                                <img src="/static/img/general/shortcut.png" width="25px" height="25px">
                            </button>
                        </div>
                    </div>`;
                }, delay); 
                delay += 250;
            }   
            
        }
        
        this.notifications.onclose = function(event) {
            console.log("Connection closed");
        }
        
        this.notifications.onerror = function(event) {
            console.log("Error: " + event.data);
        }
        
    }
}

const notification = new notifications();