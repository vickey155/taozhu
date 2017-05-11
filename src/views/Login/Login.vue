<template>
  <div class="login_content login_index">
    <div class="login_header"><span>陶朱</span>平台</div>
    <div class="login_form_box bounceInDown animated">
      <h3 class="login_form_box_title">用户登录</h3>
      <el-form ref="formValidate" :model="userInfo" :rules='ruleValidate' label-width="85px">
        <el-form-item label="登录账号" prop="loginname">
          <el-input v-model="userInfo.loginname" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input type="password" v-model="userInfo.currentpwd" placeholder="请输入登录密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button type="primary" @click="login('formValidate')">登录</el-button>
      </div>
      <div class="login_other">
        <router-link to="/fogetpassword">忘记密码？</router-link>
        <hr />
        <p>还没有账号？<router-link to="/signup">注册账号</router-link></p>
      </div>
    </div>
  </div>
</template>
<script>
  import { signOut } from '@/common/authService'
  import {validatePhone} from '@/validate/index'
  import { mapGetters } from 'vuex'
  export default{
    data: function () {
      return {
        userInfo: {
          loginname: '',
          currentpwd: '',
          msg: '登录成功',
        },
        ruleValidate: {
          loginname: [
            { validator: validatePhone, message: '请填写正确手机号', trigger: 'blur'}
          ],
        },
      };
    },
    computed: {
      ...mapGetters({
        authToken: 'authToken',
      }),
    },
    methods: {
      login: function(name){
        let vm = this;
        this.$refs[name].validate(function(valid){
          if(vm.userInfo.currentpwd == ''){
            vm.$message({
              message: '登录密码不能为空',
              type: 'warning'
            });
            return false;
          }
          if(valid){
            //验证通过，进行登录
            //登录接口调用
            vm.$store.dispatch('localLogin',vm.userInfo);
            //
          }else{
              return false;
          }
        })
      }
    },
    created: function () {
//      signOut();
    }
  };
</script>
<style lang="scss">
  @import "../../assets/scss/pages/_Login.scss";
  .login_index{
    .login_form_box{
      width: 420px;
    }
  }
</style>
