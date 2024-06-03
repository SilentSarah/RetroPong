let ws = null
let listenToSend = false
let contact_id = null
let target_id = ""
let conversation = ""

function Websocket() {
    const userId = document.cookie.split(';')[0].split('=')[1]
    if (!ws)
        ws = new WebSocket('ws://localhost:8002/ws/chat/')
    ws.onopen = (event) => console.log('Connected to chat server')
    ws.onerror = (event) => console.log('Error in connection to chat server', event)
    ws.onmessage = function (event) {
        console.log("you",JSON.parse(event.data).contact_id, "userId", userId, "from", JSON.parse(event.data).id, "coversation",JSON.parse(event.data).conversation_id, "cov",conversation)
        if (JSON.parse(event.data).contact_id === parseInt(userId) && JSON.parse(event.data).conversation_id === conversation) {  
            if (JSON.parse(event.data).message !== "refresh" && JSON.parse(event.data).message !== "invite") {
                const contact_user = dataUser.friends.filter(friend => friend.id === parseInt(JSON.parse(event.data).id))[0]
                LoadMessageRealTime(JSON.parse(event.data).message, contact_user.uprofilepic, contact_user.uUsername)
            }
        }
        UserContactFetching()
    }
}

async function UserContactFetching() {
    Websocket()
    const { userId, token } = GetUserIdToken()
    
    if(dataUser.length === 0)
        SkeletonCards() // skeleton cards
    const data = await fetchData(`http://127.0.0.1:8002/chat/contact/${userId}`, 'GET', token) // fetch data
    dataUser = data.data // store data to value dataUser

    if (data.status === "200") {
        LoadDataSuggestion(data.data)
        type = localStorage.getItem('type')
        LoadDataFriend(type ? type : 'online')
    }
    isRequest = false
}

// fetch conversation
async function DataChatFetching(target_user_id) {
    const { userId, token } = GetUserIdToken()
    const data = await fetchData(`http://127.0.0.1:8002/chat/isExistConversation/${userId}/${target_user_id}/`, 'GET', token)
    return data
}


// other user
function LoadDataSuggestion(data, target_user_id) {
    const Rcards = document.getElementById('Rcards')
    const search = document.getElementById('search')
    const btn_search = document.getElementById('btn_search')
    let content = ""

    if (data.otherUser.length === 0)
        Rcards.innerHTML = `<h4 class="text-secondary">No friends yet</h4>`
    else if (target_user_id) {
        console.log("im hre")
        const id = document.getElementById(`${target_user_id + 'id'}`)
        if (id)
            id.innerHTML = "Pending"
    }
    else {
        data.otherUser.forEach(friend => {
            content += Cards(friend, target_user_id ? data.invitation.concat(target_user_id) : data.invitation)
        });
        if (content === "")
            Rcards.innerHTML = `<h4 class="text-secondary">No friends yet</h4>`
        else
            Rcards.innerHTML = content
    }
    btn_search.addEventListener('click', () => {
        searchOtherUser(search.value, data.otherUser)
    })
}


// friends online
async function LoadDataFriend(type) {
    localStorage.setItem('type', type)
    let typeData = typeofData(type)
    const resUsers = document.getElementById('resUsers')
    let typeLower = type.charAt(0).toUpperCase() + type.slice(1)

    if (typeData === undefined)
        return
    if (typeData?.length === 0)
        resUsers.innerHTML = `<h4 class="text-white d-flex justify-content-center">No friends yet</h4>`
    else {
        resUsers.innerHTML = `<span id="typeOf" class="typeOf mb-4">${typeLower}: ${typeData?.length}</span>`
        typeData?.forEach(friend => {
            resUsers.innerHTML += Friends(friend, type)
        });
    }
}


// send invite
async function SendInvite(target_user_id) {
    const { userId, token } = GetUserIdToken();
    const data = await fetchData(`http://127.0.0.1:8002/chat/invite/${userId}/${target_user_id}`, 'GET', token)
    LoadDataSuggestion(dataUser, target_user_id)
    ws.send(JSON.stringify({ "message": "invite", "id": userId, "contact_id": target_user_id, "conversation_id": ""}))
}


//send message
async function SendMessage(target_user_id) {
    const { userId, token } = GetUserIdToken();
    let value = ""
    let data = []
    target_id = target_user_id
    const Cinput = document.getElementById('Cinput');
    const CsendBtn = document.getElementById('CsendBtn');
    
    if (listenToSend === false)
    CsendBtn.addEventListener('click', async () => {
            console.log(token)
            if (Cinput.value === "")
                return
            value = Cinput.value
            Cinput.value = ""
            Cinput.focus()
            LoadMessageRealTime(value, sessionStorage.getItem('profilepic'), sessionStorage.getItem('username'))
            ws.send(JSON.stringify({ "message": value, "id": userId, "contact_id": target_id, "conversation_id": conversation}))
            data = await fetchData(`http://127.0.0.1:8002/chat/sendMessage/${userId}/${target_id}/${JSON.parse(localStorage.getItem('coversation_id'))}`, 'POST', token, { "content": value })
        })
    listenToSend = true
}

// load data to chat page
loadDataChat = (data, target_user_id) => {
    const CinfoUser = document.getElementById('CinfoUser');
    const CcontentConver = document.getElementById('CcontentConver');
    const Cback = document.getElementById('contact_user');
    const Cinput = document.getElementById('Cinput');

    conversation = data?.conversation_id
    SendMessage(target_user_id)
    Cinput.focus()
    CinfoUser.innerHTML = data && chatFriend(data?.users[0])
    CcontentConver.innerHTML = data?.messages?.map(msg => message(msg, target_user_id)).join('') || ""
    CcontentConver.scrollTop = CcontentConver.scrollHeight
    contact_id = target_user_id
}

