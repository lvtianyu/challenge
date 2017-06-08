/**
 * Created by lvtianyu on 16/6/29.
 */
var urlContent={};
uploadOk=true;
function  url(){
    var gameId = oGetVars.gameId;

    locationSelf = location.href;

    if(locationSelf.indexOf("challenge-detail")!=-1){
        if (undefined != isChallengeFinished && isChallengeFinished) {
            urlContent={
                h: nodeurl + "pages/grab-red.html?d=a&gameId="+gameId+"&userName="+userName+"&challengeDate"+systemTime,
                title:"查看红包详情！",
                content:"今天挑战结束，回馈好友福利",
                pic: nodeurl + "source/img/fhb.png"
            };
        }else{
            
            urlContent={
                h:nodeurl + "pages/challenge-detail.html?d=a&gameId="+gameId+"&userName="+userName+"&challengeDate"+systemTime,
                title:"挑战“健康信息”",
                content:"既要红包更要健康！N倍红包给更健康的自己！",
                pic: nodeurl + "source/img/fheart.png"
            };
            
        }
    }else {

        urlContent={
            h: "http://camp.liver-cloud.com/platform/Web/dist/index.html#!/",
            title:"医云推出健康小活动，一起造起来!",
            content:"专为运动爱好者而设计，现在就体验！",
            pic: serverHome + "/source/img/fyd.png"
        };

    }

}



function initWxJSSDK() {
    var thisPageUrl = location.href;
    $.ajax({
        type: "get",
        url: wechaturl+"initJSSDK.do",
        data: {
            pageUrl: thisPageUrl
        },
        beforeSend: function (XMLHttpRequest) {
        },
        success: function (data) {
            var json=JSON.parse(data);
            if (json.result == "ok") {
                var signJson = json.values,
                    appid = signJson.appid,
                    timestamp = signJson.timestamp,
                    noncestr = signJson.noncestr,
                    signature = signJson.signature,
                    url = signJson.url;
                    //初始化微信sdk
                    wx.config({
                        debug: false,
                        appId: appid,
                        timestamp: timestamp,
                        nonceStr: noncestr,
                        signature: signature,
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'chooseWXPay',
                            'checkJsApi',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage'
                        ]
                    });

            } else {
                alert(json.errormsg);
            }
        },
        error: function () {
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });

}

if(wx != undefined){
    wx.ready(function () {
        console.log(urlContent);

        //判断当前客户端版本是否支持指定JS接口
        wx.checkJsApi({
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'chooseWXPay',
                'checkJsApi',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage'
            ],
            success: function (res) {
                // console.log(res);
                console.log(urlContent);
            }
        });

        //朋友圈
        wx.onMenuShareTimeline({
            title: urlContent.title, // 分享标题
            link: urlContent.h, // 分享链接
            imgUrl:urlContent.pic, // 分享图标
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            trigger: function (res) {
                //shareLog()
                //alert('用户点击分享到朋友圈');
            },
            success: function (res) {

                //shareLog()
                alert('已分享');
            },
            cancel: function (res) {
                //alert('已取消');
            },
            fail: function (res) {
                alert(JSON.stringify(res));
            }
        });

        //分享给朋友
        wx.onMenuShareAppMessage({
            title: urlContent.title, // 分享标题
            desc: urlContent.content, // 分享描述
            link: urlContent.h, // 分享链接
            imgUrl:urlContent.pic, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                //alert("成功")
                // 用户确认分享后执行的回调函数
                //shareLog()
                alert('已分享');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                //alert('已取消');
            },
            fail: function (res) {
                alert(JSON.stringify(res));
            }
        });

    });
}
$(function () {
    initWxJSSDK();
    url();
});


