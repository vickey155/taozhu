// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//elemnt ui组件及样式引入
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'


import Vue from 'vue';
import App from './App';
import router from './router';
import store from './vuex/store'
import { sync } from 'vuex-router-sync'
import VueResource from './api/resources'

import 'babel-polyfill'

import { getCookie } from './common/authService'
import { dateFormat } from '@/common/untils'



  Vue.use(ElementUI);

Vue.config.productionTip = false;

sync(store, router);

//全局事件中心
window.eventHub = new Vue();

//
Date.prototype.format = dateFormat;



//路由权限验证
router.beforeEach((to,from,next) => {
	//是从cookies里拿登录状态好还是从store拿登录状态好？暂时先从cookies拿
	const token  = getCookie('tokenid');
	const userid = getCookie('userid');
  const username = store.state.auth.username;
    if(!(to.matched.some( m => m.meta.signupinfo))){
      if(token && userid && (username == '' || username == null)){ //判断有没有用户名，如果没有用户名则跳转到
        next({path: '/signupinfo'})
      }else{
        next()
      }
    }
    if(to.matched.some( m => m.meta.auth)){
        // 对路由进行验证
        if(token && userid) { // 判读
          next()
        }else{
            // 未登录,跳转到登陆页面，并且带上 将要去的地址，方便登陆后跳转。
            next({path:'/login'})
        }
    }else if(to.matched.some( m => m.meta.enter)){
      if(!token && !userid) { // 判读
            next()
        }else{
          next({path:'/home'})
        }

    }else{
        next()
    }
})


/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});

var $Message =  vm.$Message;
export default  $Message
