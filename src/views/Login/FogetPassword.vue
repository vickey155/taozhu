<template>
  <div class="login_content">
    <div class="login_header"><span>陶朱</span>平台</div>
    <div class="login_form_box foget_password swing animated">
      <h3 class="login_form_box_title">忘记密码</h3>
      <el-form ref="dataFogetPassword" v-if="inputMobile" :model="dataFogetPassword" :rules='validatePassword'  label-width="85px">
        <el-form-item label="账号:" prop="loginname">
          <el-input v-model="dataFogetPassword.loginname" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="next">下一步</el-button>
        </el-form-item>
        <el-form-item>
          <router-link to="/loginup">返回登录>></router-link>
        </el-form-item>
      </el-form>
      <div v-else v-show="findPwWay === 0">
        <p class="notes text-center">您正在找回账号"{{dataFogetPassword.loginname}}"的密码 <span @click="inputMobile=true">[换 一个帐号]</span></p>
        <el-row :gutter="20" class="type_item" v-show="dataByPhone.boundemail == '1'">
          <el-col :span="4">找回方式:</el-col>
          <el-col :span="6"><a @click="findPwByEmail">【通过邮箱】</a></el-col>
        </el-row>
        <el-row :gutter="20" class="type_item" v-show="dataByPhone.boundmobile == '1'">
          <el-col :offset="4" :span="6" ><a @click="findPwByPhone">【通过手机】</a></el-col>
        </el-row>
      </div>
      <!-- 通过手机号寻找密码 -->
      <div v-if="findPwWay === 'byPhone'">
        <el-form ref="dataByPhone" :model="dataByPhone" :rules='validateByPhone'>
          <el-form-item label="验证码:" prop='verification'>
            <el-col :span='12'>
              <el-input placeholder='请输入收到的验证码' v-model='dataByPhone.verification'></el-input>
            </el-col>
            <el-col :span='6' :offset='1' class='text-right'>
              <el-button @click='getCode' :disabled='disabled'>{{phoneCount == 0 ? '获取验证码' : phoneCount+'s后重新获取'}}</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="登录密码:" prop='pwd'>
            <el-col :span='18'>
              <el-input type="password" placeholder="请输入登录密码" v-model='dataByPhone.pwd'></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="确认密码:" prop='rPwd'>
            <el-col :span='18'>
            <el-input type="password" placeholder="请输入确认密码" v-model='dataByPhone.rPwd' ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click='confirm' >确 认</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 通过邮箱号寻找密码 -->
      <div v-else-if="findPwWay === 'byEmail'">
        <validate-email :loginName="dataFogetPassword.loginname"></validate-email>
      </div>

    </div>
  </div>
</template>

<script>

  import {validatePhone,validateCode,validatePassword} from '@/validate/index'
  import { mapGetters }  from 'vuex'
  import userAip from '@/api/user'
  import { Message } from 'element-ui';
  import  ValidateEmail from './findPwByEmail';

  export default {
    name: 'fogetpassword',
    data: function(){
      const validatePassCheck = (rule, value, callback) => {
        if (value !== this.dataByPhone.pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return{
        inputMobile: true,
        dataFogetPassword: {
            loginname: '',
            mobile: ''
        },
        validatePassword: {
          loginname: [
            { required: true, message: '登录帐号不能为空', trigger: 'blur' },
            { validator: validatePhone, message: '请填写正确手机号', trigger: 'blur'}
          ]
        },
        findPwWay:0,
        dataByPhone: {
          userid:"",
          boundemail:"",
          boundmobile:"",
          verification: '',
          pwd:          '',
          rPwd:         '',
        },
        validateByPhone: {
          verification: [
            { required: true, message: '验证码号帐号不能为空', trigger: 'blur' },
            { validator: validateCode,trigger: 'blur'}
          ],
          pwd: [
            { required: true, message: '登录密码不能为空', trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur'}

          ],
          rPwd: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: validatePassCheck,trigger:'blur'}
          ]
        },
        validateCodeCount:0
      }
    },
    computed: {
      ...mapGetters({
        btnDisabled: 'btnDisabled',
        phoneCount : 'phoneCount',
      }),
      disabled: function(){
        if(this.btnDisabled){
         // console.log(this.phoneCount);
         // this.validateCodeCount = this.phoneCount;
         // console.log(this.validateCodeCount);
          return true;
        }else{
          if(this.phoneCount != 0){
            return true
          }else{
            return false;
          }
        }
      }
    },
    methods: {
      next: function(){
        var vm = this;
        this.$refs.dataFogetPassword.validate(function(valid){
          if(valid){
            userAip.validationLoginName({'verificationaccount': '0','loginname': vm.dataFogetPassword.loginname}).then(response => {
              if(response.data.flag == 'success'){
                var userinfo = response.data.datas.userinfo;
                vm.inputMobile = false;
                vm.dataByPhone.boundemail = userinfo.boundemail;
                vm.dataByPhone.boundmobile = userinfo.boundmobile;
                if(userinfo.boundemail!=="1" && userinfo.boundmobile!=="1"){
                  Message.warning('没有绑定邮箱和手机号，请联系客服');
                }
                vm.dataByPhone.userid = userinfo.userid;
                vm.dataFogetPassword.mobile = userinfo.mobile;
              }else{
                Message.error(response.data.msg);
              }
            });

          }else{
            return false;
          }
        })
      },
      getCode: function(){
        var vm = this;
        //console.log(1);
        vm.$store.dispatch('startBtnClick');
        vm.$store.dispatch('sendVerification',vm.dataFogetPassword.mobile);
      },
      findPwByPhone:function(){
        var vm = this;
        vm.findPwWay = 'byPhone';
      },
      confirm: function(){
        var vm = this;
        vm.$store.dispatch('startBtnClick');
        this.$refs.dataByPhone.validate(function(valid){
          if(valid){
            //通过验证,调获取验证码接口
            const sendData = {
              userid: vm.dataByPhone.userid,
              updateway:"T",
              loginname: vm.dataFogetPassword.loginname,
              verificationcode: vm.dataByPhone.verification,
              currentpwd: vm.dataByPhone.pwd,
              verification: vm.dataFogetPassword.mobile
            };
            vm.$store.dispatch('findPwByPhoneNum',sendData);

          }else{
            vm.$store.dispatch('endBtnClick');
            return false
          }

        })
      },
      findPwByEmail:function(){
        var vm = this;
        vm.findPwWay = 'byEmail';
        const sendData = {
          loginname: vm.dataFogetPassword.loginname
        }
        vm.$store.dispatch('findPwByEmail',sendData);
      }
    },
    components: {
      'validate-email': ValidateEmail
    }
  };
</script>

<style lang="scss">
  .foget_password{
    font-size: 14px;
    .notes{
      color: #333;
      span{
        color: #20A0FF;
        cursor: pointer;
        margin-left: 10px;
      }
    }
    .type_item{
      margin: 20px 0;
    }
    .el-form-item{
      .el-form-item__label{
        width:100px;
        text-align: right;
      }
      .el-col-offset-1{
        margin-left: 0;
      }
      .is-disabled{
        padding:10px 5px;
        min-width: 106px;
      }
    }
    .el-form-item__error{
      padding-left: 100px;
    }
  }
</style>
