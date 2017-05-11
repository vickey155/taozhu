<template>
	<div class="login_content">
		<div class="login_header"><span>陶朱</span>平台</div>
		<div class="login_form_box signup_form_box bounceInDown animated">
			<h3 class="login_form_box_title">用户注册</h3>
			<el-form ref="dataSignup" :model="dataSignup" :rules='validateSignup' label-width="95px">
				<el-row :gutter="20">
					<el-form-item :span='24'label="手机号:" class='mobile' prop="mobile">
						<el-col style="padding: 0" :span="6" class='code'>
							<el-input placeholder="+86" :disabled='true' ></el-input>
						</el-col>
						<el-col  :span="17" :offset='1'>
							<el-input  placeholder="请输入手机号" v-model='dataSignup.mobile' ></el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="验证码:" prop='verification'>
						<el-col style="padding: 0" :span='15'>
							<el-input placeholder='请输入收到的验证码' v-model='dataSignup.verification'></el-input>
						</el-col>
						<el-col :span='8' :offset='1' class='text-right'>
							<el-button @click='getCode' :disabled='disabled'>{{phoneCount == 0 ? '获取验证码' : phoneCount+'s后重新获取'}}</el-button>
						</el-col>
					</el-form-item>
					<el-form-item label="登录密码:" prop='pwd'>
						<el-input type="password" placeholder="请输入登录密码" v-model='dataSignup.pwd'></el-input>
					</el-form-item>
					<el-form-item label="确认密码:" prop='rPwd'>
						<el-input type="password" placeholder="请输入确认密码" v-model='dataSignup.rPwd' ></el-input>
					</el-form-item>
					<el-form-item>
						<el-checkbox v-model="checked">我已阅读并同意</el-checkbox><a @click='$refs.userAgreement.check= true'>用户协议</a>
					</el-form-item>
					<el-form-item>
						<el-col :span='18'>我已注册现在就<router-link to="/login">登录</router-link></el-col>
						<el-col :span='6' class="text-right" v-if='!checked'>
							<button @click.stop='disabledClick' class='el-button is-disabled'>下一步</button>
						</el-col>
						<el-col v-else :span='6' class="text-right">
							<el-button type="primary" @click=''  :disabled='btnDisabled' @click='confirm' >下一步</el-button>
						</el-col>
					</el-form-item>
				</el-row>
			</el-form>
		</div>
		<!-- 用户协议 -->
		<UserAgreement ref='userAgreement'></UserAgreement>
	</div>
</template>

<script>
	import { validatePhone,validateCode,validatePassword } from '@/validate/index'
	import UserAgreement from '@/components/user/UserAgreement'
	import { mapGetters }  from 'vuex'
	import userAip from '@/api/user'
  import { Message } from 'element-ui';
	export default {
		name: 'signup',
		data: function(){
			const validatePassCheck = (rule, value, callback) => {
				if (value !== this.dataSignup.pwd) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			const validationLoginName = (rule, value, callback) => {
				const vm = this;
                // 模拟异步验证效果
                // setTimeout(() => {
                //     if (!Number.isInteger(value)) {
                //         callback(new Error('请输入数字值'));
                //     } else {
                //         if (value < 18) {
                //             callback(new Error('必须年满18岁'));
                //         } else {
                //             callback();
                //         }
                //     }
                // }, 1000);
            };

			return {
				checked: false,
				dataSignup: {
					mobile:       '',
					verification: '',
					pwd:          '',
					rPwd:         '',
				},
				validateSignup: {
					mobile: [
					{ required: true, message: '手机号帐号不能为空', trigger: 'blur' },
					{ validator: validatePhone, message: '请填写正确手机号', trigger: 'blur'},
					],
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
					{
						validator: validatePassCheck,trigger:'blur'
					}

					]
				},
			}
		},
		components: {
			UserAgreement
		},
		computed: {
			watchNewPwd: function(){
				return this.dataSignup.pwd
			},
			...mapGetters({
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
		disabledClick: function(){
			this.$message({
				message: '请勾选同意用户协议按钮',
				type: 'warning'
			});
		},
		getCode: function(){
			var vm = this;
      if(vm.dataSignup.mobile.length == 11){
        vm.$store.dispatch('startBtnClick')
        userAip.validationLoginName({'verificationaccount': '1','loginname': vm.dataSignup.mobile}).then(response => {
          if(response.data.flag == 'success'){
          vm.$store.dispatch('sendVerification',vm.dataSignup.mobile);
        }else{
          Message.error(response.data.msg)
        }
      })
      }



//			this.$refs.dataSignup.validateField('mobile',function(valid){
//        console.log(valid.length == 0);
//        console.log(valid.length);
//				if(valid.length == 0){
//          //通过验证,调获取验证码接口
//		          vm.$store.dispatch('sendVerification',vm.dataSignup.mobile);
//		      }else{
//		      	vm.$store.dispatch('endBtnClick');
//		      	return false
//		      }
//
//		  })
		},
		confirm: function(){
			var vm = this;
			vm.$store.dispatch('startBtnClick')
			this.$refs.dataSignup.validate(function(valid){
				if(valid){
          		  //通过验证,调获取验证码接口
          		  const sendData = {
          		  	mobile    : vm.dataSignup.mobile,
          		  	code      : vm.dataSignup.verification,
          		  	currentpwd: vm.dataSignup.rPwd
          		  }
          		  console.log(sendData)
		          vm.$store.dispatch('register',sendData);
		      }else{
		      	vm.$store.dispatch('endBtnClick');
		      	return false
		      }

		  })
		}
	},
	watch: {
		watchNewPwd: function(){
			this.dataSignup.rPwd = '';
		}
	}
};
</script>

<style lang="scss">
	.signup_form_box{
		width: 550px;
		.code input{
			text-align: center
		}
		.mobile .el-form-item__error{
			padding-left: 120px;
		}
		.el-form-item__content,.el-form-item{
			height: 32px;
			line-height: 32px;
		}
		.el-form-item__error{
			padding-top: 6px;
		}
	}
</style>
