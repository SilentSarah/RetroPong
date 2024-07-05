import { getCookie } from "./userdata.js";

function initiateTwoFactorModal() {
    if (document.querySelector('.overlay') !== null) return;
    let overlay = document.createElement('div');
    overlay.classList.add('overlay', 'd-flex', 'align-items-center', 'justify-content-center');
    overlay.innerHTML = `
    <div
        id="two_factor_modal"
        class="border-transparent-1 bg-black-transparent-0-75 rounded-4"
        style="width: 450px; height:300px;">
        <div class="d-flex flex-column justify-content-between align-items-center p-2 h-100 position-relative">
            <img src="/static/img/general/Close.png" width="24px" height="24px" class="border rounded-1 ms-auto p-1 close_btn position-absolute" style="right: 2.5%; top: 3.5%">
            <h3 class="text-pink-gradient line-height-1 taprom text-shadow m-0 mt-1">RetroPong Guard</h3>
            <div class="line my-1"></div>
            <p class="nokora text-white m-0 mt-1 fw-light">2FA is enabled on this account</p>
            <p class="nokora text-white m-0 mt-1 fw-light">Please enter the code sent to your email</p>
            <div class="line my-1"></div>
            <form id="code_pin_form" class="d-flex align-items-center justify-content-evenly w-100 h-100">
                <input id="1" autofocus type="number"  class="rounded-3 border border-transparent-0-5 bg-white-transparent-0-15 text-white text-center fs-1 focus-none" style="width:12%; height:80%;">
                <input id="2" type="number" disabled class="rounded-3 border border-transparent-0-5 bg-white-transparent-0-15 text-white text-center fs-1 focus-none" style="width:12%; height:80%;">
                <input id="3" type="number" disabled class="rounded-3 border border-transparent-0-5 bg-white-transparent-0-15 text-white text-center fs-1 focus-none" style="width:12%; height:80%;">
                <input id="4" type="number" disabled class="rounded-3 border border-transparent-0-5 bg-white-transparent-0-15 text-white text-center fs-1 focus-none" style="width:12%; height:80%;">
                <input id="5" type="number" disabled class="rounded-3 border border-transparent-0-5 bg-white-transparent-0-15 text-white text-center fs-1 focus-none" style="width:12%; height:80%;">
                <input id="6" type="number" disabled class="rounded-3 border border-transparent-0-5 bg-white-transparent-0-15 text-white text-center fs-1 focus-none" style="width:12%; height:80%;">
            </form>
            <button class="btn bg-bubblegum button-rp nokora text-white fs-5 fw-light text-shadow py-2 w-100" onclick="Verify2FA()">Verify 2FA</button>
        </div>
    </div>`;
    setTimeout(() => {
        overlay.children[0].classList.add('open')
    }, 150);
    document.body.insertAdjacentElement('beforeend', overlay);
    initiateTFAEventHandlers();
}

function initiateTFAEventHandlers() {
    const overlay = document.querySelector('.overlay');
    const close_btn = document.querySelector('.close_btn');
    const code_pin_form = document.getElementById('code_pin_form');
    const code_inputs = code_pin_form.querySelectorAll('input');

    close_btn.addEventListener('click', function() { delete_cookie('2fa'); delete_cookie('user_id'); overlay.remove(); });
    code_inputs.forEach(input => {
        input.addEventListener('input', function () {
            if (input.value.length > 0) {
                let iter = input;
                if (input.value.length > 1) {
                    const string = input.value;
                    for (let i = 0; i < string.length; i++) {
                        iter.value = string[i];
                        if (iter.nextElementSibling !== null) {
                            iter = iter.nextElementSibling;
                            iter.disabled = false;
                            iter.focus();
                        }
                        else
                            break;
                    }
                }
                else if (input.nextElementSibling !== null) {
                    input.nextElementSibling.removeAttribute('disabled');
                    input.nextElementSibling.focus();
                }
            } else if (input.previousElementSibling !== null) {
                console.log("NEXT ID:",input.previousElementSibling.id)
                input.disabled = true;
                input.previousElementSibling.focus();
            }
        });
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                Verify2FA();
            }
            else if ("eE-+.".includes(event.key)) {
                event.preventDefault();
            }
        });
    });
}

function accumulateCode() {
    const code_pin_form = document.querySelector('#code_pin_form');
    return Array.from(code_pin_form.querySelectorAll('input')).reduce((acc, input) => {
        return acc + input.value;
    }, '');
}

export function scan2fa() {
    if (getCookie('2fa') != '') {
        initiateTwoFactorModal();
    }
}

function Verify2FA() {
    const accumulated_code = accumulateCode();
    if (accumulated_code.length < 6) {
        toast('Please enter the full code before verifying.', 'bg-danger');
        return;
    }
    fetch('http://127.0.0.1:8000/auth/2fa/verify', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code: accumulated_code
        })
    })
    .then(response => {
        if (response.status === 201) {
            toast('2FA verification successful', 'bg-success');
            document.querySelector('.overlay').remove();
            delete_cookie('2fa');
            DisplayNavBar();
            setTimeout(() => {
                passUserTo('/dashboard');
            }, 250);
            return response.json();
        } else if (response.status === 401 || response.status === 401) {
            toast('Invalid PIN code', 'bg-danger');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}