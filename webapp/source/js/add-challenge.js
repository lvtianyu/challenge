
$(function () {
    (function (html_Id) {

        var myScroll,
            gameId,
            isAddChallengePage = null,//判断是否是来自详情页;
            userName,
            challengeDate,
            challengeDateParam,
            $addWelfare=$("#addWelfare"),//添加福利
            $waitLoad=$("#backgroundTU"),
            $updataImgBody=$("#updataImg"),
            locationSelf = window.location,
            $pictureDelete= $('#pictureDelete'),//删除照片页面的按钮
            $challengeTarget=$("#challenge-target"),
            $challengeDesc=$("#challenge-desc"),
            $btnSave=$("#btn-save"),
            All_Fn = function () {  //交互效果的功能
                var relength = 0,//页面图片个数的记录
                    accountBalance,//判断红包的钱数
                    margin,//添加福利
                    images = {
                        localId: [],
                        serverId: []
                    },
                    openid,
                    panduanStatue = 0,
                    $uploadImgBtn=$(html_Id.uploadImgBtn),
                    onlyOne = true;//选择图片时用来判断只点击一次

                this.initParam = function () {
                    gameId = oGetVars.gameId; //根据gameId去判断是否新增操作
                    //从哪个页面过来的
                    challengeDateParam =  oGetVars.challengeDate || new Date().getTime();
                    challengeDateParam = Number(challengeDateParam);//将字符串转换成数字格式;
                    userName = localStorage.getItem("userName") ;//得到系统的userName;
                    openid = localStorage.getItem("openid"); //得到系统的openid
                    sessionStorage.removeItem("userName");//为了清楚分享过来的userName
                    isAddChallengePage = oGetVars.f;
                    
                    challengeDate = new Date(challengeDateParam).Format("yyyy-MM-dd hh:mm:ss");
                    
                    if (gameId) {
                        $("title").html("修改活动");
                    }
                    $("#div-util-btns").hide();
                    // $waitLoad.show()
                };

                //页面进来就发起活动
                this.fnInit = function () {

                    var data = {
                            userName: userName,
                            date: challengeDate,
                            checkerName:userName
                        },
                        url = "challenge/game/getChallengeInformation.do",
                        public = new PublickFn(url, data, analyticInformation);
                    public.ajaxFn();
                    public = null;

                };

                function analyticInformation(json) {

                    gameId = json.id;
                    // $waitLoad.hide();
                    if(gameId){
                        //这里的d用来判断是否是详情页过来的是就是编辑修改
                        if (gameId && isAddChallengePage != 'd') {
                            locationSelf.replace("challenge-detail.html?userName=" + userName + "&gameId=" + gameId + "&challengeDate=" + challengeDateParam);
                        } else if (gameId && isAddChallengePage == 'd') {
                            proess.getChallengeInfo(json);
                        }
                    }

                }
                
                this.getChallengeInfo = function (json) {
                    var value = json,
                        goleCalorie = value.goleCalorie,
                        challengeContent = value.challengeContent;
                    $challengeTarget.val(goleCalorie);
                    $challengeDesc.val(challengeContent);
                    $("#walk-distance").text(goleCalorie * 20);

                    if (value.statue != 0) {
                        panduanStatue = 1;
                        $challengeTarget.attr("readonly", "readonly");
                        $challengeDesc.attr("disabled", "disabled");
                        $btnSave.hide();
                    } else {
                        relength = value.pictureUrl.length;
                        if (relength > 0) {
                            $pictureDelete.show();
                            $(html_Id.pictureMath).html(relength);
                        }
                    }

                    $waitLoad.hide();

                    if (value.margin == undefined || value.margin == null) {
                        margin = 0;
                    } else {
                        margin = value.margin;
                    }

                    $("#myModalLabel").html(margin);
                    $("#div-util-btns").show();
                    // iScrollInit(slideDownCallback, slideUpCallback);

                };

                this.btnSaveHandler = function () {

                    var
                        challengeTargetVal = $challengeTarget.val();
                    if (challengeTargetVal != "" && challengeTargetVal.match(/[0-9]+/) && challengeTargetVal != 0) {  //做一个简单的教研
                        if (!challengeTargetVal.match(/&[lg]t/g)) {
                            var goleCalorie = challengeTargetVal,
                                challengeContent = $challengeDesc.val();
                            $challengeTarget.attr("readonly", "readonly");
                            $challengeDesc.attr("disabled", "disabled");
                                proess.updateChallengeMessage(goleCalorie, challengeContent, gameId);//将内容上传给服务器
                        }
                    } else {
                        alert("亲！目标不能为空或者为0");
                    }
                };
                this.updateChallengeMessage = function (goleCalorie, challengeContent, _gameId) {
                    var data, url, public;
                    if (undefined != _gameId && null != _gameId && "" != _gameId) {

                        data = {
                            goleCalorie: goleCalorie,//目标卡路里
                            challengeContent: challengeContent,//描述信息
                            gameId: _gameId
                        };
                        url = "challenge/game/updateChallengeMessage.do";
                        public = new PublickFn(url, data, analyticUpdata);
                        public.ajaxFn();
                        public = null;

                    } else {
                        data = {
                            goleCalorie: goleCalorie,//目标卡路里
                            challengeContent: challengeContent,//描述信息
                            userName: userName,
                            type: 0,
                            calendarDate: challengeDate
                        };
                        url = "challenge/game/addChallengeMessage.do";
                        public = new PublickFn(url, data, analyticAdd);
                        public.ajaxFn();
                        public = null;

                    }

                };

                function analyticUpdata(json) {
                    alert("保存成功");
                    publicUpdataAdd();
                }

                function analyticAdd(json) {
                    gameId = json;
                    alert("创建挑战成功");
                    publicUpdataAdd();
                }

                function publicUpdataAdd() {
                    $btnSave.hide();
                    $("#div-util-btns").show();
                }
                //<<<<<修改和添加格子

                this.doOpenlayer = function () {
                    if (panduanStatue == 1) {
                        $addWelfare.remove();//如果
                        alert("亲！你的活动已经结束了")
                    } else {
                        var layconcentheight,
                            container1 = $(".clite-remind-container1");
                        $addWelfare.show();
                        $("#redbag-amount").html(accountBalance);
                        layconcentheight = container1.height();
                        container1.css("margin-top", "-" + (layconcentheight) / 2 + "px")
                    }
                };
//支付福利接口
                this.thumbsTextAjax = function (transactionAmount) {
                    $.ajax({
                        type: "get",
                        url: nodeurl+"challenge/game/addWelfareOfficialAccount.do",
                        data: {
                            userName: userName,
                            gameId: gameId,
                            openid: openid,
                            total_fee: transactionAmount //元
                        },
                        success: function (json) {
                            console.log(json)
                            if (json.result == "ok") {
                                $waitLoad.hide();
                                var vj = json.values;
                                //往存储里写gameId，因为微信支付后页面跳转，url参数无法获取
                                // localStorage.setItem()
                                All_html_fn.close();
                                // wx.chooseWXPay({
                                //     timestamp: vj.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                //     nonceStr: vj.nonceStr, // 支付签名随机串，不长于 32 位
                                //     package: vj.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                                //     signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                //     paySign: vj.paySign, // 支付签名
                                //     success: function (res) {
                                //         // 支付成功后的回调函数，转向预览页
                                //         margin = Number(margin) + Number(transactionAmount);
                                //         console.log(margin)
                                //         $("#myModalLabel").html(margin);
                                //         // var _gameId = locache.get("gameId");
                                //         // if (_gameId) {
                                //         //     //todo 不知道这是为什么刷新自己
                                //         //     console.log(_gameId)
                                //         //     //  locationSelf.replace("add-challenge.html?gameId=" + _gameId + "&userName=" + userName + "&challengeDate=" + challengeDate);
                                //         // } else {
                                //         //     // locationSelf.replace("index.html");
                                //         // }
                                //     }
                                // });

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

                                            margin = Number(margin) + Number(transactionAmount);
                                            $("#myModalLabel").html(margin);

                                        }else if(resMsg == "get_brand_wcpay_request:cancel"){
                                            // cancelPay(data)
                                            alert("取消支付")
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
                        }
                    });


                };

                this.uploadImgClick = function () {
                    console.log(panduanStatue+"img");
                    if (panduanStatue == 0) {
                        if (onlyOne) {
                            onlyOne = false;
                            $waitLoad.show();
                            proess.updataImgHead();
                        }
                    } else {
                        $updataImgBody.remove();
                        alert("亲！活动已结束了，可以添加新活动上传美照哦")
                    }
                };
//选图片接口
                this.updataImgHead = function () {
                    $(html_Id.pictureAnimate).attr("style", "bottom:50%;right:50%");
                    $updataImgBody.show();
                    $(html_Id.imgContainer).html("");
                    images = {
                        localId: [],
                        serverId: []
                    };
                    wx.chooseImage({
                        success: function (res) {
                            onlyOne = true;
                            $waitLoad.hide();
                            proess.getSelectedImages(res);
                            //debug('已选择 ' + res.localIds.length + ' 张图片');
                        },
                        cancel: function (res) {
                            $waitLoad.hide();
                            onlyOne = true;
                            //console.log("取消选择图片：" + JSON.stringify(res));
                        },
                        fail: function (res) {
                            $waitLoad.hide();
                            onlyOne = true;
                            //console.log("选择图片失败：" + JSON.stringify(res));
                        }
                    });
                };

                this.getSelectedImages = function (res) {
                    images.localId = res.localIds; //[]
                    var tpls;
                    for (var j = 0, len = images.localId.length; j < len; j++) {
                        var tpl = '<li>' +
                            '<span class="remove-img xuan">' +
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

                    if (len > 0) {
                        console.log("len:" + len);
                        $uploadImgBtn.show();
                    } else {
                        $uploadImgBtn.hide();
                    }

                    //点击确定图片按钮
                    //点击×关闭图片

                    $(".remove-img").click(function () {
                        $(this).parent().remove();
                        images.localId = [];
                        var selectHtmlImg = document.getElementsByTagName('html_Id.selectHtmlImg');
                        for (var n = 0, len = selectHtmlImg.length; n < len; n++) {
                            images.localId.push(selectHtmlImg[n].getAttribute("src"));
                        }
                        if ($(html_Id.pictureMath).html() == 0) {
                            if (images.localId.length == 0) {
                                $pictureDelete.hide();
                                $uploadImgBtn.hide();
                            }
                        }
                        if (len == 0 || selectHtmlImg == undefined) {
                            $updataImgBody.hide();
                        }

                    })

                };
//上传图片接口
                this.yesUploadImg = function () {
                    //console.log("上传图片")
                    //console.log("三："+images.localId.length)
                    $uploadImgBtn.hide();
                    var i = 0,
                        length = images.localId.length;
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
                                    proess.pictureAnimation(images);
                                    proess.uploadImgLast(length);
                                }

                            },
                            fail: function (res) {
                                console.log(res)
                            }
                        });

                    }

                    upload();
                };

                //出现添加图片的动画;
                this.pictureAnimation = function (images) {
                    $(html_Id.pictureAnimate_Img).attr("src", images.localId[0]);
                    $(html_Id.pictureAnimate).show().animate({
                        "bottom": "-=49%",
                        "right": "-=49%",
                        "width": "hide",
                        "height": "hide"
                    }, 800, "linear");
                };

                this.uploadImgLast = function (length) {
                    $updataImgBody.hide();
                    $pictureDelete.show();
                    relength += length;
                    $(html_Id.pictureMath).html(relength);
                    images = {
                        localId: [],
                        serverId: []
                    };
                };
            };

        var proess = new All_Fn();

        proess.initParam();//初始化数据

        proess.fnInit();//初始化信息

        $btnSave.on("click", proess.btnSaveHandler);//点击保存按钮将数据上传

        $("#btnAddWelfare").on("click", proess.doOpenlayer);//打开福利层

        // $("#addWelfare-red").on("click", proess.redPayPve);//红包支付

        $("#updataImgHead").on("click", proess.uploadImgClick);//点击选取图片按钮

        $("#yesUp").on("click", proess.yesUploadImg);//上传图片

        $("#weixin").click(function () {          //点击微信支付要判断是否在微信环境下
            var fuli = $("#challenge-fuli").val();
            if (fuli >= 2) {
                $waitLoad.show();
                proess.thumbsTextAjax(fuli);//调用微信申请号接口
            }else {
                alert("福利金额2元以上")
            }
        });

        //页面上的功能
        var All_html_fn = {
            challengeTargetOnChangeHandler: function () {
                var userinput = $(this).val(); //格式化userInput的值把它换算成步数
                $("#walk-distance").text(userinput * 20);
            },
            close: function () {
                $addWelfare.hide();
            },
            remind: function () {
                $addWelfare.hide();
                //$("#remind").css("display","block");
            }
        };

        $challengeTarget.keyup(All_html_fn.challengeTargetOnChangeHandler);

        $("#close").click(All_html_fn.close);//点击关闭按钮关闭图层

        $("#challengeDetail").click(function () {
            var newPage = "challenge-detail.html";
            replaceUrl(newPage);
        });//点击跳转详情页

        $pictureDelete.click(function () {         //删除图片页面的链接
            locationSelf.href = "pictureDelete.html?userName=" + userName + "&gameId=" + gameId;
        });

        function replaceUrl(newPage) {
            locationSelf.replace(newPage + "?userName=" + userName + "&challengeDate=" + challengeDateParam + "&gameId=" + gameId);
        }

    })({
        uploadChallengeBtn: "#btn-save",
        btnAddWelfare: "#btnAddWelfare",
        imgContainer: "#scroller2>ul",
        pictureAnimate: "#pictureAnimate",
        selectHtmlImg: "#scroller2>ul>li img",
        pictureMath: "#pictureMath",
        uploadImgBtn: "#yesUp",
        pictureAnimate_Img: "#pictureAnimate img"
    });

    //初始化IScroll
    myScroll = new IScroll('#wrapper2', {scrollX: true, scrollY: false, mouseWheel: true});
});
