<template>
  <div class="login_content login_team">
    <div class="login_header"><span>陶朱</span>平台</div>
      <CreatTenantBox ref="CreatTenantBox"></CreatTenantBox>
  </div>
</template>

<script>
  import { getCookie } from '@/common/authService'
  import CreatTenantBox from '@/components/tenant/createTenantBox/creatTenantBox'
  export default {
    name: 'team',
    components:{
      CreatTenantBox,
    },
    created: function() {
      const tenantid = getCookie('tenantid');
      console.log(tenantid)
      if(tenantid){
        this.$router.push({path: '/home'})
      }
    },
    mounted:function(){
      this.$refs.CreatTenantBox.dialogVisible = true;
      this.$refs.CreatTenantBox.modal = false;

    }
  };
</script>

<style lang="scss">
  .login_team{
    .el-dialog__wrapper{
     overflow: inherit;
    }
    .el-dialog__header{
      display: none;
    }
    .el-dialog{
      top: 20% !important;
      box-shadow: 0 0 5px #333;
      background: hsla(0,0%,100%,.3);
    }
    .creat_tenant_box .sec:first-child{
      border: none;
    }
    .creat_tenant_box .sec:nth-child(2){
        padding-top: 0;
    }
    .sec p{
      line-height: 30px!important;
      margin-bottom: 10px!important;
    }
    .now_btn:hover{
      color:#333
    }
    .border_bottom{
      border-bottom: 1px dashed #fff !important;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .blue-border{
      border:none !important;
      border-color: transparent !important;
      background-color: transparent !important;
    }
  }
</style>
