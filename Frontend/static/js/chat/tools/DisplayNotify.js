async function MessageNotify()
{
    console.log('MessageNotify')
    const current_user = parseInt(localStorage.getItem('user_id'))
    const messages =await Fetching(`http://localhost:8000/chat/${current_user}/`,'GET',"")
    // change count messages div
    console.log(messages)
    const circle = document.getElementById('notify_msg')
    if(messages?.count <= 0)
        circle.classList.add('d-none')
    if(circle)
        circle.innerText=messages.count
}


async function MessageIsRead(ids)
{   
    console.log(ids)
    let i =0;
    const current_user = parseInt(localStorage.getItem('user_id'))
    console.log('MessageisRead')
    while(ids?.length  > i  )
    {
        const data = await Fetching(`http://localhost:8000/chat/${current_user}/isReadTrue/${ids[i]}/`,'GET')
        i++;
    }
    MessageNotify()
}