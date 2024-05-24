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
            }
        })
        .then(data => {
            for (const [key, value] of Object.entries(data)) {
                if (key === 'matchhistory' || key === 'matchstatistics') {
                    sessionStorage.setItem(key, JSON.stringify(value));
                    continue;
                }
                sessionStorage.setItem(key, value);
            }
            if (window.location.pathname === "/dashboard")
                setDashboardStats();
            DisplayNavBar();
        })
        .catch((error) => {
            sessionStorage.clear();
            if (error.message === 'Failed to fetch') {
                toast('Server is not responding, try again later.', 'bg-danger');
                clearInterval(fetchID);
                return ;
            }
        });
    }
}
function setElementInnerHTML(id, sessionKey, defaultValue = "") {
    let element = document.getElementById(id);
    let value = sessionStorage.getItem(sessionKey);
    element.innerHTML = value === "" ? defaultValue : value;
}

function setPlayerRank() {
    let rank = sessionStorage.getItem('rank');
    let tier = document.getElementById('tier');
    if (tier)
        tier.src=`/static/img/rank/${rank}.png`;
}

function setDashboardPlayerPfpAndBg() {
    let pfp = document.getElementById("profile_pic")
    let pfp_path = sessionStorage.getItem('profilepic');
    if (pfp_path === null || pfp_path === "") {
        pfp.style.backgroundImage = 'url("/static/img/pfp/Default.png")';
    } else {
        pfp.style.backgroundImage = `url(${pfp_path})`;
    }
}


function createMatchHistoryElement(matchHistory, match) {
    const match_data = {
        player_id: sessionStorage.getItem('id'),
        player_username: sessionStorage.getItem('username'),
        player_pfp: sessionStorage.getItem('profilepic'),
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
    <img src=${match_data.player_pfp == "" ? '/static/img/pfp/Default.png': match_data.player_pfp} width="70px" height="70px" class="border-transparent-0-5 rounded-1 object-fit-cover" />
    <div class="d-flex flex-column align-items-center mx-3">
    <p class="mx-2 text-white-fade nokora fw-bold mb-0 fs-3 ${match_text_color} text-shadow">
        ${match_data.result}
    </p>
    <p class="mx-2 text-white-fade nokora fw-light mb-0 text-white text-shadow">
            ${match_score}
    </p>
    </div>
    <img src="${match_data.opponent_pfp == "" ? '/static/img/pfp/Default.png': match_data.opponent_pfp}" width="70px" height="70px" class="border-transparent-0-5 rounded-1 object-fit-cover">
    `;
    matchHistory.appendChild(div);
    
}

function setMatchHistory() {
    let matchHistory = document.getElementById("matchHistory");
    matchHistory.innerHTML = "";
    const matches = JSON.parse(sessionStorage.getItem('matchhistory'));
    if (matches === null || matches === undefined || matches.length === 0) {
        matchHistory.innerHTML = "No matches played yet";
    } else {
        for (const [key, value] of Object.entries(matches)) {
            createMatchHistoryElement(matchHistory, value);
        }
    }
}

function setMatchStatistics() {
    let match_statistics = sessionStorage.getItem('matchstatistics');
    if (match_statistics === null || match_statistics === undefined) {
        return ;
    }
    match_statistics = JSON.parse(match_statistics);
    if (match_statistics === null || match_statistics === undefined) {
        console.log("FUK")
        return ;
    }
    const Chart = new SSChart(match_statistics, 'Matches Played', '/static/content/components/chart.html');
    // console.log("HELP");
    Chart.Component.then(html => {
        document.getElementById('ChartMark').innerHTML = html;
        Chart.setChartTitle();
        Chart.setGrades();
        Chart.setDates();
        Chart.setBarValues();
    });

}

function setDashboardStats() {
    setElementInnerHTML('username', 'username');
    setElementInnerHTML('title', 'title', 'The NPC');
    setElementInnerHTML('email', 'email');
    setElementInnerHTML('discordid', 'discordid', 'None');
    setElementInnerHTML('Experience', 'xp');
    setElementInnerHTML('level', 'level');
    setElementInnerHTML('tournamentsplayed', 'tournamentsplayed');
    setElementInnerHTML('tournamentswon', 'tournamentswon');
    setElementInnerHTML('tournamentslost', 'tournamentslost');
    setElementInnerHTML('desc', 'desc', "No description provided");
    setElementInnerHTML('matches', 'matchesplayed');
    setElementInnerHTML('matches_won', 'matcheswon');
    setElementInnerHTML('matches_lost', 'matcheslost');
    setDashboardPlayerPfpAndBg();
    setMatchHistory();
    setMatchStatistics();

    let player_id = document.getElementById("player_id");
    player_id.innerHTML = `RP-ID-${sessionStorage.getItem('id')}`;

    let full_name = document.getElementById("full_name");
    let first_name = sessionStorage.getItem('fname');
    let last_name = sessionStorage.getItem('lname');
    full_name.innerHTML = first_name + " " + last_name;
    setPlayerRank();
}
