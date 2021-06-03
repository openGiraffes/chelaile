const ver = '3.80.0';
const pf = 'android';
const src = 'webapp_default';
const sign = 'PPgBLFF5779koWJpY09iQg%3D%3D';

$.extend({
    initApi: function () {
        $.ajaxSettings.xhr = function () {
            try {
                return new XMLHttpRequest({ mozSystem: true });
            } catch (e) { }
        };
    },
    getApi: function (url, type) {
        var json = null;
        if (typeof type == 'undefined')
            type = 'json';
        $.ajax({
            url: url,
            type: "get",
            async: false,
            dataType: type,
            beforeSend: function (request) {
                $.showLoading();
                request.setRequestHeader("user-agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36")
            },
            success: function (data) {
                json = data;
            },
            complete: function () {
                $.hideLoading();
            }
        });
        return json;
    },
    getQueryVar: function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    },
    getDateTime: function (timestamp) {
        var unixTimestamp = new Date(timestamp);
        var localString = unixTimestamp.toLocaleString();
        return new Date(localString);
    },
    isEmpty: function (obj) {
        return obj == null || obj == '' || obj == undefined || typeof obj == 'undefined';
    },
    setData: function (key, value, temple) {
        try {
            if (temple == null || temple == undefined || typeof temple == 'undefined')
                temple = false;
            if (temple)
                sessionStorage.setItem(key, value);
            else
                localStorage.setItem(key, value);
        }
        catch (e) {
            console.log(e);
        }
    },
    getData: function (key, temple) {
        var result = false;
        try {
            if (temple == null || temple == undefined || typeof temple == 'undefined')
                temple = false;
            if (temple)
                result = sessionStorage.getItem(key);
            else
                result = localStorage.getItem(key);
        }
        catch (e) {
            console.log(e);
        }
        if (result == null || result == undefined || typeof result == 'undefined')
            result = false;
        return result;
    }
});

$(function () {
    $.initApi();
});