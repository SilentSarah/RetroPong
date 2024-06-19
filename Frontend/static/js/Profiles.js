let account_finder_active = false;
let last_search_id = undefined;

// I NEED TO IMPLEMENT AN OBJECT TO HOLD ALL THE PLAYERS THE USER HAS SEARCHED FOR

function spawnAccountSearchMenu(element) {
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
}

function eliminateAccountSearchMenu(element) {
    const modalContent = document.getElementById('modalContent');
    account_finder_active = false;
    element.classList.remove('opacity-100');
    element.classList.add('opacity-0');
    modalContent.classList.remove('overlay');
    setTimeout(() => {
        element.classList.add('d-none');
        element.classList.remove('d-flex');
    }, 250);
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
        div.classList.add('d-flex', 'align-items-center', 'bg-white-transparent-0-15', 'border-transparent-1', 'rounded-3', 'p-1', 'justify-content-between', 'w-100');
        div.innerHTML = `
        <div class="d-flex align-items-center gap-1" onclick="">
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
}

function findUsersData(search_term) {
    if (search_term == '' || search_term.search(' ') != -1) {
        const search_result = document.getElementById('search_result');
        search_result.innerHTML = `<p class="m-auto text-white fw-lighter fs-5">No user was found</p>`;
        return;
    }
    fetch ('http://127.0.0.1:8001/userdata/search', {
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
    const account_finder = document.getElementById('account_finder');
    if (account_finder) {
        if (account_finder_active == false) {
            document.onkeydown = function (e) {
                if ((e.key === 'k' && e.altKey === true || e.key === 'k' && e.metaKey === true) || e.key == "Escape") {
                    (e.key == "Escape" ? eliminateAccountSearchMenu : spawnAccountSearchMenu)(account_finder);
                    e.preventDefault();
                }
            };
            document.onclick = function (e) {
                if (e.target.closest('#account_finder') === null) {
                    eliminateAccountSearchMenu(account_finder);
                }
            }
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

function enableAccountSearchMenu() {
    if (getCookie('access') != '') {
        const modalContent = document.getElementById('modalContent');
        const div = document.createElement('div');
        div.classList.add('d-none', 'flex-column', 'bg-black-transparent-0-75', 'rounded-4', 'border-transparent-0-5', 'opacity-0' ,'p-2', 'justify-content-center', 'transition-all', 'backdrop-filter-blur', 'z-20', 'position-absolute', 'top-50', 'start-50', 'translate-middle');
        div.id = 'account_finder';
        div.innerHTML = `
        <form class="w-100 d-flex flex-column mb-2">
            <div class="d-flex align-items-center justify-content-between">
            <label for="users_search" class="text-white nokora fs-5 fw-light opacity-75">Account Search</label>
            <div class="d-flex align-items-center mb-1 opacity-75">
                ${DetectOSAndReturnKey()}
                <img src="/static/img/general/K.png" alt="K Key" width="24px">
            </div>
            </div>
            <input type="text" id="users_search" class="bg-white-transparent-0-25 border-transparent-0-5 px-2 text-white fs-5 fw-light" placeholder="Search for Someone">
        </form>
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