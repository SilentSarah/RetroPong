class Message {
 
    Generate_message(message,data_user) 
    {
        return `<div class=" d-flex flex-column w-100" style="text-align:end; ">
                 <div class="d-flex w-100" style="gap: 10px; height:max-content; ">
                    <img src="/static/img/general/gmc.webp" alt="avatar" class="avatar-user m-0 rounded-circle border border-black " style="object-fit:cover; width: 50px; height: 50px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.51);-webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.51);-moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.51);"/>
                    <div class="items-text d-flex gap-2 flex-column  fw-light inter " style="width:100% ;padding:10px 15px; border-radius:25px; text-align:start; word-wrap:break-word; height: max-content; background-color: #231423; font-size: 16px;color: white;">
                        <div class="d-flex gap-1 align-items-center" >
                            <span class="  fs-6" style="font-weight:500; color: #bfbfbf">${data_user.username}</span>
                            <span class="text-secondary" style="font-size:13px">23/03/23 10:3 PM</span>
                        </div>
                        ewidewieiwjfeiuwfeiuwfhewfuygewfewfgyewfuy ewfuyegwfuyegwfuyegwfuyegwfuyeg wfyggewfbdfnvewidewieiwjfeiuwfeiuw fhewfuygewfewfg yewfuyewfuyegwfuyegw fuyegwfuyegwfuyegwfyggewfbdfnv
                        ewidewieiwjfeiuwfeiuwfhewfuygewfewfgyewfuyewf uyegwfuyegwfuyegwfuye gwfuyegwfyggewfbdfnvewidewieiwjfeiuwf eiuwf hewfuygewfe wfgyewf uyewfuyegwfu yegwfuyegw fuyegwfuyegwfygg ewfbdfnvew idewieiwjfeiuwfe iuwfhe wfuygewfewfgyewfuyewfuyegwfuyegwfuyegwfuyegwfuyegwfyggewfbdfnv 
                    </div>
                </div>`
    }
}




function transition_between_channels_and_friends_1() {
    const channels = document.getElementById('chat');
    const friends = document.querySelectorAll('[id="Friends"]');
    const dicover_section = document.getElementById('#section_descover');
    const chat_section = document.getElementById('#section_chat');

    dicover_section.classList.add('d-none');
    chat_section.classList.remove('d-none');
    channels.classList.remove('d-none');
    friends.forEach(friend => {
        friend.classList.add('d-none');
    });


}


// function when click to message button

function define_user(sender,data) {
    if(sender == parseInt(localStorage.getItem('user_id'))) 
        return data.current_user[0]
    else if(data.friends.filter(friend => friend.id == sender).length > 0)
        return data.friends.filter(friend => friend.id == sender)[0]
}
let id = 0
function MessageButton(data_user) {
    const target_user = document.querySelectorAll('[id="btn_chat_friends"]');
    const user_id = parseInt(localStorage.getItem('user_id'))
    const class_message = new Message()
    let scroll_chat = document.getElementById("#items-right-center-bottom");//to keep scroll position in bottom

    //fetch messages
    target_user.forEach(user => {
        user.addEventListener('click',async () => {
            transition_between_channels_and_friends_1()
            const target_id = user.dataset.userId
            id = target_id
            const data = await Fetching(`http://localhost:8000/chat/${user_id}/${target_id}/`, 'POST', "")
            const allmessages = data.messages.map(message => class_message.Generate_message(message.content,define_user(message.sender,data_user))).join('')
            console.log(allmessages)
            const container = document.getElementById('message_container')
            container.innerHTML = allmessages 
            scroll_chat.click()
        })
    })

    // send message
    const btn_send = document.getElementById('btn_send_message')
    const input_message = document.getElementById('input_message')
    btn_send.addEventListener('click', async () => {
        const message = input_message.value
        await Fetching(`http://localhost:8000/chat/${user_id}/${id}/`, 'POST', message)
        input_message.value = ''
        target_user[id-2].click()
        scroll_chat.click()
     })
}


 