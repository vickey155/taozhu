<template>
  <div class="table-box">
    <el-table :data="leaveTableList" style="width: 100%" border>
      <el-table-column type="index" label="编号"  width="50"></el-table-column>
      <el-table-column prop="createdstamp" label="提交日期" :formatter="dateFormat"></el-table-column>
      <el-table-column prop="personname" label="请假人"></el-table-column>
      <el-table-column prop="leavetype" label="请假类别"></el-table-column>
      <el-table-column prop="status" label="状态"  width="80" :formatter="statusTxt"></el-table-column>
      <el-table-column prop="starttime" label="开始时间"></el-table-column>
      <el-table-column prop="endtime" label="结束时间" ></el-table-column>
      <el-table-column prop="checkusername" label="最终批准人"></el-table-column>
      <el-table-column prope="" label="操作" width="120">
        <template scope="scope">
          <!--<el-button type="text" size="small" @click="viewDetail(leaveTableList[scope.$index],'view')">
            <i class="iconfont icon-icon3"></i>
          </el-button>-->
          <el-button type="text" size="small"  @click="viewDetail(leaveTableList[scope.$index],'approve')" v-show="btnStatus = ( (leaveTableList[scope.$index].status == '1' ) ? true :false)">
            <i class="iconfont icon-shenpi"></i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="summation" label="快速审批" width="120">
        <template scope="scope">
          <el-button type="text" size="small" @click="aduitPass(leaveTableList[scope.$index],'Y')"  v-show="btnStatus = ( (leaveTableList[scope.$index].status == '1') ? true :false)">批准</el-button>
          <el-button type="text" size="small" @click="aduitNoPass(leaveTableList[scope.$index],'N')"  v-show="btnStatus = ( (leaveTableList[scope.$index].status == '1')  ? true :false)">不批准</el-button>
        </template>
      </el-table-column>
    </el-table>

    <TablePagination  ref="tablePagination" v-show="totalListCount>10?true:false"></TablePagination>

    <LeaveDetailDialog ref="LeaveDetailDialog"></LeaveDetailDialog>
   <!-- <el-radio-group v-model="leavetype" >
      <el-radio label="线上品牌商赞助"></el-radio>
      <el-radio label="线下场地免费"></el-radio>
    </el-radio-group>-->
  </div>
</template>
<script>
  import TablePagination from './../module/pagination';
  import LeaveDetailDialog from './../module/leaveDayDialog';
  import { mapGetters } from 'vuex';
  import { leaveStatus } from  '@/common/untils';
  import { getCookie } from '@/common/authService';

  export default{
    data() {
      return {
        paginationIsShow:false,
        btnStatus:false,
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
    mounted() {
      this.$nextTick(() => {
        this.$store.dispatch('getLeaveTableList','approveLeave');
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
      viewDetail(perData,btnType) {
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
            'leaveid':perData.leaveid
          }
        }
        this.$store.dispatch('getLeaveDetail',pram);
        const transferData ={
          'tenantid':perData.tenantid,
          'leaveid':perData.leaveid
        }
        this.$store.dispatch('findApprovalList',transferData);
      },
      aduitPass(perData,result) {
        this.$confirm('是否通过该请假申请吗？', '审批请假申请', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isApproveFun(perData,result);
        }).catch(() => {

        });
      },
      aduitNoPass(perData,result) {
        this.$confirm('是否不通过该请假申请吗？', '审批请假申请', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isApproveFun(perData,result);
        }).catch(() => {

        });
      },
      isApproveFun(perData,result){
        this.$store.dispatch('startBtnClick');
        const sendData={
            'tenantid':perData.tenantid,
            'leaveid':perData.leaveid,
            'createduserid':getCookie('userid'),
            'nextuserid':'',
            'result':result
          }
        this.$store.dispatch('approvalAskForLeave',sendData);
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
