<template>
  <div class="login_content">
    <div class="login_header"><span>陶朱</span>平台</div>
    <div class="login_form_box" v-if="!isChange">
      <el-row :gutter="20">
        <el-col :span="8" class="text-right"><img v-if="errorbindmai" :src="errorImg" width="40" height="40"><img v-else :src="successImg" width="40" height="40"></el-col>
        <el-col :span="16">
          <p></p>
          <p v-if="errorbindmai">错误信息:{{bindmailerror}}</p>
          <p v-else>{{bindmailsuccess}}</p>
          <p>系统将在{{count}}秒后{{edit}}</p>
        </el-col>
      </el-row>
      </div>
    <div v-else class="login_form_box">
      <el-row :gutter="20">
        <el-form ref="validatePassword" :model="dataPassword" :rules='validatePassword'  label-width="100px">
          <el-form-item label="密码:" prop="newPwd">
            <el-input type="password" v-model="dataPassword.newPwd"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="rPwd">
            <el-input type="password" v-model="dataPassword.rPwd"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="text-right">
            <el-button type="primary" @click="confirmChangePwd">确认</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </div>
  </div>
</template>

<script>
  import userApi from '@/api/user'
  import { validatePassword } from '@/validate'
  import { MD5Password } from '@/common/untils';
  export default {
    name: 'chkmail',
    data: function() {
      const validatePassCheck = (rule, value, callback) => {
        if (value !== this.dataPassword.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        count: 5,
        bindmailerror: '链接已失效',
        bindmailsuccess: '',
        edit: '关闭',
        isChange: false,
        loginname:'',
        errorbindmai: true,
        successImg: require('@/assets/images/successImg.png'),
        errorImg: require('@/assets/images/chkerror.png'),
        dataPassword: {
          newPwd: '2222',
          rPwd  : '3333'
        },
        validatePassword: {
          newPwd: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur'}
          ],
          rPwd: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: validatePassCheck, trigger: 'blur'}
          ],
        }

      }

//        clsePage: function(){
//          var vm = this;
//          vm.count = 5;
//          setInterval(function(){
//            vm.count = vm.count - 1;
//            if(vm.count == 0) {
//              window.close()
//            }
//          },1000)
//        }
    },
    computed: {
      watchNewPwd: function(){
        return this.dataPassword.newPwd
      }
    },
    methods: {
      closePage: function(){
          var vm = this;
          vm.count = 5;
          var closepage = setInterval(function(){
            vm.count = vm.count - 1;
            if(vm.count == 0) {
              clearInterval(closepage)
              window.close()
            }
          },1000)
        },
      toLogin: function(){
        var vm = this;
        vm.count = 5;
        var closepage = setInterval(function(){
          vm.count = vm.count - 1;
          if(vm.count == 0) {
            clearInterval(closepage)
            vm.$router.push({name:'login'})
          }
        },1000)
      },
      confirmChangePwd: function() {
    let vm = this;
    this.$refs.validatePassword.validate(function(valid){
      if(valid){
        let currentpwd = MD5Password(vm.dataPassword.rPwd);
        userApi.restPassword({'loginname':vm.loginname,"currentpwd":currentpwd,'lasttenantid':''}).then(response =>{
          if(response.data.flag == 'success'){
            vm.isChange = false;
            vm.errorbindmai = false;
            vm.bindmailsuccess = '修改密码成功';
            vm.edit = '返回登录页面';
            vm.toLogin();
        }else{
          vm.errorbindmai = true;
          vm.bindmailerror = response.data.msg;
          vm.closePage();
        }
      })
      }else{
        return false;
      }
    })
  }
    },
    watch: {
      watchNewPwd: function(){
        this.dataPassword.rPwd = '';
      }
    },
    beforeRouteEnter: function(to, from, next){
      next(vm => {
        const type = to.query.type  || '';
        const id = to.query.id || '';
        const loginname = to.query.loginname || '';
        if(type == 'BINDEMAIL'){
          userApi.validationLink({'id':id}).then(response =>{
            if(response.data.flag == 'success'){
            vm.bindmailsuccess = '绑定邮箱成功！';
            vm.errorbindmai = false;
            }else{
            vm.errorbindmai = true;
            vm.bindmailerror = response.data.msg;
          }
          })
          vm.closePage()
        }
        if(type == 'RESTPASSWORD'){
            vm.loginname = loginname;
            userApi.restPassword({'loginname':loginname}).then(response =>{
              if(response.data.flag == 'success'){
                vm.isChange = true;
              }else{
                vm.errorbindmai = true;
                vm.bindmailerror = response.data.msg;
              }
          })
        }
      })
    }
  };

</script>

<style lang="scss">

</style>
