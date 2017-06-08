    //全局调试开关，如果为true，那么util.js里的debug()提示的内容都弹出。
    var nodejsServerIp = "http://camp.liver-cloud.com",//测试
        contextPath = "/challenge/",
        serverHome =  nodejsServerIp + contextPath,
        nodeurl = serverHome,
        wechaturl = 'http://camp.liver-cloud.com/platform/weixin/',
        locationSelf = location.href,
        userName,
        oGetVars = {},
        locationSelfSearch = location.search;

    (function (sSearch) {
        var rNull = /^\s*$/, rBool = /^(true|false)$/i;
        function buildValue(sValue) {
            if (rNull.test(sValue)) {
                return null;
            }
            if (rBool.test(sValue)) {
                return sValue.toLowerCase() === "true";
            }
            if (isFinite(sValue)) {
                return parseFloat(sValue);
            }
            if (isFinite(Date.parse(sValue))) {
                return new Date(sValue);
            }
            return sValue;
        }
        if (sSearch.length > 1) {
            for (var aItKey, nKeyId = 0, aCouples = sSearch.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
                aItKey = aCouples[nKeyId].split("=");
                oGetVars[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? buildValue(decodeURIComponent(aItKey[1])) : null;
                //此处将unescape()替换了
            }
        }
    })(locationSelfSearch);

    function checkWxLogin(type) {
        userName = localStorage.getItem("userName");
        if (!userName) {
            location.href = "http://camp.liver-cloud.com/platform/wechat/weixin.do?redirectUrl=" + nodeurl + type+"&userName="+sessionStorage.getItem("userName");
        }
    }
    var e = locationSelfSearch.substring(1);
    var g = decodeURIComponent(e);
    var h = g.split("&");
    //如果链接中有参数，并且userName不存在，说明是登录完成后返回的的链接；
    if (e && !userName && !oGetVars.d) {
        for (var c = 0, b = h.length; c < b; c++) {
            var f = h[c];
            var a = f.split("=");
            localStorage.setItem(a[0], a[1]);
        }
    }
    userName = localStorage.getItem("userName");
    //分享那部分的链接进行存储
    if(oGetVars.d){
    for (var c = 0, b = h.length; c < b; c++) {
        var f = h[c];
        var a = f.split("=");
        sessionStorage.setItem(a[0], a[1])
    }
}

    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {

    } else {
        // console.log(ua);
    }

    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

