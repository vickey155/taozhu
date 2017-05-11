
import {
  LOGIN_SUCCESS
} from '@/vuex/types'

export default {
  //登录成功
  [LOGIN_SUCCESS](store,loginInfo){
    //登录成功存储数据
    store.auth.tokenid     = loginInfo.tokenid;
    store.auth.userid      = loginInfo.userid;
    store.tenant.tenantid      = loginInfo.tenantid;
  },
}

//export const [LOGIN_SUCCESS] = function(state,loginInfo) {
//  const userInfo = state.auth
//  return userInfo
//}
