
//页面上来就要加载的请求

//页面初始化信息的拆解方法
$(function () {
    (function (html_Id) {
        var gameId = "", //根据gameId去判断是否新增操作
            userName = "", //得到系统的userName;
            openid = "", //得到系统的openid
            left = 0,
            myScroll,
            challengeDate,
            uploadOk = false;
        var images = {
            localId: [],
            serverId: []
        };
        var onlyOne = true;//选择图片时用来判断只点击一次
        var $uploadImgBtn=$(html_Id.uploadImgBtn);
        var $button = $(html_Id.uploadMessgaeBtn);

        var All_fn = function () {
            var  $updataImgBody=$(html_Id.updataImgBody);
            this.initParams = function () {
                gameId = oGetVars.gameId; //根据gameId去判断是否新增操作
                userName = localStorage.getItem("userName"); //得到系统的userName;
                challengeDate = new Date(oGetVars.challengeDate).Format("yyyy-MM-dd hh:mm:ss");
                openid =  localStorage.getItem("openid"); //得到系统的openid
                // iScrollInit(slideDownCallback, slideUpCallback);
            };

            this.fnInit = function () {
                var data = {
                        userName: userName,
                        date: challengeDate,
                        gameId: gameId,
                        checkerName:userName
                    },
                    url = "challenge/game/getChallengeInformation.do",
                    public = new PublickFn(url, data,  process.getChallengeInfo);
                public.ajaxFn();
                public = null;

            };
            this.getChallengeInfo = function (json) {
                var
                    _addCalorie = json.addCalorie,
                    _goleCalorie = json.goleCalorie,
                    _friendAddCalorie = _addCalorie / ( _addCalorie + _goleCalorie) * 100;//朋友添加的卡路里的百分比
                // mubiao = _goleCalorie;//目标的卡路里的百分比
                //卡路里的动态增加方法
                $("#add-challenge-number").html(_addCalorie);
                $("#totalText").html(_addCalorie + _goleCalorie);//总计卡路里数量
                $("#add-challenge-percentage").attr("style", "width:" + _friendAddCalorie + "%");//朋友添加的卡路里
                $("#target-challenge-percentage").attr("style", "width:" + (100 - _friendAddCalorie) + "%");//目标添加的卡路里
                $("#target-challenge-number").html(_goleCalorie);
            };

            this.updataMessage = function () {
                var $completeChallengeNumber= $("#complete-challenge-number"),
                    challengeContent = $("#challengeContent"),
                    _completeChallengeNumberVal = $completeChallengeNumber.val(),
                    challengeContentVal = challengeContent.val();
                if (_completeChallengeNumberVal != "" && _completeChallengeNumberVal.match(/[0-9]+/)) {
                    if (!$("textarea").val().match(/&[lg]t/g)) {
                        //同时将姓名和留言内容保存到后台
                        var realityCompleteCalorie = _completeChallengeNumberVal;
                        var content = challengeContentVal;
                        $completeChallengeNumber.attr("readonly", "readonly");
                        challengeContent.attr("disabled", "disabled");
                        process.uploadChallengeData(realityCompleteCalorie, userName, content);
                        $button.off();
                    } else {
                    }
                }
            };

            this.uploadChallengeData = function (realityCompleteCalorie, userName, content) {
                var data = {
                        realityCompleteCalorie: realityCompleteCalorie,//实际完成的卡路里数量
                        gameId: gameId,
                        challengeEndDescribe: content//挑战内容描述
                    },
                    url =  "challenge/game/uploadChallengeData.do",
                    public = new PublickFn(url, data, uploadChallengeData);
                public.ajaxFn();
                public = null;
            };
            
            function uploadChallengeData(json) {
                $(".unresult").hide();
                $(".result").show();
                $("#updataImg").show();
                uploadOk = true;
                $("#remindPicture").show();
                challengeResult(json);//根据返回值判断是否成功还是失败
            }

           function challengeResult(json) {
                //判断是成功还是失败，显示不同的图；
                if (json == 0) { //0是成功
                    $("#failure").hide();
                    $("#sucess").show();
                } else {
                    $("#failure").show();
                    $("#sucess").hide();
                }
            }

            this.uploadImgClick = function () {
                if (onlyOne) {
                    onlyOne = false;
                    process.updataImgHead();
                }
            };
            this.updataImgHead = function () {
                $updataImgBody.show();
                $(html_Id.imgContainer).html("");
                //用于清空
                images = {
                    localId: [],
                    serverId: []
                };
                wx.chooseImage({
                    success: function (res) {
                        onlyOne = true;
                        process.getSelectedImages(res);
                        //debug('已选择 ' + res.localIds.length + ' 张图片');
                    },
                    cancel: function (res) {
                        onlyOne = true;
                        //console.log("取消选择图片：" + JSON.stringify(res));
                    },
                    fail: function (res) {
                        onlyOne = true;
                        //console.log("选择图片失败：" + JSON.stringify(res));
                    }
                });
            };

            this.getSelectedImages = function (res) {
                images.localId = res.localIds; //[]
                var tpls;
                for (var j = 0,len=images.localId.length; j < len; j++) {
                    var tpl = '<li>' +
                        '<span class="xuan ">' +
                        ' &times;' +
                        '</span>' +
                        '<img src="' + images.localId[j] + '" >' +
                        '</li>'
                    if (j == 0) {
                        tpls = tpl;
                    } else {
                        tpls += tpl;
                    }
                }
                $(html_Id.imgContainer).html(tpls);
                if (images.localId.length > 0) {
                    $uploadImgBtn.show();
                } else {
                    $uploadImgBtn.hide();
                }
                //点击确定图片按钮
                //点击×关闭图片
                $(html_Id.deleteUploadImgBtn).click(function () {
                    $(this).parent().remove();
                    images.localId = [];
                    var Img =  $(html_Id.selectHtmlImg);
                    for (var n = 0,len2= Img.length; n <len2; n++) {
                        images.localId.push(Img)[n].getAttribute("src");
                    }
                    if (len == 0) {
                        $uploadImgBtn.hide();
                    }
                    //console.log("页面图片"+$("#scroller2>ul>li img").length)
                    if (Img.length == 0 || Img == undefined) {
                        $uploadImgBtn.hide();
                    }
                })
            };
            
            this.yesUploadImg = function () {
                $uploadImgBtn.hide();
                var i = 0, length = images.localId.length;
                images.serverId = [];
                function upload() {
                    wx.uploadImage({ //调用服务器端的接口，传递gameId和res.serverId//var uploadPicture= images.serverId.join();
                        localId: images.localId[i],
                        success: function (res) {
                            i += 1;
                            var serverid = res.serverId;
                            images.serverId.push(serverid);

                            var data = {
                                    pictureId: serverid,
                                    gameId: gameId
                                },
                                url = "challenge/game/saveImageToDisk.do",
                                public = new PublickFn(url, data, "");
                            public.ajaxFn();
                            public = null;
                            
                            if (i < length) {
                                upload();
                            } else if (i == length) {
                                alert("亲！你的美照已成功上传");
                                $updataImgBody.hide();
                            }

                        },
                        fail: function (res) {
                            //console.log(i)
                        }
                    });

                }

                upload();
            };
        };

        var process = new All_fn();
        process.initParams();
        process.fnInit();


        $button.on('click',process.updataMessage);
        //$(html_Id.updataImgHeadBtn).click(process.uploadImgClick);//选择图片；
        $(html_Id.updataImgHeadBtn).on('click',process.uploadImgClick);

        $uploadImgBtn.click(process.yesUploadImg);//上传图片
        $(html_Id.replaceUrl).click(function () {
            var newPage = "http://camp.liver-cloud.com/platform/Web/dist/index.html";
            location.replace(newPage);
        });

    })({
        uploadMessgaeBtn: "#updataMessgae",
        waitForLoad: "#backgroundTU",
        updataImgHeadBtn: ".updataImgHead",
        updataImgBody: ".upimg",
        imgContainer: "#scroller2>ul",
        uploadImgBtn: "#yesUp",
        deleteUploadImgBtn: ".modal-height div ul span",
        selectHtmlImg: "#scroller2>ul>li img",
        replaceUrl: "#return"
    });

    wx.error(function (res) {
        alert("微信接口出现错误: " + res.errMsg);
    });
    myScroll = new IScroll('#wrapper2', {scrollX: true, scrollY: false, mouseWheel: true});

});
