async function inComingMessage(data) {
    const messages = await Fetching(`http://localhost:8000/chat/${current_user_id}/`, 'GET', "")
    console.log(messages)
    const circle = document.getElementById('notify_msg')
    const circle_invite = document.getElementById('notify_invite')
    if (circle_invite && data?.invitations)
        circle_invite.innerText = data?.invitations?.length
    if (data?.invitations?.length <= 0)
        circle_invite.classList.add('d-none')
    if (messages?.count <= 0)
        circle.classList.add('d-none')
    else 
    {
        circle.classList.remove('d-none')
        circle.innerHTML = messages.count
    }
}


// this function is used to change the isRead value to true
async function readMessages(ids) {
    let i = 0;
    while (ids?.length > i) {
         await Fetching(`http://localhost:8000/chat/${current_user_id}/isReadTrue/${ids[i]}/`, 'GET')
        i++;
    }
    inComingMessage()
}


// this function 
async function NotificationNotify() {
    const notify = await Fetching(`http://localhost:8000/invite/${current_user_id}/notify/`, 'GET', "")
    console.log(notify)

    const circle = document.getElementById('notify_invite')
    if (notify?.count <= 0)
        circle.classList.add('d-none')
    if (circle)
        circle.innerText = notify.count
}