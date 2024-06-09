const updated_values = {};
const pairs = {
    'd-sm-none': 'd-sm-flex',
    'd-md-none': 'd-md-flex',
    'd-lg-none': 'd-lg-flex',
}

function parseValue(key, value, sessionStorageValue) {
    if (key === "desc") {
        if (value === sessionStorageValue) {
            delete updated_values[key];
            if (Object.keys(updated_values).length === 0)
                DestroyConfirmationPopUp();
            return 1;
        }
    }
    else if (key != 'desc') 
    {
        if (value === '') {
            delete updated_values[key];
            if (Object.keys(updated_values).length === 0)
                DestroyConfirmationPopUp();
            return 1;
        }
        else if (value === sessionStorageValue) {
            delete updated_values[key];
            if (Object.keys(updated_values).length === 0)
                DestroyConfirmationPopUp();
            return 1;
        }
    }
    return 0;
}

function switchTabsHandler() {
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const mobile_nav_btn = document.getElementById('mobile_nav_btn');
    tabs[0].classList.add('tab-btn-active');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function() {
            tabs[i].classList.add('tab-btn-active');
            for (let j = 0; j < tabs.length; j++)
            {
                if (j == i) {
                    tabContents[j].classList.add('d-flex');
                    tabContents[j].classList.remove('d-none');
                }
                else {
                    tabs[j].classList.remove('tab-btn-active');
                    tabContents[j].classList.remove('d-flex');
                    tabContents[j].classList.add('d-none');
                }
            }
            if (window.innerWidth < 768)
                mobile_nav_btn.click();
        });
    }
    mobile_nav_btn.addEventListener('click', function() {
        const sidesetbar = document.getElementById('sidesetbar');
        for (const [key, value] of Object.entries(pairs)) {
            sidesetbar.classList.contains(key) ? (sidesetbar.classList.remove(key), sidesetbar.classList.add(value))  : (sidesetbar.classList.remove(value), sidesetbar.classList.add(key));
        }

    });
}

function handleUpload(type) {
    const fileUpload = document.createElement('input');
    fileUpload.type = 'file';
    fileUpload.accept = 'image/*';
    fileUpload.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            console.log("File selected: ", this.files[0].name);
            if (type === "pfp") {
                updated_values['pfp'] = this.files[0];
                console.log("pfp size:", this.files[0].size);
            } else if (type === "bg") {
                updated_values['bg'] = this.files[0];
                console.log("pfp size:", this.files[0].size);
            }
            DisplayConfirmationPopUp();
        }
    });
    fileUpload.click();
}

function acquireHTMLValues() {
    const pfp = document.getElementById('pfp');
    const bg = document.getElementById('bg');
    const fullName = document.getElementById('fullName');
    const username = document.getElementById('userName');
    const title = document.getElementById('title');
    const desc = document.getElementById('desc');
    const tfa = document.getElementById('2fa_text');
    const tfa_status = document.getElementById('2fa_status');
    const tfa_btn =  document.querySelector('#tfa_btn');
    const discordid = document.getElementById('discord_id_old');
    return { pfp, bg, fullName, username, title, desc, tfa, tfa_status, tfa_btn, discordid };

}

function acquireSessionData()
{
    const values = {
        pfp: sessionStorage.getItem('profilepic'),
        bg: sessionStorage.getItem('profilebgpic'),
        fullName: sessionStorage.getItem('full_name'),
        username: sessionStorage.getItem('username'),
        title: sessionStorage.getItem('title'),
        desc: sessionStorage.getItem('desc'),
        tfa: sessionStorage.getItem('two_factor'),
        discordid: sessionStorage.getItem('discordid'),
    };
    return values;
}

function setSettingsValues(HTMLElements, values) {
    HTMLElements.pfp.style.backgroundImage = `url('${values.pfp}')`;
    HTMLElements.bg.style.backgroundImage = `url('${values.bg}')`;
    HTMLElements.fullName.innerHTML = values.fullName;
    HTMLElements.username.innerHTML = values.username;
    HTMLElements.title.innerHTML = values.title === '' ? 'No title' : values.title;
    HTMLElements.desc.innerHTML = values.desc;
    HTMLElements.tfa.innerHTML = values.tfa === 'false' ? 'Enable' : 'Disable';
    HTMLElements.tfa_status.innerHTML = values.tfa === 'false' ? 'Enable' : 'Disable';
    HTMLElements.tfa_btn.setAttribute('status', values.tfa);
    HTMLElements.discordid.innerHTML = values.discordid === '' ? 'No Discord ID' : values.discordid;
    console.log("PFP:", HTMLElements.pfp.style.backgroundImage);
    console.log("BG:", HTMLElements.bg.style.backgroundImage);

}

function DestroyConfirmationPopUp() {
    if (document.querySelector('.confirmation_popup') !== null) {
        document.querySelector('.confirmation_popup').classList.remove('open');
        setTimeout(() => {
            document.querySelector('.confirmation_popup').remove();
        }, 350);
    }
}

function DisplayConfirmationPopUp() {
    if (document.querySelector('.confirmation_popup') === null) {
        const confirmation_popup = document.createElement('div');
        confirmation_popup.classList.add('position-absolute', 'border-transparent-0-5', 'bg-black-transparent-0-25', 'confirmation_popup', 'rounded-3');
        confirmation_popup.innerHTML = ` 
        <div class="d-flex flex-column justify-content-between align-items-center align-items-center position-relative w-100 h-100">
            <div class="d-flex align-items-center w-100 px-1">
                <p class="m-0 fs-5 text-white taprom line-height-1">Status Update</p>
                <img src="/static/img/general/Close.png" width="24px" height="24px" class="border rounded-1 ms-auto p-1 close_btn ">
            </div>
            <div class="line w-100"></div>
            <div class="status_body flex-fill d-flex flex-column align-items-center w-100 p-2">
                <p class="text-white nokora fw-light my-auto">
                    New Changes has been detected.<br> Do you want to save the changes?
                </p>
                <button class="btn bg-bubblegum text-white w-100" onclick="SaveChanges()" >Save Changes</button>
            </div>
        </div>`;
        document.body.appendChild(confirmation_popup);
        document.querySelector('.close_btn').addEventListener('click', function() {
            confirmation_popup.classList.remove('open');
            setTimeout(() => {
                confirmation_popup.remove();
            }, 350);
        });
        setTimeout(() => {
            confirmation_popup.classList.add('open');
        }, 250);
    }
}

function SaveChanges() {
    DestroyConfirmationPopUp();
    if (Object.keys(updated_values).length === 0){
        toast('No changes detected', 'bg-danger')
        return ;    
    }
    if (updated_values.Password && check_pass_strength(updated_values.Password) === false) {
        toast('Password too weak', 'bg-danger');
        return ;
    }
    for (const [key, value] of Object.entries(updated_values)) {
        if (parseValue(key, value, sessionStorage.getItem(key)) === 1 && updated_values['pfp'] === undefined && updated_values['bg'] === undefined) {
            toast('No changes detected', 'bg-danger');
            return ;
        }
    }
    const form = new FormData();
    for (const key in updated_values) {
        form.append(key, updated_values[key]);
    }
    clearInterval(fetchID);
    fetch('http://127.0.0.1:8001/userdata/update', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access'),
        },
        body: form,
    })
    .then(response => response.json())
    .then (response => {
        for (const key of Object.entries(updated_values))
            delete updated_values[key];
        setValuesToSessionStorage(response);
        loadAccountDetailsInSettings();
        fetchID = setInterval(fetchUserData, 5000);
    })
    .catch((error) => {
        console.log(error);
        toast('An error occured', 'bg-danger');
    })
}

function initiateEventHandlers(updated_values) {
    const textarea = document.querySelector('textarea');
    const tfa_btn = document.getElementById('tfa_btn');
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            updated_values[this.id] = this.value;
            DisplayConfirmationPopUp();
            parseValue(this.id, this.value, sessionStorage.getItem(this.id));
        });
    });
    textarea.addEventListener('input', function() {
        updated_values[this.id] = this.value;
        DisplayConfirmationPopUp();
        parseValue(this.id, this.value, sessionStorage.getItem(this.id));
    });
    tfa_btn.addEventListener('click', function() {
        if (this.getAttribute('status') === 'true') {
            this.setAttribute('status', 'false');
            updated_values['two_factor'] = 'false';
            document.getElementById('2fa_text').innerHTML = 'Enable';
            document.getElementById('2fa_status').innerHTML = 'Enable';
        } else {
            this.setAttribute('status', 'true');
            updated_values['two_factor'] = 'true';
            document.getElementById('2fa_text').innerHTML = 'Disable';
            document.getElementById('2fa_status').innerHTML = 'Disable';
        }
        DisplayConfirmationPopUp();
        parseValue('two_factor', this.getAttribute('status'), sessionStorage.getItem('two_factor'));
    });
}

function loadAccountDetailsInSettings(boolean = false) {
    const HTMLElements = acquireHTMLValues();
    const values = acquireSessionData();
    setSettingsValues(HTMLElements, values);
    if (boolean === true)
        initiateEventHandlers(updated_values);
}

function DeleteAccountPrompt() {
        const overlay = document.createElement('div');
        overlay.classList.add('position-absolute', 'w-100', 'h-100', 'bg-black-transparent-0-5', 'z-20');
        document.body.appendChild(overlay);
        const confirmation_message = document.createElement('div');
        confirmation_message.classList.add('position-absolute', 'border-transparent-0-5', 'confirmation_message', 'rounded-3', 'z-20');
        confirmation_message.innerHTML = ` 
        <div class="d-flex flex-column justify-content-between align-items-center align-items-center position-relative w-100 h-100">
            <div class="d-flex align-items-center w-100 px-1">
                <p class="m-0 fs-5 text-white taprom line-height-1">Status Update</p>
                <img src="/static/img/general/Close.png" width="24px" height="24px" class="border rounded-1 ms-auto p-1 close_btn_2 ">
            </div>
            <div class="line w-100"></div>
            <div class="status_body flex-fill d-flex flex-column align-items-center w-100 p-2">
                <p class="text-white nokora fw-light my-auto text-center">
                    This Account will be <span class="text-danger">DELETED</span>.<br> Do you want to procceed?
                </p>
                <button id="D_account" class="btn bg-danger text-white w-100" onclick="DeleteAccount()" >Delete Account</button>
            </div>
        </div>`;
        document.body.appendChild(confirmation_message);
        document.querySelector('.close_btn_2').addEventListener('click', function() {
            confirmation_message.classList.remove('open');
            setTimeout(() => {
                confirmation_message.remove();
                overlay.remove();
            }, 500);
        });
        setTimeout(() => {
            confirmation_message.classList.add('open');
        }, 250);
}

function DeleteAccount() {
    const btn = document.getElementById('D_account');
    btn.innerHTML = `<div class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>`;
    fetch('http://127.0.0.1:8001/userdata/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('access'),
        },
        body: JSON.stringify({}),
    }).then(response => response.json())
    .then(data => {
        btn.innerHTML = 'Account Deleted Successfuly';
        setTimeout(() => {
            sessionStorage.clear();
            clearInterval(fetchID);
            delete_cookie('access');
            window.location.href = '/';
        }, 1000);
    })
    .catch((error) => {
        toast('An error occured', 'bg-danger');
        document.querySelector('.close_btn_2').click();
    });

}