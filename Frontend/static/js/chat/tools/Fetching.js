

const Fetching = async (url,method, body) => {
    
    if(method === 'GET'){
    try{
        const response = await fetch(url)
        const data = await response.json()
        return  data
    }
    catch(err){
        console.log(err);
    }}
    else if(method === 'POST'){
        try{
            const response = await fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'message': body
                })
            })
            const data = await response.json()
            return data
        }
        catch(err){
            console.log(err);
        } 
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

function Fetch_info_user(){
    return Fetching('http://localhost:8000/info_user/5/','GET')
}

// function Notifications(notify)
// {   
//     if(notify.length === 0) return
//     const notify_msg = document.getElementById('notify_msg')
//     const notify_invite = document.getElementById('notify_invite')
//     // console.log(notify )
//     const current_user = parseInt(localStorage.getItem('user_id'))
//     if(notify[0].nID_id === current_user && notify[0].isNewMessage)
//     {
//         notify_msg.style.display = 'flex'
//         // console.log(notify[0].isNewMessage)
//     }
//     if(notify[0].nID_id === current_user && notify[0].isNewInvite === true)  
//     {
//         notify_invite.style.display = 'flex'
//         // console.log(notify[0].IsNewInvite)
//     }
// }

// function Remove_notification(type)
// {
//     const current_user = parseInt(localStorage.getItem('user_id'))
//     const notify = Fetching(`http://localhost:8000/notification/${current_user}/${type}/`,'GET','')
// }