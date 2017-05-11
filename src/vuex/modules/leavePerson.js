/**
 * Created by Administrator on 2017/4/20 0020.
 */

import {
  GTE_CHECKED_LEAVE_TYPE,
  GET_PAGENO,
  SUCCESS_GET_LEAVE_LIST,
  SUCCESS_GET_LEAVE_LIST_COUNT,
  GET_DIALOG_TYPE,
  SUCCESS_GET_DIALOG_INFO,
  GET_DIALOG_BASE_INFO,
  GET_LEAVE_PAGE_TYPE,
  SUCCESS_GTE_ORG_LIST,
  SET_ACTIVE_ORG,
  SET_LEAVE_PORSONNAME,
  GET_APPROVER_INFO,
  GET_TRANSFER_LEAVE_DATA
} from '../types'


import { getCookie, saveCookie } from '@/common/authService';
import { Message } from 'element-ui';
import { toZtreeFormat } from '@/common/untils';
import leaveApi  from '@/api/leave';
import hcmApi  from '@/api/hcm';

const state = {
  leaveTypeArr:['事假','病假','调休','年假','婚假','产假','陪护假','哺乳假','丧假','其他'],
  leaveTypeChecked: [],
  leaveTableList: null,
  pageNo: 1,
  totalListCount:null,
  dialogType:null,
  dialogBaseInfo:null,
  dialogInfo:null,
  leavePageType: null,
  searcherName:'',
  approverInfo:null,
  transfRecordData:null,
};

// getters
const getters = {
  leaveTypeArr : (state) => {
    const leaveTypeArr = state.leaveTypeArr;
    return leaveTypeArr;
  },
  leaveTypeChecked : (state) => {
    const leaveTypeChecked = state.leaveTypeChecked;
    return leaveTypeChecked;
  },
  leaveTableList : (state) => {
    const leaveTableList = state.leaveTableList;
    return leaveTableList;
  },
  pageNo : (state) => {
    const pageNo = state.pageNo;
    return pageNo;
  },
  totalListCount : (state) => {
    const totalListCount = state.totalListCount;
    return totalListCount?totalListCount:'0';
  },
  dialogType : (state) => {
    const dialogType = state.dialogType;
    return dialogType;
  },
  dialogBaseInfo:(state) =>{
    const dialogBaseInfo = state.dialogBaseInfo;
    return dialogBaseInfo;
  },
  dialogInfo : (state) => {
    const dialogInfo = state.dialogInfo;
    return dialogInfo;
  },
  leavePageType:(state) => {
    const leavePageType = state.leavePageType;
    return leavePageType;
  },
  searcherName:(state) => {
    const searcherName = state.searcherName;
    return searcherName;
  },
  approverInfo:(state) => {
    const approverInfo = state.approverInfo;
    return approverInfo;
  },
  transfRecordData:(state) =>{
    const transfRecordData = state.transfRecordData;
    return transfRecordData;
  }

};

// actions
const actions = {
  //获取复选框选中的请假类型
  getCheckedLeaveType(store,checkedArr) {
    store.commit(GTE_CHECKED_LEAVE_TYPE,checkedArr);
    store.dispatch('getLeaveTableList');
  },

  //获取翻页的pageNo
  getPaginationPageNo(store,pageNo) {
    store.commit(GET_PAGENO,pageNo);
    store.dispatch('getLeaveTableList');
  },

  //获取请假列表
  getLeaveTableList(store,pageType){
    if(pageType){
      store.commit(GET_LEAVE_PAGE_TYPE,pageType);
    }
    var pageType = store.state.leavePageType;
    console.log('pageType: '+pageType);
    const checkedArr = store.state.leaveTypeChecked;
    var sendData = {
      'tenantid': getCookie('tenantid'),
      'leavetypes':checkedArr.length>0?checkedArr:null,
      'pageno':store.state.pageNo
    };
    if(pageType == 'personLeave'){
      sendData.userid = getCookie('userid');
      leaveApi.getLeaveList(sendData).then((response) => {
        if(response.data.flag == 'success')
        {
          store.commit(SUCCESS_GET_LEAVE_LIST,response.data.datas);
          store.commit(SUCCESS_GET_LEAVE_LIST_COUNT,response.data.totalcount);
        }else{
          console.log(response.data.msg);
        }
      });
    }
    else if(pageType == 'staffLeave'){
      const datas = store.getters.activeOrg;
      if(datas.treepath == '1'){
        sendData.orgid=null;
      }
      else{
        sendData.orgid = store.getters.activeOrg.orgid;
      }
      sendData.personname = store.state.searcherName;
      leaveApi.getLeaveList(sendData).then((response) => {
        if(response.data.flag == 'success')
        {
          store.commit(SUCCESS_GET_LEAVE_LIST,response.data.datas);
          store.commit(SUCCESS_GET_LEAVE_LIST_COUNT,response.data.totalcount);
        }else{
          console.log(response.data.msg);
        }
      });
    }
    else if(pageType == 'approveLeave'){
      sendData.checkuserid = getCookie('userid');
      sendData.personname = store.state.searcherName;
      leaveApi.findMyApprovalList(sendData).then((response) => {
        if(response.data.flag == 'success')
        {
          store.commit(SUCCESS_GET_LEAVE_LIST,response.data.datas);
          store.commit(SUCCESS_GET_LEAVE_LIST_COUNT,response.data.totalcount);
        }else{
          Message.error(response.body.msg);
        }
      })
    }


  },

  //获取添加请假申请弹层的基本信息
  getAddLeaveBaseInfo(store,pramObj) {
    pramObj.sendData.tenantid = getCookie('tenantid');
    const sendData = pramObj.sendData;
    leaveApi.addAskForLeave(sendData).then((response) => {
      if(response.data.flag == 'success')
      {
        store.commit(GET_DIALOG_BASE_INFO,response.data.datas);
        store.commit(GET_DIALOG_TYPE,pramObj.btnType);
        store.dispatch('emitDialogShowEvent');
      }else{
        Message.error(response.body.msg);
      }
    })
  },

  //请假保存
  saveAskForLeave(store,sendData) {
    leaveApi.saveAskForLeave(sendData).then((response) => {
      if(response.data.flag == 'success')
      {
        store.dispatch('getCheckedLeaveType', []);
        eventHub.$emit('clearLeaveTypeList');
        Message.success(response.data.msg);
        eventHub.$emit('dialogHide');
      }else{
        Message.error(response.body.msg);
      }
    })
  },

  //请假提交
  commitAskForLeave(store,sendData) {
    leaveApi.commitAskForLeave(sendData).then((response) => {
      if(response.data.flag == 'success')
      {
        Message.success(response.data.msg);
        eventHub.$emit('dialogHide');
        if(store.state.dialogType == 'add'){
          store.dispatch('getCheckedLeaveType', []);
          eventHub.$emit('clearLeaveTypeList');
        }
        else{
          store.dispatch('getLeaveTableList');
        }
      }else{
        Message.error(response.body.msg);
      }
    })
  },

  //请假编辑
  editAskForLeave(store,sendData) {
    leaveApi.editAskForLeave(sendData).then((response) => {
      if(response.data.flag == 'success')
      {
        Message.success(response.data.msg);
        eventHub.$emit('dialogHide');
        store.dispatch('getLeaveTableList');
      }else{
        Message.error(response.body.msg);
      }
    })
  },

  //请假删除
  delAskForLeave(store,sendData) {

    leaveApi.delAskForLeave(sendData).then((response) => {
      if(response.data.flag == 'success')
      {
        Message.success(response.data.msg);
        store.dispatch('getLeaveTableList');
      }else{
        Message.error(response.body.msg);
      }
    })
  },

  //获取请假列表详情
  getLeaveDetail(store,pramObj) {
    const sendData = pramObj.sendData;
    leaveApi.getLeaveDetail(sendData).then((response) => {
      if(response.data.flag == 'success')
      {
        store.commit(SUCCESS_GET_DIALOG_INFO,response.data.datas);
        store.commit(GET_DIALOG_TYPE,pramObj.btnType);
        store.dispatch('emitDialogShowEvent');
      }else{
        Message.error(response.body.msg);
      }
    })
  },

  //不同页面执行监听的事件不同
  emitDialogShowEvent(store){
    const pageType = store.state.leavePageType;
    if(pageType =='personLeave'){
      eventHub.$emit('dialogShowPerson');
    }
    else if(pageType=='staffLeave'){
      eventHub.$emit('dialogShowStaff');
    }
    else if(pageType=='approveLeave'){
      eventHub.$emit('dialogShowApprove');
    }
  },



// 员工请假

  //初始化所有数据
  initHcmDataNeedByLeave (store) {
    var sendData = {
      tenantid: getCookie('tenantid'),
      userid: getCookie('userid'),
      tenantname: ''
    };
    hcmApi.findOrgList(sendData).then(response => {
      if(response.data.flag == 'success') {
        store.commit(SUCCESS_GTE_ORG_LIST,response.data.datas);
        store.commit(SET_ACTIVE_ORG,response.data.datas[0]);
        store.dispatch('getLeaveTableList','staffLeave');
      }else{
        console.log(response.data.msg)
      }
    })

  },

  //点击组织获取列表
  changeOrgByLeave(store,data) {
    store.commit(SET_ACTIVE_ORG,data);
    store.dispatch('getLeaveTableList');
  },

  //点击搜索按钮searcherName
  searchLeaveTableList(store,personName){
    store.commit(SET_LEAVE_PORSONNAME,personName);
    store.dispatch('getLeaveTableList');
  },

  //获取流转记录列表
  findApprovalList(store,sendData) {
    leaveApi.findApprovalList(sendData).then((response) => {
      if(response.data.flag == 'success')
      {
        store.commit(GET_TRANSFER_LEAVE_DATA,response.data.datas);
      }else{
        Message.error(response.body.msg);
      }
    })
  },

  //审批请假申请
  approvalAskForLeave(store,sendData) {
    leaveApi.approvalAskForLeave(sendData).then((response) => {
      if(response.data.flag == 'success')
      {
        Message.success(response.data.msg);
        eventHub.$emit('dialogHide');
        store.dispatch('getLeaveTableList');
      }else{
        Message.error(response.body.msg);
      }
    })
  },

};

const mutations = {
  [GTE_CHECKED_LEAVE_TYPE] (state,CheckedArr){
    state.leaveTypeChecked = CheckedArr;
  },

  [GET_PAGENO] (state,pageNo){
    state.pageNo = pageNo;
  },

  [SUCCESS_GET_LEAVE_LIST] (state,listData){
    state.leaveTableList = listData;
  },

  [SUCCESS_GET_LEAVE_LIST_COUNT] (state,count){
    state.totalListCount = count;
  },

  [GET_DIALOG_TYPE] (state,type){
    state.dialogType = type;
  },

  [SUCCESS_GET_DIALOG_INFO] (state,info){
    state.dialogInfo = info;
  },

  [GET_DIALOG_BASE_INFO] (state,info){
    state.dialogBaseInfo = info;
  },

  [GET_LEAVE_PAGE_TYPE] (state,type){
    state.leavePageType = type;
  },

  [SET_LEAVE_PORSONNAME] (state,name){
    state.searcherName = name;
  },
  [GET_APPROVER_INFO] (state,info){
    state.approverInfo = info;
  },
  [GET_TRANSFER_LEAVE_DATA] (state,data){
    state.transfRecordData = data;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
