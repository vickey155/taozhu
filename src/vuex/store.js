import Vue          from 'vue'
import Vuex         from 'vuex'
import middlewares  from './middlewares'
import * as getters from './getters'
import * as actions from './actions'
import mutations  from './mutations'


import auth     from './modules/auth'     //用户信息及token
import tenant   from './modules/tenant'     //团队信息
import btnEvent from './modules/btnEvent' //防止按钮多次点击
import hcm from './modules/hcm' //hcm模块
import leave from './modules/leavePerson' //请假模块



Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  actions,
  getters,
  mutations,
  modules: {
    auth,
    btnEvent,
    tenant,
    hcm,
    leave
  },
  strict: debug,
  middlewares
})
