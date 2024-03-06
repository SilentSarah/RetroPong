
function confirmOperartion(type, parent) {
    let Confirmation = document.createElement('div');
    if (type === 'copy') {
        document.getElementById('copyConfirm') ? parent.removeChild(document.getElementById('copyConfirm')) : null;
        Confirmation.id = 'copyConfirm';
        Confirmation.innerHTML = ' Copied to clipboard!';
        Confirmation.classList.add('nokora', 'text-white');
        Confirmation.style.fontSize = '0.5rem';
        parent.appendChild(Confirmation);
        setTimeout(() => {
            parent.removeChild(Confirmation);
        }, 1000);
    }
}


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
    document.getElementById('cpyID').addEventListener('click', function() {
        let copyText = document.getElementById('player_id');
        navigator.clipboard.writeText(copyText.innerHTML);
        confirmOperartion('copy', copyText.parentElement);

    });
}