<template>
  <div class="table-box">
    <el-table :data="leaveTableList" style="width: 100%" border>
      <el-table-column type="index" label="编号"  width="80"></el-table-column>
      <el-table-column prop="createdstamp" label="提交日期" :formatter="dateFormat"></el-table-column>
      <el-table-column prop="personname" label="请假人"></el-table-column>
      <el-table-column prop="leavetype" label="请假类别" ></el-table-column>
      <el-table-column prop="status" label="状态"  :formatter="statusTxt"></el-table-column>
      <el-table-column prop="starttime" label="开始时间"></el-table-column>
      <el-table-column prop="endtime" label="结束时间" ></el-table-column>
      <el-table-column prop="checkusername" label="最终批准人"  ></el-table-column>
      <el-table-column prope="" label="操作" width="100">
        <template scope="scope">
          <el-button type="text" size="small" @click="viewDetail('view',leaveTableList[scope.$index])">
            <i class="iconfont icon-icon3"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <TablePagination  ref="tablePagination" v-show="totalListCount>10?true:false"></TablePagination>

    <LeaveDetailDialog ref="LeaveDetailDialog"></LeaveDetailDialog>

  </div>
</template>
<script>
  import TablePagination from './../module/pagination';
  import LeaveDetailDialog from './../module/leaveDayDialog';
  import { mapGetters } from 'vuex';
  import { leaveStatus } from  '@/common/untils';

  export default{
    data() {
      return {
        paginationIsShow:false
      };
    },
    computed: {
      ...mapGetters({
        userTenantId:'userTenantId',
        leaveTableList:'leaveTableList',
        totalListCount:'totalListCount',
        activeOrg:'activeOrg'
      }),

    },
    created() {
      var vm = this;
      vm.$store.dispatch('initHcmDataNeedByLeave');
    },
    mounted() {
      this.$nextTick(() => {
       // this.getLeaveList();
      })
    },
    methods: {
      statusTxt(row, column) {
        const code = row.status;
        return leaveStatus(code);
      },
      dateFormat(row) {
        //ie new Date()不认识日期中的'-'，但是认识'/'
        var date = row.createdstamp.replace(/-/g,"/");
        return new Date(date).format('yyyy-MM-dd');
      },
      viewDetail(btnType,perData) {
        this.$store.dispatch('startBtnClick');
        const pramBase = {
          btnType:btnType,
          sendData:{'userid':perData.userid}
        };
        this.$store.dispatch('getAddLeaveBaseInfo',pramBase);
        const pram = {
          btnType:btnType,
          sendData:{
            'tenantid':perData.tenantid,
            'leaveid':perData.leaveid,
            'orgid':this.activeOrg.orgid
          }
        }
        this.$store.dispatch('getLeaveDetail',pram);
        const transferData ={
          'tenantid':perData.tenantid,
          'leaveid':perData.leaveid
        }
        this.$store.dispatch('findApprovalList',transferData);
      }
    },
    components:{
      TablePagination,
      LeaveDetailDialog
    }
  };

</script>
<style lang="scss">

</style>
