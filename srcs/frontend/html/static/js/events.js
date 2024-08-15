/****************************************************
*     ██████  ▄▄▄       ██▀███   ▄▄▄       ██░ ██   *
*   ▒██    ▒ ▒████▄    ▓██ ▒ ██▒▒████▄    ▓██░ ██▒  *
*   ░ ▓██▄   ▒██  ▀█▄  ▓██ ░▄█ ▒▒██  ▀█▄  ▒██▀▀██░  *
*     ▒   ██▒░██▄▄▄▄██ ▒██▀▀█▄  ░██▄▄▄▄██ ░▓█ ░██   *
*   ▒██████▒▒ ▓█   ▓██▒░██▓ ▒██▒ ▓█   ▓██▒░▓█▒░██▓  *
*   ▒ ▒▓▒ ▒ ░ ▒▒   ▓▒█░░ ▒▓ ░▒▓░ ▒▒   ▓▒█░ ▒ ░░▒░▒  *
*   ░ ░▒  ░ ░  ▒   ▒▒ ░  ░▒ ░ ▒░  ▒   ▒▒ ░ ▒ ░▒░ ░  *
*   ░  ░  ░    ░   ▒     ░░   ░   ░   ▒    ░  ░░ ░  *
*         ░        ░  ░   ░           ░  ░ ░  ░  ░  *
*                All Rights Reserved                *
*                        1337                       *
*****************************************************/

import { routes, router } from "./router.js";
import { getCookie, fetchUserData, toast, clearUserDataLocally } from "./userdata.js";
import { OnlineProfile, enableAccountSearchMenu } from "./Profiles.js";
import { scan2fa } from "./twoFactor.js";
import { log_user_in, register_user, passUserTo } from "./login_register.js";
import { notifications } from "./notification.js";
import { DestroyConfirmationPopUp } from "./settings.js";
import { GameConnector } from "./Game/GameConnection.js";


let notificationHandler = null;
export let SelfUser = undefined;

export function delete_cookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function DisplayNavBar() {
    if (getCookie('access') === '') return;
    let navbar_logged_in = `
    <div id="retro_menu" class="nav_btn ms-3 position-relative">
        <img id="retro_menu_img" src="/static/img/general/Menu.png" width="40px">
        <div id="menu_content" class="flex-column justify-content-center align-items-center gap-2 position-absolute">
            <a href="/dashboard" class="nav_btn selected" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="Right popover">
                <img src="/static/img/general/Account.png" width="30px">
            </a>
            <div onclick="spawnAccountSearchMenu()" class="nav_btn selected hover-cursor">
                <img id="account_search_btn" src="/static/img/general/FindUser.png" width="30px">
            </div>
            <a href="/chat" class="nav_btn selected">
                <img src="/static/img/general/Chat.png" width="30px">
            </a>
            <a href="/game" class="nav_btn selected">
                <img src="/static/img/general/Game.png" width="30px">
            </a>
            <a href="/tournament" class="nav_btn selected">
                <img src="/static/img/general/Tournament.png" width="30px">
            </a>
            <a href="/settings" class="nav_btn selected">
                <img src="/static/img/general/Settings.png" width="30px">
            </a>
        </div>
    </div>
    <a href="/" class="ms-3">
        <img class="img img-shadow" src="./static/img/general/Rp.png" width="50px">
    </a>
    <div class="d-flex gap-2 me-3">
        <div id="notification" class="nav_btn position-relative" onclick="SetNotificationLight()">
            <img src="/static/img/general/Notfication.png" width="40px" class="position-relative" style="z-index: 12;">
            <div id="notification_light" class="d-none"></div>
            <div id="notification_menu" class="d-flex flex-column justify-content-between align-items-center gap-2 position-absolute">
                <h3 class="text-white fs-5 taprom text-pink-gradient text-glow m-0 py-2">Notifications</h3>
                <div id="notifications_container" class="d-flex flex-column justify-content-start align-items-center px-2 h-100 overflow-y-auto overflow-x-hidden gap-2 mb-2">
                    <div id="loading_notifications" class="spinner-border text-white my-auto" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="logout" href="" class="nav_btn">
            <img src="/static/img/general/Logout.png" width="40px">
        </div>
    </div>`

    let navbar = document.getElementById('navbar');
    let open = false;
    if (document.getElementById("retro_menu") === null
        || document.getElementById("notification") === null
        || document.getElementById("logout") === null) {
        navbar.innerHTML = navbar_logged_in;
        let notificationElement = document.getElementById('notification');
        notificationElement.addEventListener('click', function () {
            let notification_menu = document.getElementById('notification_menu');
            if (notification_menu.classList.contains('open') == true) {
                notification_menu.classList.remove('open');
            } else {
                notification_menu.classList.add('open');
            }
        });
        document.getElementById('logout').addEventListener('click', function () {
            destoryWebsockets();
            clearUserDataLocally();
            window.location.href = '/';
        });
        let retro_menu = document.getElementById('retro_menu');
        retro_menu.addEventListener('click', function () {
            let menu = document.getElementById('menu_content');
            if (open === false) {
                menu.classList.add('open');
                open = true;
            } else {
                menu.classList.remove('open');
                open = false;
            }
        });
        if (notificationHandler === null && getCookie('access') != '') {
            notificationHandler = new notifications();
        }
        scanLinks();
    }
}

function  destoryWebsockets() {
    if (SelfUser !== undefined) {
        SelfUser.ws.close();
    }
    if (notificationHandler !== null) {
        notificationHandler.notifications.close();
    }
}
function confirmOperartion(type, parent) {
    if (type === 'copy') {
        document.getElementById('copyConfirm') ? parent.removeChild(document.getElementById('copyConfirm')) : null;
        toast('Copied to clipboard!', 'bg-success');
    }
}

function scanInput() {
    let items = document.querySelectorAll('input');

    items.forEach(item => {
        item.addEventListener('keypress', function (e) {
            if (e.key === 'Enter')
                if (window.location.pathname === '/login')
                    log_user_in(items);
                else if (window.location.pathname === '/register')
                    register_user(items);
        });
    });
}

function linkClickHandler(e) {
    DestroyConfirmationPopUp();
    console.log('Link Clicked')
    e.preventDefault();
    history.pushState(null, null, this.href);
    router();
}

function iterateOverLinks(link) {
    link.addEventListener('click', linkClickHandler);
}

function removeLinkHandlers(link) {
    link.removeEventListener('click', linkClickHandler);
}

export function scanLinks() {
    window.removeEventListener('popstate', router);
    document.querySelectorAll('a').forEach(removeLinkHandlers);
    window.addEventListener('popstate', router);
    document.querySelectorAll('a').forEach(iterateOverLinks);
}

function copyToClipboard() {
    let copyText = document.getElementById('player_id');
    navigator.clipboard.writeText(copyText.textContent);
    confirmOperartion('copy', copyText.parentElement);
}

export function copyIDListener() {
    let cpyID = document.getElementById('cpyID');
    if (cpyID) {
        cpyID.removeEventListener('click', copyToClipboard);
        cpyID.addEventListener('click', copyToClipboard);
    }
}

export function displayTitle() {
    let title = document.querySelector('.mainTitle');
    if (title) {
        setTimeout(() => {
            title.classList.add('open');
        }, 250);
    }
}

export function clearModals() {
    const modalContent = document.querySelector('#modalContent');
    Array.from(modalContent.children).forEach(content => {
        if (content.id !== 'account_finder') {
            content.remove();
        }
    });
}

export function credentialsScan() {
    scan2fa();
    scanInput();
    if (getCookie('access') == '' || getCookie('2FA') == '')
        document.cookie = '';
}

export function tokenCheck() {
    if (getCookie('access') === "") {
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register" && window.location.pathname !== "/") {
            window.location.href = "/login";
        }
        return false;
    } 
    else if (window.location.pathname === "/login" || window.location.pathname === "/register")
    {
        passUserTo('/dashboard');
        return false;
    }
    return true;
}

function OnOnlineServiceClose(service) {
    if (service === undefined) return;
    service.ws.onclose = () => {
        console.log('Online System has been closed.');
        if (getCookie('access') !== '') service = new OnlineProfile(service.link);
        else service = undefined;
    };
}

export function loadEvents() {
    
    const origpath = window.location.pathname;
    const found_path = routes.find(route => route.path === origpath);

    // if (origpath != '/game' && origpath != '/tournament') GameConnector ? GameConnector.close() : null;
    scanLinks();
    if (found_path !== undefined) {
        DisplayNavBar();
        if (SelfUser == undefined) {
            tokenCheck() === true ? SelfUser = new OnlineProfile("wss://127.0.0.1:8002/ws/online/"):null;
            OnOnlineServiceClose(SelfUser);
        }
        found_path.func_arr.forEach(func => func());
    }
    if (!tokenCheck()) return;

    fetchUserData();
    enableAccountSearchMenu();
}

window.addEventListener('beforeunload', function (event) { destoryWebsockets(); });
