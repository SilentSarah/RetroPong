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

let notificationHandler = null;

function delete_cookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function DisplayNavBar() {
    let navbar_logged_in = `
    <div id="retro_menu" class="nav_btn ms-3 position-relative">
        <img id="retro_menu_img" src="/static/img/general/Menu.png" width="40px">
        <div id="menu_content" class="flex-column justify-content-center align-items-center gap-2 position-absolute">
            <a href="/dashboard" class="nav_btn selected" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="Right popover">
                <img src="/static/img/general/Account.png" width="30px">
            </a>
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
        <div id="notification" href="" class="nav_btn position-relative">
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
            sessionStorage.clear();
            clearInterval(fetchID);
            delete_cookie('access');
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

function scanLinks() {
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

function copyIDListener() {
    let cpyID = document.getElementById('cpyID');
    if (cpyID) {
        cpyID.removeEventListener('click', copyToClipboard);
        cpyID.addEventListener('click', copyToClipboard);
    }
}

function displayTitle() {
    let title = document.querySelector('.mainTitle');
    if (title) {
        setTimeout(() => {
            title.classList.add('open');
        }, 250);
    }
}



function loadEvents() {
    if (window.location.pathname === '/') {
        displayTitle();
    }
    if (window.location.pathname === '/login' || window.location.pathname === '/register'){
        scan2fa();
        scanInput();
        if (getCookie('access') == '' || getCookie('2FA') == '')
            document.cookie = '';
    }
    else if (window.location.pathname === '/settings') {
        switchTabsHandler();
        loadAccountDetailsInSettings(true);
    }
	else if (window.location.pathname === '/game')
		initGame();
    else if (window.location.pathname === '/dashboard' || window.location.pathname === '/profile') {
        copyIDListener();
        window.location.pathname === '/dashboard' ? setDashboardStats(true) : setDashboardStats(false);
    }
    if (window.location.pathname != '/login' && window.location.pathname != '/register' && window.location.pathname != '/')
        fetchUserData();
    scanLinks();
    enableAccountSearchMenu();
}

window.addEventListener('beforeunload', function(event) {
    clearInterval(fetchID);
    if (notificationHandler !== null) {
        notificationHandler.notifications.close();
    }
});
