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

import { getCookie, setLoadingOverlay } from "./userdata.js";
import { DisplayNavBar, scanLinks } from "./events.js";
import { initiateTwoFactorModal } from "./twoFactor.js";

function toast(message, color_class) {
    let div = document.createElement('div');
    div.id = 'login-toast';
    div.classList.add('toast', 'align-items-center', color_class, 'border-0', 'slide-in-blurred-top', 'position-absolute', 'translate-middle');
    div.style.zIndex = '99999';
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

    document.body.appendChild(div);
    
    div.style.display = 'block';
    div.style.top = '100px';
    div.style.left = '50%';
    div.style.right = '50%';
    destroytoast(div);
    return div;
}

function settoastmsg(toast, message, color_class) {
    toast.children[0].children[0].textContent = message;
    toast.classList.add(color_class);
}

function destroytoast(toasty) {
    setTimeout(() => {
        toasty.remove();
    }, 2000);
}

export function passUserTo(path) {
    if (path === '' || path === null || path === undefined)
            path = '/';
    const dashboard = document.createElement('a');
    dashboard.href = path;
    document.body.appendChild(dashboard);
    scanLinks();
    dashboard.click();
    dashboard.remove();
}

export function loginWith42() {
    fetch(`https://${window.env.HOST_ADDRESS}:${window.env.USERMGR_PORT}/userdata/42login`)
    .then(response => {
        if (response.status === 200) {
            return response.text();
        }
    })
    .then(data => {
        window.location.href = data;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export function log_user_in() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let toasty = toast('Logging in...', 'bg-primary');
    if (username === undefined || password === undefined || username === null || password === null  || username === '' || password === '') {
        settoastmsg(toasty, 'Please fill in all fields', 'bg-danger');
        return;
    }
    let data = {
        username: username,
        password: password
    };
    setLoadingOverlay(true);
    fetch(`https://${window.env.HOST_ADDRESS}:${window.env.AUTH_PORT}/auth/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        setLoadingOverlay(false);
        if (response.status >= 400 && response.status < 500) {
            settoastmsg(toasty, 'Login failed', 'bg-danger');
            throw new Error('Invalid credentials');
        } else if (response.status >= 500) {
            settoastmsg(toasty, 'Login failed', 'bg-danger');
            throw new Error('Server error');
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (getCookie('2fa') != '') {
            initiateTwoFactorModal();
        } else {
            DisplayNavBar();
            localStorage.setItem('user_id', data.user_id);
            settoastmsg(toasty, 'Login successful, Redirecting...', 'bg-success');
            passUserTo("/dashboard");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function block_inputs(inputs) {
    inputs.forEach(input => {
        input.disabled = true;
    });
}

function unblock_inputs(inputs) {
    inputs.forEach(input => {
        input.disabled = false;
    });
}

function check_pass_strength(pass) {
    if (pass.length < 8) {
        toast('Password must be at least 8 characters long', 'bg-danger');
        return false;
    }
    if (pass.search(/[a-z]/) === -1) {
        toast('Password must contain at least one lowercase letter', 'bg-danger');
        return false;
    }
    if (pass.search(/[A-Z]/) === -1) {
        toast('Password must contain at least one uppercase letter', 'bg-danger');
        return false;
    }
    if (pass.search(/[0-9]/) === -1) {
        toast('Password must contain at least one number', 'bg-danger');
        return false;
    }
    // if (pass.search(/[!@#$%^&*;]/) === -1) {
    //     toast('Password must contain at least one special character', 'bg-danger');
    //     return false;
    // }
}

export function register_user() {
    const inputs = document.querySelectorAll('input');
    const btn = document.querySelector('button');
    toast('Registering...', 'bg-primary');
    block_inputs(inputs);
    btn.disabled = true;
    inputs.forEach(input => {
        if (input.value === '' || input.value === null || input.value === undefined) {
            toast('Please fill in all fields', 'bg-danger');
            unblock_inputs(inputs);
            btn.disabled = false;
            return;
        }
    });
    
    const uUsername = inputs[1].value;
    const uPassword = inputs[3].value;
    const uEmail = inputs[2].value;
    const uFullName = inputs[0].value.split(' ');
    const uFname = uFullName[0];
    const uLname = uFullName[1];
    
    
    if (check_pass_strength(uPassword) === false) {
        unblock_inputs(inputs);
        btn.disabled = false;
        return;
    }
    const data = {
        "uUsername": uUsername,
        "uPassword": uPassword,
        "uEmail": uEmail,
        "uFname": uFname,
        "uLname": uLname,
    }
    setLoadingOverlay(true);
    fetch(`https://${window.env.HOST_ADDRESS}:${window.env.USERMGR_PORT}/userdata/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        setLoadingOverlay(false);
        if (response.status === 201) {
            toast('Registration successful, Redirecting...', 'bg-success');
            DisplayNavBar();
            passUserTo('/dashboard')
        } else if (response.status === 409)
            toast('Username/Email already exists', 'bg-danger');
        else if (response.status >= 400 && response.status < 500)
            toast('Invalid credentials', 'bg-danger');
        if (response.status > 201) {
            unblock_inputs(inputs);
            btn.disabled = false;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        unblock_inputs(inputs);
        setLoadingOverlay(false);
    });
}

window.log_user_in = log_user_in;
window.register_user = register_user;
window.loginWith42 = loginWith42;