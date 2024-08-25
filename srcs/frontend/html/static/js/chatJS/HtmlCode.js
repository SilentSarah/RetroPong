

function sanitizeHTMLCode(html) {
    if (!html) return html;
    if (typeof(html) !== "string") return html;
    html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return html;
}

export const Cards = (otherUser, invitation) => {
    return `
            <div class=" Rcard d-flex flex-column p-4 gap-2">
                <div class="d-flex align-items-center gap-2">
                    <img class="RcardImg w-30 rounded-circle" src=${otherUser?.uprofilepic ? otherUser?.uprofilepic : "https://i.pinimg.com/736x/fe/26/83/fe2683f11283ef9fe4211894d9147652.jpg"} alt="avatar">
                    <div class="d-flex flex-column">
                        <span class="name text-white fw-bold fs-5">${sanitizeHTMLCode(otherUser?.uUsername)}</span>
                        <span class="description text-secondary">${sanitizeHTMLCode(otherUser?.udesc === null ? otherUser?.udesc : "No desciption")}</span>
                    </div>
                </div>
                <div class="h-100 w-100 d-flex align-items-end justify-content-center">
                    <button id="${otherUser?.id + 'id'}" class="btn_invite text-white" onclick="SendInvite(${otherUser?.id})">${invitation?.includes(otherUser.id) ? "Pending" : "Invite"}</button>
                </div>
            </div>`
}


export const Friends = (friend, type, blockedby) => {
    return `<div class="Ruser w-100 py-2 px-2 mb-2 d-flex align-items-center justify-content-between">
                <div class="Rcontent d-flex align-items-center gap-2">
                    <img class="Rimg img-fr rounded-circle" src=${friend.uprofilepic ? friend?.uprofilepic : "https://i.pinimg.com/736x/fe/26/83/fe2683f11283ef9fe4211894d9147652.jpg"} alt="avatar">   
                    <div class="d-flex flex-column">
                        <span class="name text-white fw-bold fs-5">${friend?.uUsername}</span>
                        <span class="description text-secondary">${friend?.udesc === null ? friend?.udesc : "No description"}</span> 
                    </div>
                </div> 
                <div class="align-items-center gap-2 ${blockedby?.some(block=>block.id === friend.id) ? 'd-none' : 'd-flex'}">
                    <img id="rb-0" onclick="implementBtns('toChat',${friend?.id})" src="/static/img/chat/messages.png" alt="icon" class="Rbtns ${type === 'online' || type === 'all' ? 'd-flex' : 'd-none'}" data-user-id='${friend?.id}'  >
                    <img id="rb-1" onclick="implementBtns('accept',${friend?.id})" src="/static/img/chat/valide.png" alt="icon" class="Rbtns ${type === 'pending' ? 'd-flex' : 'd-none'}"  >
                    <img id="rb-2" onclick="implementBtns('decline',${friend?.id})" src="/static/img/chat/remove.png" alt="icon" class="Rbtns ${type !== 'blocked' ? 'd-flex' : 'd-none'}"  >
                    <img id="rb-3" onclick="implementBtns('unblock',${friend?.id})" src="/static/img/chat/unblock_user.png" alt="icon" class="Rbtns ${type === 'blocked' ? 'd-flex' : 'd-none'}" >
                </div>
                <div class="align-items-center gap-2 ${blockedby?.some(block=>block.id === friend.id) ? 'd-flex' : 'd-none'}">
                    Can't chat with this user
                </div>
            </div>`
}

export const chatFriend = (friend) => {
    return `<div class="Rectangle h-10 position-relative w-100">
                <img class="Rimg Cimg position-absolute rounded-circle hover-cursor" src=${friend.profilepic ? friend.profilepic : "/static/img/general/Account.png"} onclick="DisplayProfileDetails(${friend?.id ? friend?.id : null})" alt="avatar">
                <!-- <div id="circleStatus" class="circle_status ${friend.isOnline ? 'online' : 'offline'} rounded-circle position-absolute "></div> -->
            </div>
            <div class="Cinformation text-white d-flex flex-column w-90 h-30 p-3 gap-3">
                <div class="CitemInfo d-flex flex-column"> 
                    <span class="Cname Cbreak fw-bold">${sanitizeHTMLCode(friend.username)}</span>
                    <span class="Cdescription Cbreak">${friend.desc === null ? sanitizeHTMLCode(friend.desc) : "No description"}</span>
                </div>
                <div class="CitemInfo d-flex flex-column"> 
                    <span class="detailsFriend Cbreak">${sanitizeHTMLCode(friend.email)}</span>
                    <span class="detailsFriend Cbreak">ID: ${sanitizeHTMLCode(friend.id)}</span>
                </div>
           </div>`
}

export const message = (msg, target_user_id) => {
    const date = new Date(msg?.created)
    return `<div class="slide-in-blurred-top-1 CcontentMessage d-flex align-items-end ml-2 position-relative" >
                <div class="d-flex gap-3">
                   <img class="Ccimg rounded-circle object-fit-cover hover-cursor" src=${!msg?.user?.profilepic ? "/static/img/pfp/Default.png" : msg?.user?.profilepic} onclick="DisplayProfileDetails(${!msg?.user?.id ? null : msg?.user?.id})" alt="avatar">
                   <div class="${msg.user.id === target_user_id ? 'Cmessage' : 'Cmessage2'} bg-pink ">${sanitizeHTMLCode(msg.content)}</div>
                </div>
                <span class="timeChat position-absolute">${sanitizeHTMLCode(msg.user.username)} <span class="timeSize fw-normal">${date.toUTCString()}</span></span>
            </div>`
}


export const member = (member) => {
    return `<div class="chUser d-flex justify-content-between align-items-center p-2">
    <div class="d-flex align-items-center gap-1"> 
        <img class="chImg rounded-circle" src=${member.profilepic ?  member.profilepic :"/static/img/general/Account.png"} alt="avatar">
        <div class="d-flex flex-column">
            <span class="chName nokora">${sanitizeHTMLCode(member.username)}</span>
            <span class="chDesc nokora">${sanitizeHTMLCode(member.desc)}</span>
        </div>
    </div>
    <button class="chBtn_invite">Invite</button>
</div>`
}

export const message_channel =(member, user)=>{
    return `<div class="slide-in-blurred-top-1 CcontentMessage d-flex align-items-end ml-2 position-relative" >
                <div class="d-flex gap-3">
                   <img class="Ccimg rounded-circle object-fit-cover hover-cursor" src=${!user?.profilepic ? "/static/img/pfp/Default.png" : user?.profilepic} onclick="DisplayProfileDetails(${!user?.id ? null : user?.id})"  alt="avatar">
                   <div class="Cmessage bg-pink fs-small">${sanitizeHTMLCode(member.cmContent)}</div>
                </div>
                <span class="timeChat position-absolute"> <span class="timeSize fw-normal">10:00 AM</span></span>
            </div>`
}