let dataUser = []

async function fetchData(url, method, token, content) {
    return await fetch(url, {
           method: method,
           body: JSON.stringify(content),
           headers: {
               'Content-Type': 'application/json',
               'Authorization': token,
           }}).then(response => response.json())
           .then(data => {
               return { data, "status": "200" };
           }).catch(error => {
               return { "error": error, "status": "500" };
           });
}
 
function searchOtherUser(values, otherUser) {
    const Rcards = document.getElementById('Rcards')
    if (Rcards === null) return;
    
    if (otherUser.length === 0)
        return
    result_filter = otherUser.filter(friend => friend.uUsername.toLowerCase().startsWith(values))
    if (result_filter.length === 0) {
        Rcards.innerHTML = ""
        Rcards.innerHTML = `<h4 class="text-secondary">No found this user!</h4>`
        return
    }
    Rcards.innerHTML = ""
    result_filter.forEach(friend => {
        Rcards.innerHTML += Cards(friend)
    });
}

const typeofData = (type) => {
    if (type === 'online')
        return dataUser?.friends?.filter(friend => friend.isOnline === true)
    else if (type === 'all')
        return dataUser?.friends
    else if (type === 'pending')
        return dataUser?.requests
    else if (type === 'blocked')
        return dataUser?.blocked
}

const GetUserIdToken=()=>{
    const userId = getCookie('user_id')
    const token = 'Bearer ' + getCookie('access')
    return {userId, token}
}

// load message in real time 
function LoadMessageRealTime(value, profilepic, username) {
    const CcontentConver = document.getElementById('CcontentConver');
    if (CcontentConver === null) return;

    CcontentConver.innerHTML += message({
        "content": value, "user":
            { "profilepic": profilepic, "username": username }
    })
    CcontentConver.scrollTop = CcontentConver.scrollHeight
}