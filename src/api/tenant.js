
import {TenantResource} from './resources'
import {UserResource} from './resources'

export default {

  //加入租户 租户名称不存在验证
  validationTenant(data) {
    return TenantResource.save({id:'validationTenant.htm'},data);
  },
  //加入租户 获取租户列表
  getTenantList(data) {
    return TenantResource.save({id:'getTenantList.htm'},data);
  },

  //创建租户团体
  createTenantTeam(data) {
    return TenantResource.save({id:'createTenant.htm'},data);
  },
  //获取租户下用户
  getTenantList(data) {
    return TenantResource.save({id:'getTenantList.htm'},data);
  },
//获取租户下用户
  userListByTenantId(data) {
    return UserResource.save({id:'userListByTenantId.htm'},data);
  },
  //切换团队
  switchTenant(data){
    return TenantResource.save({id:'switchTenant.htm'},data);
  },
  //移除租户下用户
  removeUser(data){
    return TenantResource.save({id:'removeUser.htm'},data);
  },
  applicationList(data){
    return UserResource.save({id:'applicationList.htm'},data);
  },
  //审核申请接口
  processingApplication(data){
    return UserResource.save({id:'processingApplication.htm'},data);
  },
  //退出租户
  exitTenant(data){
    return TenantResource.save({id:'exitTenant.htm'},data);
  },
  //租户邀请用户
  tenantInvitate(data){
    return TenantResource.save({id:'tenantInvitate.htm'},data);
  }
}
