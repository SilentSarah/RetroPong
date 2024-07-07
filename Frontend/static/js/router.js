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

import { clearModals, loadEvents, displayTitle, credentialsScan, copyIDListener } from "./events.js";
import { log_user_in, register_user, loginWith42 } from "./login_register.js";
import { setDashboardStats } from "./userdata.js";
import { loadAccountDetailsInSettings, switchTabsHandler } from "./settings.js";
import { spawnAccountSearchMenu } from "./Profiles.js";
import { handleUpload, SaveChanges, DeleteAccount, DeleteAccountPrompt } from "./settings.js"
import { Verify2FA } from "./twoFactor.js";
import { invokeActivity } from "./notification.js";


export let fetchID;
export const routes = [
    {   path: '/404', 
        on: false,
        component: () => grabContent('/404.html'),
        func_arr: []
    },
    {   path: '/',
        on: false,
        component: () => grabContent('/static/content/home.html'),
        func_arr: [() => {displayTitle()}]
    },
    {
        path: '/login',
        on: false,
        component: () => grabContent('/static/content/login.html'),
        func_arr: [() => credentialsScan()]
    },
    {
        path: '/register',
        on: false,
        component: () => grabContent('/static/content/registration.html'),
        func_arr: [() => credentialsScan()]
    },
    {
        path: '/dashboard',
        on: false,
        component: () => grabContent('/static/content/dashboard.html'),
        func_arr: [() => copyIDListener(), () => setDashboardStats(true)]
    },
    {
        path: '/game',
        on: false,
        component: () => grabContent('/static/content/game.html'),
        func_arr: [() => initGameSocket()]
    },
    {
        path: '/tournament',
        on: false,
        component: () => grabContent('/static/content/tournament.html'),
    },
    { // For testing only >>>
        path: '/info',
        on: false,
        component: () => grabContent('/static/content/info.html')
    },
    {
        path: '/settings',
        on: false,
        component: () => grabContent('/static/content/settings.html'),
        func_arr: [() => switchTabsHandler(), () =>  loadAccountDetailsInSettings(true)]
    },
    {
        path: '/chat',
        on: false,
        component: () => grabContent('/static/content/chatv2.html'),
        func_arr: [() => Websocket()]
    },
    {
        path: '/profile',
        on: false,
        component: () => grabContent('/static/content/dashboard.html'),
        func_arr: [() => copyIDListener(), () =>  setDashboardStats(false)]
    },
]

async function StartLoading(route) {
    if (route != undefined && route != null && route.on === true) {
        return;
    }
    const loading = await fetch('/static/content/loadingStatus.html').then(response => response.text());
    document.getElementById('mainContent').innerHTML = loading;
}

async function grabContent(path) {
    const response = await fetch(path);
    if (!response.ok) {
        return await grabContent('/404.html');
    }
    const data = await response.text();
    return data;
}

export function router() {
    const path = window.location.pathname;
    let route = routes.find(route => route.path === path);
    let mainContent = document.getElementById('mainContent');
    clearModals();
    StartLoading(route);
    setTimeout(() => {
    if (route) {
        route.component().then(html => {
            if (route.on === false)
                mainContent.innerHTML = html;
            loadEvents();
            route.on = true;
            for (let i = 0; i < routes.length; i++) {
                if (routes[i].path !== path && routes[i].on) {
                    routes[i].on = false;
                }
            }
        });
    } else {
        routes[0].component().then(html => {
            mainContent.innerHTML = html;
            routes[0].on = true;
            for (let i = 1; i < routes.length; i++) {
                if (routes[i].on) {
                    routes[i].on = false;
                }
            }
            loadEvents();
        });
    }}, 750);
}
router();

window.log_user_in = log_user_in;
window.register_user = register_user;
window.loginWith42 = loginWith42;
window.spawnAccountSearchMenu = spawnAccountSearchMenu;
window.handleUpload = handleUpload;
window.SaveChanges = SaveChanges;
window.DeleteAccount = DeleteAccount;
window.Verify2FA = Verify2FA;
window.DeleteAccountPrompt = DeleteAccountPrompt;
window.invokeActivity = invokeActivity;