let c  = true

const open =(sidebar ,items) => {
    sidebar.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    sidebar.style.width = '50%';
    items.forEach(item => {
        item.style.display = 'flex';
    })
    c = false
}

const close = (sidebar, items) => {
    sidebar.style.background = '';
    sidebar.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    sidebar.style.width = '80px';
    items.forEach(item => {
        item.style.display = 'none';
    })
    c = true
}

const resetsettings = (sidebar, items) => {
    sidebar.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)';
    sidebar.style.width = '80px';
    items.forEach(item => {
        item.style.display = 'flex';
    })
}

function openMenu() {
    const sidebar = document.getElementById('sidebar');
    const items = document.querySelectorAll('.items');
     
    if(c)
        open(sidebar, items)
    else if(!c)
        close(sidebar, items)
    window.addEventListener('keyup', (e) => {
        if(e.key == 'q')
            close()
    })
    window.addEventListener('resize', () => {
        if(window.innerWidth >= 768)
            resetsettings(sidebar, items)
        else 
            close(sidebar, items)})
}

function appearInfoFriend()
{
    const divInfo = document.getElementById('CinfoUser');
    if(divInfo.style.left == '0px')
        divInfo.style.left = '-1000px';
    else
        divInfo.style.left = '0px';
    window.addEventListener('resize', ()=> divInfo.style.left = '-1000px');
}
 

function transition(destination)
{
    const page_chat = document.getElementById('page_chat'); // page chat
    const page_discover = document.getElementById('page_discover'); // page discover
    const page_discussion = document.getElementById('page_discussion');

    if(destination == 'chat')
    {
        page_chat.classList.remove('d-none');
        page_discover.classList.add('d-none');
        page_discussion.classList.add('d-none');
    }
    else if(destination == 'discover')
    {
        page_discover.classList.remove('d-none');
        page_chat.classList.add('d-none');
        page_discussion.classList.add('d-none');
    }
 
}

function changeColor(type)
{
    const element = document.getElementById(type);
    const all = document.getElementById('all');
    const online = document.getElementById('online');
    const pending = document.getElementById('pending');
    const blocked = document.getElementById('blocked');
    all.classList.remove('text-pink')
    online.classList.remove('text-pink')
    pending.classList.remove('text-pink')
    blocked.classList.remove('text-pink')
    element.classList.add('text-pink')
}


function filterFriends(type){
    const typeOf = document.getElementById('typeOf');
    const rb_0 = document.getElementById('rb-0');
    const rb_1 = document.getElementById('rb-1');
    const rb_2 = document.getElementById('rb-2');
    const rb_3 = document.getElementById('rb-3');
    if(type == 'online')
    {
        typeOf.innerHTML = 'Online Friends: ';
        rb_1.style.display = 'none';
        rb_2.style.display = 'none';
        rb_3.style.display = 'none';
        rb_0.style.display = 'flex';
        changeColor('online');
    }
    else if(type == 'all')
    {
        typeOf.innerHTML = 'All Friends: ';
        rb_1.style.display = 'none';
        rb_2.style.display = 'none';
        rb_3.style.display = 'none';
        rb_0.style.display = 'flex'
        changeColor('all');
    }
    else if(type == 'pending')
    {
        typeOf.innerHTML = 'Pending Friends: ';
        rb_0.style.display = 'none'
        rb_1.style.display = 'flex';
        rb_2.style.display = 'flex';
        rb_3.style.display = 'none';
        changeColor('pending');
    }
    else if(type == 'blocked')
    {
        typeOf.innerHTML = 'Blocked Friends: ';
        rb_0.style.display = 'none'
        rb_1.style.display = 'none';
        rb_2.style.display = 'none';
        rb_3.style.display = 'flex';
        changeColor('blocked');
    }
}

function implementBtns(target){
    const page_discussion = document.getElementById('page_discussion');
    const page_chat = document.getElementById('page_chat');
    const page_discover = document.getElementById('page_discover');
    if(target ===  'toChat')
    {
        console.log('object')
        page_chat.classList.add('d-none');
        page_discussion.classList.remove('d-none');
        page_discover.classList.add('d-none');
    }

}