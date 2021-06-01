let lid, lng, sid, lat, cid, od;

$(function () {
    document.activeElement.addEventListener('keydown', handleKeydown);
    od = $.getQueryVar('od');
    lat = $.getQueryVar('lat');
    lng = $.getQueryVar('lng');
    lid = $.getQueryVar('lid');
    sid = $.getQueryVar('sid');
    cid = $.getQueryVar('cid');
    loadTimes();
});

function loadTimes() {
    var url = 'http://api.chelaile.net.cn/bus/line!depTimeTable.action?sign=' + sign + '&cityId=' + cid + '&stationId=' + sid + '&geo_type=gcj&lineId=' + lid + '&s=android&geo_lng='
        + lng + '&geo_lat=' + lat + '&v=' + ver;
    var result = $.getApi(url, 'text');
    let data = JSON.parse(result.replace("**YGKJ", "").replace("YGKJ##", ""));
    if (data.jsonr.status == '00') {
        var tb = data.jsonr.data.timetable, tss = [];
        for (var index = 0; index < tb.length; index++) {
            var ts = tb[index].times;
            tss = tss.concat(ts);
        }
        for (var j = 0; j < tss.length; j += 2) {
            var row = '<div class="item"><label>' + tss[j] + '</label>';
            try {
                row += '<label>' + tss[j + 1] + '</label>';
            }
            catch (e) { }
            row += '</div>';
            $('#container').append(row);
        }
    }
    else {
        alert('加载失败！' + data.jsonr.errmsg);
    }
}

function handleKeydown(e) {
    if (e.key != "EndCall")
        e.preventDefault();
    switch (e.key) {
        case 'ArrowUp':
            nav(-1);
            break;
        case 'ArrowDown':
            nav(1);
            break;
        case 'E':
        case 'Backspace':
        case 'SoftRight':
            window.location.href = '../detail/index.html?cid=' + cid + '&lat=' + lat + '&lng=' + lng + '&lid=' + lid + '&od=' + od + '&sid=' + sid;
            break;
    }
}

var current = 0;
function nav(move) {
    var next = current + move;
    const items = document.querySelectorAll('.item');
    if (next >= items.length)
        next = items.length - 1;
    else if (next < 0)
        next = 0;
    const targetElement = items[next];
    if (targetElement) {
        current = next;
        targetElement.focus();
        $('.item').removeClass('select');
        $(targetElement).addClass('select');
    }
}
