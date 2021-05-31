$(function () {
    document.activeElement.addEventListener('keydown', handleKeydown);
    var web = localStorage.getItem('url');
    $('#web').attr('src', web);
    navigator.spatialNavigationEnabled = true;
});

function handleKeydown(e) {
    if (e.key != "EndCall")
        e.preventDefault();
    switch (e.key) {
        case 'Backspace':
            window.location.href = '../index.html';
            break;
    }
}