let account_finder_active = false;

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
                if (e.target.closest('#account_finder') === null && account_finder_active == true) {
                    eliminateAccountSearchMenu(account_finder);
                }
            
            }
        }
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
                <img src="/static/img/general/CommandKey.png" alt="Command or Alt Key" width="24px">
                <img src="/static/img/general/K.png" alt="Command or Alt Key" width="24px">
            </div>
            </div>
            <input type="text" id="users_search" class="bg-white-transparent-0-25 border-transparent-0-5 px-2 text-white fs-5 fw-light" placeholder="Search for Someone">
        </form>
        <div class="d-flex flex-column justify-content-start bg-white-transparent-0-15 rounded-3 p-2 border-transparent-0-5" style="height: 300px;">
            <div class="w-100 align-items-center p-1 d-flex flex-column gap-1 overflow-y-auto">
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