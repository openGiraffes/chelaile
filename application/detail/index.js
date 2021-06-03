let cid, lat, lng, lid, od, sid;
$(function () {
    document.activeElement.addEventListener('keydown', handleKeydown);
    cid = $.getQueryVar('cid');
    lat = $.getQueryVar('lat');
    lng = $.getQueryVar('lng');
    lid = $.getQueryVar('lid');
    sid = $.getQueryVar('sid');
    od = $.getQueryVar('od');
    load();
});

function load() {
    switch (tab_location) {
        case 0:
            $('#info').show();
            $('#items').hide();
            loadDetail();
            break;
        case 1:
            $('#info').hide();
            $('#items').show();
            loadLineInfo();
            break;
    }
}

function loadLineInfo() {
    var url = 'http://api.chelaile.net.cn/bus/line!lineDetail.action?sign=' + sign + '&cityId=' + cid + '&geo_type=gcj&lineId=' + lid +
        '&isNewLineDetail=1&s=android&last_src=app_xiaomi_store&geo_lng=' + lng + '&geo_lat=' + lat + '&v=' + ver;
    var result = $.getApi(url, 'text');
    let data = JSON.parse(result.replace("**YGKJ", "").replace("YGKJ##", ""));
    var stations = data.jsonr.data.stations;
    for (var idx = 0; idx < stations.length; idx++) {
        var mt = '';
        var sn = stations[idx].sn;
        var metros = stations[idx].metros;
        if (metros != null && metros.length > 0) {
            for (var j = 0; j < metros.length; j++) {
                var color = metros[j].color;
                var name = metros[j].fullName;
                mt += '<div style="color:white;background-color:rgb(' + color + ')">' + name + '</div>';
            }
        }
        $('#items').append('<div class="item">' + sn + mt + '</div>');
    }
}
function loadDetail() {
    var url = 'http://api.chelaile.net.cn/bus/line!busesDetail.action?sign=' + sign + '&cityId=' + cid + '&lat=' + lat + '&geo_type=gcj&gpstype=gcj&geo_lt=5&screenDensity=3.0&flpolicy=1&stats_referer=searchHistory&targetOrder='
        + od + '&lineId=' + lid + '&s=android&geo_lng=' + lng + '&geo_lat=' + lat + '&v=' + ver;
    var result = $.getApi(url, 'text');
    let data = JSON.parse(result.replace("**YGKJ", "").replace("YGKJ##", ""));
    if (data.jsonr.status == '00') {
        var item = data.jsonr.data;
        var rm = item.tip.desc;
        var bc = item.buses.length;
        var desc = '';
        $('#line').text(item.line.name + '路');
        if (rm != '') {
            var r = rm.match(/\d分钟/);
            if (r != null && r.length > 0)
                desc = r[0];
        }
        if (desc == '')
            desc = item.line.ksDesc;
        $('#remain').text(desc);
        $('#end').text(item.line.endSn);
        $('#count').text(bc);
        for (var index = 0; index < bc; index++) {
            var row = item.buses[index];
            var arrivalTime = '-', html = '';
            if (row.travels.length > 0) {
                var time = row.travels[0].arrivalTime;
                var d = $.getDateTime(time);
                var min = d.getMinutes().toString();
                if (min.length != 2)
                    min = '0' + min;
                var sec = d.getSeconds().toString();
                if (sec.length != 2)
                    sec = '0' + sec;
                arrivalTime = d.getHours() + ':' + min + ':' + sec;
            }
            html = '<div class="item"><p>车牌号：' + row.busId + '</p><p>当前车速：' + row.speed + '</p><p>距离站点：' + row.distanceToSc + '米</p><p>预计到达时间：' + arrivalTime
                + '</p></div>';
            $('#container').append(html);
        }
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
        case 'ArrowRight':
            tab(1);
            break;
        case 'ArrowLeft':
            tab(-1);
            break;
        case 'Q':
        case 'SoftLeft':
            window.location.href = '../time/index.html?lid=' + lid + '&lat=' + lat + '&lng=' + lng + '&sid=' + sid + '&cid=' + cid + '&od=' + od;
            break;
        case 'E':
        case 'Backspace':
        case 'SoftRight':
            window.location.href = '../info/index.html?cid=' + cid + '&lat=' + lat + '&lng=' + lng;
            break;
        case 'Enter':
            $('#container').empty();
            loadDetail(cid, lat, lng, lid, od);
            break;
    }
}

var current = 0, tab_location = 0;
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

function tab(move) {
    var currentIndex = parseInt($('.focus').attr('tabIndex'));
    var next = currentIndex + move;
    if (next > 1) next = 0;
    if (next < 0) next = 1;
    var items = document.querySelectorAll('li');
    var targetElement = items[next];
    if (targetElement) {
        $('.focus').attr("class", "");
        targetElement.className = "focus";
        tab_location = next;
        load();
    }
}