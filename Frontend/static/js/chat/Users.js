const current_user_id = parseInt(localStorage.getItem('user_id'))
function OnlineSocket()
{
    const socket = new WebSocket(`ws://localhost:8000/ws/online/${current_user_id}/`);
    socket.onopen = function (e) {
        console.log("Connection established online!");
        socket.send(JSON.stringify({'id':current_user_id ,'o_type':"online"}));
    };
    socket.onclose = function (e) {
        console.log("Connection closed!");
    };

}
OnlineSocket()

const updateUserInfo = async () => {
    const data = await Fetch_info_user()
    const info = new InfoUser(data)
    // All
    const allHTMLArray = data?.friends?.map(user => info.AllUsers(user)).join('');
    // Online
    const onlineHTMLArray = data?.friends?.map(user => info.OnlineUsers(user)).join('');
    // Pending (Notifications invite)
    const pendingHTMLArray = data.invitations.map(invitation => info.PendingUsers(invitation)).join('');
    // const circle = getElementById('notify_invite')
    // Block    
    const blockHTMLArray = data.block.map(block => info.BlockUsers(block)).join('');

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
    // current User to load data of user in Dashboard
    info.current_user()
    // this function is used to block, unblock, accept, decline user  
    ButtonsAction()
    // loading converstation and messages
    loadConversation(data)
    // fetching all new message notification
    inComingMessage(data)
    // NotificationNotify()
    SearchUsers()
}

function ButtonsAction() {
    const action_btns = document.querySelectorAll('.action_btns')
    action_btns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log("object")
            AcceptDeclineBlockUnblock(btn.dataset.userId, btn.dataset.status)
        })
    })
}







