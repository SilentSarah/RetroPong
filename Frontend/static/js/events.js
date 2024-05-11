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
    <div id="retro_menu" class="nav_btn ms-2">
        <img src="/static/img/general/Menu.png" width="40px">
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

function scanLinks() {
    window.addEventListener('popstate', router);
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            history.pushState(null, null, this.href);
            router();
        });
    });
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
    for([key, value] of Object.entries(matches)) {
        if (value['won'] > highiest) {
            highiest = value['won'];
        }
    }
    return highiest;

}

let ChartData = {
    'Matches Played': {
        "24/07": 15777,
        "25/07": 150,
        "26/07": 100,
        "27/07": 0,
    }
};

function loadEvents() {
    scanLinks();
    if (window.location.pathname === '/') {
    }
    if (window.location.pathname === '/login' || window.location.pathname === '/register')
        scanInput();
    else if (window.location.pathname == '/dashboard' ) {
        copyIDListener();
        const Chart = new SSChart(ChartData, 'Matches Played', '/static/content/components/chart.html');
            Chart.Component.then(html => {
                document.getElementById('ChartMark').innerHTML = html;
                Chart.setChartTitle();
                Chart.setGrades();
                Chart.setDates();
                Chart.setBarValues();
        });
    }
    else if (window.location.pathname === '/settings') {
        handlePictureUploads();
        TwoFactorAuthHandler();
    }
	else if (window.location.pathname === '/game')
		initGame();
    else if (window.location.pathname === '/dashboard') {
        copyIDListener();
    }
    else if (window.location.pathname === '/settings') {
        handlePictureUploads();
        TwoFactorAuthHandler();
    }
    if (window.location.pathname != '/login' && window.location.pathname != '/register' && window.location.pathname != '/')
        fetchUserData();
}