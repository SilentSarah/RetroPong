

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
            console.log(data)
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
    return Fetching('http://localhost:8000/info_user/6/','GET')
}