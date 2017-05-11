<template>
  <div class="login_content">
    <div class="login_header"><span>陶朱</span>平台</div>
    <div class="login_form_box bounceInDown animated">
      <h3 class="login_form_box_title">用户注册</h3>
      <el-form ref="userInfo" :model="userInfo" :rules='userInfoValidate' label-width="85px">
        <el-form-item label="用户名:" prop="username">
          <el-input  placeholder="请输入用户名" v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="邀请码:" prop="invitedcode">
          <el-input  placeholder="请输入邀请码" v-model="userInfo.invitedcode"></el-input>
        </el-form-item>
        <div class="text-right"><el-button type="primary" @click="confirm" :disabled="btnDisabled">完成注册</el-button></div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { validateUserName,validateCode } from '@/validate/index'
  import { mapGetters }  from 'vuex'

  import { getCookie,saveCookie,signOut} from '@/common/authService';

  export default {
    name: 'signupinfo',
    data: function(){
      return {
        userInfo: {
          username: '',
          invitedcode: '',
          successMsg: '您已完成注册'
        },
        userInfoValidate: {
          username: [
            { required: true, message: '登录帐号不能为空', trigger: 'blur' },
            { validator: validateUserName, trigger: 'blur'}
          ],
          invitedcode: [
            { validator: validateCode, message: '邀请码必须是长度在2到10个数字',trigger: 'blur'},
//            { min: 2,max: 10, message: '验证码长度在2到10个字符', trigger: 'blur' },
          ]
        },
      }
    },
    computed: {
      ...mapGetters({
        btnDisabled: 'btnDisabled',
      }),
    },
    methods: {
      confirm: function(){
        let vm = this;
        vm.$store.dispatch('startBtnClick')
        this.$refs.userInfo.validate(function(valid){
          if(valid){
            //验证通过，进行登录
            //登录接口调用
            vm.$store.dispatch('updateUserName',vm.userInfo)
          }else{
            vm.$store.dispatch('endBtnClick');
            return false;
          }
        })
      }
    },
    created : function(){
      var vm = this;
      eventHub.$on('SUCCESS_CHANGE_USERINFO', function () {
        vm.$router.push({path:'/team'})
      })
    },
    beforeDestroy: function(){
      eventHub.$off('SUCCESS_CHANGE_USERINFO')
    }
  };
</script>

<style scoped lang="scss">
.login_form_box{
  width: 480px;
}
</style>
