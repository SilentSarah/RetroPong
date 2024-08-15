

import { getCookie } from './userdata.js';
import { scanLinks } from './events.js';
import { passUserTo } from './login_register.js';

let delay = 0;
export let last_notification_id = undefined;
const img_paths = {
    'MESSAGE': '/static/img/general/Chat.png',
    'ACCOUNT': '/static/img/general/Account.png',
    'GAME': '/static/img/general/Game.png',
    'FRIEND': '/static/img/general/Chat.png',
    'TOURNAMENT': '/static/img/general/Tournament.png',
}

const notifications_array = []

function convertDateFormat(dateStr) {
    let [date, time] = dateStr.split(' ');
    date = date.split('/').reverse().join('/');
    return new Date(`${date} ${time}`);
}

function scaleMessageDateSent(date) {
    const currentDate = new Date();
    const diff = currentDate - convertDateFormat(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0)
        return `${years}y ago`;
    if (months > 0)
        return `${months}m ago`;
    if (days > 0)
        return `${days}d ago`;
    if (hours > 0)
        return `${hours}h ago`;
    if (minutes > 0)
        return `${minutes}m ago`;
    if (seconds > 0)
        return `${seconds}s ago`;
    return `Just now`;

}

function controlNotificationFlow(data, notifications_container) {
    if (data['Notifications'] == undefined || Object.keys(data['Notifications']).length == 0) {
        notifications_container.innerHTML = `<p id="no_notification" class="text-secondary text-center nokora fw-light my-auto fade_in">No Notifications</p>`;
        return 1;
    }
    if (notifications_container.children[0].id === 'loading_notifications' || notifications_container.children[0].id === 'no_notification')
        notifications_container.children[0].remove();
}

function constructNotificationData(each_notification) {
    const notification_Data = {
        id: each_notification.id,
        type: each_notification.type == 'FRIEND' ? 'MESSAGE' : each_notification.type,
        content: each_notification.content,
        date: each_notification.date,
        reciever: each_notification.reciever,
        sender: each_notification.sender,
        sender_username: each_notification.sender_username,
        sender_pfp: each_notification.sender_pfp == undefined ? "/static/img/general/Account.png" : each_notification.sender_pfp,
    }
    return notification_Data;
}

function clearNotificationArray() {
    for (let i = 0; i < notifications_array.length; i++)
        notifications_array[i].remove();
}

function constructNotification(each_notification, notifications_container) {
    const notification_Data = constructNotificationData(each_notification);
    let notification = document.createElement('div');
    if (last_notification_id === undefined || last_notification_id != notification_Data.id)
    {
        setTimeout(() => {
            notifications_container.insertBefore(notification, notifications_container.firstChild);
            notification.outerHTML = `
            <div id="notification_content" back-link="${notification_Data.type}" notification_id="${notification_Data.id}" class="d-flex flex-column justify-content-between rounded-3 bg-white-transparent-0-15 p-2 m-0 gap-1 fade_in" style="width:280px; height:100px;">
                <div id="noti_header" class="d-flex align-items-center gap-1 opacity-75">
                    <img src="${img_paths[notification_Data.type]}" width="20px">
                    <p class="text-white nokora fw-bold m-0" style="font-size: 15px;">${notification_Data.type}</p>
                    <p class="ms-auto m-0 nokora fw-light text-white" style="font-size: 12px;">${scaleMessageDateSent(notification_Data.date)}</p>
                </div>
                <div id="noti_body" class="d-flex align-items-center justify-content-start gap-2">
                    <img src="${notification_Data.sender_pfp}" width="40px" height="40px" class="object-fit-cover border-pink rounded-3">
                    <p class="text-white m-0 fw-light text-turncate" style="font-size: 0.85rem;">
                        <span class="nokora text-pink text-turncate fw-bold">${notification_Data.sender_username}</span>
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
        last_notification_id = notification_Data.id;
    }
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
            anchor.href = '/settings';
            selected_notification.appendChild(anchor);
            scanLinks();
            anchor.click();
            anchor.remove();
            break;
        case 'GAME':
            passUserTo('/game');
            localStorage.setItem('inviter_id', notification_data.sender);
            break;
        case 'TOURNAMENT':
            passUserTo('/game');
    }
}

export function invokeActivity(notificationID) {
    const notification = JSON.parse(localStorage.getItem(notificationID));
    const notification_data = constructNotificationData(notification);
    const selected_notification = document.querySelector(`#notification_content[notification_id="${notificationID}"]`);
    if (selected_notification != null) {
        invokeAction(notification_data, selected_notification);
    }
}

function saveNotificationData(data) {
    for (const [key, value] of Object.entries(data['Notifications'])) {
        localStorage.setItem(value['id'], JSON.stringify(value));
    }
}

function SetNotificationLight(check = false) {
    const notification_light = document.getElementById('notification_light');
    const last_notification_id_saved = parseInt(localStorage.getItem('last_notification_id'));
    if (check == true) {
        if (last_notification_id_saved == null || last_notification_id_saved != last_notification_id)
            notification_light.classList.replace('d-none', 'd-block');
    }
    else {
        localStorage.setItem('last_notification_id', last_notification_id);
        notification_light.classList.replace('d-block', 'd-none');
    }
}

export class notifications {
    constructor() {
        this.delay = 0;
        this.notifications = new WebSocket("wss://127.0.0.1:8002/ws/notifications/");
        this.notifications.onopen = function(event) {
            const Authorization = {'Authorization': `Bearer ${getCookie('access')}`}
            this.send(JSON.stringify(Authorization));
        }
        this.notifications.onmessage = function(event) {
            let data = JSON.parse(event.data);
            const notifications_container = document.getElementById('notifications_container');
            if (controlNotificationFlow(data, notifications_container) == 1)
                return;
            clearNotificationArray();
            saveNotificationData(data);
            for (const [key, value] of Object.entries(data['Notifications']))
                constructNotification(value, notifications_container);
            SetNotificationLight(true);
        }    
        this.notifications.onclose = function(event) {
            const notifications_container = document.getElementById('notifications_container');
            if (notifications_container)
                notifications_container.innerHTML = `<p class="text-secondary text-center nokora fw-light my-auto fade_in">No Notifications</p>`;
            console.log("Connection closed");
        }
        this.notifications.onerror = function(event) {
            delete this.notifications;
            this.notifications = new WebSocket("wss://127.0.0.1:8002/ws/notifications/");
        }
    }

}

window.invokeActivity = invokeActivity;
window.SetNotificationLight = SetNotificationLight;