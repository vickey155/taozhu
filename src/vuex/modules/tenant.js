/**
 * Created by Administrator on 2017/4/20 0020.
 */

import {
  SUCCESS_GET_TENANT_LIST,
  SET_TENANTNAME,
  GET_USER_LIST_BY_TENANTID,
  SWITCH_TENANT,
  SUCCESS_DEL_USER,
  SUCCESS_APPLICATION_LIST,
  PROCESSING_APPLICATION,
  SUCCESS_EXIT_TENANT
} from '../types'

import {
  getCookie,
  saveCookie
} from '@/common/authService'


import tenantApi  from '@/api/tenant'
import { Message }     from 'element-ui';

const state = {
  tenantid: getCookie('tenantid') ||  null,
  tenantList: null,
  tenantname: null,
  userListByTenantid: null,
  applicationList: null

};

// getters
const getters = {
    tenantList : state => {
      const tenantList = state.tenantList
      return tenantList
    },
    tenantid : state => {
      const tenantid = state.tenantid
      return tenantid
    },
    tenantname: state  => {
    const tenantname = state.tenantname
    return tenantname
    },
    userListByTenantid: state  => {
      const userListByTenantid = state.userListByTenantid
      return userListByTenantid
    },
    applicationList: state  => {
      const applicationList = state.applicationList;
      return applicationList;
    }
};

// actions
const actions = {
  //获取租户列表
  getTenantList: function(store){
    const sendData =   {
      "userid": getCookie('userid'),
      "tenantname": "",
      "pagesize": '-1'
      }
    tenantApi.getTenantList(sendData).then(response => {
      const tennatList = response.data.datas;
      store.commit(SUCCESS_GET_TENANT_LIST,tennatList)
      store.dispatch("getTenantName")
    })
  },
  //获取当前租户名字
  getTenantName: function(store){
    store.state.tenantList.forEach(function(val,index,arr){
      if(val.tenantid == store.state.tenantid){
        store.commit(SET_TENANTNAME,val.tenantname)
      }
    })
  },
  //获取租户下用户列表
  userListByTenantId: function(store){
    const sendDate = {
      tenantid:store.state.tenantid,
      pagesize: '-1'
    }
    tenantApi.userListByTenantId(sendDate).then(response => {
      if(response.data.flag == 'success')
      {
        store.commit(GET_USER_LIST_BY_TENANTID, response.data.datas)
      }else{
      console.log(response.body.msg);
      }
    })
  },
  //切换团队
  switchTenant: function(store,tenantid){
    const sendData = {
      userid: getCookie('userid'),
      tenantid: tenantid
    }
    tenantApi.switchTenant(sendData).then(response => {
      if(response.data.flag == 'success')
      {
        //应该把值都设置为null，在需要的页面再做请求
        //此功能待改善
        //location.reload()
        saveCookie('tenantid',tenantid);
        store.commit(SWITCH_TENANT,tenantid);
        store.dispatch('getTenantName');
        store.dispatch('initHcmData');
        store.dispatch('userListByTenantId');
        store.dispatch('applicationList');
        eventHub.$emit('SWITCHTANT');

        //store.dispatch('getTenantList');
        //store.dispatch('getOrgList');
        //if(store.state.applicationList == null){
        //  store.dispatch('applicationList');
        //}
        //if(store.state.userListByTenantid == null){
        //  store.dispatch('userListByTenantId');
        //}
      }else{
      Message.error(response.body.msg);
      }
    })
  },
  //移除租户用户
  removeUser: function(store,userid){
    const sendData = {
      userid: userid,
      tenantid: store.state.tenantid
    };
    //测试删除，注释
    //store.commit(SUCCESS_DEL_USER,userid);
    //return false;
    tenantApi.removeUser(sendData).then(response => {
      if(response.data.flag == 'success')
      {
        Message.success("移除人员成功");
        store.commit(SUCCESS_DEL_USER,userid)
      }else{
        Message.error(response.body.msg);
      }
    })
  },
  //获取未审核的申请列表
  applicationList: function(store){
    const sendData = {
      tenantid: store.state.tenantid,
      pagesize: '-1',
      result: '1'
    }
    tenantApi.applicationList(sendData).then(response => {
      if(response.data.flag == 'success')
      {
        store.commit(SUCCESS_APPLICATION_LIST,response.data.datas)
      }else{
        console.log(response.body.msg)
      }
    })
  },
  //审核申请接口
  processingApplication: function(store,data) {
    const sendData = {
      optuserid: getCookie('userid'),
      userid:data.userid,
      reqid: data.reqid,
      result: 1
    };
    tenantApi.processingApplication(sendData).then(response => {
      if(response.data.flag == 'success')
      {
        Message.success("已成功同意"+data.username+"加入该团队");
        store.commit(PROCESSING_APPLICATION,data.reqid);
        store.dispatch('userListByTenantId')
      }else{
        Message.error(response.body.msg);
      }
    })
  },
  //退出租户
  exitTenant: function(store,data){
    const sendData = {
      userid: getCookie('userid'),
      tenantid: getCookie('tenantid')
    }
    tenantApi.exitTenant(sendData).then(response => {
      if(response.data.flag == 'success')
      {
        Message.success("退出租户成功");
        store.commit(SUCCESS_EXIT_TENANT,sendData.tenantid);
        store.dispatch('switchTenant',store.state.tenantList[0].tenantid)
      }else{
         Message.error(response.body.msg);
     }
    })
  },
  //租户邀请用户
  tenantInvitate: function(store,userinfobo){
    const sendData = {
      tenantid: getCookie('tenantid'),
      userinfo: {
        invitationcode: store.getters.userInfo.invitationcode
      },
      userinfobo: userinfobo
    };
    tenantApi.tenantInvitate(sendData).then(response => {
      if(response.data.flag == 'success')
      {
        if(response.body.datas.length>0){
          Message.error(response.body.datas);
        }else{
          eventHub.$emit('SUCCESS_TENANT_INVITATE')
          Message.success(response.body.msg);
          store.dispatch('userListByTenantId');
        }
      }else{
        Message.error(response.body.msg);
      }
    })
  }
};

const mutations = {
  [SUCCESS_GET_TENANT_LIST] (state,tennatList){
    state.tenantList = tennatList;
  },
  [SUCCESS_DEL_USER] (state,userid){
    state.userListByTenantid.filter(function(val,index,arr){
      if(val.userid == userid){
        state.userListByTenantid.splice(index,1)
      }
    })
  },
  [SUCCESS_APPLICATION_LIST](state,applicationList){
    state.applicationList = applicationList;
  },
  [SET_TENANTNAME] (state, tenatname) {
    state.tenantname = tenatname;
  },
  [GET_USER_LIST_BY_TENANTID] (state,userListByTenantid ) {
    state.userListByTenantid = userListByTenantid
  },
  [SWITCH_TENANT] (state, tenantid) {
    state.tenantid = tenantid
    saveCookie("tenantid",tenantid)
  },
  [PROCESSING_APPLICATION](state,reqid) {
    state.applicationList.filter(function(val,index,arr){
      if(val.reqid == reqid){
        state.applicationList.splice(index,1)
      }
    })
  },
  [SUCCESS_EXIT_TENANT](state,tenantid){
    state.tenantList.filter(function(val,index,arr){
      if(val.tenantid == tenantid){
        state.tenantList.splice(index,1)
      }
    })
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
