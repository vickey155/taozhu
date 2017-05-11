<template>
  <!-- 通过邮箱号寻找密码 -->
  <div id="findPwByEmail">
    <p>
      <span class="email-icon"></span>
      我们已经向您的邮箱发送了一封确认修改密码的链接<br>请从邮件中点击链接完成密码修改！
    </p>
    <el-row type="flex" class="row-bg" justify="center">
      <el-button type="primary">请登录邮箱确认修改</el-button>
      <el-button type="primary" @click="sendEmailAgain" :disabled="emailCount != 0">{{emailCount == 0 ? '重新发送' : emailCount+'s后重新获取'}}</el-button>
    </el-row>
  </div>

</template>

<script>

  import { mapGetters }  from 'vuex';

  export default {
    props: ['loginName'],
    data: function(){
      return{
      }
    },
    computed: {
      ...mapGetters({
        emailCount: 'emailCount'
      }),
    },
    methods: {
      sendEmailAgain() {
        const sendData = {
          loginname: this.loginName
        }
        this.$store.dispatch('findPwByEmail',sendData);
      }
    }
  };
</script>

<style lang="scss">
  #findPwByEmail{
    font-size: 14px;
    p{
      text-align: center;
      font-weight: 700;
      max-width: 100%;
      line-height: 36px;
      color:#444;
    }
    .el-button--primary{
      padding: 10px 5px;
      min-width:140px;
      margin: 0 30px;
    }
    .el-row{
      margin-top:30px;
    }
  }
</style>
