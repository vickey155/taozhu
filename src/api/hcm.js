import { OrgResource,PostResource,PersonResource } from './resources'

export default {
  // 组织模块 - 获取组织列表
  findOrgList: function (data) {
    return OrgResource.save({id: 'findList.htm'}, data)
  },
  // 组织模块 - 获取组织详情
  getPartyOrg: function (data) {
    return OrgResource.save({id: 'getPartyOrg.htm'}, data)
  },
  // 组织模块 - 编辑组织详情
  editOrg: function (data) {
    return OrgResource.save({id: 'editOrg.htm'}, data)
  },
  // 组织模块 - 撤销组织
  deledtOrg: function (data) {
    return OrgResource.save({id: 'deledtOrg.htm'}, data)
  },
  // 组织模块 - 新增组织
  addOrg: function (data) {
    return OrgResource.save({id: 'addOrg.htm'}, data)
  },


  //岗位模块 - 获取岗位列表
  getPostList: function (data) {
    return PostResource.save({id: 'getPostList.htm'}, data)
  },
  //岗位模块 - 新增岗位
  addPost: function (data) {
    return PostResource.save({id: 'addPost.htm'}, data)
  },
  //岗位模块 - 撤销岗位
  delPost: function (data) {
    return PostResource.save({id: 'delPost.htm'}, data)
  },
  //岗位模块 - 编辑岗位
  editPost: function (data) {
    return PostResource.save({id: 'editPost.htm'}, data)
  },
  //岗位模块 - 获取岗位详情
  getPostDetails: function (data) {
    return PostResource.save({id: 'getPost.htm'}, data)
  },


  //人员模块 - 获取人员列表
  getPersonList: function (data) {
    return PersonResource.save({id: 'findList.htm'}, data)
  },
  //人员模块 - 新增人员
  addPerson: function (data) {
    return PersonResource.save({id: 'addPerson.htm'}, data)
  },
  //人员模块 - 删除人员
  delPerson: function (data) {
    return PersonResource.save({id: 'delPerson.htm'}, data)
  },
  //人员模块 - 编辑人员
  editPerson: function (data) {
    return PersonResource.save({id: 'editPerson.htm'}, data)
  },
  //人员模块 - 获取人员详情
  findById: function (data) {
    return PersonResource.save({id: 'findById.htm'}, data)
  },
  //人员模块 - 获取租户下未关联人员用户列表
  findUserNotLinkPersonList: function(data) {
    return PersonResource.save({id: 'findUserNotLinkPersonList.htm'}, data)
  },
  //人员模块 - 人员绑定用户
  personLinkUser: function(data) {
    return PersonResource.save({id: 'personLinkUser.htm'}, data)
  },
  //人员模块 - 人员解绑
  unbundlingUser: function(data) {
    return PersonResource.save({id: 'unbundlingUser.htm'}, data)
  },
  //人员模块 - 从系统中导入人员
  accountImport: function(data){
    return PersonResource.save({id: 'accountImport.htm'}, data)
  }
}
