<template>
  <div>
   <el-dialog class='input-dialog password-dialog' title="修改密码" v-model="boxPassword" size="tiny">
      <el-form ref="changePassword" :model='dataPassword' :rules='validatePassword'  label-width="100px">
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="旧密码:" prop='oldPwd'>
              <el-input type="password" v-model='dataPassword.oldPwd'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="新密码:" prop='newPwd'>
              <el-input type="password" v-model='dataPassword.newPwd'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="确认密码:" prop='rPwd'>
              <el-input type="password" v-model='dataPassword.rPwd'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
           <el-form-item label="">
            <el-button type="primary" @click='confirm'>确认</el-button>
             <el-button @click='boxPassword = false;'>取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { validatePassword } from '@/validate'
export default {
  name: 'changePassword',
  data: function(){
  	const validatePassCheck = (rule, value, callback) => {
  		 if (value !== this.dataPassword.newPwd) {
  			callback(new Error('两次输入密码不一致!'));
  		} else {
  			callback();
  		}
  	};
  	return {
  		boxPassword : false,
  		dataPassword: {
  			oldPwd: '',
  			newPwd: '',
  			rPwd  : ''
  		},
  		validatePassword: {
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur'}
        ],
        rPwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'blur'}
        ],
      }
  	}
  },
  computed: {
  	watchNewPwd: function(){
  		return this.dataPassword.newPwd
  	}
  },
  methods: {
  	confirm: function() {
  		let vm = this;
        this.$refs.changePassword.validate(function(valid){
          if(valid){
            //验证通过，进行登录
            //登录接口调用
            //
            const sendDate = {
            	"oldPwd"    : vm.dataPassword.oldPwd,
            	"currentpwd": vm.dataPassword.rPwd,
			    "updateway" : 'S'
            }
            vm.$store.dispatch('changePwd',sendDate)
          }else{
              return false;
          }
        })
  	}
  },
  watch: {
  	boxPassword: function(){
  		if(this.$refs.changePassword){
  			this.$refs["changePassword"].resetFields();
  		}
  	},
  	watchNewPwd: function(){
  		this.dataPassword.rPwd = '';
  	}
  },
  created: function(){
  	var vm = this;
  	eventHub.$on('SUCCESS_CHANGE_PWD',function(){
  		vm.boxPassword = false;
  	})
  },
  beforeDestroy: function(){
    eventHub.$off('SUCCESS_CHANGE_PWD')
  }
};
</script>

<style lang="scss">
    @import "./../../assets/scss/component/_el-dialog.scss";
  .password-dialog{
    .el-row{
     padding: 18px 0;
    }
  }
</style>
