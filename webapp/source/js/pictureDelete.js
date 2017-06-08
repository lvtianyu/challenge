
var target = document.getElementById("scroller");
target.style.webkitTransition = "all ease 0.2s";
function swipePicture(pictureUrl) {
    touch.on(target, "swiperight", function (ev) {
        //this.style.webkitTransform = "translate3d(" + 0 + "px,0,0)";
        prev();
    });

    touch.on(target, "swipeleft", function (ev) {
        //this.style.webkitTransform = "translate3d(-" + 0 + "px,0,0)";
        next();
    });
}

$(function () {
    (function (html_Id) {
        var userName,
            gameId,
            pictureUrl = [],
            i = 0,
            pictureLength,//图片长度
            windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            $nextImg=$(html_Id.nextImg),
            $prevImg=$(html_Id.prevImg),
            $waitingLoad=$("#backgroundTU"),
            $backgroundmodel=$(html_Id.backgroundmodel),
            All_Fn = function () {
                this.initParam = function () {
                    gameId = oGetVars.gameId;
                    userName = localStorage.getItem("userName");
                };

                this.fnInit = function () {
                    if (gameId) { //发起ajax请求//取活动的详情
                        var data= {
                            gameId: gameId,
                            userName:userName
                        },
                            url =  "challenge/game/getChallengeInformation.do",
                            public = new PublickFn(url, data, getChallengeInfo);
                        public.ajaxFn();
                        public = null;
                    
                    }
                };

                 function getChallengeInfo(json) {
                    pictureUrl = json.pictureUrl;
                    proess.createImgDiv(pictureUrl);
                }

                this.createImgDiv = function (pictureUrl) {
                    var len = pictureUrl.length,
                        tpl,
                        tpls;
                    if (len != 0 && pictureUrl != undefined) {
                        pictureLength = len - 1;//初始化图片的数量
                        tpls = ' <div class="item active" id=' + pictureUrl[0].id + '> ' +
                            '<img src=' + pictureUrl[0].pictureUrl + ' alt="..."> ' +
                            '</div>'
                        if (len == 1) {
                            proess.PreNextClickStyle();
                        } else if (len > 1) {
                            for (var i = 1; i < len; i++) {
                                tpl = ' <div class="item " id=' + pictureUrl[i].id + '> ' +
                                    '<img src=' + pictureUrl[i].pictureUrl + ' alt="..."> ' +
                                    '</div>'
                                tpls += tpl;
                            }
                        }
                        $(html_Id.scroller).html(tpls);
                        proess.loadingImg();
                    }
                };

                this.PreNextClickStyle = function () {
                    if (pictureUrl.length == 1) {
                        $prevImg.attr("src", "../source/img/img-pre2.png");
                        $nextImg.attr("src", "../source/img/img-next2.png")
                    }
                };

                this.loadingImg = function () {
                    $waitingLoad.show();
                    $(html_Id.fristImg)[0].addEventListener('load', function () {
                        proess.marginStyle(".active");
                        $waitingLoad.hide();
                    });
                };

                this.marginStyle = function (fromImg) {
                    var marginTop = 0,
                        marginLeft = 0,
                        $fromImg = $(fromImg),
                        $fromWidth=$(fromImg + " img").width(),
                        height = $fromImg.height();
                    if (!$fromImg.attr("style")) {
                        if (height < windowHeight) {
                             marginTop = (windowHeight - height - 50) / 2 + "px";
                        }
                        if ($fromWidth < windowWidth) {
                             marginLeft = (windowWidth - $fromWidth) / 2 + "px";
                        }
                        $fromImg.attr("style", "margin-top:" + marginTop + ";padding-left:" + marginLeft);
                    }
                };

                this.deletePictureClick = function () {
                    if ($(html_Id.item) != undefined) {
                        $waitingLoad.show();
                        var pictureId = $(html_Id.active).attr("id");
                        $(html_Id.active).remove();
                        pictureLength -= 1;//修改图片的数量
                        proess.deleteAjax(pictureId);
                    }
                };

                this.deleteAjax = function (pictureId) {
                    var data = {
                        pictureId: pictureId
                    };

                    $.ajax({
                        type: "get",
                        url: nodeurl+"challenge/game/deletePicture.do",
                        data: data,
                        beforeSend: function (XMLHttpRequest) {
                            if (this.waitProcess) {
                                $waitingLoad.show();
                            }
                        },
                        success: function (json) {
                            if (json.result == "ok") {
                                $waitingLoad.hide();
                                return proess.newpictureUrl(pictureId);
                            } else {
                                alert(json.errormsg);
                            }
                        },
                        complete: function (XMLHttpRequest) {
                            if (this.waitProcess) {
                                $waitingLoad.hide();
                            }
                        },
                        error: function () {
                            //myalert("error");
                        }
                    });
                };

                this.newpictureUrl = function (pictureId) {       //给图片重新初始数组
                    var pictureUrl1 = [];
                    for (var j = 0, len = pictureUrl.length; j < len; j++) {
                        if (pictureId != pictureUrl[j].id) {
                            pictureUrl1.push(pictureUrl[j])
                        }
                    }
                    //console.log(pictureUrl1.length)
                    if (pictureUrl1.length > 0) {
                        alert("亲！您的图片已删除");
                        proess.Refresh(pictureUrl1);
                    } else {
                        $(html_Id.scroller).html("亲！您现在的图片已经删完了")
                    }
                    $waitingLoad.hide();
                };

                this.Refresh = function (pictureUrl1) {  //判断按钮的顺序
                    pictureUrl = pictureUrl1;
                    //console.log(i)
                    //console.log(pictureUrl1)
                    var id;
                    if (i > 0) {
                        if (i != (pictureLength + 1)) {
                            id = "#" + pictureUrl[i].id;
                            $(id).addClass("active");
                            if (pictureUrl.length == 2 || i == pictureLength) {
                                $nextImg.attr("src", "../source/img/img-next2.png")
                            }
                        } else {
                            id = "#" + pictureUrl[i - 1].id;
                            $(id).addClass("active");
                            $nextImg.attr("src", "../source/img/img-next2.png");
                            i -= 1;
                        }
                    } else {
                        id = "#" + pictureUrl[i].id;
                        $(id).addClass("active");
                        $prevImg.attr("src", "../source/img/img-pre2.png");
                    }
                    proess.PreNextClickStyle();
                };
            };

        var proess = new All_Fn();
        proess.initParam();
        proess.fnInit();//初始化整个页面框架和第一张图片；

        var All_html_fn = {
            prev: function () {
                if (i > 0) {
                    var item = $(html_Id.item);
                    $backgroundmodel.show();
                    var Rto = "#" + item[i].getAttribute("id");
                    var Rfrom = "#" + item[i - 1].getAttribute("id");
                    $(Rfrom).attr("class", "item active left ");
                    proess.marginStyle(Rfrom);
                    this.swipeRight(Rfrom, Rto);
                }
            },

            swipeRight: function (Nfrom, Nto) {
                var $Nto=$(Nto),$Nfrom=$(Nfrom);
                i -= 1;
                if (i == 0) {
                    $prevImg.attr("src", "../source/img/img-pre2.png");
                }
                $nextImg.attr("src", "../source/img/img-next1.png");

                $(html_Id.scroller).attr("style", "text-align:center");
                setTimeout(function () {
                    $Nto.addClass("right")
                    $Nfrom.removeClass("left")
                }, 300)
                setTimeout(function () {
                    $Nto.attr("class", "item ")
                    $backgroundmodel.hide();
                }, 900)
            },

            next: function () {
                //console.log(pictureLength)
                //console.log(i)
                if (i < (pictureLength)) {
                    $backgroundmodel.show();
                    var Nto = "#" + $(html_Id.item)[i].getAttribute("id");
                    // console.log($(html_Id.item))
                    // console.log(pictureLength)
                    // console.log($(html_Id.item)[(i + 1)])
                    var Nfrom = "#" + $(html_Id.item)[(i + 1)].getAttribute("id");
                    $(Nfrom).attr("class", "item active prev");
                    proess.marginStyle(Nfrom);
                    this.swipeLeft(Nfrom, Nto);
                }
            },

            swipeLeft: function (Rfrom, Rto) {
                i += 1;
                //console.log("+：" + i)
                if (i == pictureLength) {
                    $nextImg.attr("src", "../source/img/img-next2.png");
                }
                $prevImg.attr("src", "../source/img/img-pre1.png");
                $(html_Id.scroller).attr("style", "text-align:center");
                setTimeout(function () {
                    $(Rto).addClass("next");
                    $(Rfrom).removeClass("prev");
                }, 300);
                setTimeout(function () {
                    $(Rto).attr("class", "item ");
                    $backgroundmodel.hide();

                }, 900)
            }
        };

        $(html_Id.deletePicture).click(proess.deletePictureClick);
        $(html_Id.nextBtn).click(function () {
            All_html_fn.next()
        });
        $(html_Id.prevBtn).click(function () {
            All_html_fn.prev()
        });
        $(html_Id.replaseUrl).click(function () {
            window.location.href = "add-challenge.html?gameId=" + gameId;
        });
    })({
            scroller: "#scroller",
            prevBtn: "#pre",
            nextBtn: "#next",
            nextImg: "#next>img",
            prevImg: "#pre>img",
            fristImg: "#scroller img",
            item: ".item",
            active: ".active",
            backgroundmodel: "#backgroundmodel",
            deletePicture: "#deletePicture",
            replaseUrl: "#return"
        }
    )
});