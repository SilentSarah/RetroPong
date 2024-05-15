async function SearchUsers() {
    const search_btn = document.getElementById('search_btn')
    const search_input = document.getElementById('search_input')
    const search_container = document.getElementById('search_container')
    const search = new Search()

    function FilterSearch() {
        if (search_input.value !== '') {
            value = search_input.value
            filterSearchUser(search_container, data, search, value)
            Send_invite()
        }
    }

    const data = await Fetch_info_user()
    loadDataToElement(search_container, data, search)
    search_btn.addEventListener('click', () => FilterSearch())
    search_input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter')
            FilterSearch()
    })
    Send_invite()
}

async function Send_invite() {
    const btn_invite = document.getElementsByClassName('btn_invite')
    for (let i = 0; i < btn_invite.length; i++) {
        btn_invite[i].addEventListener('click', async () => {
            const data = Fetching(`http://localhost:8000/invite/${current_user_id}/${btn_invite[i].dataset.userId}/`, 'GET')
            SearchUsers()
        })
    }
}