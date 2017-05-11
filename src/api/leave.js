import {LeaveResource} from './resources'
export default {

  //新增请假 获取个人基本信息
  addAskForLeave: function (data){
    return LeaveResource.save({id:'findPersonMessage.htm'},data)
  },


  // 保存请假
  saveAskForLeave: function (data){
    return LeaveResource.save({id:'addAskForLeave.htm'},data)
  },

  // 提交请假
  commitAskForLeave: function (data){
    return LeaveResource.save({id:'commitAskForLeave.htm'},data)
  },

  // 修改请假
  editAskForLeave: function (data){
    return LeaveResource.save({id:'editAskForLeave.htm'},data)
  },

  // 删除请假列表
  delAskForLeave: function (data){
    return LeaveResource.save({id:'delAskForLeave.htm'},data)
  },

  // 获取请假列表
  getLeaveList: function (data){
    return LeaveResource.save({id:'findAskForLeaveList.htm'},data)
  },

  // 获取请假详情
  getLeaveDetail: function (data){
    return LeaveResource.save({id:'findAskForLeave.htm'},data)
  },

  // 获取流转记录列表
  findApprovalList: function (data){
    return LeaveResource.save({id:'findApprovalList.htm'},data)
  },

  // 获取审批列表
  findMyApprovalList: function (data){
    return LeaveResource.save({id:'findMyApprovalList.htm'},data)
  },

  // 审批请假申请
  approvalAskForLeave: function (data){
    return LeaveResource.save({id:'approvalAskForLeave.htm'},data)
  }

}
