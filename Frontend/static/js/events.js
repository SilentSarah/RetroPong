function loadEvents() {
    let items = document.querySelectorAll('input');
    items.forEach(item => {
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter')
                console.log('Enter key pressed');
        });
    });
    window.addEventListener('popstate', router);
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
        e.preventDefault();
        history.pushState(null, null, this.href);
        router();
    });
});
}