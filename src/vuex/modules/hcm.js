/**
 * Created by Administrator on 2017/4/20 0020.
 */

import {
  SUCCESS_GTE_ORG_LIST,
  SET_ACTIVE_ORG,
  SUCCESS_GET_POST_LIST,
  SUCCESS_GET_PERSON_LIST,
  CHANGE_ACTIVE_ORG,
  SUCCESS_GET_ORG_DETAILS,
  SUCCESS_GET_POST_DETAILS,
  SUCCESS_GET_PERSON_DETAILS,
  SUCCESS_GET_USER_NOT_LIKN,
  CHANGE_USER_LOGINNAME,
  CLEAR_HCM_DATA
} from '../types'



import {
  getCookie,
  saveCookie
} from '@/common/authService'

import { Message }     from 'element-ui';
import { toZtreeFormat,deepCopy } from '@/common/untils'

import hcmApi  from '@/api/hcm'

const state = {
  orgList: null,
  postList: null,
  personList: null,
  orgDetails: null,
  postDetails: null,
  activeOrg: null,
  activeOrgTreepath: null,
  personDetails: null,
  userNotLinkList: null,
  orgType: [
    {name: "事业部", typename: 'division'},
    {name: "子公司", typename: 'subcorp'},
    {name: "分公司", typename: 'branch'},
    {name: "部门", typename: 'department'},
    {name: "科室/班组", typename: 'group'},
    {name: "虚拟组织", typename: 'virtualorg'},
  ],
};

// getters
const getters = {


    odlOrgList: state => {
      return state.orgList
  },
    orgList : state => {
        const result = toZtreeFormat(state.orgList,'orgid','parentid','children');
        const orgList = result == false ? null : result;
        return orgList;
    },
    postList : state => {
      let newPostList = [];
      let treepath = state.activeOrg?state.activeOrg.treepath: '';
      if(treepath == '1'){
        return state.postList
      }else{
        if(state.postList){
          state.postList.forEach(function(val,index,arr){
            if(state.activeOrg && val.orgid == state.activeOrg.orgid){
              newPostList.push(val)
            }
          });
          return newPostList
        }
      }
      return newPostList;
      return []
    },
    allPersonList: state => {
      return state.personList;
    },
    personList : state => {
      let newPersonList = [];
      if(state.personList){
        if(!state.activeOrg){
          return []
        }
        if(state.activeOrg.treepath == 1 || state.activeOrg.treepath == null){
          return state.personList
        }else{
          state.personList.forEach(function(val,index,arr){
            if(val.treepath == state.activeOrg.treepath){
              newPersonList.push(val)
            }
          });
        }
        return newPersonList;
        }
    },
    activeOrg: state => {
      const activeOrg = state.activeOrg;
      return activeOrg;
    },
    orgDetails: state => {
      const orgDetails = state.orgDetails;
      return orgDetails;
    },
    postDetails: state => {
      let postDetails = state.postDetails?state.postDetails[0]:{};

      return postDetails;
    },
    personDetails: state => {
      let personDetails = state.personDetails?state.personDetails:{};
      return personDetails;
    },
    orgType: state => {
      const orgType = state.orgType;
      return orgType;
    },
    userNotLinkList: state => {
      let userNotLinkList = state.userNotLinkList?state.userNotLinkList:{};

      return userNotLinkList;
    },
};

// actions
const actions = {
  //初始化所有数据
  initHcmData (store) {
    var sendData = {
      tenantid: getCookie('tenantid'),
      userid: getCookie('userid'),
      tenantname: ''
    };
    hcmApi.findOrgList(sendData).then(response => {
      store.commit(SUCCESS_GTE_ORG_LIST,response.data.datas);
      const topOrg = response.data.datas.filter(function(val,index,arr){
        return (val.treepath == "1")
      });
      store.commit(SET_ACTIVE_ORG,topOrg[0]);
      store.dispatch('getPostList',{"activeOrg":store.state.activeOrg.orgid});
      store.dispatch('getOrgDetails',{"orgid":store.state.activeOrg.orgid});
      store.dispatch('getPersonList',{});
    })
  },


  //组织 - 获取组织列表
  getOrgList (store) {
    var sendData = {
      tenantid: getCookie('tenantid'),
      userid: getCookie('userid'),
      tenantname: store.getters.tenantname
    };
    hcmApi.findOrgList(sendData).then(response => {
      if(response.data.flag == 'success') {
        if(store.state.activeOrg == null) {
          store.commit(SET_ACTIVE_ORG,response.data.datas[0]);
        }
      store.commit(SUCCESS_GTE_ORG_LIST,response.data.datas);
      }else{
        console.log(response.data.msg)
      }
    })
  },
  //组织 - 新增组织
  addOrg (store,data) {
    var data = data;
    let typename = '';
    store.state.orgType.forEach(function(val,index,arr){
      if(val.name == data.typename){
        typename = val.typename
      }
    });
    const sendData = {
      userid: getCookie('userid'),
      "mome": "",
      begintime: new Date(data.begintime).format('yyyy-MM-dd') + ' 00:00:00' || '',
      endtime: new Date(data.endtime).format('yyyy-MM-dd') + ' 00:00:00' || '',
      partyorgentity: {
        tenantid: getCookie('tenantid'),
        indexno: store.state.activeOrg.indexno + '',
        orgid:  store.state.activeOrg.orgid,
        treepath:  store.state.activeOrg.treepath,
        orgname: data.orgname,
        orgno: data.orgno || '',
        memo: data.memo || '',
      },
      partyroletypeentity: {
        typename: typename
      },
      "partyrelationshipentity": {}
    };
    hcmApi.addOrg(sendData).then(response => {
      if(response.data.flag == 'success') {
        let oldActiveOrg = JSON.parse(JSON.stringify(store.state.activeOrg))
        Message.success(response.data.msg);
        store.dispatch("getOrgList");
        eventHub.$emit('SUCCESS_ADD_ORG');
        store.dispatch("changeOrg",oldActiveOrg);
      }else{
        console.log(response.data.msg)
      }
    }).catch()
  },
  //组织 - 编辑组织
  editOrg (store,data) {
    var sendData = {
      userid: getCookie('userid'),
      typename: data.typename || 'central',
      begintime: data.begintime?new Date(data.begintime).format('yyyy-MM-dd')+' 00:00:00':null,
      endtime: data.endtime?new Date(data.endtime).format('yyyy-MM-dd')+' 00:00:00':null,
      mome: "",
      partyorgentity: {
        tenantid: getCookie('tenantid'),
        orgid: store.state.activeOrg.orgid,
        orgname: data.orgname ,
        orgno: data.orgno,
      },
    }
    hcmApi.editOrg(sendData).then(response => {
      if(response.data.flag == 'success') {
        Message.success(response.data.msg)
        eventHub.$emit('SUCCESS_EDIT_ORG');
        store.dispatch('getOrgList')
      }else{
        Message.error(response.data.msg)
      }
    })
  },
  //组织 - 撤销组织
  deledtOrg (store,data) {
    var sendData = {
      tenantid: getCookie('tenantid'),
      userid: getCookie('userid'),
      orgid: store.state.activeOrg.orgid,
      treepath: store.state.activeOrg.orgid
    };
    hcmApi.deledtOrg(sendData).then(response => {
      if(response.data.flag == 'success') {
        Message.success(response.data.msg);
        store.dispatch("getOrgList");
        eventHub.$emit('SUCCESS_DEL_ORG');
        store.dispatch("changeOrg",store.state.orgList[0]);
      }else{
        Message.error(response.data.msg);
      }
    })
  },
  //组织 - 切换当前组织
  changeOrg (store,data) {
    eventHub.$emit('CHANGE_ACTIVE_ORG');
    store.commit(CHANGE_ACTIVE_ORG,data);
    store.dispatch('getOrgDetails',{orgid: data.orgid})
  },
  //组织 - 获取组织详情
  getOrgDetails (store,activeOrg) {
    var sendData = {
      tenantid: getCookie('tenantid'),
      orgid: activeOrg.orgid
    };
    hcmApi.getPartyOrg(sendData).then(response => {
      if(response.data.flag == 'success') {
        store.commit(SUCCESS_GET_ORG_DETAILS, response.data.datas)
      }else{
        console.log(response.data.msg)
      }
    })
  },





  //岗位 - 获取岗位列表
  getPostList (store,data) {
    var sendData = {
      tenantid: getCookie('tenantid'),
      //orgid: data.activeOrg || '',
      pageno: data.pageno || 1,
      pagesize: data.pagesize || -1
    };
    hcmApi.getPostList(sendData).then(response => {
      if(response.data.flag == 'success') {
      store.commit(SUCCESS_GET_POST_LIST,response.data.datas)

      }else{
        console.log(response.data.msg)
      }
    })
  },
  //岗位 - 新增岗位
  addPost (store,data) {
    let parentid = '';
    store.state.postList.forEach(function(val){
      if(val.postname == data.parentpostname){
        parentid = val.orgpostid
      }
    });
    var sendData = {
      createduserid: getCookie('userid'),
      tenantid: getCookie('tenantid'),
      orgid: store.state.activeOrg.orgid,
      postname: data.postname || '',
      postno: data.postno || '',
      parentid: parentid || '',
      persionnum: data.persionnum || '',
      rank: data.rank|| '',
      responsibility: data.responsibility|| '',
      postspecification: data.postspecification || '',

    };
    hcmApi.addPost(sendData).then(response => {
      if(response.data.flag == 'success') {
        Message.success(response.data.msg);
        eventHub.$emit('SUCCESS_ADD_POST');
        store.dispatch('getPostList',{});
      }else{
        Message.error(response.data.msg);
      }
    })

  },
  //岗位 - 获取岗位详情
  getPostDetails (store,data) {
    const sendData = {
      orgpostid: data.orgpostid
    }
    hcmApi.getPostDetails(sendData).then(response => {
      if(response.data.flag == 'success') {
        store.commit('SUCCESS_GET_POST_DETAILS',response.data.datas);
      }else{
        console.log(response.data.msg)
      }
    })
  },
  //岗位 - 编辑岗位详情
  editPost (store,data) {
    let parentid = '';
    store.state.postList.forEach(function(val){
      if(val.postname == data.parentpostname){
        parentid = val.orgpostid
      }
    });
    var sendData = {
      lastupdateduserid: getCookie('userid'),
      tenantid: getCookie('tenantid'),
      orgpostid: data.postid,
      orgid: store.state.activeOrg.orgid,
      postname: data.postname || '',
      postno: data.postno || '',
      parentid: parentid || '',
      persionnum: data.persionnum || '',
      rank: data.rank|| '',
      responsibility: data.responsibility|| '',
      postspecification: data.postspecification || '',

    };
    hcmApi.editPost(sendData).then(response => {
      if(response.data.flag == 'success') {
      Message.success(response.data.msg);
      eventHub.$emit('SUCCESS_EDIT_POST');
      store.dispatch('getPostList',{});
      }else{
        Message.error(response.data.msg);
      }
    })
  },
  //岗位 - 撤销岗位
  delPost (store,orgpostid) {
    const sendData = {
      orgpostid: orgpostid,
      tenantid: getCookie('tenantid')
    }
    hcmApi.delPost(sendData).then(response => {
      if(response.data.flag == 'success') {
        Message.success('删除岗位成功');
        store.dispatch('getPostList',{});
      }else{
        Message.error(response.data.msg);
      }
    })
  },





  //人员 - 获取人员列表
  getPersonList (store,data) {
    var sendData = {
      tenantid: getCookie('tenantid'),
      typename: 'employee',
      worknum: null,
      pageno: data.pageno || 1,
      pagesize: data.pagesize || -1,
      firstname: data.firstname
    };
    hcmApi.getPersonList(sendData).then(response => {
      if(response.data.flag == 'success') {
        store.commit(SUCCESS_GET_PERSON_LIST, response.data.datas);
        if(data != undefined && data.callBack){
          data.callBack(response.data.datas);
        }
        //eventHub.$emit('treeTwoDataShow');
      }else{
        console.log(response.data.msg)
      }
    })
  },
  //人员 - 新增人员
  addPerson (store,data) {
    let orgList = [];
    let postList = [];
    let postItem = {};


    orgList = store.state.orgList.filter(function(val,index,arr){
      return (val.orgid == data.orgid)
    });
    postList = store.state.postList.filter(function(val,index,arr){
      return (val.orgid == orgList[0].orgid)
    });
    postItem = postList.filter(function(val,index,arr){
      return (val.postname == data.postname)
    });


    var sendData = {
      orgid: data.orgid,
      postid: postItem.length>0?postItem[0].orgpostid:'',
      tenantid: getCookie('tenantid'),
      phone: data.phone,
      idcard: data.idcard,
      firstname: data.firstname,
      typename: 'employee',
      type:'employee',
      birthdate: data.birthdate?new Date(data.birthdate).format('yyyy-MM-dd')+' 00:00:00':'',
      gender: data.gender == '男'?'m':'w',
      worknum: data.worknum,
      createduserid: getCookie('userid')

    };
    hcmApi.addPerson(sendData).then(response => {
      if(response.data.flag == 'success') {
        Message.success('新增人员成功');
        store.dispatch('getPersonList',{});
        eventHub.$emit('SUCCESS_ADD_PERSON')
      }else{
        Message.error(response.data.msg)
      }
    })
  },
  //人员 - 编辑人员
  editPerson (store,data) {
    let orgList = [];
    let postList = [];
    let postItem = {};


    orgList = store.state.orgList.filter(function(val,index,arr){
      return (val.orgid == data.orgid)
    });
    postList = store.state.postList.filter(function(val,index,arr){
      return (val.orgid == orgList[0].orgid)
    });
    postItem = postList.filter(function(val,index,arr){
      return (val.postname == data.postname)
    });


    var sendData = {
      personid: data.personid,
      orgid: data.orgid,
      postid: postItem.length>0?postItem[0].orgpostid:'',
      tenantid: getCookie('tenantid'),
      phone: data.phone,
      idcard: data.idcard,
      firstname: data.firstname,
      typename: 'employee',
      type:'employee',
      birthdate: data.birthdate?new Date(data.birthdate).format('yyyy-MM-dd')+' 00:00:00':'',
      gender: data.gender == '男'?'m':'w',
      worknum: data.worknum,
      lastupdateduserid: getCookie('userid')

    };
    hcmApi.editPerson(sendData).then(response => {
      if(response.data.flag == 'success') {
      Message.success('编辑人员成功');
      store.dispatch('getPersonList',{});
      eventHub.$emit('SUCCESS_EDIT_PERSON')
    }else{
      Message.error(response.data.msg)
    }
  })
  },
  //人员 - 删除人员
  delPerson (store,data){
    var sendData = {
      postid: data.postid,
      personid: data.personid,
      tenantid: getCookie('tenantid')
    }
    hcmApi.delPerson(sendData).then(response => {
      if(response.data.flag == 'success') {
        Message.success('删除人员成功');
        store.dispatch('getPersonList',{});
      }else{
         Message.error(response.data.msg)
      }
    })
  },
  //人员 - 人员详情
  findById (store,personid){
    const sendData = {
      tenantid: getCookie('tenantid'),
      personid: personid
    }
    hcmApi.findById (sendData).then(response => {
      if(response.data.flag == 'success') {
        store.commit(SUCCESS_GET_PERSON_DETAILS,response.data.datas)
      }else{
        console.log(response.data.msg)
      }
    })
  },
  //人员 - 人员绑定列表
  findUserNotLinkPersonList (store,personid){
    var sendData = {
      tenantid: getCookie('tenantid')
    }
    hcmApi.findUserNotLinkPersonList(sendData).then(response => {
      if(response.data.flag == 'success') {
       store.commit(SUCCESS_GET_USER_NOT_LIKN,response.data.datas)
      }else{
        console.log(response.data.msg)
      }
    })
  },
  //人员 - 绑定人员
  personLinkUser (store,data){
    const sendData = {
      tenantid: getCookie('tenantid'),
      personid: data.personid || '',
      userid: data.userid || '',
      createduserid: getCookie('userid'),
    };
    hcmApi.personLinkUser (sendData).then(response => {
      if(response.data.flag == 'success') {
        Message.success('绑定人员成功');
        store.commit(CHANGE_USER_LOGINNAME,{personid: data.personid,loginname: data.loginname,userid: data.userid})
        eventHub.$emit('SUCCESS_PERSON_LINK_USER')
      }else{
        Message.error(response.data.msg)
      }
    })
  },
  //人员 - 解绑人员
  unbundlingUser (store,data) {
    const sendData = {
      tenantid: getCookie('tenantid'),
      personid: data.personid || '',
      userid: data.userid || '',
    };
    hcmApi.unbundlingUser (sendData).then(response => {
      if(response.data.flag == 'success') {
        Message.success('人员解绑成功');
        store.commit(CHANGE_USER_LOGINNAME,{personid: data.personid,loginname: ''})
      }else{
        Message.error(response.data.msg)
      }
    })
  },
  //人员 - 从系统中导入
  accountImport (store,data) {
    const sendData = {
      tenantid: getCookie('tenantid'),
      userid: getCookie('userid')
    };
    hcmApi.accountImport (sendData).then(response => {
      if(response.data.flag == 'success') {
      Message.success(response.data.msg);
      store.dispatch('getPersonList',{});
    }else{
      Message.error(response.data.msg)
    }
  })
  }
};

const mutations = {
  [SUCCESS_GTE_ORG_LIST] (state,orgList){
    state.orgList = orgList;
  },
  [SET_ACTIVE_ORG] (state,orgData){
    state.activeOrg = orgData
  },
  [SUCCESS_GET_POST_LIST](state,postList){
    state.postList = postList
  },
  [SUCCESS_GET_PERSON_LIST](state,personList){
  state.personList = personList
  },
  [CHANGE_ACTIVE_ORG](state,activeOrg){
    state.activeOrg = activeOrg
  },
  [SUCCESS_GET_ORG_DETAILS](state,orgDetails){
    state.orgDetails = orgDetails;
  },
  [SUCCESS_GET_POST_DETAILS](state,postDetails){
    state.postDetails = postDetails
  },
  [SUCCESS_GET_PERSON_DETAILS](store,personDetails){
    state.personDetails = personDetails;
  },
  [SUCCESS_GET_USER_NOT_LIKN](store,userNotLinkList){
    state.userNotLinkList = userNotLinkList;
  },
  [CHANGE_USER_LOGINNAME](state,data){
    state.personList.forEach(function(val,index,arr){
      if(val.personid == data.personid){
        val.loginname = data.loginname;
        val.userid = data.userid;
      }
    })
  },

  [CLEAR_HCM_DATA](state,data){
      state.orgList = null
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
