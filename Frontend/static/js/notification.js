let delay = 0;
const img_paths = {
    'MESSAGE': '/static/img/general/Chat.png',
    'ACCOUNT': '/static/img/general/Account.png',
    'GAME': '/static/img/general/Game.png',
    'FRIEND': '/static/img/general/Chat.png',
}

const notifications_array = []

function convertDateFormat(dateStr) {
    let [date, time] = dateStr.split(' ');
    date = date.split('/').reverse().join('/');
    return new Date(`${date} ${time}`);
}

function scaleMessageDateSent(date) {
    const date_sent = new Date(convertDateFormat(date));
    const current_date = new Date();
    if (current_date.getFullYear() > date_sent.getFullYear())
        return `${current_date.getFullYear() - date_sent.getFullYear()} years ago`;
    if (current_date.getMonth() > date_sent.getMonth())
        return `${current_date.getMonth() - date_sent.getMonth()} ${current_date.getMonth() - date_sent.getMonth() > 1 ? "years":"year"} ago`;
    if (current_date.getDate() > date_sent.getDate())
        return `${current_date.getDate() - date_sent.getDate()} ${current_date.getDate() - date_sent.getDate() > 1 ? "days":"day"} ago`;
    if (current_date.getHours() > date_sent.getHours())
        return `${current_date.getHours() - date_sent.getHours()} ${current_date.getHours() - date_sent.getHours() > 1 ? "hours":"hour"} ago`;
    if (current_date.getMinutes() > date_sent.getMinutes())
        return `${current_date.getMinutes() - date_sent.getMinutes()} ${current_date.getMinutes() - date_sent.getMinutes() > 1 ? "minutes":"minute"} ago`;
    return `Just now`;

}

function controlNotificationFlow(data, notifications_container) {
    if (data['Notifications'] == undefined)
        return 1;
    if (notifications_container.children[0].classList.contains('spinner-border')) {
        notifications_container.children[0].remove();
    }
    if (Object.keys(data['Notifications']).length == 0) {
        notifications_container.innerHTML = `<p class="text-secondary text-center nokora fw-light my-auto fade_in">No Notifications</p>`;
        return 1;
    }
}

function constructNotificationData(each_notification) {
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
    return notification_Data;
}

function constructNotification(each_notification) {
    const notification_Data = constructNotificationData(each_notification);
    let notification = document.createElement('div');
    setTimeout(() => {
        notifications_container.appendChild(notification);
        notification.outerHTML = `
        <div id="notification_content" back-link="${notification_Data.type}" notification_id="${notification_Data.id}" class="d-flex flex-column justify-content-between rounded-3 bg-white-transparent-0-15 p-2 m-0 fade_in" style="width:280px; height:100px;">
            <div id="noti_header" class="d-flex align-items-center gap-1 opacity-75">
                <img src="${img_paths[notification_Data.type]}" width="20px">
                <p class="text-white nokora fw-bold m-0" style="font-size: 15px;">${notification_Data.type}</p>
                <p class="ms-auto m-0 nokora fw-light text-white" style="font-size: 12px;">${scaleMessageDateSent(notification_Data.date)}</p>
            </div>
            <div id="noti_body" class="d-flex align-items-center justify-content-start gap-2">
                <img src="${notification_Data.sender_pfp}" width="40px" height="40px" class="object-fit-cover border-pink rounded-3">
                <p class="text-white m-0 fw-light text-turncate" style="font-size: 0.85rem;">
                    <span class="nokora text-pink text-turncate">${notification_Data.sender_username}</span>
                    ${notification_Data.content}
                </p>
                <button class="border-pink goto ms-auto" onclick="invokeActivity(${notification_Data.id})">
                    <img src="/static/img/general/shortcut.png" width="25px" height="25px">
                </button>
            </div>
        </div>`;
    }, delay); 
    delay += 250;
    notifications_array.push(notification);
}

function invokeAction(notification_data, selected_notification) {
    const anchor = document.createElement('a');
    switch (notification_data.type) {
        case 'MESSAGE':
        case 'FRIEND':
            anchor.href = '/chat';
            localStorage.setItem('sender_id', notification_data.sender);
            selected_notification.appendChild(anchor);
            scanLinks();
            anchor.click();
            anchor.remove();
            break;
        case 'ACCOUNT':
            //  TO BE IMPLEMENTED
            break;
        case 'GAME':
            anchor.href = '/game';
            localStorage.setItem('sender_id', notification_data.sender);
            break;
    }
}

function invokeActivity(notificationID) {
    const notification = JSON.parse(localStorage.getItem(notificationID));
    const notification_data = constructNotificationData(notification);
    const selected_notification = document.querySelector(`#notification_content[notification_id="${notificationID}"]`);
    if (selected_notification != null) {
        invokeAction(notification_data, selected_notification);
    }
}

function saveNotificationData(data) {
    for (const [key, value] of Object.entries(data['Notifications'])) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

class notifications {
    constructor() {
        this.delay = 0;
        this.notifications = new WebSocket("ws://127.0.0.1:8001/ws/notifications/");
        this.notifications.onopen = function(event) {
            const Authorization = {'Authorization': `Bearer ${getCookie('access')}`}
            this.send(JSON.stringify(Authorization));
        }
        this.notifications.onmessage = function(event) {
            let data = JSON.parse(event.data);
            const notifications_container = document.getElementById('notifications_container');
            if (controlNotificationFlow(data, notifications_container) == 1)
                return;
            saveNotificationData(data);
            for (const [key, value] of Object.entries(data['Notifications']))
                constructNotification(value);
            
        }    
        this.notifications.onclose = function(event) {
            const notifications_container = document.getElementById('notifications_container');
            notifications_container.innerHTML = `<p class="text-secondary text-center nokora fw-light my-auto fade_in">No Notifications</p>`;
            console.log("Connection closed");
        }
        this.notifications.onerror = function(event) {
            console.log("Error: " + event.data);
        }
    }

}