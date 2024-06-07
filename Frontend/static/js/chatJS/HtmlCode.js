const Cards = (otherUser, invitation) => {
    return `
            <div class=" Rcard d-flex flex-column p-4 gap-2">
                <div class="d-flex align-items-center gap-2">
                    <img class="RcardImg w-30 rounded-circle" src=${otherUser?.uprofilepic ? otherUser?.uprofilepic : "https://i.pinimg.com/736x/fe/26/83/fe2683f11283ef9fe4211894d9147652.jpg"} alt="avatar">
                    <div class="d-flex flex-column">
                        <span class="name text-white fw-bold fs-5">${otherUser?.uUsername}</span>
                        <span class="description text-secondary">${otherUser?.udesc === null ? otherUser?.udesc : "No desciption"}</span>
                    </div>
                </div>
                <div class="h-100 w-100 d-flex align-items-end justify-content-center">
                    <button id="${otherUser?.id + 'id'}" class="btn_invite text-white" onclick="SendInvite(${otherUser?.id})">${invitation?.includes(otherUser.id) ? "Pending" : "Invite"}</button>
                </div>
            </div>`
}


const Friends = (friend, type, blockedby) => {
    return `<div class="Ruser w-100 py-2 px-2 mb-2 d-flex align-items-center justify-content-between">
                <div class="Rcontent d-flex align-items-center gap-2">
                    <img class="Rimg img-fr rounded-circle" src=${friend.uprofilepic ? friend?.uprofilepic : "https://i.pinimg.com/736x/fe/26/83/fe2683f11283ef9fe4211894d9147652.jpg"} alt="avatar">   
                    <div class="d-flex flex-column">
                        <span class="name text-white fw-bold fs-5">${friend?.uUsername}</span>
                        <span class="description text-secondary">${friend?.udesc === null ? friend?.udesc : "No description"}</span> 
                    </div>
                </div> 
                <div class="align-items-center gap-2 ${blockedby.some(block=>block.id === friend.id) ? 'd-none' : 'd-flex'}">
                    <img id="rb-0" onclick="implementBtns('toChat',${friend?.id})" src="/static/img/chat/messages.png" alt="icon" class="Rbtns ${type === 'online' || type === 'all' ? 'd-flex' : 'd-none'}" data-user-id='${friend?.id}'  >
                    <img id="rb-1" onclick="implementBtns('accept',${friend?.id})" src="/static/img/chat/valide.png" alt="icon" class="Rbtns ${type === 'pending' ? 'd-flex' : 'd-none'}"  >
                    <img id="rb-2" onclick="implementBtns('decline',${friend?.id})" src="/static/img/chat/remove.png" alt="icon" class="Rbtns ${type !== 'blocked' ? 'd-flex' : 'd-none'}"  >
                    <img id="rb-3" onclick="implementBtns('unblock',${friend?.id})" src="/static/img/chat/unblock_user.png" alt="icon" class="Rbtns ${type === 'blocked' ? 'd-flex' : 'd-none'}" >
                </div>
                <div class="align-items-center gap-2 ${blockedby.some(block=>block.id === friend.id) ? 'd-flex' : 'd-none'}">
                    Can't chat with this user
                </div>
            </div>`
}

const chatFriend = (friend) => {
    return `<div class="Rectangle h-10 position-relative w-100">
                <img class="Rimg Cimg position-absolute rounded-circle" src=${friend.profilepic ? friend.profilepic : "/static/img/general/Account.png"} alt="avatar">
                <div id="circleStatus" class="circle_status ${friend.isOnline ? 'online' : 'offline'} rounded-circle position-absolute "></div>
            </div>
            <div class="Cinformation text-white d-flex flex-column w-90 h-30 p-3 gap-3">
                <div class="CitemInfo d-flex flex-column"> 
                    <span class="Cname Cbreak fw-bold">${friend.username}</span>
                    <span class="Cdescription Cbreak">${friend.desc === null ? friend.desc : "No description"}</span>
                </div>
                <div class="CitemInfo d-flex flex-column"> 
                    <span class="detailsFriend Cbreak">${friend.email}</span>
                    <span class="detailsFriend Cbreak">ID: ${friend.id}</span>
                </div>
           </div>`
}

const message = (msg, target_user_id) => {
    return `<div class="slide-in-blurred-top-1 CcontentMessage d-flex align-items-end ml-2 position-relative" >
                <div class="d-flex gap-3">
                   <img class="Ccimg rounded-circle" src=${msg?.user?.profilepic} alt="avatar">
                   <div class="${msg.user.id === target_user_id ? 'Cmessage' : 'Cmessage2'} bg-pink ">${msg.content}</div>
                </div>
                <span class="timeChat position-absolute">${msg.user.username} <span class="timeSize fw-normal">10:00 AM</span></span>
            </div>`
}


const member = (member) => {
    return `<div class="chUser d-flex justify-content-between align-items-center p-2">
    <div class="d-flex align-items-center gap-1"> 
        <img class="chImg rounded-circle" src=${member.profilepic ?  member.profilepic :"/static/img/general/Account.png"} alt="avatar">
        <div class="d-flex flex-column">
            <span class="chName nokora">${member.username}</span>
            <span class="chDesc nokora">${member.desc}</span>
        </div>
    </div>
    <button class="chBtn_invite">Invite</button>
</div>`
}

const message_channel =(member, user)=>{
    return `<div class="slide-in-blurred-top-1 CcontentMessage d-flex align-items-end ml-2 position-relative" >
                <div class="d-flex gap-3">
                   <img class="Ccimg rounded-circle" src=${user.profilepic}  alt="avatar">
                   <div class="Cmessage bg-pink fs-small">${member.cmContent}</div>
                </div>
                <span class="timeChat position-absolute"> <span class="timeSize fw-normal">10:00 AM</span></span>
            </div>`
}