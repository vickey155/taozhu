<template>
  <div class="join_tenant_box" v-show="teamListVisible">
    <div class="table-wrap">
      <table class="tenant-list-table" cellspacing="0" cellpadding="0" border="0" v-show="tableshow == true">
        <tr>
          <th width="12%">序号</th>
          <th width="45%">团队名称</th>
          <th width="23%">团队联系人</th>
          <th width="20%">操作</th>
        </tr>
        <tr v-for="(perData,$index) in tenantListDate ">
          <td>{{ $index+1 }}</td>
          <td>{{ perData.tenantname }}</td>
          <td>{{ perData.tenantinfo.contacts }}</td>
          <td>
            <button class="el-button" @click="joinTeam($index,tenantListDate)" v-if="perData.result === '2' && perData.createduserid != userInfo.userid">申请加入团队</button>
            <button class="el-button is-disabled" v-else="perData.result === '1' ||(perData.result === '2' && perData.createduserid == userInfo.userid)" >已申请加入</button>
          </td>
        </tr>
      </table>
    </div>
    <p class="tips" v-if="tableshow == true">提示：以上是与您搜索相类似的团队，您可以输入更接近的关键字!</p>
    <p class="tips" v-else-if="tableshow == false">提示：没有找到与您搜索相类似的团队，您可以选择 <el-button type="text" @click='createTenant'>创建团队</el-button></p>
  </div>
</template>

<script>

  import { mapGetters }  from 'vuex';
  import { Message } from 'element-ui';
  import tenantApi from '@/api/tenant';
  import userAip from '@/api/user'

  export default {
    name: 'joinTenantBox',
    props: ['tenantName'],
    data() {
      return {
        teamListVisible:false,
        searchNomeTip:"提示：以上是与您搜索相类似的团队，您可以输入更接近的关键字!",
        btnShow:'0',
        tableshow:true,
        tenantListDate:[]
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    methods: {
      showTenantList() {
        var vm = this;
        vm.tenantListDate = [];
        this.$store.dispatch('startBtnClick');
        tenantApi.getTenantList({'tenantname':vm.tenantName,"userid":vm.userInfo.userid}).then(response =>{
          if(response.data.flag == 'success'){
            if(response.data.datas.length == 0 ){
               this.tableshow = false;
               this.searchNomeTip = "";
            }
            else{
              this.tableshow = true;
              vm.tenantListDate = response.data.datas.slice(0,6);
            }
          }
          else{
            Message.error(response.data.msg);
          }
        });
      },
      joinTeam(ind,data) {
        var vm = this;
        this.$store.dispatch('startBtnClick');
        userAip.userJoinTenant({'tenantid':data[ind].tenantid,"userid":vm.userInfo.userid}).then(response =>{
          if(response.data.flag == 'success'){
            Message.success(response.data.msg);
            data[ind].result = '1';
          }
          else{
            Message.error(response.data.msg);
          }
        });
      },
      createTenant() {
          eventHub.$emit('createTenant');
      }
    }
  };
</script>

<style lang="scss">

  .join_tenant_box{
    margin-bottom: 20px;
    width:100%;
    @mixin tableElem {
      padding:5px;
      height: 25px;
      text-align: center;
      line-height: 20px;
      border-bottom: 1px solid #ccc;
      background-color: #fff;
      color:#333;
      font-weight: 600;
      .el-button{
        width:120px;
        color:#fff;
        line-height: 25px;
        background-color: #23b7e5;
        padding: 0 5px;
        font-weight: 700;
      }
      .is-disabled {
        color: #bfcbd9;
        cursor: not-allowed;
        background-image: none;
        color:#fff;
        background-color:#c0bebe;
        border-color: #d1dbe5;
      }

    }
    .table-wrap{
      width: 100%;
      max-height: 255px;
      overflow: hidden;
      overflow-y:auto;
    }
    .tenant-list-table{
      width: 100%;
      border:0;
      th{
        @include tableElem;
        line-height: 25px;
      }
      td{
        @include tableElem;
      }
    }
    .tips{
      color:#333;
      line-height: 40px;
      padding: 10px 0;
      background-color: rgba(75,156,255,.5);
      margin-top: 20px;
      .el-button{
        width: auto;
      }
    }

  }
</style>
