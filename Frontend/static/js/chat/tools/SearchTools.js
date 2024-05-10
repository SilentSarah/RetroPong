function loadDataToElement(search_container, data, search)
{
    const DiscoverSection = document.getElementById('DiscoverSection')
    console.log(data?.users?.length == 0)
    if(data?.users?.length > 0 )
        search_container.innerHTML = data.users.map(user => search.Generate_card(user,pending(data,user.id))).join('')
    else if(data?.users?.length == 0)
        DiscoverSection.innerHTML=  "<h1 id='DiscoverTitle' class='mt-4 fw-bold text-white taprom'  style='font-size: 48px; background: #999999;background: linear-gradient(to top,#999999 0%, #FFFFFF 65%);background: linear-gradient(to top, #999999 0%, #FFFFFF 65%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.251));'>No user found!</h1>\
                                     <p class='text-white'>Waiting for new users to enter!</p>"
    else 
        DiscoverSection.innerHTML=  "<h1 class='mt-4 fw-bold text-white taprom'  style='font-size: 48px; background: #999999;background: linear-gradient(to top,#999999 0%, #FFFFFF 65%);background: linear-gradient(to top, #999999 0%, #FFFFFF 65%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.251));'>Server Error!</h1>"
}

function filterSearchUser(search_container, data, search, value)
{
    const DiscoverTitle = document.getElementById('DiscoverTitle')
    let Search = document.getElementById('search_container')
    const users = data?.users?.filter(user =>  user.username.toLowerCase().startsWith(value.toLowerCase()))
    console.log(users)
    if(users.length > 0 )
    {
        DiscoverTitle.classList.remove('taprom')
        DiscoverTitle.innerText = "Recommendations"
        search_container.innerHTML = users.map(user => search.Generate_card(user, pending(data,user.id))).join('')
    }
    else if(users.length == 0)
    {
        console.log("ds")
        DiscoverTitle.classList.add('taprom')
        DiscoverTitle.innerText = "No user Found!"
        search_container.innerText = ""
    }
    else
        DiscoverTitle.innerText = "No user Found!"
}

function pending(data,id){
    if(data.status.some(rec => rec.receiver === id))
          return true
    return false
}