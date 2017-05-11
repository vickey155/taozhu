/**
 * Created by Administrator on 2017/4/20 0020.
 */

import {
  LOGIN_SUCCESS,
  REPLACE_USERINFO,
  UPDATE_USERNAME,
  SUCCESS_BINDINGPHONE,
  SUCCESS_GET_INVITED_CODE_COUNT
} from '../types'
import {
  getCookie,
  saveCookie
} from '@/common/authService'


import { Message }     from 'element-ui';
import userApi         from '@/api/user'
import router          from '@/router/index'
import { MD5Password } from '@/common/untils';


const state = {
  tokenid       : getCookie('tokenid') || null,
  userid        : getCookie('userid') || null,
  username      : getCookie("username") || null,
  loginname     : null,
  email         : null,
  mobile        : null,
  general       : null,
  invitationcode: null,
};

// getters
const getters = {
  invitationcode: function(state){
    return state.invitationcode
  },
  tokenid: function(){
    return state.tokenid
  }
};

// actions
const actions = {
  //获取用户信息
  getUserInfo ({ commit, state}) {
    userApi.getUserInfo({userid: state.userid}).then(response => {
      const userInfo = {
        username       : response.data.datas.username  || '',
        loginname      : response.data.datas.loginname || '',
        email          : response.data.datas.userinfo.email     || '',
        mobile         : response.data.datas.userinfo.mobile     || '',
        general        : response.data.datas.userinfo.general   || '',
        invitationcode : response.data.datas.userinfo.invitationcode   || '',
      }

      commit(REPLACE_USERINFO,userInfo);//存储登录后的用户信息

    })
  },
  //修改用户姓名
  //将原先修改用户姓名改为修改用户信息
  updateUserName ({ commit, state },data) {
    const sendData = {
      "userid": state.userid,
      "username": data.username|| '',
      "userinfo": {
        invitedcode: data.invitedcode || ''
      }

    }
    userApi.updateUserInfo(sendData).then(response => {
      if(response.data.flag == 'success'){
        Message.success(data.successMsg);
        commit(UPDATE_USERNAME,data.username);
      }else{
        Message.error(response.body.msg);
        commit(UPDATE_USERNAME,state.username);
      }
    })
  },
  //修改手机号
  bindingPhone ({ commit, state },data) {
    const sendData = {
      userid           : state.userid,
      loginname        : state.loginname,
      verificationcode : data.code,
      lastupdateduserid: state.userid,
      verification     : data.mobile,
      userinfo: {
        mobile: data.mobile,
        boundmobile: '1'
      }
    }
    userApi.bindingPhone(sendData).then(response => {
      if(response.data.flag == 'success'){
        Message.success('绑定手机号成功');
        eventHub.$emit('SUCCESS_BINDINGPHONE');//通知组件绑定成功
        commit(SUCCESS_BINDINGPHONE,data.mobile);
      }else{
        Message.error(response.body.msg);
      }
    })
  },
  //修改密码
  changePwd ({ commit, state },data) {
    const currentpwd = MD5Password(data.currentpwd);
    const oldPwd     = MD5Password(data.oldPwd);
    const sendData = {
      userid            : state.userid,
      loginname         : state.loginname,
      "currentpwd"      : currentpwd,
      "updateway"       : data.updateway,
      "oldPwd"          : oldPwd,
      "verificationcode": data.verificationcode || '',
      "verification"    : data.verification || ''
    }
    userApi.changePwd(sendData).then(response => {
      if(response.data.flag == 'success'){
        Message.success('成功修改密码');
        eventHub.$emit('SUCCESS_CHANGE_PWD');//通知组件修改密码成功
      }else{
        Message.error(response.body.msg);
      }
    })
  },
  //绑定邮箱发送链接
  sendLink(store,data){
    const sendData = {
      "userid": getCookie("userid"),
      "tenantid": '',
      "username": store.state.username,
      "userinfo": {
        "email": data.email,
      }
    };
    userApi.sendLink(sendData).then(response => {
      if(response.data.flag == 'success'){
      eventHub.$emit('SUCCESS_CHANGE_EMAIL_SEND');//通知组件绑定邮箱发送链接成功
      store.dispatch('countDown','Email_COUNT_DOWN');
      }else{
      Message.error(response.body.msg);
      }
    })
    //commit(validationLink,data)
  },
  //获取用户邀请人总数接口
  getInvitedcodeTotalCount ({commit, state},data){
    userApi.getInvitedcodeTotalCount({invitationcode: state.invitationcode}).then(response => {
      if(response.data.flag == 'success'){
        eventHub.$emit('SUCCESS_GET_INVITED_CODE_COUNT',response.data.InvitedcodeTotalCount);
      }else{
       console.log(response.body.msg);
      }
    })
  }
};

const mutations = {
  //更新所有用户信息
  [REPLACE_USERINFO](state,userInfo){
    //登录成功存储数据
    state.username         = userInfo.username;
    state.loginname        = userInfo.loginname;
    state.email            = userInfo.email;
    state.mobile           = userInfo.mobile;
    state.general          = userInfo.general;
    state.invitationcode   = userInfo.invitationcode;

    saveCookie("username",state.username);
  },
  //修改用户名成功
  [UPDATE_USERNAME](state,username){
    state.username = username;
    eventHub.$emit('SUCCESS_CHANGE_USERINFO');//通知组件修改用户信息成功

    saveCookie("username",state.username);
  },
  [SUCCESS_BINDINGPHONE](state,mobile){
    state.mobile = mobile
  },
  [SUCCESS_GET_INVITED_CODE_COUNT] (state,totalcount){
    state.InvitedcodeTotalCount = InvitedcodeTotalCount;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
