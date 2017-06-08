/**
 * Created by EYUN on 2015/12/18.
 */
//sessionStorage传递过来的用户名参数
var redAccount = $("#redAccount"),
    userName,
    userImg = $("#userImg"),
    gameId;


function initParams() { //获取sessionStorage本地存储的值
    userName = localStorage.getItem("userName") || oGetVars.userName ; //得到系统的userName//sessionStorage.getItem("userName");
    //userAge = sessionStorage.getItem("userAge");
    gameId = oGetVars.gameId;

    $("#btn-check-challenge").click(function () {
        window.location.href = "challenge-detail.html?gameId=" + gameId;
    });
    initReadRed()
}




// if (userName) {
    function initReadRed() {
        //读手气
        $.ajax({
            type: "get",
            url: "http://camp.liver-cloud.com/platform/livercloud/v1/redpacket/getRedMessage.do",
            data: {
                userName: userName,
                gameId: gameId
            },
            beforeSend: function (XMLHttpRequest) {
                //alert("beforeSend");//显示进度条
                //ShowLoading();
                console.log("beforeSend");
            },
            success: function (json) {
                console.log(json);
                //alert(json);
                handleResultReadRed(json);
            },
            error: function () {
                //请求出错处理
                console.log("error");
            },
            complete: function (XMLHttpRequest, textStatus) {

                console.log("complete");
            }
        });
    }
// }

function handleResultReadRed(json) {
    var errorcode = json.errorcode,
        errormsg = json.errormsg,
        result = json.result,
        valuesobj = json.values,
        gameUserInfo=valuesobj.gameUserInfo,
        redpacketList=valuesobj.redpacketList;
    if ("ok" == result) {
        if(!gameUserInfo || gameUserInfo=="null"){
            alert("系统忙,抱歉")
        }else{
            $("#nickName").html(gameUserInfo.nickname);
            userImg.attr("src", gameUserInfo.headPortrait);
        }
        $("#redAccount").html(valuesobj.userRedpacketSum);
        var len = redpacketList.length;
        if (redpacketList && len> 0) {
            var list = "";
            for (var i =0; i<len;i++) {
                var m = redpacketList[i];

                list += "<div class='clite-row clearfix'>";
                list += "  <div class='pull-left clite-grabred-row-left'>";

                var _userName = m.nickname;
                var _headPortrait = m.headPortrait || "../img/img-defaule-head.png";
                
                if (_headPortrait) {
                    list += "    <img src='" + _headPortrait + "' class='clite-head-img clite-vertical-middle' />";
                }
                list += "  </div>";
                list += "  <div class='pull-left clite-grabred-row-left clite-grabred-name'>";
                list += "    " + _userName + "";
                list += "  </div>";

                    list += "  <div class='pull-right clite-grabred-row-right text-right'>";
                    list += "    " + m.account + "元";
                    list += "  </div>";

                list += "</div>";
            }
            $(".redList").html(list);
        } else {
            $(".redList").html("<div align='center' class='clite-prompt-message1 clite-margintop20'>啥都没有 ╮(╯_╰)╭ </div>");
        }
    }
    // iScrollInit(slideDownCallback, slideUpCallback);
}


$(function () {

    initParams();

    // initReadRed();//读红包

});
