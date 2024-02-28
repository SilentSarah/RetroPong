const routes = [
    {   path: '/404', 
        on: false,
        component: () => grabContent('/static/content/404.html')
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
        path: '/contact',
        on: false,
        component: () => grabContent('/static/content/contact.html')
    },
]

async function StartLoading(route) {
    console.log(route);
    if (route.on === true) {
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
    const route = routes.find(route => route.path === path);
    let mainContent = document.getElementById('mainContent');
    StartLoading(route);
    setTimeout(() => {
    if (route) {
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
        if (route.on === true)
            return;
        routes[0].component().then(html => {
            mainContent.innerHTML = html;
            loadEvents();
            routes[0].on = true;
        });
    }}, 750);
}

window.addEventListener('popstate', router);
document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
        e.preventDefault();
        history.pushState(null, null, this.href);
        router();
    });
});

router();
