let cityInfo = null, lat = 0, lng = 0;
$(function () {
    getLocation();
    document.activeElement.addEventListener('keydown', handleKeydown);
    navigator.spatialNavigationEnabled = false;
    var cid = $.getQueryVar('cid');
    if (cid != false) {
        var cname = decodeURIComponent($.getQueryVar('cname'));
        $('#cid').val(cid);
        $('#gps_city').text(cname);
        $('#lctt').text('城市');
    }
    document.getElementById('city').onchange = function (e) {
        var keyword = e.target.value;
        var cityName = $('#gps_city').text();
        var result = $.getApi('http://api.map.baidu.com/geocoder/v2/?address=' + keyword + '&output=json&ak=Bsr5iefxHEwQD8iCFTx3GwWOem0ZoSBk&city=' + cityName);
        if (result.status == 0) {
            lat = result.result.location.lat;
            lng = result.result.location.lng;
            $('#gps_city').text(keyword);
            $('#lctt').text(result.result.level);
        }
    }
});

function gotoPage() {
    var cid = $('#cid').val();
    var checked = $('#api').is(':checked');
    if (cid == '') {
        if (checked)
            getCityInfo();
        else
            openWeb();
    }
    else
        openWeb();
}

function openWeb() {
    var cityName = $('#gps_city').text();
    var web = 'http://web.chelaile.net.cn/ch5/index.html?showFav=1&switchCity=0&utm_source=webapp_meizu_map&showTopLogo=0&gpstype=wgs&src=webapp_meizu_map&utm_medium=menu&showHeader=1&hideFooter=1&cityName=' +
        cityName + '&cityId=' + cid + '&supportSubway=1&cityVersion=0&lat=&lng=#!/linearound';
    localStorage.setItem('url', web);
    window.location.href = '../web/index.html';
}

function getCityInfo() {
    if (cityInfo) {
        if (cityInfo.jsonr.status == '00') {
            var cityId = cityInfo.jsonr.data.localCity.cityId;
            window.location.href = '../info/index.html?cid=' + cityId + '&lat=' + lat + '&lng=' + lng;
        }
    }
    else {
        alert('获取位置失败，请确定已经获取当前位置！');
    }
}

function getLocation() {
    $('#gps_city').text('定位中...');
    if ("geolocation" in navigator) {
        var options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
    else {
        alert('没有权限获取当前位置，请手动搜索！');
    }
}

function success(pos) {
    var crd = pos.coords;
    lat = crd.latitude;
    lng = crd.longitude;
    var url = 'https://api.chelaile.net.cn/goocity/city!localCity.action?s=IOS&gpsAccuracy=80.000000&gpstype=wgs&push_open=1&vc=10554&lat=' + lat + '&lng=' + lng;
    var result = $.getApi(url, 'text');
    cityInfo = JSON.parse(result.replace("**YGKJ", "").replace("YGKJ##", ""));
    $('#gps_city').text(cityInfo.jsonr.data.localCity.cityProvince + cityInfo.jsonr.data.localCity.cityName);
}

function error(err) {
    $('#gps_city').text('定位失败...');
    alert('获取当前地址失败,请开启定位功能或者手动搜索！' + err.message);
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
            gotoPage();
            break;
        case 'E':
        case 'SoftRight':
            getLocation();
            break;
        case 'Enter':
            var radio = $('#api').is(':focus');
            if (radio === true) {
                var checked = $('#api').is(':checked');
                $('#api').attr('checked', !checked);
            }
            else
                window.location.href = '../city/index.html';
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
    }
}
