<template>
  <div>
    <div class="content_header">个人资料</div>
    <el-row :gutter="20" class="personal_information" style="margin-left: 0;margin-right: 0">
      <el-col :span="16">
        <el-card class="user_info">
          <el-form ref="userInfo"  label-width="80px">
            <el-form-item label="姓名:" prop='username'>
              <div class="el-input"><input ref="username" :value="userInfo.username"  @blur="changeUserName($event.target.value)" class="el-input__inner"></input></div>
            </el-form-item>
            <el-form-item label="账号:">
              <span>{{userInfo.loginname}}</span>
            </el-form-item>
            <el-form-item label="邮箱:">
              <span class="left_text">
                {{userInfo.email}}
              </span>
              <span class="change_btn" @click='$refs.changeEmail.boxEmail = true'>{{userInfo.email==''?'绑定邮箱':'(已绑定)更换邮箱地址'}}</span>
            </el-form-item>
            <el-form-item label="手机:">
              <span class="left_text">
                {{userInfo.mobile}}
              </span>
              <span class="change_btn" @click='$refs.changeMobile.boxMobile = true'>{{userInfo.mobile==''?'绑定手机':'(已绑定)更换手机号码'}}</span>
            </el-form-item>
            <el-form-item label="密码:">
              <span class="left_text">*******</span>
               <el-button type="info" @click='$refs.changePassword.boxPassword = true'>修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="explain">
          <div slot="header" class="clearfix">
            其他说明
          </div>
          <ul>
            <li v-for="item in explain">{{item.text}}</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>

    <!-- 绑定手机号弹窗 -->
    <changeMobile ref='changeMobile'></changeMobile>
    <!-- 修改密码 -->
    <changePassword ref='changePassword'></changePassword>
    <!--修改邮箱-->
    <changeEmail ref="changeEmail"></changeEmail>
  </div>
</template>

<script>
  import { mapGetters }       from 'vuex';
  import { validateUserName } from './../../validate/index'
  import { filterGeneral }    from './../../filters/index'

  //组件引入
  import changeMobile    from '@/components/user/changeMobile'
  import changePassword  from '@/components/user/changePassword'
  import changeEmail  from '@/components/user/changeEmail'
  export default {
    name: 'PersonalInformation',
    data: function () {
      return {
        explain: [
        {"text": '1.助理：代表可以查看本人下属的工作内容'},
        {"text": '2.权限开放：代表可以把自己的所有工作内容开放给其他同事查阅'},
        {"text": '3.其他上级：同上级'},
        ],
      }
    },
    components:{
      changeMobile,changePassword,changeEmail
    },
    filters: {
      "filterGeneral": filterGeneral
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      }),
    },
    methods: {
      changeUserName: function(newUserName){
        const vm = this;
        const oldUserName = vm.$store.state.auth.username;
        if(newUserName == oldUserName){
          return false;
        }
        validateUserName('',newUserName,function(result){
          if(typeof result == "object"){//验证不通过 提示信息 并重新赋值vuex的状态
            vm.$message({
              showClose: true,
              message: result.message,
              type: 'error'
            });
            vm.$refs.username.value = oldUserName;
          }else{//验证通过 调用修改接口
            vm.$store.dispatch('updateUserName',{username:newUserName,successMsg: '修改用户名成功'});
          }
        })
//        vm.$store.dispatch('updateUserName',{username:newUserName,successMsg: '修改用户名成功'});
      },
    },
    created: function(){
      if(this.userInfo.loginname === null){ //检查是否有用户数据，如果没有则请求用户详情
        this.$store.dispatch('getUserInfo');
      }
    },
  };
</script>

<style lang="scss">
  .content_header{
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    background: #fafafa;
    border-bottom: 1px solid #d5d5d5;
    box-shadow: 2px 2px 3px #ddd;

  }


  .personal_information{
    padding: 0 20px;
    margin-top: 20px;
  }


  .user_info{
    .el-card__body{
      padding: 0;
    }
    .el-form-item{
      margin-bottom: 0;
      padding: 8px 0;
      cursor: pointer;
      border-bottom: 1px solid #eee;
      .el-form-item__content{
        height: 36px;
      }
      input{
        width: 240px;
        border-color: #fff !important;
        background:  #fff !important;
        color: #333 !important;
      }
      .is-disabled .el-input__inner{
        border-color: #f5f5f5 !important;
      }
      &:hover{
        input{

        }
        .is-disabled .el-input__inner{
          border-color: #f5f5f5 !important;
          background:  #f5f5f5 !important;
        }
        background: #f5f5f5;
      }
    }
    .user_info_general{
      .radio_label{
        cursor: pointer;
        margin-right: 10px;
      }
      input{
        width: auto;
        margin-right: 5px;
      }
    }
    .left_text{
      display: inline-block;
      width:240px;
    }
    .change_btn{
      color: #58B7FF;
    }
  }


  .explain{
    min-height: 400px;
    font-size: 14px;
    li{
      line-height: 22px;
      margin-bottom: 10px;
    }
  }


</style>
