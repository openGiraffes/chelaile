$(function () {
    document.activeElement.addEventListener('keydown', handleKeydown);
    loadAll();
});

function loadAll() {
    var result = $.getApi('https://web.chelaile.net.cn/cdatasource/citylist');
    if (result.status == 'OK') {
        var arr = result.data.allRealtimeCity;
        for (var index = 0; index < arr.length; index++) {
            var cityName = arr[index].cityName;
            var item = '<div class="item" data-id="' + arr[index].cityId + '" data-name="' + cityName + '">' + cityName + '</div>';
            $('#list').append(item);
        }
    }
    else {
        alert('获取城市列表失败！');
    }
}

var current = 0;
function nav(move) {
    var next = current + move;
    const items = document.querySelectorAll('.item');
    if (next >= items.length) {
        next = items.length - 1;
    }
    else if (next < 0) {
        next = 0;
    }
    const targetElement = items[next];
    if (targetElement) {
        current = next;
        targetElement.focus();
        $('.item').removeClass('select');
        $(targetElement).addClass('select');
    }
}

function handleKeydown(e) {
    switch (e.key) {
        case 'ArrowUp':
            nav(-1);
            break;
        case 'ArrowDown':
            nav(1);
            break;
        case 'Q':
        case 'SoftLeft': {
            const items = document.querySelectorAll('.item');
            const targetElement = items[current];
            var cid = $(targetElement).attr('data-id');
            var cname = $(targetElement).attr('data-name');
            window.location.href = '../index.html?cid=' + cid + '&cname=' + encodeURIComponent(cname);
            break;
        }
        case 'E':
        case 'Backspace':
        case 'SoftRight':
            window.location.href = '../index.html';
            break;
    }
}