
import { LoadMessageRealTime, fetchData, searchOtherUser, typeofData, GetUserIdToken, setDataUser, dataUser } from "./tools.js"
import { SkeletonCards, SkeletonFriends, handleError } from "./skeleton.js"
import { Friends, Cards, chatFriend, message } from "./HtmlCode.js"
import { setIsRequest } from "./allBtnsChat.js"
import { getCookie, user_id } from "../userdata.js"


let listenToSend = false
let contact_id = null
let conversation = ""
let storeDataWs = {}
let storeDataUser = {}
let target_id = ""
export let ws = null
export let channelObj = {}

export function Websocket() {
    const userId = user_id || getCookie('user_id');
    if (userId != "") {
        if (!ws)
            ws = new WebSocket(`wss://${window.env.HOST_ADDRESS}:${window.env.CHAT_PORT}/ws/chat/${userId}`)
        ws.onopen = (event) => console.log('Connected to chat server')
        ws.onerror = (event) => console.log('Error', event)
        ws.onclose = (event) => {
            ws = null
            // console.log('closing socket!', event)
            // setTimeout(() => { Websocket() }, 2000)
        }
        ws.onmessage = function (event) {
            console.log("111", event)
            let data = JSON.parse(event.data)
            if (data.message === "statusOnlinePing")
                storeDataWs = data
            if ((data.contact_id === parseInt(userId)) && data.conversation_id === conversation) {
                if (data.message !== "refresh" && data.message !== "invite") {
                    const contact_user = dataUser.friends.filter(friend => friend.id === parseInt(data.id))[0]
                    LoadMessageRealTime(data.message, contact_user?.uprofilepic, contact_user?.uUsername, data.created)
                }
            }
            UserContactFetching()
        }
    }
}

async function UserContactFetching() {
    const { userId, token } = GetUserIdToken()

    if (dataUser?.length === 0) {
        SkeletonCards() // skeleton cards
        SkeletonFriends() // skeleton friends
    }
    const data = await fetchData(`https://${window.env.HOST_ADDRESS}:${window.env.CHAT_PORT}/chat/contact/${userId}`, 'GET', token) // fetch data
    if (data.status === "200") {
        setDataUser(data.data) // store data to value dataUser
        LoadDataSuggestion(data.data)
        const type = localStorage.getItem('type')
        LoadDataFriend(type ? type : 'online')
        LoadChannel(data.data?.channel)
    }
    else
        handleError()
    setTimeout(() => {  if(data.status !== "200") handleError()}, 5000)
    setIsRequest(false); // to handle request by request to avoid many requests
}

// fetch conversation
export async function DataChatFetching(target_user_id) {
    const { userId, token } = GetUserIdToken()
    const data = await fetchData(`https://${window.env.HOST_ADDRESS}:${window.env.CHAT_PORT}/chat/isExistConversation/${userId}/${target_user_id}/`, 'GET', token)
    return data
}


// other user
function LoadDataSuggestion(data, target_user_id) {
    const Rcards = document.getElementById('Rcards')
    const search = document.getElementById('search')
    const btn_search = document.getElementById('btn_search')
    let content = ""

    if (data?.otherUser?.length === 0) {
        if (Rcards)
            Rcards.innerHTML = `<h4 class="text-secondary">No friends yet</h4>`
    }
    else if (target_user_id) {
        const id = document.getElementById(`${target_user_id + 'id'}`)
        if (id)
            id.innerHTML = "Pending"
    }
    else {
        data?.otherUser?.forEach(friend => {
            content += Cards(friend, target_user_id ? data?.invitation?.concat(target_user_id) : data?.invitation)
        });
        if (content === "") {
            if (Rcards)
                Rcards.innerHTML = `<h4 class="text-secondary">No friends yet</h4>`
        }
        else {
            if (Rcards)
                Rcards.innerHTML = content
        }
    }
    if (btn_search) {
        btn_search.addEventListener('click', () => {
            searchOtherUser(search.value, data?.otherUser)
        })
    }
}


// friends online
export async function LoadDataFriend(type) {
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
            resUsers.innerHTML += Friends(friend, type, dataUser.blockedby)
        });
    }
}


// load channel
function LoadChannel(channel) {
    const channel_title = document.getElementById('channel_title')
    const channel_general = document.getElementById('channel')

    if(channel)
    {
        channelObj = channel[0]
        channel_general.classList.remove('d-none')
    }
    if(channel_title)
        if (channel[0])
            channel_title.innerHTML = channel[0].chName
}

// send invite
async function SendInvite(target_user_id) {
    const { userId, token } = GetUserIdToken();
    const data = await fetchData(`https://${window.env.HOST_ADDRESS}:${window.env.CHAT_PORT}/chat/invite/${userId}/${target_user_id}`, 'GET', token)
    LoadDataSuggestion(dataUser, target_user_id)
    ws.send(JSON.stringify({ "message": "invite", "id": userId, "contact_id": target_user_id, "conversation_id": "" }))
}

// create notification
async function createNotification(value, receiver, sender, token) {
    const content = {
        "nType": "MESSAGE",
        "nContent": "has sent you a message",
        "nReciever": receiver,
        "nSender": sender
    }
    await fetchData(`https://${window.env.HOST_ADDRESS}:${window.env.CHAT_PORT}/chat/notification`, 'POST', token, { "notification": content })
}

//send message
const ClickSend = async (value, target_user_id) => {
    const Cinput = document.getElementById('Cinput');
    const { userId, token } = GetUserIdToken();
    let data = []
    const date = new Date(Date.now());
    console.log(date);
    if (value === "")
        return
    Cinput.value = ""
    Cinput.focus()
    createNotification(value, target_user_id, userId, token)
    LoadMessageRealTime(value, sessionStorage.getItem('profilepic'), sessionStorage.getItem('username'), date.toUTCString())
    ws.send(JSON.stringify({ "message": value, "id": userId, "contact_id": target_id, "conversation_id": conversation }))
    data = await fetchData(`https://${window.env.HOST_ADDRESS}:${window.env.CHAT_PORT}/chat/sendMessage/${userId}/${target_id}/${JSON.parse(localStorage.getItem('coversation_id'))}`, 'POST', token, { "content": value })
}



async function SendMessage(target_user_id) {
    const Cinput = document.getElementById('Cinput');
    const CsendBtn = document.getElementById('CsendBtn');
    target_id = target_user_id

    Cinput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter')
            ClickSend(Cinput.value, target_id)
    })
    if (listenToSend === false)
        CsendBtn.addEventListener('click', async () => ClickSend(Cinput.value, target_id))
    listenToSend = true
}

// load data to chat page
export const loadDataChat = (data, target_user_id) => {
    const CinfoUser = document.getElementById('CinfoUser');
    const CcontentConver = document.getElementById('CcontentConver');
    const Cinput = document.getElementById('Cinput');

    conversation = data?.conversation_id
    CinfoUser.innerHTML = data && chatFriend(data?.users[0])
    storeDataUser = data?.users[0]
    CcontentConver.innerHTML = data?.messages?.map(msg => message(msg, target_user_id)).join('') || ""
    CcontentConver.scrollTop = CcontentConver.scrollHeight
    contact_id = target_user_id
    setTimeout(() => { SendMessage(target_user_id) }, 1000)
    Cinput.focus()
}

// setInterval(() => {
//     const circleStatus = document.getElementById('circleStatus')

//     if (storeDataUser.id === storeDataWs.id)
//         if (storeDataWs.status && circleStatus) {
//             circleStatus.classList.remove('offline')
//             circleStatus.classList.add('online')
//         } else if (circleStatus) {
//             circleStatus.classList.remove('online')
//             circleStatus.classList.add('offline')
//         }
// }, 1000)

export function setTargetId(id) {
    target_id = id
}

window.SendInvite = SendInvite