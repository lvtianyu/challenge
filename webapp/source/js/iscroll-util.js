var myScroll;
var upIcon = $("#up-icon");
var downIcon = $("#down-icon");

/**
 * @param slideDownCallback
 * @param slideUpCallback
 */
function loadIScroll(slideDownCallback,slideUpCallback) {
	myScroll = new IScroll('#wrapper', { probeType: 3, mouseWheel: true });

	myScroll.on("scroll",function(){
		var y = this.y,
			maxY = this.maxScrollY - y,
			downHasClass = downIcon.hasClass("reverse_icon"),
			upHasClass = upIcon.hasClass("reverse_icon");

		if(y >= 40){
			!downHasClass && downIcon.addClass("reverse_icon");
			return "";
		}else if(y < 40 && y > 0){
			downHasClass && downIcon.removeClass("reverse_icon");
			return "";
		}

		if(maxY >= 40){
			!upHasClass && upIcon.addClass("reverse_icon");
			return "";
		}else if(maxY < 40 && maxY >=0){
			upHasClass && upIcon.removeClass("reverse_icon");
			return "";
		}
	});

	myScroll.on("slideDown",function(){
		if(this.y > 40){
			//alert("slideDown");
			console.log("slideDown");
			upIcon.removeClass("reverse_icon");
			if (typeof slideDownCallback == "function") {
				slideDownCallback();
			}
		}
	});

	myScroll.on("slideUp",function(){
		if(this.maxScrollY - this.y > 40){
			//alert("slideUp");
			console.log("slideUp");
			upIcon.removeClass("reverse_icon")
			if (typeof slideUpCallback == "function") {
				slideUpCallback();
			}
		}
	});
}

function iScrollInit(slideDownCallback,slideUpCallback){
	//初始化IScroll，考虑到大量的dom操作，iscroll需要等dom处理完再计算，延迟一小会
    if (undefined == myScroll) {
		setTimeout(function () {
			loadIScroll(slideDownCallback,slideUpCallback);
	    }, 300);
	}else{
		setTimeout(function () {
	        myScroll.refresh();
	    }, 300);
	}
}