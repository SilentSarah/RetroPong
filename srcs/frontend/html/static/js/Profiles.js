import { getCookie, setLoadingOverlay, toast } from './userdata.js';
import { passUserTo } from './login_register.js';
import { current_user } from "./userdata.js";
import { DisplayMatchSeekScreen } from './Game/GameRenderer.js';

export class OnlineProfile {
    constructor(link) {
        this.link = link;
        this.intervalID = null;
        this.userConnectionData = {};
        this.ws = new WebSocket(link);
        this.checkProfile = (profile_id) => {
            const data = {
                "Authorization": "Bearer " + getCookie('access'),
                "viewed_user": profile_id
            };
            this.ws.send(JSON.stringify(data));
        }
        this.displayOnlineStatus = (profile_id) => {
            
            if (window.location.pathname !== '/profile') return;
            if (Object.keys(this.userConnectionData).length === 0) return;
            if (Object.keys(current_user).indexOf("id") != -1 && this.userConnectionData.viewed_user !== current_user.id) return;

            const pfp = document.getElementById('profile_pic');
            const onlinestatus = document.createElement('div');
            const status = pfp.querySelector('.connection_status');
            onlinestatus.classList.add("connection_status");
            
            if (status === null) {
                pfp.appendChild(onlinestatus);
                this.userConnectionData.online === true ? 
                (onlinestatus.classList.add("bg-online"), onlinestatus.classList.remove("bg-offline")): 
                (onlinestatus.classList.add("bg-offline"), onlinestatus.classList.remove("bg-online"));
            } else {
                this.userConnectionData.online === true ? 
                (status.classList.add("bg-online"), status.classList.remove("bg-offline")): 
                (status.classList.add("bg-offline"), status.classList.remove("bg-online"));
            }

        }
        this.ws.onopen = () => {
            const auth_data = { "Authorization": "Bearer " + getCookie('access')};
            this.ws.send(JSON.stringify(auth_data));
        };
        this.ws.onmessage = (data) => {
            let data_content = JSON.parse(data.data);
            if (Object.keys(data_content).length > 0) {
                this.userConnectionData = data_content;
                this.displayOnlineStatus(this.userConnectionData.viewed_user);
                clearInterval(this.intervalID);
            }
        };
    }
}

let account_finder_active = false;
let last_search_id = undefined;


function Invite(id, type) {
    const profileOptions = document.getElementById('profileOptions');
    if (id == undefined || id == null || type == undefined || type == null) return;
    if (type != 'friend' && type != 'game') return;
    Array.from(profileOptions.children).forEach(child => {
        child.disabled = true;
        child.classList.add('opacity-75', 'cursor-not-allowed');
    });
    // setLoadingOverlay(true);
    fetch ("https://127.0.0.1:8001/userdata/invite", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'type': type,
            'receiver': id
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(data => {
        toast(data.message, "bg-success");
        Array.from(profileOptions.children).forEach(child => {
            child.disabled = false;
            child.classList.remove('opacity-75', 'cursor-not-allowed');
        });
        if (type === "game") {
            localStorage.setItem('invitee_id', id);
            setTimeout(() => passUserTo('/game'), 1000);
        } 
        // setLoadingOverlay(false);
    })
    .catch(error => {
        toast("An error occured while inviting this person.", "bg-danger");
        Array.from(profileOptions.children).forEach(child => {
            child.disabled = false;
            child.classList.remove('opacity-75', 'cursor-not-allowed');
        });
        // setLoadingOverlay(false);
    });
}

export function DisplayProfileOptions() {
    const ProfileOptions = document.getElementById('profileOptions');

    if (current_user == undefined || current_user == null) return;
    if (Object.keys(current_user).length == 0) return;
    if (ProfileOptions) ProfileOptions.remove();
    if (current_user.id === parseInt(sessionStorage.getItem('id'))) return ;

    const modalContent = document.getElementById('modalContent');
    const profileOptions = document.createElement('div');
    profileOptions.classList.add('d-flex', 'gap-2', 'align-items-center', 'justify-content-center', 'start-50', 'end-50', 'z-ultimate', 'position-sticky', 'transform-middle');
    profileOptions.style.top = '85%';
    profileOptions.id = 'profileOptions';
    profileOptions.innerHTML = `
        <button id="friendInvite" onclick="Invite(${current_user.id}, 'friend')" class="button-rp text-white border-transparent-2 rounded-3 bg-bubblegum transition-all p-2">
            <img src="/static/img/general/AddFriend.png" width="40px" height="40px" alt="Add this Friend">
        </button>
        <button id="GameInvite" onclick="Invite(${current_user.id}, 'game')" class="button-rp text-white border-transparent-2 rounded-3 bg-blueberry transition-all p-2">
            <img src="/static/img/general/InviteGame.png" width="40px" height="40px" alt="Duel this friend">
        </button>`;
    modalContent.appendChild(profileOptions);
}

export function spawnAccountSearchMenu() {
    const element = document.getElementById('account_finder');
    const input = element.querySelector('input');
    const modalContent = document.getElementById('modalContent');
    account_finder_active = true;
    element.classList.remove('d-none');
    element.classList.add('d-flex');
    modalContent.classList.add('overlay');
    input.focus();
    setTimeout(() => {
        element.classList.remove('opacity-0');
        element.classList.add('opacity-100');
    }, 250);
    users_search.removeEventListener('input', seachForUsers);
    users_search.addEventListener('input', seachForUsers);
    document.onclick = function (e) {
        if (element.classList.contains('d-flex') === true) {
            if (e.target.closest('#account_finder') === null && e.target.id !== 'account_search_btn')
                eliminateAccountSearchMenu(element);
        }
    };
}

function eliminateAccountSearchMenu(element) {
    const modalContent = document.getElementById('modalContent');
    account_finder_active = false;
    element.classList.remove('opacity-100');
    element.classList.add('opacity-0');
    if (modalContent.querySelector("#loadingOverlay") === null)
        modalContent.classList.remove('overlay');
    setTimeout(() => {
        element.classList.add('d-none');
        element.classList.remove('d-flex');
    }, 250);
}

export function DisplayProfileDetails(id) {
    if (id == undefined || id == null) return;
    fetch ("https://127.0.0.1:8001/userdata/" + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access'),
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        for (const [key, value] of Object.entries(data)) {
            current_user[key] = value;
        }
        sessionStorage.setItem("profile", JSON.stringify(current_user));
        passUserTo('/profile');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayUsersOnTheSearchMenu(data) {
    const search_result = document.getElementById('search_result');
    search_result.innerHTML = '';
    if (Object.keys(data).length == 0) {
        search_result.innerHTML = `<p class="m-auto text-white fw-lighter fs-5">No user was found</p>`;
        return;
    }
    for (const [key, value] of Object.entries(data)) {
        const each_player = {
            id: value.id,
            username: value.username,
            pfp: value.profilepic,
            xp: value.xp,
            level: value.level,
            title: value.title,
        }
        const div = document.createElement('div');
        div.classList.add('d-flex', 'align-items-center', 'bg-white-transparent-0-15', 'border-transparent-1', 'rounded-3', 'p-1', 'justify-content-between', 'w-100', 'hover-cursor');
        div.onclick = () => { DisplayProfileDetails(each_player.id); };
        div.innerHTML = `
        <div class="d-flex align-items-center gap-1">
            <img src="${each_player.pfp}" width="50px" height="50px" class="rounded-3 object-fit-cover border-transparent-0-5">
            <p class="text-white nokora m-0 fw-light">${each_player.username}</p>
        </div>
        <div class="d-flex flex-column">
            <table>
                <tr>
                    <td class="text-white nokora m-0 pe-1 pb-1">
                        <img src="/static/img/dashboard_utils/XP.png" alt="XP" width="24px">
                    </td>
                    <td class="text-white nokora m-0 text-end fw-light text-truncate">${each_player.xp}</td>
                </tr>
                <tr>
                    <td class="text-white nokora m-0 pe-1">
                        <img src="/static/img/dashboard_utils/LVL.png" alt="XP" width="24px">
                    </td>
                    <td class="text-white nokora m-0 text-end fw-light text-truncate">${each_player.level}</td>
                </tr>
            </table>
        </div>`;
        search_result.appendChild(div);
    }
    search_result.children[0].focus();
}

function findUsersData(search_term) {
    if (search_term == '' || search_term.search(' ') != -1) {
        const search_result = document.getElementById('search_result');
        search_result.innerHTML = `<p class="m-auto text-white fw-lighter fs-5">No user was found</p>`;
        return;
    }
    fetch('https://127.0.0.1:8002/userdata/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('access'),
        },
        body: JSON.stringify({
            'search_term': search_term
        })
    })
    .then(response => response.json())
    .then(data => {
        displayUsersOnTheSearchMenu(data);
    });
}

function clearSearchResult() {
    const search_result = document.getElementById('search_result');
    if (search_result.children.length > 0) 
        if (search_result.children[0].classList.contains('spinner-border') == true) return;
    search_result.innerHTML = `
    <div class="spinner-border text-white m-auto" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>`;
}

function seachForUsers() {
    const users_search = document.getElementById('users_search');
    if (last_search_id != undefined) {
        clearTimeout(last_search_id);
    }
    clearSearchResult();
    last_search_id = setTimeout(() => { findUsersData(users_search.value); }, 500);
}

function initiateAccountSearchMenuEvents() {
    const search_result = document.getElementById('search_result');
    const account_finder = document.getElementById('account_finder');
    if (account_finder) {
        if (account_finder_active == false) {
            document.onkeydown = function (e) {
                if ((e.key === 'k' && e.altKey === true || e.key === 'k' && e.metaKey === true) || e.key == "Escape") {
                    (e.key == "Escape" ? eliminateAccountSearchMenu : spawnAccountSearchMenu)(account_finder);
                    e.preventDefault();
                } else if (e.key === 'Enter') {
                    if (search_result.children.length > 0)
                        search_result.children[0].click();
                }
            };
        }
    }
}

function DetectOSAndReturnKey() {
    const OS = navigator.platform;
    if (OS.includes('Mac')) {
        return '<img src="/static/img/general/CommandKey.png" alt="Command or Alt Key" width="26px">';
    } else if (OS.includes('Win') || OS.includes('Linux')) {
        return '<img class="opacity-75" src="/static/img/general/alt.png" alt="Command or Alt Key" width="26px">';
    } else {
        return ""
    }
}

export function enableAccountSearchMenu() {
    if (getCookie('access') != '') {
        const modalContent = document.getElementById('modalContent');
        const div = document.createElement('div');
        div.classList.add('d-none', 'flex-column', 'bg-black-transparent-0-75', 'rounded-4', 'border-transparent-0-5', 'opacity-0' ,'p-2', 'justify-content-center', 'transition-all', 'backdrop-filter-blur', 'z-20', 'position-absolute', 'top-50', 'start-50', 'translate-middle');
        div.id = 'account_finder';
        div.innerHTML = `
        <div class="w-100 d-flex flex-column mb-2">
            <div class="d-flex align-items-center justify-content-between">
            <label for="users_search" class="text-white nokora fs-5 fw-light opacity-75">Account Search</label>
            <div class="d-flex align-items-center mb-1 opacity-75">
                ${DetectOSAndReturnKey()}
                <img src="/static/img/general/K.png" alt="K Key" width="24px">
            </div>
            </div>
            <input type="text" id="users_search" class="bg-white-transparent-0-25 border-transparent-0-5 px-2 text-white fs-5 fw-light" placeholder="Search for Someone">
        </div>
        <div class="d-flex flex-column justify-content-start bg-white-transparent-0-15 rounded-3 p-2 border-transparent-0-5" style="height: 300px;">
            <div id="search_result" class="w-100 align-items-center p-1 d-flex flex-column gap-1 h-100 w-100 overflow-y-auto">
                <p class="m-auto text-white fw-lighter fs-5">No user was found</p>
            </div>
        </div>`;
        if (document.getElementById('account_finder') === null) {
            modalContent.appendChild(div);
        } else {
            const old_div = document.getElementById('account_finder');
            eliminateAccountSearchMenu(old_div);
        }
        initiateAccountSearchMenuEvents();
    }
}

window.spawnAccountSearchMenu = spawnAccountSearchMenu;
window.DisplayProfileDetails = DisplayProfileDetails;
window.Invite = Invite;