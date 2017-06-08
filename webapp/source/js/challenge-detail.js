var
    type = 3,//用清水赞
    userName,
    gameId,
    openid,
    targetChallengeNumber = 0,//页面上点击添加的卡路里；
    date, //时间戳 //YYYY-mm-dd hh:mi:ss
    challengeDate,
    systemTime,//时间戳
    updataTime,//用来判断是否可以上传的时间
    stweather,
    stmood,
    isChallengeFinished = false,
    locationSelf = window.location.href,
    tumbBtnText = "亲！发动身边力量为你打赏吧",//点赞的反应文字
    $backgroundTU = $("#backgroundTU"),//背景层刷新层
    costFreeBtn = $("#heart"),//清水赞按钮
    costForBtn = $("#weixin"),
    // costForRedBtn = $("#redPay"),
    editBtn = $("#detailpen"),//编辑按钮
    $myModal=$("#myModal"),
    sometingUserName,//这是分享出去的参与者的用户名字
    $shareGetFriend=$(".share-get-friend"),
    $sharePrev=$(".share-prev"),
    $addChallengePercentage=$("#add-challenge-percentage"),
    $heartA=$("#heartA"),
    page1 = $("#container");//对象page1

function initParam() {
    
    gameId = oGetVars.gameId || sessionStorage.getItem("gameId");
    userName =  sessionStorage.getItem("userName") || oGetVars.userName || localStorage.getItem("userName");
    sometingUserName = localStorage.getItem("userName") || oGetVars.userName;
    openid = localStorage.getItem("openid");
    // alert("分享人"+userName);
    // alert("登录人"+sometingUserName);
    challengeDate = oGetVars.challengeDate || sessionStorage.getItem("challengeDate");
    systemTime = challengeDate;
    date = new Date(challengeDate).Format("yyyy-MM-dd hh:mm:ss");

}

//提示手势
function localStorageF() {
    var $remindPicture = $("#remindPicture"),
        _remindPicture = localStorage.getItem("remindPicture3");
    //对提示图片做了一个本地永久保存,只提示一次;
    if (_remindPicture) {
        $remindPicture.remove();
        return
    } else {
        $remindPicture.show();
    }
    if ($remindPicture) {
        $remindPicture.click(function () {
            $remindPicture.remove();
            localStorage.setItem("remindPicture3", "true");
            return $remindPicture = null;
        })
    }

}

function fnInit() {
    zan(getChallengeInfo);
    //判断是否可以点赞
    if (sometingUserName!=userName) {
        $.ajax({
            type: "get",
            url: nodeurl+"challenge/game/getUserWeatherGold.do",
            data: {
                userName: sometingUserName,
                gameId: gameId
            },
            success: function (json) {

                if (json.result == "ok") {
                    // alert("是否可以点赞"+json.values);
                    if (json.values == 1) {
                        $myModal=null;
                        $heartA=null;
                        tumbBtnText = "亲！你已经支持我活动了，谢谢";
                    }
                }
            }
        });
    }
    $backgroundTU.hide();

}

function fnInitPicture(json) {
    //这里可以运用懒加载
    var len = json.pictureUrl.length;
    if (len > 0 || json.pictureUrl != undefined) {
        var tpls, tpl;
        for (var i = 0; i < len; i++) {
            tpl = '<div class="row">' +
                '<div class="col-xs-12">' +
                '<img src="' + json.pictureUrl[i].pictureUrl + '" class="img-responsive clite-margintop5">' +
                '</div>' +
                '</div>';
            if (i == 0) {
                tpls = tpl;
            } else {
                tpls += tpl;
            }
        }
        $("#photo").html(tpls);
    } else {
        //如果图片没有应该加一张假图
    }
}

//初始化运动轴
function getRange(json) {
    var value = json,
        _finalCalorie = value.finalCalorie,
        _addCalorie = value.addCalorie,
        _addCaloriePercentage = _addCalorie / _finalCalorie * 100;//朋友添加的卡路里的百分比

    $addChallengePercentage.attr("style", "width:" + _addCaloriePercentage + "%");//朋友添加的卡路里的比例

    $("#target-challenge-percentage").attr("style", "width:" + (100 - _addCaloriePercentage) + "%");//目标添加卡路里的比例

    $("#add-challenge-number").html(_addCalorie);//盆友添加的卡路里

    var money=value.goldNum*2;
    $("#thumbsText").html(money);//黄金赞的数量；

    if (_finalCalorie != undefined && _finalCalorie != "") {//总计卡路里数量
        $("#totalText").html(_finalCalorie);
        $("#finalCalorie").html(_finalCalorie);
    }

    $("#heartText").html(value.totalPraise);//总的点赞数量添加到页面；

    $backgroundTU.hide();//将页面的刷新按钮停止;
}

//初始化福利层、挑战内容、目标卡路里
function fnInitData(json) {

    targetChallengeNumber = json.goleCalorie;//目标的卡路里
    //判断是否有gameId;
    if (!gameId) {
        gameId = json.id;
    }
    if (json.margin) {
        if (json.margin > 0) {
            $("#welfare-number").html(json.margin);//先填加后显示;
        } else {
            $(".welfare").hide();
        }
    }
    if (json.challengeContent) {
        $("#detailDescribe").html(json.challengeContent);//挑战描述内容；
    }
    $("#target-challenge-number").html(targetChallengeNumber);//目标卡路里
}

//初始化页面头部信息的方法
function getPagehead(vaule) {
    var getUserInfoUserName = vaule.userName;
    var data = {
            userName: userName
        },
        url = "challenge/user/getUserInfo.do",
        public = new PublickFn(url, data, getUserInfo);
    public.ajaxFn();
    public = null;

    date = new Date(vaule.startTime).Format("yyyy-MM-dd hh:mm:ss");//获得时间
    var gameDay = new Date(vaule.startTime).Format("yyyy年MM月dd日");
    $(".gameDay").html(gameDay);
    mood(date, getUserInfoUserName);

}
//获取用户信息
function getUserInfo(json) {
    var nickName = json.nickName;
    $(".nickName").html(nickName);
    $(".headPicture img").attr("src", json.headPortraitUrl);
}

//获取个人信息;
function getMyselfInformation(json) {

    $heartA=null;//点赞效果
    $myModal=null;//支付层
    $(".share").hide();//分享层
    //判断是发起人的什么状态
    if (json.statue == 3) {
        // alert("亲！你的活动过期了!")
    }
    if (json.statue != 0) {
        $("#doing").hide();
        isChallengeFinished = true;
        $("#challengeOkText").html("红包明细");
        $("#ok img").attr("src", "../source/img/operation-icon07.png");
        $shareGetFriend.show();
        $sharePrev.show();
        $("#best-game").hide();
        if (json.realityCompleteCalorie < json.finalCalorie) {

            $("#fqokImg").attr("src", "../source/img/img-face-05.png")
        }
        editBtn.hide();
        if (json.realityCompleteCalorie) {
            $(".lastText").html(json.realityCompleteCalorie);
        }
    } else {
        $shareGetFriend.hide();
        $sharePrev.show();
    }

    //点击挑战完成按钮;
    $("#challengeOk").on("click", function () {
        judgeComplete(json)
    });
}

//点击完成按钮判断是否完成挑战功能
function judgeComplete(json) {
    if (json.statue != 0) {
        location.href = "grab-red.html?gameId=" + gameId;
    } else {
        if (systemTime != "") {
            var d1 = new Date(json.startTime),
                d1str = d1.Format("yyyy-MM-dd"),
                d2 = new Date(),
                d2str = d2.Format("yyyy-MM-dd");
            if (d1str == d2str) {

                var newPage = "upload-data.html" + "?userName=" + userName + "&gameId=" + gameId + "&f=d" + "&challengeDate=" + challengeDate;
                location.replace(newPage);
            } else {
                alert("亲！你的活动只有在发起当天才能结束，发起日期是" + d1str + "别忘了完成哦")
            }
        }

    }
}
//todo 当把页面分享出去时候,点击我也挑战时候是否要先回到主页再进,还是直接进这个页面这是问题
function getHerselfInformation(json) {
    editBtn.hide();
    if (json.statue != 0) {
        $("#doing").hide();
        $shareGetFriend.show();
        $sharePrev.hide();
        var fxBottom = $("#share-btn");
        fxBottom.show();

        $("#best-game").hide();//关闭点赞层

        var realityCompleteCalorie = json.realityCompleteCalorie;

        if (realityCompleteCalorie) {
            $(".lastText").html(realityCompleteCalorie);
        }
        // todo 点击页底的我也挑战按钮跳到,创建挑战页;

    } else {

        $sharePrev.hide();
        $(".share").show();
        $shareGetFriend.hide();
    }
}

//页面初始化信息的拆解方法
function getChallengeInfo(value) {

    challengeDate = value.startTime;

    getPagehead(value);//获取页面头部信息的方法

    getRange(value);//可重复加载的数据

    fnInitData(value);//初始化的数据

    fnInitPicture(value);//初始化页面的图片
    //判断是否是同一个人的username,如果不是就是分享出去的。

    if (userName == sometingUserName) {
        getMyselfInformation(value);

    } else {
        getHerselfInformation(value)

    }

}

//卡路里的动态增加方法
function addpengyou(addCalorie, mubiaoCalorie) {

    $addChallengePercentage.attr("style", "width:" + addCalorie + "%");//朋友添加的卡路里
    $("#target-challenge-percentage").attr("style", "width:" + (100 - addCalorie) + "%");//目标添加的卡路里
    $("#target-challenge-number").html(mubiaoCalorie);
}

//申请微信支付
function thumbsTextAjax() {

    $.ajax({
        type: "get",
        url: nodeurl+"challenge/game/applyGoldPraise.do",
        data: {
            userName: sometingUserName,
            gameId: gameId,
            openid: openid,
            total_fee: 2

        },
        beforeSend: function (XMLHttpRequest) {
            $backgroundTU.show();
        },
        success: function (json) {
            $backgroundTU.hide();
            if (json.result == "ok") {
                var vj = json.values;
                //往存储里写gameId，因为微信支付后页面跳转，url参数无法获取

                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        appId: vj.appId,     //公众号名称，由商户传入
                        timeStamp: vj.timeStamp,         //时间戳，自1970年以来的秒数
                        nonceStr: vj.nonceStr, //随机串
                        package: vj.package,
                        signType: "MD5",         //微信签名方式：
                        paySign: vj.paySign //微信签名
                    },
                    function (res) {
                        var resMsg = res.err_msg;
                        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                        if (resMsg == "get_brand_wcpay_request:ok") {

                            costForBtn.off();//解绑微信付款;
                            $(".modal-backdrop").remove();
                            $heartA=null;
                            $myModal=null;
                            // 支付成功后的回调函数，转向预览页
                            return zan(getRange);

                        }else if(resMsg == "get_brand_wcpay_request:cancel"){
                            // cancelPay(data)
                        }else{
                            alert("微信付款出现问题(网络或平台原因)");
                            // cancelPay(data);
                            // _notive="微信付款出现问题(网络或平台原因)";
                            // return noticeSetTimeoutPublick(_notive);
                        }
                    }
                );
            } else {
                alert(json.errormsg);
            }
        },
        complete: function (XMLHttpRequest) {
            $backgroundTU.hide();
        }
    });
}
//点击清水赞的接口
function heartTextAjax() {
    var data = {
            userName: sometingUserName,
            gameId: gameId
        },
        url = "challenge/game/rinsingPraise.do",
        public = new PublickFn(url, data, rinsingPraise);
    public.ajaxFn();
    public = null;
}

function rinsingPraise() {
    $heartA.hide();
    costFreeBtn.off();//点击完清水咱后要解绑按钮
    return zan(getRange);//点击了清水赞后我们要将总的点赞人数给重新更新，所以要调用一下赞方法
}

//.当点击不管是清水赞还是黄金赞时候我们都要再次掉一下获取点赞接口将  点赞总信息和卡路里条进行修改
function zan(f) {
    //初始化挑战信息
    var data = {
            userName: userName,
            date: date,
            gameId: gameId,
            checkerName:sometingUserName
        },
        url = "challenge/game/getChallengeInformation.do",
        public = new PublickFn(url, data, f);
    public.ajaxFn();
    public = null;
    //判断是否可以点赞
}


function praise() {
    if(!$heartA){ //当$heartA被赋值为null是我们就显示提示信息
        alert(tumbBtnText)
    }else{
        $heartA.show();
        heartTextAjax();//1要记录一下点赞的情况
    }
}

function thumbBtn() {
    if($myModal){
        $myModal.show();    //如果存在就可以点赞否则弹出提示信息
    }else{
        alert(tumbBtnText);
    }
}

function replaceUrl(newPage) {
    var localUserName=localStorage.getItem("userName");
    location.href = newPage + "?userName=" + localUserName + "&gameId=" + gameId + "&f=d" + "&challengeDate=" + challengeDate;
}

//等候加载
$(function () {
    $backgroundTU.show();

    localStorageF();//独立片段 提醒
    initParam();//初始化页面信息
    fnInit();//初始化页面功能

    costFreeBtn.on("click", praise);//清水赞

    //点击微信支付要判断是否在微信环境下

    costForBtn.on("click", function () {
        // alert(1)
        thumbsTextAjax(sometingUserName, gameId);//调用微信申请号接口
    });

    //点击点赞按钮
    $("#thumbs").on("click", thumbBtn);

    $("#upMood").click(function () {
        //点击天气心情更换图标
    });

    $myModal.on('click',function () {
        $myModal.hide()
    });
    //点击编辑按钮调转到编辑页面

    editBtn.on("click", function () {
        var newPage = "add-challenge.html";
        replaceUrl(newPage);
        // location.href = "add-challenge.html?gameId=" + gameId + "&f=d" + "&userName=" + userName + "&challengeDate=" + challengeDate;
    });

    //点击完成挑战跳到挑战页面

    $("#stone").click(function () {
        var newPage = "record-name.html";
        replaceUrl(newPage);
    });


    $(".messageAll").click(function () {
        var newPage = "message-board.html";
        replaceUrl(newPage);
    });



    //我也要挑战
    $("#my-want-challenge").on("click", function () {
        var newPage = "add-challenge.html";
        location.href = newPage + "?userName=" + sometingUserName  + "&f=d" + "&challengeDate=" + challengeDate;
    })
});
