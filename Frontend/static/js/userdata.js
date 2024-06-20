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

function toast(message, color_class) {
    let div = document.createElement('div');
    div.id = 'login-toast';
    div.classList.add('toast', 'align-items-center', color_class, 'border-0', 'position-absolute', 'z-5', 'slide-in-blurred-top');
    div.setAttribute('role', 'alert');
    div.setAttribute('aria-live', 'assertive');
    div.setAttribute('aria-atomic', 'true');

    let toast_content = document.createElement('div');
    toast_content.classList.add('d-flex');

    let toast_body = document.createElement('div');
    toast_body.innerHTML = message;
    toast_body.classList.add('toast-body', 'text-white', 'nokora');

    let close_btn = document.createElement('button');
    close_btn.classList.add("btn-close", "btn-close-white", "me-2", "m-auto");
    close_btn.setAttribute('type', 'button');
    close_btn.setAttribute('data-bs-dismiss', 'toast');
    close_btn.setAttribute('aria-label', 'Close');

    div.appendChild(toast_content);
    toast_content.appendChild(toast_body);
    toast_content.appendChild(close_btn);

    let mainContent = document.getElementById('mainContent');
    mainContent.appendChild(div);
    
    div.style.display = 'block';
    div.style.top = '25px';
    destroytoast(div);
    return div;
}
function settoastmsg(toast, message, color_class) {
    toast.children[0].children[0].innerHTML = message;
    toast.classList.add(color_class);
}
function destroytoast(toasty) {
    setTimeout(() => {
        toasty.remove();
    }, 2000);
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function setValuesToSessionStorage(data) {
    for (const [key, value] of Object.entries(data)) {
        if (key === 'matchhistory' || key === 'matchstatistics') {
            sessionStorage.setItem(key, JSON.stringify(value));
            continue;
        }
        if (key === 'fname')
            sessionStorage.setItem('full_name', value);
        if (key === 'lname')
            sessionStorage.setItem('full_name', sessionStorage.getItem('full_name') + " " + value);
        sessionStorage.setItem(key, value);
    }
}

function fetchUserData() {
    if (getCookie('access') === "") {
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register" && window.location.pathname !== "/") {
            window.location.href = "/login";
            return ;
        }
    } else {
        if (window.location.pathname === "/login" || window.location.pathname === "/register") {
            window.location.href = "/dashboard";
        }  
        fetch("http://127.0.0.1:8001/userdata/",
        { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('access'),
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                deleteCookie("access");
                sessionStorage.clear();
            }
        })
        .then(data => {
            setValuesToSessionStorage(data);
            if (window.location.pathname === "/dashboard")
                setDashboardStats();
            DisplayNavBar();
        })
        .catch((error) => {
            if (error.message === 'Failed to fetch') {
                toast('Server is not responding, try again later.', 'bg-danger');
                clearInterval(fetchID);
                return ;
            }
        });
    }
}

function setTextContentHTML(id, sessionKey, defaultValue = "", self = true) {
    let element = document.getElementById(id);
    let value = self ? sessionStorage.getItem(sessionKey) : current_user[sessionKey];
    if (value === null || value === undefined)
        return ;
    element.textContent = value === "" ? defaultValue : value;
}

function setPlayerRank(self = true) {
    let rank = self ? sessionStorage.getItem('rank') : current_user['rank'];
    if (rank === null || rank === undefined)
        return ;
    let tier = document.getElementById('tier');
    if (tier)
        tier.src=`/static/img/rank/${rank}.png`;
}

function setDashboardPlayerPfpAndBg(self = true) {
    let pfp = document.getElementById("profile_pic");
    let bg = document.getElementById("profile_bg");
    let pfp_path = self ? sessionStorage.getItem('profilepic') : current_user['profilepic'];
    let bg_path = self ? sessionStorage.getItem('profilebgpic') : current_user['profilebgpic'];
    if (pfp_path === null || pfp_path === "") {
        pfp.style.backgroundImage = 'url("/static/img/pfp/Default.png")';
    } else {
        pfp.style.backgroundImage = `url(${pfp_path})`;
    }
    if (bg_path === null || bg_path === "") {
        bg.style.backgroundImage = 'url("/static/img/bg/DefaultBG.png")';
    } else {
        bg.style.backgroundImage = `url(${bg_path})`;
    }

}


function createMatchHistoryElement(matchHistory, match, self = true) {
    const match_data = {
        player_id: match.OpponentData.self_id,
        player_username: match.OpponentData.self_username,  
        player_pfp: match.OpponentData.self_pfp,
        opponent_id: match.OpponentData.id,
        opponent_username: match.OpponentData.username,
        score: match.OpponentData.score,
        result: match.OpponentData.result,
        opponent_pfp: match.OpponentData.pfp,

    }
    let div = document.createElement("div");
    const match_color = match_data.result == "WIN" ? "bg-win" : match_data.result == "LOSS" ? "bg-loss" : match_data.result == "DRAW" ? "bg-draw" : "text-white";
    const match_text_color = match_data.result == "WIN" ? "text-success" : match_data.result == "LOSS" ? "text-danger" : match_data.result == "DRAW" ? "ext-white-fade" : "text-white";
    const match_score = match_data.result == "WIN" ? `${match_data.score[0]} - ${match_data.score[1]}` : `${match_data.score[1]} - ${match_data.score[0]}`;
    div.classList.add("d-flex", "border-transparent-0-5", "rounded-3", "align-items-center", "justify-content-evenly", "p-2", "dynamic-fill");
    div.classList.add(match_color);
    div.innerHTML = `
    <img src=${match_data.player_pfp == "" ? '/static/img/pfp/Default.png': match_data.player_pfp} onclick="DisplayProfileDetails(${match_data.self_id})"  width="70px" height="70px" class="border-transparent-0-5 rounded-1 object-fit-cover hover-cursor" />
    <div class="d-flex flex-column align-items-center mx-3">
    <p class="mx-2 text-white-fade nokora fw-bold mb-0 fs-3 ${match_text_color} text-shadow">
        ${match_data.result}
    </p>
    <p class="mx-2 text-white-fade nokora fw-light mb-0 text-white text-shadow">
            ${match_score}
    </p>
    </div>
    <img src="${match_data.opponent_pfp == "" ? '/static/img/pfp/Default.png': match_data.opponent_pfp}" onclick="DisplayProfileDetails(${match_data.opponent_id})" width="70px" height="70px" class="border-transparent-0-5 rounded-1 object-fit-cover hover-cursor">
    `;
    matchHistory.appendChild(div);
    
}

function setMatchHistory(self = true) {
    let matchHistory = document.getElementById("matchHistory");
    matchHistory.innerHTML = "";
    const matches = self ? JSON.parse(sessionStorage.getItem('matchhistory')) : current_user['matchhistory'];
    if (matches === null || matches === undefined || Object.keys(matches).length === 0){
        matchHistory.innerHTML = '<span class="text-white text-center nokora fw-light opacity-75">No Matches</span>';
    } else {
        for (const [key, value] of Object.entries(matches)) {
            createMatchHistoryElement(matchHistory, value);
        }
    }
}

function setMatchStatistics(self = true) {
    let match_statistics = self ? sessionStorage.getItem('matchstatistics') : current_user['matchstatistics'];
    if (match_statistics === null || match_statistics === undefined) {
        return ;
    }
    match_statistics = self ? JSON.parse(match_statistics) : match_statistics;
    if (match_statistics === null || match_statistics === undefined) {
        console.log("FUK")
        return ;
    }
    const Chart = new SSChart(match_statistics, 'Matches Played', '/static/content/components/chart.html');
    Chart.Component.then(html => {
        document.getElementById('ChartMark').innerHTML = html;
        Chart.setChartTitle();
        Chart.setGrades();
        Chart.setDates();
        Chart.setBarValues();
    });

}

function setDashboardStats(self = true) {
    setTextContentHTML('username', 'username', "", self);
    setTextContentHTML('title', 'title', 'The NPC', self);
    setTextContentHTML('email', 'email', "", self);
    setTextContentHTML('discordid', 'discordid', 'None', self);
    setTextContentHTML('Experience', 'xp', "0", self);
    setTextContentHTML('level', 'level', "0", self);
    setTextContentHTML('tournamentsplayed', 'tournamentsplayed', "0", self);
    setTextContentHTML('tournamentswon', 'tournamentswon', "0", self);
    setTextContentHTML('tournamentslost', 'tournamentslost', "0", self);
    setTextContentHTML('desc', 'desc', "No description provided", self);
    setTextContentHTML('matches', 'matchesplayed', "0", self);
    setTextContentHTML('matches_won', 'matcheswon', "0", self);
    setTextContentHTML('matches_lost', 'matcheslost', "0", self);
    setDashboardPlayerPfpAndBg(self);
    setMatchHistory(self);
    setMatchStatistics(self);

    let player_id = document.getElementById("player_id");
    let player_id_value = self ? sessionStorage.getItem('id') : current_user['id'];
    if (player_id_value)
        player_id.textContent = `RP-ID-${player_id_value}`;

    let full_name = document.getElementById("full_name");
    let first_name = self ? sessionStorage.getItem('fname') : current_user['fname'];
    let last_name = self ? sessionStorage.getItem('lname') : current_user['lname'];
    if (first_name && last_name)
        full_name.textContent = first_name + " " + last_name;
    setPlayerRank();
    if (self === false) {
        DisplayProfileOptions();
    }
}
