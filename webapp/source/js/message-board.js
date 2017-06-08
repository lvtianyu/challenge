function Range(html, initParam) {
    this.html = html;
    this.initParam = initParam;
}
Range.prototype = {
    section_ajax: function () {
        var self = this;
        $.ajax({
            type: "get",
            url: nodeurl+"challenge/game/getChallengeLeaveMessage.do",
            data: {
                gameId: self.initParam.gameId
            },
            success: function (json) {
                if (json.result == "ok") {

                    self.section1(json);
                } else {
                    
                }
            }
        });

    },

    addChallengeLeaveMessage: function (content) {
        var self = this,
            uesrName=this.initParam.userName ;
        if (uesrName != "" && uesrName != undefined && uesrName != null) {
            $.ajax({
                type: "get",
                url: nodeurl+"challenge/game/addChallengeLeaveMessage.do",
                data: {
                    content: content,
                    userName: uesrName,
                    gameId: this.initParam.gameId
                },
                success: function (json) {
                    if (json.result == "ok") {
                        $(self.initParam.messageBtn).attr("style", "background-color:#fff");
                        self.section_ajax();//每当我点击留言成功后我们都要在调一下接口；
                    } else {
                    }
                },
                error: function () {

                }
            });
        }
    },
    section1: function (json) {
        var self = this,
            tpls,
            tpl,
            day,
            value = json.values,
            len = value.length;

        if (len > 0) {

            for (var i = 0; i < len; i++) {
                day = new Date(value[i].createTime).Format("yyyy-MM-dd");
                if (!value[i].userName) {
                    value[i].nikeName = "过客";
                }
                tpl = ' <div class="clite-row">' +
                    '<div class="row clite-margin0">' +
                    '<div class="col-xs-3 remove-padding-right">' +
                    value[i].nikeName + "说:" +
                    '</div>' +
                    '<div class="col-xs-9 remove-padding-left">' +
                    value[i].content +
                    '</div>' +
                    '</div>' +
                    '<div class="row clite-margin0">' +
                    '<div class="col-xs-12 message-day">' +
                    day +
                    '</div>' +
                    '</div>' +
                    '</div>';
                if (i == 0) {
                    tpls = tpl;
                } else {
                    tpls += tpl;
                }
            }
        } else {
            $(this.html.messageNome).show();
        }
        $(this.html.section).html(tpls);
        $(this.html.messageText).val("");
        $("#backgroundTU").hide();
    },

    messageBtn: function () {
        var self = this,
            messageText = $(this.html.messageText).val();
        if (Number(messageText) != 0) {
            if (messageText.match(/&[lg]t/g)) {
                alert("亲！你输入的内容有&lg,请修改");
            } else {
                //同时将姓名和留言内容保存到后台
                self.addChallengeLeaveMessage(messageText);
            }
        } else {

        }
    }

};
$(function () {
    (function (label) {
        var All = {
            userName: localStorage.getItem("userName"),
            gameId: oGetVars.gameId,
            date: new Date(oGetVars.challengeDate).Format("yyyy-MM-dd hh:mm:ss"),
            stweather: "",
            stmood: "",
            systemTime: oGetVars.challengeDate
        };
        var every = new Range(label, All);
        every.section_ajax();//页面内容
        $(label.messageBtn).click(function () {
            every.messageBtn()
        });//调用留言部分
        $(label.upMood).click(function () {
            window.location.replace('mood-weather.html?challengeDate=' + All.systemTime + "&weather=" + All.stweather + "&mood=" + All.stmood);

        });
        $("input").keyup(function () {
            var messageText = $(label.messageText).val();
            if (Number(messageText) != 0) {
                $(label.messageBtn).attr("style", "background-color:#31e2cb");
            } else {
                $(label.messageBtn).attr("style", "background-color:#fff");
            }
        })
    })({
        messageBoard: "#messageBoard ",
        messageNome: "#messageNome",
        section: ".section",
        messageBtn: "#messageBtn",
        messageText: "#messageText",
        upMood: "#upMood"
    })
});

