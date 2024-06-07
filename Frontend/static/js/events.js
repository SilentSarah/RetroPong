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
        <img class="img img-shadow" src="./static/img/general/Logo.png" width="100px">
    </a>
    <div class="d-flex gap-2 me-3">
        <div id="notification" href="" class="nav_btn position-relative">
            <img src="/static/img/general/Notfication.png" width="40px">
            <div id="notification_light" class="d-none"></div>
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
        document.getElementById('notification').addEventListener('click', function () {
            console.log('Notification');
        });
        document.getElementById('logout').addEventListener('click', function () {
            sessionStorage.clear();
            clearInterval(fetchID);
            delete_cookie('access');
            window.location.href = '/';
        });
        let retro_menu = document.getElementById('retro_menu');
        retro_menu.addEventListener('click', function () {
            console.log('Menu');
            let menu = document.getElementById('menu_content');
            if (open === false) {
                menu.classList.add('open');
                open = true;
            } else {
                menu.classList.remove('open');
                open = false;
            }
        });
        scanLinks();
    }
}

function confirmOperartion(type, parent) {
    let Confirmation = document.createElement('div');
    if (type === 'copy') {
        document.getElementById('copyConfirm') ? parent.removeChild(document.getElementById('copyConfirm')) : null;
        Confirmation.id = 'copyConfirm';
        Confirmation.innerHTML = ' Copied to clipboard!';
        Confirmation.classList.add('nokora', 'text-white');
        Confirmation.style.fontSize = '0.5rem';
        parent.appendChild(Confirmation);
        setTimeout(() => {
            parent.removeChild(Confirmation);
        }, 1000);
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

function copyIDListener() {
    let cpyID = document.getElementById('cpyID');
    if (cpyID) {
        cpyID.addEventListener('click', function () {
            let copyText = document.getElementById('player_id');
            navigator.clipboard.writeText(copyText.innerHTML);
            confirmOperartion('copy', copyText.parentElement);

        });
    }
}

function handlePictureUploads() {
    let uploadBG = document.getElementById('uploadBG');
    let uploadPFP = document.getElementById('uploadPFP');
    let fileInputBg = document.createElement('input');
    let fileInputPfp = document.createElement('input');
    fileInputBg.type = 'file';
    fileInputPfp.type = 'file';
    if (uploadBG && uploadPFP) {
        uploadBG.addEventListener('click', function () {
            fileInputBg.click();
            if (fileInputBg.files) {
                // TO BE FURTHER IMPLEMENTED
            }

        });
        uploadPFP.addEventListener('click', function () {
            fileInputPfp.click();
            if (fileInputPfp.files) {
                // TO BE FURTHER IMPLEMENTED
            }
        });
    }
}

function TwoFactorAuthHandler() {
    let Offbtn = document.getElementById('offBtn');
    let Onbtn = document.getElementById('onBtn');
    if (Offbtn && Onbtn) {
        Offbtn.addEventListener('click', function () {
            Offbtn.setAttribute('fill', 'white');
            Offbtn.setAttribute('x', '7');
            Offbtn.setAttribute('y', '23');
            Offbtn.setAttribute('font-size', '17');
            //=====//
            Onbtn.setAttribute('fill', 'grey');
            Onbtn.setAttribute('x', '7');
            Onbtn.setAttribute('y', '23');
            Onbtn.setAttribute('font-size', '16');
            //=====//
            Onbtn.classList.remove('text-glow');
            Offbtn.classList.add('text-glow');
        });
        Onbtn.addEventListener('click', function () {
            Onbtn.setAttribute('fill', 'white');
            Onbtn.setAttribute('x', '7');
            Onbtn.setAttribute('y', '23');
            Onbtn.setAttribute('font-size', '17');
            //=====//
            Offbtn.setAttribute('fill', 'grey');
            Offbtn.setAttribute('x', '7');
            Offbtn.setAttribute('y', '23');
            Offbtn.setAttribute('font-size', '16');
            //=====//
            Offbtn.classList.remove('text-glow');
            Onbtn.classList.add('text-glow');

        });
    }
}

function findHighiestGrade(matches) {
    let highiest = 0;
    for ([key, value] of Object.entries(matches)) {
        if (value['won'] > highiest) {
            highiest = value['won'];
        }
    }
    return highiest;

}

 


function loadEvents() {
    scanLinks();
    Websocket()

    if (window.location.pathname === '/') {
    }
    if (window.location.pathname === '/login' || window.location.pathname === '/register')
        scanInput();
    else if (window.location.pathname == '/dashboard' ) {
        copyIDListener();
    }
    else if (window.location.pathname === '/settings') {
        handlePictureUploads();
        TwoFactorAuthHandler();
    }
	else if (window.location.pathname === '/game')
		initGame();
    else if (window.location.pathname === '/dashboard') {
        copyIDListener();
        setDashboardStats();
    }
    else if (window.location.pathname === '/settings') {
        handlePictureUploads();
        TwoFactorAuthHandler();
    }
    else if (window.location.pathname === '/chat') {
        UserContactFetching();
    }
    if (window.location.pathname != '/login' && window.location.pathname != '/register' && window.location.pathname != '/')
        fetchUserData();   
}
