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

let fetchID;
const routes = [
    {   path: '/404', 
        on: false,
        component: () => grabContent('/404.html')
    },
    {   path: '/',
        on: false,
        component: () => grabContent('/static/content/home.html')
    },
    {
        path: '/login',
        on: false,
        component: () => grabContent('/static/content/login.html')
    },
    {
        path: '/register',
        on: false,
        component: () => grabContent('/static/content/registration.html')
    },
    {
        path: '/dashboard',
        on: false,
        component: () => grabContent('/static/content/dashboard.html')
    },
    {
        path: '/game',
        on: false,
        component: () => grabContent('/static/content/game.html')
    },
    {
        path: '/tournament',
        on: false,
        component: () => grabContent('/static/content/tournament.html')
    },
    { // For testing only >>>
        path: '/info',
        on: false,
        component: () => grabContent('/static/content/info.html')
    },
    {
        path: '/settings',
        on: false,
        component: () => grabContent('/static/content/settings.html')
    },
    {
        path: '/chat',
        on: false,
        component: () => grabContent('/static/content/chatv2.html')
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

function router() {
    const path = window.location.pathname;
    let route = routes.find(route => route.path === path);
    let mainContent = document.getElementById('mainContent');
    StartLoading(route);
    setTimeout(() => {
    if (route) {
        console.log(route);
        if (route.on === true)
            return;
        route.component().then(html => {
            mainContent.innerHTML = html;
            loadEvents();
        });
        route.on = true;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].path !== path && routes[i].on) {
                routes[i].on = false;
            }
        }
    } else {
        routes[0].component().then(html => {
            console.log("404");
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
// temp commented below
// fetchUserData();
// fetchID = setInterval(fetchUserData, 1500);