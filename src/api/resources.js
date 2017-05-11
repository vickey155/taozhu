import Vue from 'vue'
import VueResource from 'vue-resource'
import { API_ROOT,apiVersion } from './../config/index'
import { getCookie,signOut } from '../common/authService'
import router from './../router';
import store from '@/vuex/store';
import { Loading } from 'element-ui';


Vue.use(VueResource);


// HTTP相关
Vue.http.options.crossOrigin = true;
Vue.http.options.credentials = true;
Vue.http.options.emulateHTTP = true;



//拦截器
Vue.http.interceptors.push((request, next)=>{
  Vue.http.headers.common['api-version'] = apiVersion;
  Vue.http.headers.common['token']       = getCookie('tokenid');
  // 这里对请求体进行处理
  request.headers = request.headers || {};
  //const loadingInstance  = Loading.service({ fullscreen: true });
  next((response) => {
    //loadingInstance.close();
  	store.dispatch('endBtnClick')
    // 这里可以对响应的结果进行处理
    if (response.status === 401) {
    	signOut()//退出登录并返回登录页面
    	router.push({name: 'login'})
    }
  })
})


export const UserResource = Vue.resource(API_ROOT + 'tz-usertenant/user{/id}');
export const TenantResource = Vue.resource(API_ROOT + 'tz-usertenant/tenant{/id}');
export const LeaveResource = Vue.resource(API_ROOT + 'tz-hcm/leave{/id}');

//hcm模块 - 组织
export const OrgResource = Vue.resource(API_ROOT + 'tz-party/party{/id}');
export const  PostResource = Vue.resource(API_ROOT + 'tz-hcm/hcm{/id}');
export const  PersonResource = Vue.resource(API_ROOT + 'tz-party/partyperson{/id}');
