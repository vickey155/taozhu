/**
 * Created by Administrator on 2017/4/20 0020.
 */

import {
  PHONE_COUNT_DOWN,
  Email_COUNT_DOWN,
  START_BTN_CLICK,
  END_BTN_CLICK
} from '../types'
import { countDown } from '@/common/untils'


const state = {
  btnDisabled: false,
  phoneCount: 0,
  emailCount: 0
};

// getters
const getters = {
  btnDisabled : state => {
    const btnDisabled = state.btnDisabled
    return btnDisabled
  },
  phoneCount : state => {
    const phoneCount = state.phoneCount
    return phoneCount
  },
  emailCount : state => {
      const emailCount = state.emailCount
      return emailCount
    }
};

// actions
const actions = {
  //type代表要倒计时的类型
  //是phoneCount 或者是 emailCount 还是其他的
  countDown ({ commit, state},countType) {
    commit(countType,60);
    countDown(function(count){
      commit(countType,count)
    })
  },
  startBtnClick ({ commit, state},countType) {
    commit(START_BTN_CLICK)
  },
  endBtnClick ({ commit, state},countType) {
    commit(END_BTN_CLICK)
  }
};

const mutations = {
  [PHONE_COUNT_DOWN](state,count){
    state.phoneCount = count
  },
  [Email_COUNT_DOWN](state,count){
    state.emailCount = count
  },
  [START_BTN_CLICK](state,count){
    state.btnDisabled = true;
  },
  [END_BTN_CLICK](state,count){
    state.btnDisabled = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
