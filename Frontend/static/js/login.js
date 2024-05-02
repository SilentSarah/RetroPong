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
    return div;
}

function settoastmsg(toast, message, color_class) {
    toast.children[0].children[0].innerHTML = message;
    toast.classList.add(color_class);
}

function destroytoast(toasty) {
    setTimeout(() => {
        toasty.remove();
    }, 1000);
}

function passUserToDashboard() {
    setTimeout(() => {
    window.location.href = '/dashboard';
    }, 1200);
}

function loginWith42() {
    fetch("http://127.0.0.1:8001/userdata/42login")
    .then(response => {
        if (response.status === 200) {
            return response.text();
        } else {
            throw new Error('Server error');
        }
    })
    .then(data => {
        console.log('Success:', data);
        window.location.href = data;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
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
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 201) {
            return response.json();
        } else if (response.status >= 400 && response.status < 500) {
            throw new Error('Invalid credentials');
        } else {
            throw new Error('Server error');
        }
    })
    .then(data => {
        console.log('Success:', data);
        localStorage.setItem('user_id', data.user_id);
        settoastmsg(toasty, 'Login successful, Redirecting...', 'bg-success');
        destroytoast(toasty);
        passUserToDashboard();
    })
    .catch((error) => {
        console.error('Error:', error);
        settoastmsg(toasty, 'Login failed', 'bg-danger');
        destroytoast(toasty);
        passUserToDashboard();
    });
}