//手机号验证
export const validatePhone = function(rule, value, callback){
  if(value == ''){
    callback();
  }
  else if ( !(/^1(3|4|5|7|8)\d{9}$/.test(value))) {
    callback(new Error('请输入正确手机号'));
  }else{
    callback();
  }
}
//用户名验证
export const validateUserName = function(rule, value, callback){
  var strRegex = /^[a-zA-Z\u4e00-\u9fa5 ]{1,100}$/;;
  if (value.trim() == '') {
    callback(new Error('用户姓名不能为空'));
  }else if(value.length < 2){
    callback(new Error('姓名不能小于2个字符'));
  }else if(value.length > 100){
  	callback(new Error('姓名不能大于100个字符'));
  }else if(!(strRegex.test(value))){
  	callback(new Error('姓名只能包括英文中文字符及空格'));
  }else{
  	callback()
  }
};
//邀请用户名验证
export const validateInvitingUserName = function(rule, value, callback){
  var strRegex = /^[a-zA-Z\u4e00-\u9fa5 ]{1,100}$/;
  if (value.trim() == '') {
    callback()
  }else if(value.length < 2){
    callback(new Error('用户姓名不能小于2个字符'));
  }else if(value.length > 100){
    callback(new Error('用户姓名不能大于100个字符'));
  }else if(!(strRegex.test(value))){
    callback(new Error('姓名只能包括英文中文字符及空格'));
  }else{
    callback()
  }
}
//身份证验证
export const validateUserCard = function(rule, value, callback){
  var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
  if (value.trim() == '') {
    callback()
  }else if(!(reg.test(value))){
    callback(new Error('请输入正确的身份证'));
  }else{
    callback()
  }
}
//密码验证
export const validatePassword = function(rule, value, callback){
  const hasDoubleType = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/
  if ( !(hasDoubleType.test(value))) {
    callback(new Error('至少包含数字、符号、字母中任意两种,且不少于6位字符'));
  }else if(value.length < 6){
    callback(new Error('密码字符不能小于2个字符'));
  }else if(value.length >20){
    callback(new Error('密码字符不能大于20个字符'));
  }else{
    callback();
  }
}

//验证码校验
export const validateCode = function(rule, value, callback){
  const num = /^[0-9]*$/;
  if(!(num.test(value))){
    callback(new Error('验证码必须是数字'))
  }else if(value.length<2){
    callback(new Error('验证码不能小于2个字符'))
  }else if(value.length>10){
    callback(new Error('验证码不能大于10个字符'))
  }else{
    callback()
  }
};


//正整数
export const validateNumber = (rule, value, callback) => {
  const num1 = /^\d+$/g;
  const num2 = /^[1-9]\d*$/;
  if(!num1.test(value) && value.length == 1){
    callback(new Error('请输入正整数'));
  }
  else if(!num2.test(value) && value.length >1){
    callback(new Error('请输入正整数'));
  }
  else{
    callback();
  }
};

//编码校验
export const validateOrgCode = (rule, value, callback) => {
  var strRegex = /^[a-zA-Z0-9]*$/;
  if(!strRegex.test(value)){
    callback(new Error('编码只能输入英文、数字字符'));
  }else{
    callback();
  }
};
//部门岗位等名称验证
export const validateOrgName = (rule, value, callback) => {
  var strRegex = /^[a-zA-Z0-9\u4e00-\u9fa5 ]*$/;
  var kongge = /^[ ]{0,100}$/;
  if(kongge.test(value)&&value.length>=1){
    callback(new Error('不允许输入全空格'));
  } else if(!strRegex.test(value)){
    callback(new Error('只能输入中英文、数字及空格'));
  }else{
    callback();
  }
};


//出生日期校验
export const validateBirthdate = (rule, value, callback) => {
  var strRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
  if(!strRegex.test(value)){
    callback(new Error('日期格式不正确'));
  }else{
    callback();
  }
}

//日期格式校验
export const validateDate = (rule, value, callback) => {
  var strRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
  if(!strRegex.test(value)){
    callback(new Error('日期格式不正确'));
  }else{
    callback();
  }
}


//空格校验
export const validateSpacing = (rule, value, callback) => {

  if (value.trim() == '') {
    callback(new Error('不允许输入全空格'));
  }else{
    callback();
  }
}
