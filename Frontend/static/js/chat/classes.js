class Message {
 
    Generate_message(message,data_user) 
    {
        return `<div class=" d-flex flex-column w-100" style="text-align:end; ">
                 <div class="d-flex w-100" style="gap: 10px; height:max-content; ">
                    <img src=${data_user?.img} alt="avatar" class="avatar-user m-0 rounded-circle border border-black " style="object-fit:cover; width: 50px; height: 50px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.51);-webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.51);-moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.51);"/>
                    <div class="items-text d-flex gap-2 flex-column  fw-light inter " style="width:100% ;padding:10px 15px; border-radius:25px; text-align:start; word-wrap:break-word; height: max-content; background-color: #231423; font-size: 16px;color: white;">
                        <div class="d-flex gap-1 align-items-center" >
                            <span class="  fs-6" style="font-weight:500; color: #bfbfbf">${data_user?.username}</span>
                            <span class="text-secondary" style="font-size:13px">23/03/23 10:3 PM</span>
                        </div>
                        ${message}
                    </div>
                    </div>
                </div>`
    }

    Friend_profile(friend){
        return `
        <div class="member d-flex flex-column align-items-center p-1" style="gap: 2px; background-color: #5D315D;">
            <div class="zone_img position-relative">
                <div class="circle rounded-circle  position-absolute " style="width: 15px; height: 15px;bottom: 8px;right: 7px ;background-color: #75E25A;border:2px solid #565656"> </div>
                <img id="#user_img" src=${friend?.img} alt="" class="rounded-circle  " style="height: 75px; width: 75px;object-fit:cover; border:2px solid #565656">
            </div>
            <div class="items_user d-flex flex-column text-white p-2 " style="width:251px ; gap:10px">
                    <div class="username d-flex justify-content-center align-items-center  w-100" style="height:45px;background-color:rgba(0, 0, 0, 0.25);font-size:20px; border-radius:25px">${friend?.username}</div>
                    <div class ="details_user d-flex align-items-c enter justify-content-between taprom " style="background: #FFF065; background: linear-gradient(to bottom, #FFF065 53%, #FF0000 64%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;text-shadow: 0px 0px 10px rgba(255, 0, 0, 0.48);
                    ">  <span class="d-flex justify-content-center align-items-center " style="height:45px; padding:0px 20px;background-color:rgba(0, 0, 0, 0.25);font-size:20px; border-radius:25px">Punisher</span> <span class="rank d-flex justify-content-center align-items-center " style="height:45px;padding:0px 8px;background-color:rgba(0, 0, 0, 0.25);font-size:20px; border-radius:25px">52 <img src="/static/img/chat/rank.png" style="border-radius:50%; width:30px;height:30px;background-color:rgb(255,255,255,.25);" /></span>
                    </div>
                    <div style="background-color:rgba(0, 0, 0, 0.25);font-size:20px; border-radius:25px" class="d-flex flex-column align-items-center justify-content-center">
                        <span class="my-2">About</span>
                        <p  style="font-size:16px;color:#BABABA; font-weight:300;" class="p-2">Hey, I'm using Whatsup Hey, I'm using Whatsup Hey, I'm using Whatsup Hey, I'm using Whatsup</p>
                    </div>
            </div>
        </div>
        `
    }
}


class Search{
    Generate_card(user, isPend){
        return `<div class="item-card-bottom" style="flex: 1; height: 310px; width: 400px;max-width: 400px;border-radius: 25px;overflow:hidden; background: rgb(240,128,242);background: linear-gradient(180deg, rgba(240,128,242,0.5) 0%, rgba(0,0,0,0.25) 100%);filter: drop-shadow(0px 4px 4px #000000);box-shadow: 10px -10px 19px 0px rgba(255,255,255,0.25) inset;-webkit-box-shadow: 10px -10px 19px 0px rgba(255,255,255,0.25) inset;-moz-box-shadow: 10px -10px 19px 0px rgba(255,255,255,0.25) inset;">
        <div style="margin:10px;" class="d-flex align-items-center">
            <img src=${user?.img} class="avatar-general"
                style="border-radius: 50%; margin-right: 10px; width: 90px; height: 90px;object-fit: cover;" />
            <div class="d-flex flex-column m-0">
                <h1 class="title-1 fw-bold"
                    style="font-size: 32px;background: #999999;background: linear-gradient(to top, #999999 0%, #FFFFFF 65%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.251));">
                    ${user?.username}</h1>
                <p class="desc-1 fw-regular" style=" color:#8D8D8D;font-size: 18px;">Description</p>
            </div>
        </div>
        <div class="box-rates d-flex align-items-center" style="margin:20px;gap: 15px;">
            
            <div class="box1 d-flex flex-column align-items-center justify-content-center"  style="flex:1 ;gap:5px;">
                <span class="title-2 nokora text-white">Rank</span>
                <span class="number-1 nokora text-white fw-bold d-flex justify-content-center align-items-center w-60" style="font-size:38px;background-color:#d9d9d969; border-radius: 15px;height: 80px;">35</span>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-center ">
            <button   data-user-id='${user?.id}' class="btn_invite button-join nokora text-white " style="border:none;font-weight: 700;background-color: transparent; width: 100px; height: 40px; border-radius: 25px;background: rgb(0,0,0);background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(240,128,242,0.5) 100%);filter: drop-shadow(0px 4px 4px #000000);box-shadow: 0px -4px 4px 0px rgba(255,255,255,0.25) inset;-webkit-box-shadow: 0px -4px 4px 0px rgba(255,255,255,0.25) inset;-moz-box-shadow: 0px -4px 4px 0px rgba(255,255,255,0.25) inset;">${isPend ? 'Pending' : 'Invite'}</button>
        </div>
    </div>`
}}


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
                        <img src=${user?.img} alt="avatar" class="m-0 avatar w-100 h-100 rounded-circle" style="object-fit: cover;">
                        <div class="circle rounded-4 position-absolute"  style="width: 10px;height: 10px;bottom: 2px;right: 2px;background-color: ${user?.online_status ? 'green' : 'red'};border:.1px solid rgb(70, 70, 70)">
                        </div>
                    </div>
                    <div class="d-flex flex-column">
                        <span class="name">${user?.username}</span>
                        <span class="status fw-bold text-secondary">Online</span>
                    </div>
                </div>
                <div>
                    <img id="btn_chat_friends" src="/static/img/chat/messages.png" alt="icon" data-user-id='${user?.id}'
                     class="icon" style="width: 38px;height: 31px;">
                    <img src="/static/img/chat/block.png" alt="icon" class="action_btns"  data-user-id='${user?.id}' data-status="block"
                    style="width: 31px;height: 31px;">
                </div>
            </div>
        `
    }

    OnlineUsers(user) {
        return `
        <div class="user ${user?.online_status ? 'd-flex' : 'd-none'} justify-content-between py-3 border-bottom border-secondary">
            <div class="user d-flex align-items-center gap-3">
                <div class="d-flex" style=" width: 50px; height: 50px;position: relative;">
                    <img src=${user?.img} alt="avatar"
                        class="m-0 avatar w-100 h-100 rounded-circle"
                        style="object-fit: cover;">
                    <div class="circle rounded-4 position-absolute" style="width: 10px;height: 10px;bottom: 2px;right: 2px;background-color: green;border:.1px solid rgb(70, 70, 70)">
                    </div>
                </div>
                <div class="d-flex flex-column">
                    <span class="name">${user?.username}</span>
                    <span class="status fw-bold text-secondary">Online</span>
                </div>
            </div>
            <div>
                <img id="btn_chat_friends" src="/static/img/chat/messages.png" alt="icon" class="icon"  data-user-id='${user?.id}'  
                    style="width: 38px;height: 31px;" >
                <img src="/static/img/chat/block.png" alt="icon" class="action_btns" data-user-id='${user?.id}' data-status="block"
                    style="width: 31px;height: 31px;">
            </div>
        </div>
        `
    }

    PendingUsers(user) {
        return `
        <div class="user d-flex justify-content-between py-3 border-bottom border-secondary">
            <div class="user d-flex align-items-center gap-3">
                <div class="d-flex" style=" width: 50px; height: 50px;position: relative;">
                    <img src=${user?.img} alt="avatar"
                        class="m-0 avatar w-100 h-100 rounded-circle"
                        style="object-fit: cover;">
                </div>
                <div class="d-flex flex-column">
                    <span class="name">${user?.username}</span>
                    <span class="status fw-bold text-secondary">Invite</span>
                </div
            </div>
            </div>
            <div class="icons">
                <img src="/static/img/chat/valide.png" alt="icon" class="action_btns" data-status="accept" data-user-id='${user?.id}'   
                    style="width: 31px;height: 31px;">
                <img src="/static/img/chat/remove.png" alt="icon" class="action_btns" data-status="decline" data-user-id='${user?.id}'  
                    style="width: 31px;height: 31px;">
            </div>
        </div>`
    }

    BlockUsers(user) {
        return `<div
        class="user d-flex justify-content-between py-3 border-bottom border-secondary">
        <div class="user d-flex align-items-center gap-3">
            <div class="d-flex" style=" width: 50px; height: 50px;position: relative;">
                <img src=${user?.img} alt="avatar"
                    class="m-0 avatar w-100 h-100 rounded-circle"
                    style="object-fit: cover;">
            </div>
            <div class="d-flex flex-column">
                <span class="name">${user?.username}</span>
                <span class="status fw-bold text-secondary">Blocked</span>
            </div>
        </div>
        <img src="/static/img/chat/unblock_user.png" alt="icon" class="action_btns" data-status="unblock" data-user-id='${user?.id}'  
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
