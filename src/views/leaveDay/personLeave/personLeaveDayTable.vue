<template>
  <div class="table-box">
    <el-table :data="leaveTableList" style="width: 100%" border>
      <el-table-column type="index" label="编号"  width="50"></el-table-column>
      <el-table-column prop="createdstamp" label="请假日期" :formatter="dateFormat"></el-table-column>
      <el-table-column prop="leavetype" label="请假类别"></el-table-column>
      <el-table-column prop="status" label="状态"  width="80" :formatter="statusTxt"></el-table-column>
      <el-table-column prop="result" label="审批结果"  width="80" :formatter="resultTxt"></el-table-column>
      <el-table-column prop="starttime" label="开始时间"></el-table-column>
      <el-table-column prop="endtime" label="结束时间" ></el-table-column>
      <el-table-column prop="" label="最终批准人"  ></el-table-column>
      <el-table-column prope="" label="操作" width="150" align="left">
        <template scope="scope">
          <el-button type="text" size="small" @click="btnOptionFun('view',leaveTableList[scope.$index])">
            <i class="iconfont icon-icon3"></i>
          </el-button>
          <el-button type="text" size="small" v-show="btnStatus = (leaveTableList[scope.$index].status == '0' ? true :false)" @click="confirmSubmit(leaveTableList[scope.$index])">
            <i class="iconfont icon-queren"></i>
          </el-button>
          <el-button type="text" size="small" v-show="btnStatus = (leaveTableList[scope.$index].status == '0' ? true :false)" @click="btnOptionFun('edit',leaveTableList[scope.$index])">
            <i class="iconfont icon-bianji"></i>
          </el-button>
          <el-button type="text" size="small" v-show="btnStatus = (leaveTableList[scope.$index].status == '0' ? true :false)" @click="confirmDel(leaveTableList[scope.$index])">
            <i class="iconfont icon-shanchu"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <TablePagination  ref="tablePagination" v-show="totalListCount>10?true:false"></TablePagination>
  </div>
</template>
<script>
  import TablePagination from './../module/pagination';
  import {validateNumber} from '@/validate/index';
  import { mapGetters } from 'vuex';
  import { leaveStatus,resultStatus } from  '@/common/untils';

  export default{
    data() {
      return {
        leaveData:[],
        currentData:{},
        btnStatus:false,
        paginationIsShow:false
      };
    },
    computed: {
      ...mapGetters({
        userTenantId:'userTenantId',
        leaveTableList:'leaveTableList',
        totalListCount:'totalListCount',
        dialogDetailInfo:'dialogDetailInfo',
      }),
    },
    created() {
      var vm = this;
      vm.$store.dispatch('getLeaveTableList','personLeave');
    },
    methods: {
      statusTxt(row, column) {
        const code = row.status;
        return leaveStatus(code);
      },
      resultTxt(row, column){
        const code = row.result;
        return resultStatus(code);
      },
      dateFormat(row) {
        //ie new Date()不认识日期中的'-'，但是认识'/'
        var date = row.createdstamp.replace(/-/g,"/");
        return new Date(date).format('yyyy-MM-dd');
      },
      confirmSubmit(data) {
        this.$confirm('你确定要提交我的请假申请吗？', '提交我的请假申请', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.currentData = data;
          this.submitLeave();

        }).catch(() => {

        });
      },
      submitLeave() {
        const vm = this;
        this.$store.dispatch('startBtnClick');
        const sendData = {
          'tenantid':vm.userTenantId.tenantId,
          'leaveid':vm.currentData.leaveid
        };
        this.$store.dispatch('commitAskForLeave',sendData);
      },
      confirmDel(data) {
        this.$confirm('你确定要删除我的请假申请吗？', '删除我的请假申请', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.currentData = data;
          this.delLeave();
        }).catch(() => {

        });
      },
      delLeave() {
        const vm = this;
        this.$store.dispatch('startBtnClick');
        const sendData = {
          'tenantid':vm.userTenantId.tenantId,
          'leaveid':vm.currentData.leaveid,
          'userid':vm.userTenantId.userId
        };
        this.$store.dispatch('delAskForLeave',sendData);
      },
      btnOptionFun(btnType,perData) {
        const vm = this;
        this.$store.dispatch('startBtnClick');
        const pramBase = {
          btnType:btnType,
          sendData:{'userid':vm.userTenantId.userId}
        };
        this.$store.dispatch('getAddLeaveBaseInfo',pramBase);
        const pram = {
          btnType:btnType,
          sendData:{'tenantid':perData.tenantid,leaveid:perData.leaveid}
        };
       this.$store.dispatch('getLeaveDetail',pram);
      }
    },
    components:{
      TablePagination
    }
  };

</script>
<style lang="scss"  >

</style>
