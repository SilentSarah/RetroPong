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

function passUserToDashboard() {
    const dashboard = document.createElement('a');
    dashboard.href = '/dashboard';
    document.body.appendChild(dashboard);
    scanLinks();
    dashboard.click();
}

function loginWith42() {
    fetch("http://127.0.0.1:8001/userdata/42login")
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

function storeCookies(data) {
	for (let key in data)
		document.cookie = `${key}=${data[key]}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function log_user_in() {
    let items = document.querySelectorAll('input');
    let username = items[0].value;
    let password = items[1].value;
    let toasty = toast('Logging in...', 'bg-primary');
    if (username === undefined || password === undefined || username === null || password === null  || username === '' || password === '') {
        settoastmsg(toasty, 'Please fill in all fields', 'bg-danger');
        return;
    }
    let data = {
        username: username,
        password: password
    };
    fetch('http://127.0.0.1:8000/auth/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 201) {
            return response.json();
        } else if (response.status >= 400 && response.status < 500) {
            settoastmsg(toasty, 'Login failed', 'bg-danger');
            throw new Error('Invalid credentials');
        } else {
            settoastmsg(toasty, 'Login failed', 'bg-danger');
            throw new Error('Server error');
        }
    })
    .then(data => {
        console.log('Success:', data);
        localStorage.setItem('user_id', data.user_id);
		storeCookies(data);
        settoastmsg(toasty, 'Login successful, Redirecting...', 'bg-success');
        DisplayNavBar();
        passUserToDashboard();
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

function register_user() {
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

    fetch('http://127.0.0.1:8001/userdata/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 201) {
            toast('Registration successful, Redirecting...', 'bg-success');
            DisplayNavBar();
            passUserToDashboard();
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
    });
}