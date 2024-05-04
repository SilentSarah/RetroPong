class Message {
 
    Generate_message(message,data_user) 
    {
        return `<div class=" d-flex flex-column w-100" style="text-align:end; ">
                 <div class="d-flex w-100" style="gap: 10px; height:max-content; ">
                    <img src=${data_user.img} alt="avatar" class="avatar-user m-0 rounded-circle border border-black " style="object-fit:cover; width: 50px; height: 50px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.51);-webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.51);-moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.51);"/>
                    <div class="items-text d-flex gap-2 flex-column  fw-light inter " style="width:100% ;padding:10px 15px; border-radius:25px; text-align:start; word-wrap:break-word; height: max-content; background-color: #231423; font-size: 16px;color: white;">
                        <div class="d-flex gap-1 align-items-center" >
                            <span class="  fs-6" style="font-weight:500; color: #bfbfbf">${data_user.username}</span>
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
                <img id="#user_img" src=${friend.img} alt="" class="rounded-circle  " style="height: 75px; width: 75px; border:2px solid #565656">
            </div>
            <div class="items_user d-flex flex-column text-white p-2 " style="width:251px ; gap:10px">
                    <div class="username d-flex justify-content-center align-items-center  w-100" style="height:45px;background-color:rgba(0, 0, 0, 0.25);font-size:20px; border-radius:25px">Ahmed sekak</div>
                    <div class ="details_user d-flex align-items-c enter justify-content-between taprom " style="background: #FFF065; background: linear-gradient(to bottom, #FFF065 53%, #FF0000 64%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;text-shadow: 0px 0px 10px rgba(255, 0, 0, 0.48);
                    "> 
                        <span class="d-flex justify-content-center align-items-center " style="height:45px; padding:0px 20px;background-color:rgba(0, 0, 0, 0.25);font-size:20px; border-radius:25px">Punisher</span>
                        <span class="rank d-flex justify-content-center align-items-center " style="height:45px;padding:0px 8px;background-color:rgba(0, 0, 0, 0.25);font-size:20px; border-radius:25px">52 <img src="/static/img/chat/rank.png" style="border-radius:50%; width:30px;height:30px;background-color:rgb(255,255,255,.25);" /></span>
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


// function when click to message button
function define_user(sender,data) {
    if(sender == parseInt(localStorage.getItem('user_id'))) 
        return data.current_user[0]
    else if(data.friends.filter(friend => friend.id == sender).length > 0)
        return data.friends.filter(friend => friend.id == sender)[0]
}

let id = 0
let elemet = 0
function MessageButton(data_user) {
    const target_user = document.querySelectorAll('[id="btn_chat_friends"]');
    const class_message = new Message()
    let scroll_chat = document.getElementById("#items-right-center-bottom");//to keep scroll position in bottom
    const user_id = parseInt(localStorage.getItem('user_id'))

    //fetch messages
    target_user.forEach(user => {
        user.addEventListener('click',async () => {
            const target_id = user.dataset.userId
            id = target_id
            transition_between_channels_and_friends_1()
            const data = await Fetching(`http://localhost:8000/chat/${user_id}/${target_id}/`, 'POST', "")
            const allmessages = data?.messages?.map(message => class_message.Generate_message(message.content,define_user(message.sender,data_user))).join('')
            const container = document.getElementById('message_container')
            const friend_profile = document.getElementById('friend_profile')
            container.innerHTML = allmessages ? allmessages : ''
            friend_profile.innerHTML = class_message.Friend_profile(data.user[0])
            scroll_chat.click()
            element = user
        })
    })
}


function Send()
{
    const user_id = parseInt(localStorage.getItem('user_id'))
    const btn_send = document.getElementById('btn_send_message')
    const input_message = document.getElementById('input_message')
    
    btn_send.addEventListener('click', async () => {
        const message = input_message.value
        console.log(message)
        await Fetching(`http://localhost:8000/chat/${user_id}/${id}/`, 'POST', message)
        input_message.value = ''
        element !== 0 &&  element.click()
    })   
    
}
 
async function AcceptDeclineBlockUnblock(id, status)
{
    const current_user = parseInt(localStorage.getItem('user_id'))
    const data = await  Fetching(`http://localhost:8000/friends/${current_user}/${id}/${status}/`,'GET',"")
    fetch_info_user()
    console.log(data)
}
