class InfoUser {
    constructor(data) {
        this.data = data;
    }


    capitalizeFirstLetter(string) {
        if (string === undefined)
            return "--"
        const first_letter = string.charAt(0).toUpperCase();
        const rest = string.slice(1);
        return first_letter + rest;
    }

    AllUsers(user) {
        return `
            <div class="user d-flex justify-content-between py-3 border-bottom border-secondary">
                <div class="user d-flex align-items-center gap-3">
                    <div class="d-flex" style=" width: 50px; height: 50px;position: relative;">
                        <img src=${user.img} alt="avatar" class="m-0 avatar w-100 h-100 rounded-circle" style="object-fit: cover;">
                        <div class="circle rounded-4 position-absolute"  style="width: 10px;height: 10px;bottom: 2px;right: 2px;background-color: green;border:.1px solid rgb(70, 70, 70)">
                        </div>
                    </div>
                    <div class="d-flex flex-column">
                        <span class="name">${user.username}</span>
                        <span class="status fw-bold text-secondary">Online</span>
                    </div>
                </div>
                <div>
                    <img id="btn_chat_friends" src="/static/img/chat/messages.png" alt="icon" data-user-id='${user.id}'
                     class="icon" style="width: 38px;height: 31px;">
                    <img src="/static/img/chat/block.png" alt="icon" class="action_btns"  data-user-id='${user.id}' data-status="block"
                    style="width: 31px;height: 31px;">
                </div>
            </div>
        `
    }

    OnlineUsers(user) {
        return `
        <div class="user d-flex justify-content-between py-3 border-bottom border-secondary">
            <div class="user d-flex align-items-center gap-3">
                <div class="d-flex" style=" width: 50px; height: 50px;position: relative;">
                    <img src=${user.img} alt="avatar"
                        class="m-0 avatar w-100 h-100 rounded-circle"
                        style="object-fit: cover;">
                    <div class="circle rounded-4 position-absolute"
                        style="width: 10px;height: 10px;bottom: 2px;right: 2px;background-color: green;border:.1px solid rgb(70, 70, 70)">
                    </div>
                </div>
                <div class="d-flex flex-column">
                    <span class="name">${user.username}</span>
                    <span class="status fw-bold text-secondary">Online</span>
                </div>
            </div>
            <div>
                <img id="btn_chat_friends" src="/static/img/chat/messages.png" alt="icon" class="icon"  data-user-id='${user.id}'  
                    style="width: 38px;height: 31px;" >
                <img src="/static/img/chat/block.png" alt="icon" class="action_btns" data-user-id='${user.id}' data-status="block"
                    style="width: 31px;height: 31px;">
            </div>
        </div>
        `
    }

    PendingUsers(user) {
        return `<div
        class="user d-flex justify-content-between py-3 border-bottom border-secondary">
        <div class="user d-flex align-items-center gap-3">
            <div class="d-flex" style=" width: 50px; height: 50px;position: relative;">
                <img src=${user.img} alt="avatar"
                    class="m-0 avatar w-100 h-100 rounded-circle"
                    style="object-fit: cover;">
            </div>
            <div class="d-flex flex-column">
                <span class="name">${user.username}</span>
                <span class="status fw-bold text-secondary">Invite</span>
            </div>
        </div>
        <div class="icons">
            <img src="/static/img/chat/valide.png" alt="icon" class="action_btns" data-status="accept" data-user-id='${user.id}'  
                style="width: 31px;height: 31px;">
            <img src="/static/img/chat/remove.png" alt="icon" class="action_btns" data-status="decline" data-user-id='${user.id}'  
                style="width: 31px;height: 31px;">
        </div>
    </div>`
    }

    BlockUsers(user) {
        return `<div
        class="user d-flex justify-content-between py-3 border-bottom border-secondary">
        <div class="user d-flex align-items-center gap-3">
            <div class="d-flex" style=" width: 50px; height: 50px;position: relative;">
                <img src=${user.img} alt="avatar"
                    class="m-0 avatar w-100 h-100 rounded-circle"
                    style="object-fit: cover;">
            </div>
            <div class="d-flex flex-column">
                <span class="name">${user.username}</span>
                <span class="status fw-bold text-secondary">Blocked</span>
            </div>
        </div>
        <img src="/static/img/chat/unblock_user.png" alt="icon" class="action_btns" data-status="unblock" data-user-id='${user.id}'  
            style="width: 31px;height: 31px;">
    </div>`}

    current_user() {
        const name = document.getElementById('current_name')
        const username = document.getElementById('current_username')
        const email = document.getElementById('current_email')
        const full_name = document.getElementById('current_fullname')
        if (username && email && full_name && name) {
            username.innerHTML = this.capitalizeFirstLetter(this.data.current_user[0].username)
            email.innerHTML = this.capitalizeFirstLetter(this.data.current_user[0].email)
            full_name.innerHTML = this.capitalizeFirstLetter(this.data.current_user[0].full_name)
            name.innerHTML = this.capitalizeFirstLetter(this.data.current_user[0].username)
        }
    }
}



const fetch_info_user = async () => {
    const data = await Fetch_info_user()
    const info = new InfoUser(data)
    localStorage.setItem('user_id',  data.current_user[0].id)
    // All
    const allHTMLArray = data?.friends?.map(user => info.AllUsers(user)).join('');
    // Online
    const onlineHTMLArray = data?.friends?.map(user => info.OnlineUsers(user)).join('');
    // Pending (Notifications invite)
    const pendingHTMLArray = data.invitations.map(invitation => info.PendingUsers(invitation)).join('');
    // Block    
    const blockHTMLArray = data.block.map(block =>   info.BlockUsers(block)).join('');

    // containers
    const All = document.getElementById('userContainer')
    const Online = document.getElementById('onlineContainer')
    const Pending = document.getElementById('pendingContainer')
    const Block = document.getElementById('blockContainer')
    if (All && Online && Pending && Block) {
        All.innerHTML = allHTMLArray ? allHTMLArray : '<h1 class="text-center">No Users</h1>'
        Online.innerHTML = onlineHTMLArray ? onlineHTMLArray : '<h1 class="text-center">No Users</h1>'
        Pending.innerHTML = pendingHTMLArray ? pendingHTMLArray : '<h1 class="text-center">No Invite</h1>'
        Block.innerHTML = blockHTMLArray ? blockHTMLArray : '<h1 class="text-center">No Block</h1>'
    }
    // numbers for each container
    const all = document.getElementById('number_all')
    const online = document.getElementById('number_online')
    const pending = document.getElementById('number_pending')
    const block = document.getElementById('number_block')
    if (all && online && pending && block) {
        all.innerHTML = "All friends: " + data.friends.length
        online.innerHTML = "Online friends: " + data.friends.length
        pending.innerHTML = "Pending friends: " + data.invitations.length
        block.innerHTML = "blocked friends: " + data.block.length
    }
    // current User
    info.current_user()
    // Message Button
    MessageButton(data)
    Action_btns()
    Notifications(data.notification)
 }

function Action_btns(){
    const action_btns = document.querySelectorAll('.action_btns')
    action_btns.forEach(btn =>{
        btn.addEventListener('click',()=>{
            AcceptDeclineBlockUnblock(btn.dataset.userId, btn.dataset.status)
        })
    })
}