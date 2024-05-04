class Search{
    constructor(){}
    
    Generate_card(user, isPend){
        return `<div class="item-card-bottom" style="flex: 1; height: 310px; width: 400px;max-width: 400px;border-radius: 25px;overflow:hidden; background: rgb(240,128,242);background: linear-gradient(180deg, rgba(240,128,242,0.5) 0%, rgba(0,0,0,0.25) 100%);filter: drop-shadow(0px 4px 4px #000000);box-shadow: 10px -10px 19px 0px rgba(255,255,255,0.25) inset;-webkit-box-shadow: 10px -10px 19px 0px rgba(255,255,255,0.25) inset;-moz-box-shadow: 10px -10px 19px 0px rgba(255,255,255,0.25) inset;">
        <div style="margin:10px;" class="d-flex align-items-center">
            <img src=${user.img} class="avatar-general"
                style="border-radius: 50%; margin-right: 10px; width: 90px; height: 90px;object-fit: cover;" />
            <div class="d-flex flex-column m-0">
                <h1 class="title-1 fw-bold"
                    style="font-size: 32px;background: #999999;background: linear-gradient(to top, #999999 0%, #FFFFFF 65%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.251));">
                    ${user.username}</h1>
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
            <button   data-user-id='${user.id}' class="btn_invite button-join nokora text-white " style="border:none;font-weight: 700;background-color: transparent; width: 100px; height: 40px; border-radius: 25px;background: rgb(0,0,0);background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(240,128,242,0.5) 100%);filter: drop-shadow(0px 4px 4px #000000);box-shadow: 0px -4px 4px 0px rgba(255,255,255,0.25) inset;-webkit-box-shadow: 0px -4px 4px 0px rgba(255,255,255,0.25) inset;-moz-box-shadow: 0px -4px 4px 0px rgba(255,255,255,0.25) inset;">${isPend ? 'Pending' : 'Invite'}</button>
        </div>
    </div>`
    }


}

const current_user = parseInt(localStorage.getItem('user_id'))

function pending(data,id){
    if(data.status.some(rec => rec.receiver === id))
    {
        console.log(data.status.map(rec => rec.receiver ), id)
        return true
    }
    return false
}

async function search(){
    const search_btn = document.getElementById('search_btn')
    const search_input = document.getElementById('search_input')
    const search_container = document.getElementById('search_container')
    const search = new Search()
    console.log(current_user)
    
     
    const data = await Fetch_info_user()
    search_container.innerHTML = data.users.map(user => search.Generate_card(user,pending(data,user.id))).join('')
    search_btn.addEventListener('click', async () => {
        if(search_input.value !== ''){
            value = search_input.value
            const users = data.users.filter(user =>  user.username.toLowerCase().startsWith(value.toLowerCase()))
            console.log(users)
            if(users.length > 0)
            {   
                search_container.style.display = 'grid'
                const cards = users.map(user => search.Generate_card(user, pending(data,user.id))).join('')
                search_container.innerHTML = cards ? cards : ''
            }else{
                search_container.style.display = 'flex'
                search_container.innerHTML = `<div class="d-flex justify-content-center align-items-center" > <h1 class="text-secondary">No user found</h1>`
            }
        }
    }) 
    Send_invite()

}

async function Send_invite()
{
    const btn_invite = document.getElementsByClassName('btn_invite')
    for(let i = 0; i < btn_invite.length; i++)
    {
        btn_invite[i].addEventListener('click',async () => {
            const data = Fetching(`http://localhost:8000/invite/${current_user}/${btn_invite[i].dataset.userId}/`, 'GET')
            console.log(data)
            search()
        })
    }
 
}