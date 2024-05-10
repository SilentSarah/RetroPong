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

    // to open & close 
    let open_member_btn = document.getElementById('#open_members_btn');
    let close_member_btn = document.getElementById('#close_members_btn');
    let menu_items_1 = document.getElementById('#menu_items-1');  // to show the menu items


    let descover_btn = document.getElementById("#descover_btn"); // to show the descover section
    let chat_btn = document.getElementById("#chat_btn"); // to show the chat section
    let section_descover = document.getElementById("#section_descover");
    let section_chat = document.getElementById("#section_chat");

    if (open_chat_btn && close_chat_btn && blur_id) {
        open_chat_btn.addEventListener('click', function () { // to open the menu
            open_chat_btn.classList.add('d-none');
            close_chat_btn.classList.remove('d-none');
            blur_id.style.filter = 'blur(5px)';
            menu_items.classList.remove('d-none');
            open_member_btn.style.right = '-1000px';
        });
        close_chat_btn.addEventListener('click', function () { // to close the menu
            menu_items.classList.add('d-none');
            open_chat_btn.classList.remove('d-none');
            blur_id.style.filter = 'blur(0px)';
            console.log(section_chat.classList.contains('d-none'))
            if (!section_chat.classList.contains('d-none'))
                open_member_btn.style.right = '14px';
        });
        window.addEventListener('resize', function () { // to close the menu when the window is resized
            menu_items.classList.add('d-none');
            open_chat_btn.classList.remove('d-none');
            blur_id.style.filter = 'blur(0px)';
            console.log(section_chat.classList.contains('d-none'))
            if (!section_chat.classList.contains('d-none'))
                open_member_btn.style.right = '14px';
        })
    }

    // this part about the details users when click on the member image
    if (open_member_btn && close_member_btn && blur_id) {
        open_member_btn.addEventListener('click', function () { // to open the menu
            open_member_btn.style.right = '-1000px';
            close_member_btn.classList.remove('d-none');
            blur_id.style.filter = 'blur(5px)';
            menu_items_1.classList.remove('d-none');
            open_chat_btn.classList.add('d-none')
        });
        close_member_btn.addEventListener('click', function () { // to close the menu
            open_member_btn.style.right = '14px';
            close_member_btn.classList.add('d-none');
            menu_items_1.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
            open_chat_btn.classList.remove('d-none');
        });
        window.addEventListener('resize', function () {
            open_member_btn.style.right = '14px';
            close_member_btn.classList.add('d-none');
            menu_items_1.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
            open_chat_btn.classList.remove('d-none');
        })
    }


    // this part about the details users when click on the user image
    // let click = document.getElementById("#user_img");
    // let details = document.getElementById("#details");
    // window.addEventListener('click', function (event) {
    //     if (event.target.className === click.className && click) {
    //         console.log(event.clientY)
    //         let Y = event.clientY;
    //         let X = event.clientX;
    //         details.classList.remove('d-none');
    //         details.style.top = (Y - 233) + 'px';
    //         details.style.left = (X - 200) + 'px';
    //     }
    //     this.window.addEventListener('resize', function () {
    //         details.classList.add('d-none');
    //     })
    //     this.window.addEventListener('click', function (event) {
    //         if (event.target.className !== click.className) {
    //             details.classList.add('d-none');
    //         }
    //     })
    // })

    // this part about the chat section to keep the scroll in the bottom
    let scroll_chat = document.getElementById("#items-right-center-bottom");
    window.addEventListener('click', function () {
        scroll_chat.scrollTop = scroll_chat.scrollHeight;  // to keep scroll position in bottom
    })

    // this part about the descover and chat section in the mobile view
    // switch between the descover and chat section
    if (descover_btn && section_descover && section_chat) {
        descover_btn.addEventListener('click', function () {
            section_descover.classList.remove('d-none');
            section_chat.classList.add('d-none');
            open_chat_btn.classList.remove('d-none');
            close_chat_btn.classList.add('d-none');
            menu_items.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
            open_member_btn.style.right = '-1000px';
        })

        chat_btn.addEventListener('click', function () {
            section_descover.classList.add('d-none');
            section_chat.classList.remove('d-none');
            open_chat_btn.classList.remove('d-none');
            close_chat_btn.classList.add('d-none');
            menu_items.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
            open_member_btn.style.right = '14px';

        })

    }

    // this part about the descover and chat section in the large view
    let descover_btn_lg = document.getElementById("#descover_btn_lg"); // to show the descover section
    let btn_friends = document.getElementById("btn_friends"); // to show the chat section
    if (descover_btn_lg && section_descover && section_chat) {
        descover_btn_lg.addEventListener('click', function () {
            section_descover.classList.remove('d-none');
            section_chat.classList.add('d-none');
            open_chat_btn.classList.remove('d-none');
            close_chat_btn.classList.add('d-none');
            menu_items.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
            open_member_btn.classList.add('d-none');
        })
        btn_friends.addEventListener('click', function () {
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
    if (arrow_left && arrow_right) {
        arrow_left.addEventListener('click', function () {
            arrow_left.classList.add('d-none');
            arrow_right.classList.remove('d-none');
            btns_less_more.style.left = '60px';
            items_left.style.minWidth = '60px';
            items_left.style.width = '60px';
        })
        arrow_right.addEventListener('click', function () {
            arrow_left.classList.remove('d-none');
            arrow_right.classList.add('d-none');
            btns_less_more.style.left = '180px';
            items_left.style.minWidth = '180px';
            items_left.style.width = '180px';
        }
        )
    }
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


function filter_all_pending_online_blocks() {
    // buttons
    const btn_all = document.getElementById('btn_all');
    const btn_pending = document.getElementById('btn_pending');
    const btn_online = document.getElementById('btn_online');
    const btn_blocks = document.getElementById('btn_blocks');
    // filters
    const all = document.getElementById('all');
    const pending = document.getElementById('pending');
    const online = document.getElementById('online');
    const blocks = document.getElementById('blocks');
    const btns = [btn_all, btn_pending, btn_online, btn_blocks];
    const filters = [all, pending, online, blocks];
    const notify = document.getElementById('notify_msg');
    if(btn_all)
    btn_all.addEventListener('click', () => {
        all.classList.remove('d-none');
        btn_all.style.color = 'rgb(248, 65, 172)';
        filters.forEach(btn => {
            if (btn.id !== 'all')
                btn.classList.add('d-none');
        });
        btns.forEach(btn => {
            if (btn.id !== 'btn_all')
                btn.style.color = '';
        })
        // if(notify.style.display === 'flex')
        // {
        //     Remove_notification('message')
        //     notify.style.display = 'none'
        // }
    });
    const notify_invite = document.getElementById('notify_invite')

    if(btn_pending)
    btn_pending.addEventListener('click', () => {
        pending.classList.remove('d-none');
        btn_pending.style.color = 'rgb(248, 65, 172)';
        filters.forEach(btn => {
            if (btn.id !== 'pending')
                btn.classList.add('d-none');
        });
        btns.forEach(btn => {
            if (btn.id !== 'btn_pending')
                btn.style.color = '';
        })
        // if(notify_invite.style.display === 'flex')
        // {
        //     Remove_notification('invite')
        //     notify_invite.style.display = 'none'
        // }
    });
    if(btn_online)
    btn_online.addEventListener('click', () => {
        online.classList.remove('d-none');
        btn_online.style.color = 'rgb(248, 65, 172)';
        filters.forEach(btn => {
            if (btn.id !== 'online')
                btn.classList.add('d-none');
        });
        btns.forEach(btn => {
            if (btn.id !== 'btn_online')
                btn.style.color = '';
        })
    });
    if(btn_blocks)
    btn_blocks.addEventListener('click', () => {
        blocks.classList.remove('d-none');
        btn_blocks.style.color = 'rgb(248, 65, 172)';
        filters.forEach(btn => {
            if (btn.id !== 'blocks')
                btn.classList.add('d-none');
        });
        btns.forEach(btn => {
            if (btn.id !== 'btn_blocks')
                btn.style.color = '';
        })
    });
}

function transition_between_channels_and_friends() {
    const btn_channels = document.querySelectorAll('[id="btn_channel"]');
    console.log(btn_channels)
    const btn_friends = document.getElementById('btn_friends');
    const btn_friendss = document.getElementById('btn_friendss');
    
    const channels = document.getElementById('chat');
    const friends = document.querySelectorAll('[id="Friends"]');
    const bar_members = document.getElementById('bar_members');
    const dicover_section = document.getElementById('#section_descover');
    const chat_section = document.getElementById('#section_chat');

    if(btn_friends)
    btn_friends.addEventListener('click', () => {
        channels.classList.add('d-none');
        // members.classList.add('d-none');
        friends.forEach(friend => {
            console.log("object")
            friend.classList.remove('d-none');
        });
    });
    if(btn_friendss)
    btn_friendss.addEventListener('click', () => {
        channels.classList.add('d-none');
        // members.classList.add('d-none');
        friends.forEach(friend => {
            console.log("object")
            friend.classList.remove('d-none');
        });
    });
    if(btn_channels)
    btn_channels.forEach(channel => {
        console.log(dicover_section)
        channel.addEventListener('click', () => {
            dicover_section.classList.add('d-none');
            chat_section.classList.remove('d-none');
            channels.classList.remove('d-none');
            friends.forEach(friend => {
                friend.classList.add('d-none');
            });
        })
    });
}

function findHighiestGrade(matches) {
    let highiest = 0;
    for ([key, value] of Object.entries(matches)) {
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
    Click();
    filter_all_pending_online_blocks();
    transition_between_channels_and_friends();
    
    scanLinks();
    fetch_info_user();
    search()
    // if (window.location.pathname === '/') {
    //         const Chart = new SSChart(ChartData, 'Matches Played', '/static/content/components/chart.html');
    //         Chart.Component.then(html => {
    //             document.getElementById('ChartMark').innerHTML = html;
    //             Chart.setChartTitle();
    //             Chart.setGrades();
    //             Chart.setDates();
    //             Chart.setBarValues();
    //         });
    // }
    // if (window.location.pathname === '/login' || window.location.pathname === '/register')
    //     scanInput();
    // else if (window.location.pathname == '/dashboard' )
    //     copyIDListener();
    // else if (window.location.pathname === '/settings' || window.location.pathname == '/') {
    //     handlePictureUploads();
    //     TwoFactorAuthHandler();
    // }
    // else if (window.location.pathname === '/game')
    // {
    // 	initGame();
    // }
}