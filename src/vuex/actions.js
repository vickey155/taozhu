import userApi from './../api/user'
import router          from './../router/index'
import {LOGIN_SUCCESS,REPLACE_USERINFO} from './types'



import { Message } from 'element-ui';
import { MD5Password } from './../common/untils';
import { getCookie,saveCookie,signOut} from './../common/authService';

//登录
export const localLogin = (store, userInfo) => {
  var msg = userInfo.msg;
  userInfo.currentpwd = MD5Password(userInfo.currentpwd);//加密密码
  userApi.localLogin(userInfo).then(function(response){
    //登录成功
    if(response.data.flag == 'success'){
      Message.success(msg);

      const tokenid  = response.data.datas.tokenid;
      const userid = response.data.datas.userEntity.userid;
      const tenantid = response.data.datas.userEntity.lasttenantid;



      saveCookie('tokenid',tokenid);
      saveCookie('userid',userid);
      saveCookie('tenantid',tenantid);


      //登录成功 存储用户信息
      //已开发.....
      const loginInfo = {
        tokenid: tokenid || '',
        userid : userid || '',
        tenantid: tenantid || ''
      };
      const userInfo = {
        username        : response.data.datas.userEntity.username || '',
        loginname       : response.data.datas.userEntity.loginname || '',
        email           : response.data.datas.userInfoEntity.email || '',
        mobile          : response.data.datas.userInfoEntity.mobile || '',
        general         : response.data.datas.userInfoEntity.general || '',
        invitationcode  : response.data.datas.userInfoEntity.invitationcode || '',
      };

      store.commit(LOGIN_SUCCESS,loginInfo);//存储登录后需要的信息
      store.commit(REPLACE_USERINFO,userInfo);//存储登录后的用户信息


      console.log('检查tenantid:' +tenantid)


    if(tenantid == ''){
      router.push({path:'/team'});
      return false;
    }
    //登录成功跳转主页
    router.push({path:'/home'});


    }else{
      Message.error(response.body.msg)
    }
  })
}

//退出
export const localLogout = (store) => {
  const tokenid = getCookie('tokenid');
  const userid = getCookie('userid');
  const tenantid = getCookie('tenantid');
  userApi.localLogout({"userid": userid,'tokenid': tokenid, "tenantid":tenantid}).then(response => {
    if(response.data.flag == 'success'){
      Message.success('成功退出当前系统');
      //退出成功
      signOut();
      //退出成功后应该先清空数据
      //带开发....
      router.push({path:'/login'});
    }else{
      Message.error(response.body.msg)
    }
  })
}


//获取验证码
export const sendVerification = (store,address) => {
  userApi.sendVerification({'verification':address}).then(response => {
    if(response.data.flag == 'success'){
      Message.success('验证码发送成功到'+ address +',请注意查收');
      store.dispatch('countDown','PHONE_COUNT_DOWN');
    }else{
      Message.error(response.body.msg)
    }
  })
}

//注册
export const register = (store,data) => {
  let currentpwd = MD5Password(data.currentpwd)
  const sendData = {
    loginname :       data.mobile,
    currentpwd:       currentpwd,
    verificationcode: data.code,
    verification:     data.mobile,
    userinfo: {
      boundmobile: '1',
      mobile: data.mobile,
    }
  }
  userApi.register(sendData).then(response => {
    if(response.data.flag == 'success'){
      //Message.success('注册成功');
      const loginData = {
          loginname: data.mobile,
          currentpwd: data.currentpwd,
          msg: '注册成功'
        };
      store.dispatch('localLogin',loginData);
    }else{
      Message.error(response.body.msg)
    }
  })
}

//找回密码通过手机号
export const findPwByPhoneNum = (store,data) => {
  let currentpwd = MD5Password(data.currentpwd);
  const sendData = {
    userid: data.userid,
    updateway:"T",
    loginname: data.loginname,
    verificationcode: data.verificationcode,
    currentpwd: currentpwd,
    verification: data.verification
  }
  userApi.findPwByPhoneNum(sendData).then(response => {
    console.log(response)
    if(response.data.flag == 'success'){
      Message.success('通过手机找回密码成功！');
      router.push({name: 'login'})
    }else{
      Message.error(response.body.msg)
    }
  })
}

//找回密码通过邮箱
export const findPwByEmail = (store,data) => {
  const sendData = {
    updateway:'M',
    loginname: data.loginname
  };
  store.dispatch('startBtnClick');
  userApi.findPwByEmail(sendData).then(response => {
    console.log(response)
    if(response.data.flag == 'success'){
      Message.success('链接发送邮箱成功！');
      store.dispatch('countDown','Email_COUNT_DOWN');
    }else{
      Message.error(response.body.msg)
    }
  })
}
