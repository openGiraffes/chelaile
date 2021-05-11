let cid, lat, lng, sid;
$(function () {
    cid = $.getQueryVar('cid');
    lat = $.getQueryVar('lat');
    lng = $.getQueryVar('lng');
    loadInfo(cid, lat, lng);
    document.activeElement.addEventListener('keydown', handleKeydown);
});

function realtimeInfo(lid) {
    var url = 'http://api.chelaile.net.cn/bus/line!lineDetail.action?sign=' + sign + '&cityId=' + cid + '&geo_type=gcj&lineId=' + lid +
        '&isNewLineDetail=1&s=android&last_src=app_xiaomi_store&geo_lng=' + lng + '&geo_lat=' + lat + '&v=' + ver;
    var result = $.getApi(url, 'text');
    let data = JSON.parse(result.replace("**YGKJ", "").replace("YGKJ##", ""));
    var item = $('div[data-lid="' + lid + '"]');
    if (data.jsonr.status == '00') {
        var od = data.jsonr.data.targetOrder;
        var rm = data.jsonr.data.tip.desc;
        $(item).attr('data-od', od);
        if (rm != '') {
            var r = rm.match(/\d分钟/);
            if (r != null && r.length > 0) {
                $(item).append('<p>还有' + r[0] + '到达！</p>');
            }
        }
    }
}

function loadInfo(cid, lat, lng) {
    var url = 'https://api.chelaile.net.cn/bus/stop!homePageInfo.action?type=1&act=2&gpstype=wgs&gpsAccuracy=80.000000&cityId=' +
        cid + '&hist=&s=android&sign=&dpi=3&push_open=1&v=5.50.4&lat=' + lat + '&lng=' + lng;
    var result = $.getApi(url, 'text');
    let data = JSON.parse(result.replace("**YGKJ", "").replace("YGKJ##", ""));
    console.log(data)
    if (data.jsonr.status == "00") {
        var sname = '';
        if (data.jsonr.data.nearSts.length > 0) {
            sname = data.jsonr.data.nearSts[0].sn;
            sid = data.jsonr.data.nearSts[0].sId;
        }
        $('#sn').text(sname);
        var arr = data.jsonr.data.lines;
        for (var index = 0; index < arr.length; index++) {
            var row = arr[index].line;
            var lid = row.lineId;
            var item = '<div data-lid="' + lid + '" class="item"><p><label>班次：' + row.name + '</label>&nbsp;<label>开往：' + row.endSn +
                '</label></p><p><label>首班车：' + row.firstTime + '</label>&nbsp;<label>末班车：' + row.lastTime + '</label></p><p><label>' + row.desc + '</label></p></div>';
            $('#container').append(item);
            realtimeInfo(lid);
        }
    }
}

function lineDetail() {
    const items = document.querySelectorAll('.item');
    const targetElement = items[current];
    var od = $(targetElement).attr('data-od');
    var lid = $(targetElement).attr('data-lid');
    window.location.href = '../detail/index.html?cid=' + cid + '&lat=' + lat + '&lng=' + lng + '&lid=' + lid + '&od=' + od + '&sid=' + sid;
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
        case 'SoftLeft':
            lineDetail();
            break;
        case 'E':
        case 'Backspace':
        case 'SoftRight':
            window.location.href = '../index.html';
            break;
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
