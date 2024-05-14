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

class UserData {
    constructor(id, username, email, fname, lname, pfp, bg, about, regdate, cids) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fname = fname;
        this.lname = lname;
        this.pfp = pfp;
        this.bg = bg;
        this.about = about;
        this.regdate = regdate;
        this.cids = cids;
    }
    getID() {
        return this.id;
    }
    getUsername() {
        return this.username;
    }
    getEmail() {
        return this.email;
    }
    getFname() {
        return this.fname;
    }
    getLname() {
        return this.lname;
    }
    getPfp() {
        return this.pfp;
    }
    getBg() {
        return this.bg;
    }
    getAbout() {
        return this.about;
    }
    getRegdate() {
        return this.regdate;
    }
    getCids() {
        return this.cids;
    }
}

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
                throw new Error('Token Expired or Invalid');
            }
        })
        .then(data => {
            for (const [key, value] of Object.entries(data)) {
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
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        });
    }
}
function setDashboardStats() {
    let date = new Date(sessionStorage.getItem('regdate'));
    let username = document.getElementById('username');
    username.innerHTML = sessionStorage.getItem('username');
    let player_id = document.getElementById('player_id');
    player_id.innerHTML = `RP-ID-${sessionStorage.getItem('id')}`;
    let full_name = document.getElementById('full_name');
    full_name.innerHTML = `${sessionStorage.getItem('fname')} ${sessionStorage.getItem('lname')}`;
    let email = document.getElementById('email');
    email.innerHTML = sessionStorage.getItem('email');
    let regdate = document.getElementById('regdate');
    regdate.innerHTML = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}