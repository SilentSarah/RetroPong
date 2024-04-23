
function confirmOperartion(type, parent) {
    let Confirmation = document.createElement('div');
    if (type === 'copy') {
        document.getElementById('copyConfirm') ? parent.removeChild(document.getElementById('copyConfirm')) : null;
        Confirmation.id = 'copyConfirm';
        Confirmation.innerHTML = ' Copied to clipboard!';
        Confirmation.classList.add('nokora', 'text-white');
        Confirmation.style.fontSize = '0.5rem';
        parent.appendChild(Confirmation);
        setTimeout(() => {
            parent.removeChild(Confirmation);
        }, 1000);
    }
}

function Click() {  

    // this part about the details users when click on the channel image
    let open_chat_btn = document.getElementById('#open_chat_btn'); // to open the menu
    let close_chat_btn = document.getElementById('#close_chat_btn');    // to close the menu
    let blur_id = document.getElementById('#blur_id');      // to blur the background
    let menu_items = document.getElementById('#menu_items');  // to show the menu items

    let open_member_btn = document.getElementById('#open_members_btn'); // to open the menu
    let close_member_btn = document.getElementById('#close_members_btn');    // to close the menu
    let menu_items_1 = document.getElementById('#menu_items-1');  // to show the menu items

    if (open_chat_btn && close_chat_btn && blur_id) {
        open_chat_btn.addEventListener('click', function () { // to open the menu
            close_chat_btn.classList.remove('d-none');
            blur_id.style.filter = 'blur(5px)';
            menu_items.classList.remove('d-none');
        });
        close_chat_btn.addEventListener('click', function () { // to close the menu
            menu_items.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
            open_member_btn.classList.remove('d-none');
        });
        window.addEventListener('resize', function () { // to close the menu when the window is resized
            close_chat_btn.classList.add('d-none');
            menu_items.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
            close_member_btn.classList.add('d-none');
            menu_items_1.classList.add('d-none');
        })
    }

    // this part about the details users when click on the member image
    if (open_member_btn && close_member_btn && blur_id) {
        open_member_btn.addEventListener('click', function () { // to open the menu
            open_member_btn.classList.add('d-none');
            close_member_btn.classList.remove('d-none');
            blur_id.style.filter = 'blur(5px)';
            menu_items_1.classList.remove('d-none');
        });
        close_member_btn.addEventListener('click', function () { // to close the menu
            open_member_btn.classList.remove('d-none');
            close_member_btn.classList.add('d-none');
            menu_items_1.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
        });
    }
  

    // this part about the details users when click on the user image
    let click = document.getElementById("#user_img");
    let details = document.getElementById("#details");
    window.addEventListener('click', function (event) {
        if (event.target.className === click.className) {
            console.log(event.clientY)
            let Y = event.clientY;
            let X = event.clientX;
            details.classList.remove('d-none');
            details.style.top = (Y - 233) + 'px';
            details.style.left = (X - 200) + 'px';
        }
        this.window.addEventListener('resize', function () {
            details.classList.add('d-none');
        })
        this.window.addEventListener('click', function (event) {
           if(event.target.className !== click.className){
                details.classList.add('d-none');
            }
        })
    })

    // this part about the chat section to keep the scroll in the bottom
    let scroll_chat = document.getElementById("#items-right-center-bottom");
    window.addEventListener('click', function () {
        console.log(scroll_chat.scrollTop,  scroll_chat.scrollHeight) 
        scroll_chat.scrollTop = scroll_chat.scrollHeight;  // to keep scroll position in bottom
    })

    // this part about the descover and chat section in the mobile view
    let descover_btn = document.getElementById("#descover_btn"); // to show the descover section
    let chat_btn = document.getElementById("#chat_btn"); // to show the chat section
    let section_descover = document.getElementById("#section_descover");
    let section_chat = document.getElementById("#section_chat");
    if(descover_btn && section_descover && section_chat){
         descover_btn.addEventListener('click',function(){
            section_descover.classList.remove('d-none');
            section_chat.classList.add('d-none');
            open_chat_btn.classList.remove('d-none');
            close_chat_btn.classList.add('d-none');
            menu_items.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
        })

        chat_btn.addEventListener('click',function(){
            section_descover.classList.add('d-none');
            section_chat.classList.remove('d-none');
            open_chat_btn.classList.remove('d-none');
            close_chat_btn.classList.add('d-none');
            menu_items.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
        })
        
    }
    // this part about the descover and chat section in the laptop view
    let descover_btn_lg = document.getElementById("#descover_btn_lg"); // to show the descover section
    let chat_btn_lg = document.getElementById("#chat_btn_lg"); // to show the chat section
    if(descover_btn_lg && section_descover && section_chat){
         descover_btn_lg.addEventListener('click',function(){
            section_descover.classList.remove('d-none');
            section_chat.classList.add('d-none');
            open_chat_btn.classList.remove('d-none');
            close_chat_btn.classList.add('d-none');
            menu_items.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
            open_member_btn.classList.add('d-none');
        })

        chat_btn_lg.addEventListener('click',function(){
            section_descover.classList.add('d-none');
            section_chat.classList.remove('d-none');
            open_chat_btn.classList.remove('d-none');
            close_chat_btn.classList.add('d-none');
            menu_items.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
            open_member_btn.classList.remove('d-none');

        })
        
    }

    // this part about the menu items to expand and collapse the items
    let arrow_left = document.getElementById("#arrow_left");
    let arrow_right = document.getElementById("#arrow_right");
    let items_left = document.getElementById("#items_left");
    let btns_less_more = document.getElementById("#btns_less_more");
    if(arrow_left && arrow_right)
    {
        arrow_left.addEventListener('click',function(){
            arrow_left.classList.add('d-none');
            arrow_right.classList.remove('d-none');
            btns_less_more.style.left = '60px';
            items_left.style.minWidth = '60px';
            items_left.style.width = '60px';
        })
        arrow_right.addEventListener('click',function(){    
            arrow_left.classList.remove('d-none');
            arrow_right.classList.add('d-none');
            btns_less_more.style.left = '180px';
            items_left.style.minWidth = '180px';
            items_left.style.width = '180px';
         }
        )
    }

    // check if was in section chat or descover to show the right section
    // window.addEventListener('load',function(){
    //     console.log(window)
    //     console.log(object)
    // })
}

function scanInput() {
    let items = document.querySelectorAll('input');
    items.forEach(item => {
        item.addEventListener('keypress', function (e) {
            if (e.key === 'Enter')
                console.log('Enter key pressed');
        });
    });
}

function scanLinks() {
    window.addEventListener('popstate', router);
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            history.pushState(null, null, this.href);
            router();
        });
    });
}

function copyIDListener() {
    let cpyID = document.getElementById('cpyID');
    if (cpyID) {
        cpyID.addEventListener('click', function () {
            let copyText = document.getElementById('player_id');
            navigator.clipboard.writeText(copyText.innerHTML);
            confirmOperartion('copy', copyText.parentElement);

        });
    }
}

function handlePictureUploads() {
    let uploadBG = document.getElementById('uploadBG');
    let uploadPFP = document.getElementById('uploadPFP');
    let fileInputBg = document.createElement('input');
    let fileInputPfp = document.createElement('input');
    fileInputBg.type = 'file';
    fileInputPfp.type = 'file';
    if (uploadBG && uploadPFP) {
        uploadBG.addEventListener('click', function () {
            fileInputBg.click();
            if (fileInputBg.files) {
                // TO BE FURTHER IMPLEMENTED
            }

        });
        uploadPFP.addEventListener('click', function () {
            fileInputPfp.click();
            if (fileInputPfp.files) {
                // TO BE FURTHER IMPLEMENTED
            }
        });
    }
}

function TwoFactorAuthHandler() {
    let Offbtn = document.getElementById('offBtn');
    let Onbtn = document.getElementById('onBtn');
    if (Offbtn && Onbtn) {
        Offbtn.addEventListener('click', function () {
            Offbtn.setAttribute('fill', 'white');
            Offbtn.setAttribute('x', '7');
            Offbtn.setAttribute('y', '23');
            Offbtn.setAttribute('font-size', '17');
            //=====//
            Onbtn.setAttribute('fill', 'grey');
            Onbtn.setAttribute('x', '7');
            Onbtn.setAttribute('y', '23');
            Onbtn.setAttribute('font-size', '16');
            //=====//
            Onbtn.classList.remove('text-glow');
            Offbtn.classList.add('text-glow');
        });
        Onbtn.addEventListener('click', function () {
            Onbtn.setAttribute('fill', 'white');
            Onbtn.setAttribute('x', '7');
            Onbtn.setAttribute('y', '23');
            Onbtn.setAttribute('font-size', '17');
            //=====//
            Offbtn.setAttribute('fill', 'grey');
            Offbtn.setAttribute('x', '7');
            Offbtn.setAttribute('y', '23');
            Offbtn.setAttribute('font-size', '16');
            //=====//
            Offbtn.classList.remove('text-glow');
            Onbtn.classList.add('text-glow');

        });
    }
}

function findHighiestGrade(matches) {
    let highiest = 0;
    for([key, value] of Object.entries(matches)) {
        if (value['won'] > highiest) {
            highiest = value['won'];
        }
    }
    return highiest;

}

let ChartData = {
    'Matches Played': {
        "24/07": 15777,
        "25/07": 150,
        "26/07": 100,
        "27/07": 0,
    }
};

function loadEvents() {
    scanLinks();
    if (window.location.pathname === '/') {
            const Chart = new SSChart(ChartData, 'Matches Played', '/static/content/components/chart.html');
            Chart.Component.then(html => {
                document.getElementById('ChartMark').innerHTML = html;
                Chart.setChartTitle();
                Chart.setGrades();
                Chart.setDates();
                Chart.setBarValues();
            });
    }
    if (window.location.pathname === '/login' || window.location.pathname === '/register')
        scanInput();
    else if (window.location.pathname == '/dashboard' )
        copyIDListener();
    else if (window.location.pathname === '/settings' || window.location.pathname == '/') {
        handlePictureUploads();
        TwoFactorAuthHandler();
    }
    Click();
}