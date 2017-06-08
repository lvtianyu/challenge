var challengeDate;

function initParam() {
	challengeDate = oGetVars.challengeDate;
	
}

function regListener() {
	$("#btn-add-challenge").click(function(){
		location.href = "add-challenge.html?challengeDate=" + challengeDate;
	});
	
	$("#btn-go-home").click(function(){
		location.href = "index.html?challengeDate=" + challengeDate;
	});
}
function slideDownCallback(){
//	location.href="index.html";
	history.go(-1);
}

function slideUpCallback(){
//	location.reload();
}

function initUI() {
	//初始化IScroll
	iScrollInit(slideDownCallback,slideUpCallback);
	
	var _d    =  new Date(challengeDate);
	var day   =  _d.getDate();
	var week  =  getDayName(day);
	var year  =  _d.getFullYear();
	var month =  _d.getMonth() + 1;
	$("#day").html(day);
	$("#week").html(week);
	$("#year-and-month").html(year + "年" + month + "月");
}
$(function(){
    initParam();
    regListener();
    initUI();
});
