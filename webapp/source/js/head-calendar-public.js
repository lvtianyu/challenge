


//TODO 获取头部的日期

function mood(date,userName){
/*    $.ajax({
        type: "get",
        url:nodeurl,
        data: {
            userName:userName,
            date:date,
            action : "user/getUserHomePageInfo.do"
        },
        dataType : dataType,
        success : function(json) {
            if (json.result == "ok") {
                photograph(json);

            } else {
            }
        },
        error : function() {

        }
    });*/

    var data = {
            userName: userName,
            date: date,
            gameId: gameId
        },
        url = "challenge/user/getUserHomePageInfo.do",
        public = new PublickFn(url, data, photograph);
    public.ajaxFn();
    public = null;
    /*    var ajaxVariables = {
     data: {
     userName: userName,
     date: date,
     gameId: gameId,
     action: "game/getChallengeInformation.do"
     },
     callBack: function (json) {
     console.log(json)
     getChallengeInfo(json);
     },
     waitProcess: true
     };

     var getChallengeInformation = new PublicAjax(ajaxVariables);
     getChallengeInformation.fnajax();
     getChallengeInformation=null;*/
}
//图片上传方法；
function photograph(json){
    // 心情和天气放回的是代号
     stweather=json.weather;
     stmood=json.mood;
   if(stweather){
       if(stweather!=8 ){
           $("#tianqi").attr("src","../source/img/img-day-0" + json.values.weather + ".png");
       }
   }
    if(stmood){
        if(stmood!=8){
            $("#xinqing").attr("src","../source/img/img-face-0" + json.values.mood + ".png");
        }
    }
    $("#day").html( json.day);
    $("#utcday").html(json.week);
}

