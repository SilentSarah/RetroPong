const routes = [
    {   path: '/404', 
        component: () => grabContent('/static/content/404.html')
    },
    {   path: '/',
        component: () => grabContent('/static/content/login.html')
    },
    {
        path: '/about',
        component: () => grabContent('/static/content/about.html')
    },
    {
        path: '/contact',
        component: () => grabContent('/static/content/contact.html')
    },
]

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
    if (route) {
        route.component().then(html => {
            document.getElementById('mainContent').innerHTML = html;
        });
    } else {
        routes[0].component().then(html => {
            document.getElementById('mainContent').innerHTML = html;
        });
    }
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

