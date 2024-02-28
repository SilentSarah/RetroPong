function loadEvents() {
    let items = document.querySelectorAll('input');
    console.log('items: ', items);
    items.forEach(item => {
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter')
                console.log('Enter key pressed');
        });
    });
}