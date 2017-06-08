// function slideDownCallback() {
//     location.replace("challenge-detail.html?gameId=" + oGetVars.gameId) ;
// }
//
// function slideUpCallback() {
//     //location.reload();
// }
$(function () {
    (function (html_Id) {
        var All_Variables = {
            userName: "",
            gameId: "",
            pageIndex: 1,
            PageCount: 20,
            initParam: function () {
                this.userName = oGetVars.userName || locache.session.get("userName"); //初始复杂的变量函数,
                this.gameId = oGetVars.gameId;
            },
            Append_Msg_In_Div: function (data, html_Id) {

                var tpls,
                    dataLen = data.length,
                    tpl,
                    list,
                    crow;
                if (dataLen != undefined && dataLen != null) {
                    if (dataLen >= this.PageCount) {
                        $(html_Id.addMore).show();
                    } else if (dataLen == 0) {
                        $(html_Id.promptMsg).show();
                    }
                }

                for (var i = 0; i < dataLen; i++) {
                    list = data.list[i];

                    if (list.nikeName == undefined) {
                        list.nikeName = "过客";
                    }
                    var img;
                    if (list.headPortraitUrl == undefined || list.headPortraitUrl == "" || list.headPortraitUrl == null) {
                        img = "../source/img/img-defaule-head.png"
                    } else {
                        img = list.headPortraitUrl;
                    }
                    tpl = '<div class="row newHeight">' +
                        '<div class="col-xs-8 clite-record-padding0">' +
                        '<div class="pull-left clite-record-row-left">' +
                        '<img src=' + img + '>' +
                        '</div>' +
                        '<div class="pull-left clite-record-name">' + list.nikeName + '</div>' +
                        '</div>' +
                        '<div class="col-xs-4  clite-record-row-right text-right">' + 朋友 + '</div>' +
                        '</div>';

                    if (i == 0) {
                        tpls = tpl;
                    } else {
                        tpls += tpl;
                    }
                }
                $(html_Id.section).append(tpls);
                if (html_Id.divEven) {
                    $(html_Id.divEven).attr("style", "background-color:" + html_Id.divEvenColor);
                }
                // iScrollInit(slideDownCallback, slideUpCallback);
            },

            fnInit: function () {
                var self = this;
                $.ajax({
                    type: "get",
                    url: nodeurl+"challenge/game/getChellengeClickPraise.do",
                    data: {
                        gameId: this.gameId,
                        pageIndex: this.pageIndex
                    },
                    beforeSend: function (XMLHttpRequest) {
                        $("#backgroundTU").show();
                    },
                    success: function (json) {
                        if (json.result == "ok") {
                            var data = {
                                length: json.values.list.length,
                                list: json.values.list,
                            };
                            self.Append_Msg_In_Div(data, html_Id);
                        } else {
                        }

                    },
                    complete: function (XMLHttpRequest) {
                        $("#backgroundTU").hide();
                    },
                    error: function () {
                        //myalert("error");
                    }
                });
            },
        }
        All_Variables.initParam();//初始化变量
        All_Variables.fnInit();//初始化页面的后台数据
        $(html_Id.addMore).click(function () {//加载更多
            All_Variables.pageIndex += 1;
            All_Variables.fnInit();
        });
    })({
        addMore: "#addMore",
        promptMsg: "#promptMsg",
        section: "#section",             //将动态生成的每行div加载到页面上来
        divEven: "#section>.row:even", //选择隔行变色的颜色，如果不要求隔行变色，给false
        divEvenColor: "#f8f8f8",
    })
}
)
