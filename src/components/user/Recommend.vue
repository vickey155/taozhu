<template>
  <div>
    <el-dialog class="user_recommend" title="推荐拿福利" v-model="dialogVisible" size="tiny">
      <h4>您可以通过以下方式分享邀请码给您的好友入驻"陶朱平台"</h4>
      <h5>您的邀请码:<span id="code">{{userInfo.invitationcode}}</span></h5>
      <el-button type="primary" class="copyCodeBtn" data-clipboard-target="#code">复制邀请码</el-button>
      <p>{{totalcount}}个用户通过您的邀请加入了陶朱平台。晒一晒?</p>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'recommend',
    data: function() {
      return {
        dialogVisible: false,
        totalcount: 0
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo',
      }),
    },
    watch:{
      dialogVisible: function () {
        if(this.dialogVisible  == true){
          this.$store.dispatch('getInvitedcodeTotalCount')
        }
      }
    },
    created: function (){
      var vm = this;
      eventHub.$on('SUCCESS_GET_INVITED_CODE_COUNT',function(totalcount){
        console.log(totalcount)
        vm.totalcount = totalcount
      });
    },
    mounted: function(){
      var vm = this;
      var clipboard = new Clipboard('.copyCodeBtn');
      clipboard.on('success', function(e) {
        vm.$message.success('复制成功');
        e.clearSelection();
      });
    }
  };
</script>

<style lang="scss">
.user_recommend{
  .el-dialog{
    width: 600px;
  }
  text-align: center;
  .el-dialog__header{
    text-align: left;
    background: #3399ff;
  }
  .el-dialog__title,.el-dialog__close{
    color: #fff;
  }
  h4{
    margin-bottom: 30px;
  }
  .el-button{
    margin: 10px 0;
  }
  P{
    margin-top: 20px;
  }
}
</style>
