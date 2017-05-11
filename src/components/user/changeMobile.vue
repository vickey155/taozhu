<template>
  <div>
    <el-dialog class='input-dialog' title="绑定手机号码" v-model="boxMobile" size="tiny">
      <i class="title"><span></span>为了保证您的帐号安全，绑定手机前请先进行安全验证</i>
      <el-form ref="dataMobile"  :model='dataMobile' :rules='validateMobile' label-width="80px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="手机号:" prop='mobile'>
              <el-input v-model='dataMobile.mobile'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="验证码:" prop='code'>
              <el-input v-model='dataMobile.code'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-button @click='getCode' :disabled='disabled'>{{phoneCount == 0 ? '获取验证码' : phoneCount+'s后重新获取'}}</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="">
                <el-button type="primary" @click='confirmChnage'>确认</el-button>
                <el-button @click='boxMobile = false;'>取消</el-button>
              </el-form-item>
            </el-col>
        </el-row>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="boxMobile = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters }  from 'vuex'
import {validatePhone} from '@/validate/index'
export default {
  name: 'changeMobile',
  data: function(){
    return {
      boxMobile: false,
      dataMobile: {
        mobile: '',
        code: ''
      },
      validateMobile: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, message: '请填写正确手机号', trigger: 'blur'}
        ],
      }
    }
  },
  computed: {
      ...mapGetters({
        userInfo: 'userInfo',
        btnDisabled: 'btnDisabled',
        phoneCount : 'phoneCount',
      }),
      disabled: function(){
        if(this.btnDisabled){
          return true
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
    getCode: function(){
      var vm = this;
      if(vm.userInfo.mobile == vm.dataMobile.mobile){
        vm.$message({
          message: '手机号不能是当前绑定手机号',
          type: 'warning'
        });
        return false;
      }
      this.$refs.dataMobile.validate(function(valid){
        if(valid){
          vm.$store.dispatch('startBtnClick');
          //通过验证,调获取验证码接口
          vm.$store.dispatch('sendVerification',vm.dataMobile.mobile);
        }else{
          vm.$store.dispatch('endBtnClick');
          return false
        }

      })
    },
    confirmChnage: function(){
        const vm     = this;
        const mobile = vm.dataMobile.mobile;
        const code   = vm.dataMobile.code;
        vm.$store.dispatch('startBtnClick');
        this.$refs.dataMobile.validate(function(valid){
          if(valid){
            if(vm.dataMobile.code){
              //通过验证,调用修改密码接口
              vm.$store.dispatch('bindingPhone',{'mobile':mobile,'code':code},'1111');
            }else{
               vm.$message({
                message: '验证码不能为空',
                type: 'warning'
              });
              return false;
            }
          }else{
            return false
          }

        })
    }
  },
  created: function(){
    var vm = this;
    eventHub.$on('SUCCESS_BINDINGPHONE',function(){
      vm.boxMobile = false;
    })
  },
  beforeDestroy: function(){
    eventHub.$off('SUCCESS_BINDINGPHONE')
  },
  watch: {
    boxMobile: function() {

      if(this.$refs.dataMobile){
        this.$refs["dataMobile"].resetFields();
      }

    }
  }
};
</script>

<style lang="scss">
  @import "./../../assets/scss/component/_el-dialog.scss";
</style>
