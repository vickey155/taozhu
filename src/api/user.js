import {UserResource} from './resources'
export default {
  // 登录账户
  localLogin: function (data){
    return UserResource.save({id:'login.htm'},data)
  },
  //登出账户
  localLogout: function (data){
    return UserResource.save({id:'logout.htm'},data)
  },
  //获取用户信息
  getUserInfo: function (data){
    return UserResource.save({id:'userDetail.htm'},data)
  },
  //修改用户信息
  updateUserInfo: function (data){
  	return UserResource.save({id:'updateUserInfo.htm'},data)
  },
  //获取验证码接口
  sendVerification: function(data){
    return UserResource.save({id:'sendVerification.htm'},data)
  },
  //绑定手机
  bindingPhone: function(data){
    return UserResource.save({id:'bindingPhone.htm'},data)
  },
  //修改密码
  changePwd: function(data){
    return UserResource.save({id:'changePwd.htm'},data)
  },
  // 注册结构
  register: function(data){
    return UserResource.save({id:'register.htm'},data)
  },
  //验证用户名
  validationLoginName: function(data){
    return UserResource.save({id:'validationLoginName.htm'},data)
  },
  //找回密码-手机号
  findPwByPhoneNum: function(data){
    return UserResource.save({id:'changePwd.htm'},data)
  },
  //找回密码-邮箱
  findPwByEmail: function(data){
    return UserResource.save({id:'changePwd.htm'},data)
  },
  //找回密码-邮箱-点击链接
  restPassword: function (data) {
    return UserResource.save({id:'restPassword.htm'},data)
  },
  //绑定邮箱发送链接
  sendLink: function(data){
    return UserResource.save({id:'sendLink.htm'},data)
  },
  //邮箱绑定点击链接接口
  validationLink: function(data){
    return UserResource.save({id:'validationLink.htm'},data)
  },
  //加入租户团队
  userJoinTenant(data) {
    return UserResource.save({id:'userJoinTenant.htm'},data);
  },
  //获取用户邀请人总数接口
  getInvitedcodeTotalCount(data) {
    return UserResource.save({id:'getInvitedcodeTotalCount.htm'},data);
  }
}
