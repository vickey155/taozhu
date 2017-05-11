import MD5 from 'md5'

//密码加密
export function MD5Password(psd){
  const md5 = MD5(psd).toUpperCase(),
      pwdNow = MD5(md5 + "<ZY>" + md5).toUpperCase();
  return pwdNow;
};

//验证码倒计时
export function countDown(func){
	let count = 59;
  clearInterval(window.countDownInterval);
	 window.countDownInterval = setInterval(function(){
		func(count);
		if(count == 0){
			clearInterval(countDown)
			return false;
		}else{
			count = count - 1;
		}
	},1000)
};

//字符串去数字(1天2小时)
export const getNumberByTime = (str,type) =>
{
  var arr1 = str.split('天');
  var arr2 = arr1[1].split('小时');
  if (type == 'day') {
    return arr1[0];
  }
  else if (type == 'hour') {
    return arr2[0];
  }
}


export  function toZtreeFormat(sNodes,id,parentKey,childKey) {
  if(sNodes == null) return false;
  var sNodes = sNodes;
  var r = [];
  var key = id
  var parentKey = parentKey;
  var childKey = childKey;
  var tmpMap = {};
  for (var i = 0, l = sNodes.length; i < l; i++) {
    tmpMap[sNodes[i][key]] = sNodes[i];
  }
  for (var i = 0, l = sNodes.length; i < l; i++) {
    if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
      if (!tmpMap[sNodes[i][parentKey]][childKey])
        tmpMap[sNodes[i][parentKey]][childKey] = [];
      tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
    } else {
      r.push(sNodes[i]);
    }
  }
  return r;
}

//时间时期格式化
export const dateFormat = function(fmt){
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//深拷贝
export const  deepCopy= function(source) {
  var result={};

  for (var key in source) {
    result[key] = typeof source[key]==='object'? deepCoyp(source[key]): source[key];
  }
  return result;
};


//请假状态判断

export const  leaveStatus = function (statue) {

  if(statue == '1'){
    return '审核中';
  }
  else if(statue == '0'){
    return '待提交';
  }
  else if(statue == '2'){
    return '已审批';
  }
}

//审批结果

export const  resultStatus = function (statue) {

  if(statue == 'N'){
    return '未通过';
  }
  else if(statue == 'Y'){
    return '通过';
  }
  else if(statue == ''){
    return '未审批';
  }
}
















