/**
 * Created by EYUN on 2015/12/17.
 */

//通过 window.location.search 字符串获取查询参数，存入对象 oGetVars 中
//调用方法： alert(oGetVars.yourVar);
var oGetVars = new (function (sSearch) {
 var rNull = /^\s*$/, rBool = /^(true|false)$/i;
 function buildValue(sValue) {
   if (rNull.test(sValue)) { return null; }
   if (rBool.test(sValue)) { return sValue.toLowerCase() === "true"; }
   if (isFinite(sValue)) { return parseFloat(sValue); }
   if (isFinite(Date.parse(sValue))) { return new Date(sValue); 
   }
   return sValue;
 }
 if (sSearch.length > 1) {
   for (var aItKey, nKeyId = 0, aCouples = sSearch.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
     aItKey = aCouples[nKeyId].split("=");
     this[unescape(aItKey[0])] = aItKey.length > 1 ? buildValue(unescape(aItKey[1])) : null;
   }
 }
})(window.location.search);

/**
* 检查对象是否为空，如果为空返回true，不为空返回false
*/
function isEmpty(obj) {
  if (undefined == obj || null == obj || ""== obj){
    return true;
  }

  return false;
}


function getMonDate(dateObj) {
	var d = dateObj, day = d.getDay(), date = d.getDate();
	if (day == 1)
		return d;
	if (day == 0) {
		d.setDate(date - 6);
	} else {
		d.setDate(date - day + 1);
	}
	return d;
}

// 0-6转换成中文名称
function getDayName(day) {
	var day = parseInt(day);
	if (isNaN(day) || day < 0 || day > 6) {
		return false;
	}
	var weekday = [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	return weekday[day];
}


function debug(message){
	
	if(DEBUG){
		console.log(message);
		alert(message);
	}
}

/**
 * 显示log
 * @param content
 */
var showLog = function (content) {
    console.log(content);
    //找一个div,可以把内容写入进去
    //$("#page4").html(s.replace(/\r\n/g,"<br>"));
};

function formatNumber(num, precision, separator) {
    var parts;
    // 判断是否为数字
    if (!isNaN(parseFloat(num)) && isFinite(num)) {
        // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
        // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
        // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
        // 的值变成了 12312312.123456713
        num = Number(num);
        // 处理小数点位数
        num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
        // 分离数字的小数部分和整数部分
        parts = num.split('.');
        // 整数部分加[separator]分隔, 借用一个著名的正则表达式
        parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

        return parts.join('.');
    }
    return NaN;
}

function toDecimal(x,n) {
	var f = parseFloat(x);
	if (isNaN(f)) {
		return false;
	}
	var f = Math.floor(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if (rs < 0) {
		rs = s.length;
		s += '.';
	}
	var num = n || 2;
	while (s.length <= rs + num) {
		s += '0';
	}
	return s;
}

$(function() {
  FastClick.attach(document.body);
});
