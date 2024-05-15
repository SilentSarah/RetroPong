let id = 0
let element = 0
let isListener = false
let arrayOfSockets = {}
let x= 0

// function when click to message button
function define_user(sender, data) {
    if (sender == parseInt(localStorage.getItem('user_id')))
        return data.current_user[0]
    else if (data.friends.filter(friend => friend.id == sender).length > 0)
        return data.friends.filter(friend => friend.id == sender)[0]
}


function loadConversation(data_user) {
    const target_user = document.querySelectorAll('[id="btn_chat_friends"]');
    let scroll_chat = document.getElementById("#items-right-center-bottom");//to keep scroll position in bottom
    const class_message = new Message()

    //fetch messages
    target_user.forEach(user => {
        user.addEventListener('click', async () => {
            const target_id = user.dataset.userId
            id = target_id
            if(x==0)
                transition_between_channels_and_friends_1()
            const data = await Fetching(`http://localhost:8000/chat/${current_user_id}/${target_id}/`, 'POST', "")
            const allmessages = data?.messages?.map(message => class_message.Generate_message(message.content, define_user(message.sender, data_user))).join('')
            const container = document.getElementById('message_container')
            const friend_profile = document.getElementById('friend_profile')
            container.innerHTML = allmessages ? allmessages : ''
            friend_profile.innerHTML = class_message.Friend_profile(data?.user[0])
            const ids = data?.messages?.filter(it => it.isRead === false && it.sender !==current_user_id).map(it => it.id)
            element = user
            scroll_chat.click()
            // inComingMessage(data_user)

            if(x==0)
                readMessages(ids)
            Send()
            webSocket(target_id)
        })
    })
}



function Send() {
    if (!isListener) {
        const btn_send = document.getElementById('btn_send_message')
        const input_message = document.getElementById('input_message')

        // Function to send message
        const sendMessage = async () => {
            const message = input_message.value
            if (message !== '') {
                await Fetching(`http://localhost:8000/chat/${current_user_id}/${id}/`, 'POST', message)
                if (arrayOfSockets[id])
                    arrayOfSockets[id].send(message)
                element !== 0 && element.click()
            }
            input_message.value = ''
            input_message.focus()
        }
        //Event listener for the send button click
        btn_send.addEventListener('click', () => sendMessage())
        // Event listener for the send button keypress
        input_message.addEventListener('keypress', (event) => {
            if (event.key === 'Enter')
                sendMessage()
        });
        isListener = true
    }
}

async function AcceptDeclineBlockUnblock(id, status) {
    await Fetching(`http://localhost:8000/friends/${current_user_id}/${id}/${status}/`, 'GET', "")
    updateUserInfo()
}



async function webSocket(target_id) {
    let socket
    console.log(arrayOfSockets[target_id])
    if (!arrayOfSockets[target_id]) {
        console.log("Create new socket!")
        socket = new WebSocket(`ws://localhost:8000/ws/chat/${current_user_id}/${target_id}/`);
        socket.onopen = function (event) {
            console.log('WebSocket connection established.');
        };
        // Event handler for errors
        socket.onerror = function (error) {
            console.error('WebSocket error:', error);
        };

        // Event handler for when the connection is closed
        socket.onclose = function (event) {
            console.log('WebSocket connection closed.');
        };
        arrayOfSockets[target_id] = socket
    } else if (arrayOfSockets[target_id]) {
        console.log("Already exist this socket!")
        socket = arrayOfSockets[target_id]

        socket.onopen = function (event) {
            console.log('WebSocket connection established.');
        };
        socket.onmessage = async function (event) {
            x = 1
            element.click()
            x = 0
        };

        // Event handler for errors
        socket.onerror = function (error) {
            console.error('WebSocket error:', error);
        };

        // Event handler for when the connection is closed
        socket.onclose = function (event) {
            console.log('WebSocket connection closed.');
        };
    }

}

// function to close all sockets
function closeAllSockets() {
    for (let key in arrayOfSockets) {
        arrayOfSockets[key].close()
    }
    arrayOfSockets = {}
}

setInterval(() => closeAllSockets(), 1000 * 60 * 5) // close all sockets every 5 minutes