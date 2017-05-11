<template>
  <div class="dialog-wrapper marginB">
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" @open="callBack">
      <el-form :model="leaveForm" ref="leaveForm" label-width="100px" :inline="true" class="demo-leaveForm">
        <el-row>
          <el-form-item label="工号：">
            <el-input v-model="existData.personno" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input v-model="existData.personname" :disabled="true"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="部门：">
            <el-input v-model="existData.orgname" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职务：">
            <el-input v-model="existData.postname" :disabled="true"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="类别：">
            <el-input v-model="existData.leavetype" :disabled="true"></el-input>
          </el-form-item>
          <!--<el-form-item label="年假余额" class="lastYearLeaveDay" v-if="leavePageType != 'staffLeave'">
            <el-input v-model="existData.lastyeardys" :disabled="true"></el-input>
          </el-form-item>-->
        </el-row>

        <el-row class="oneLine">
          <el-form-item label="请假事由：" prop="reason">
            <el-input type="textarea" v-model="existData.reason" :disabled="true"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="起始时间：" prop="starttime">
              <el-date-picker type="datetime" :disabled="true" placeholder="起始时间" v-model="existData.starttime"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="endtime">
            <el-date-picker type="datetime" :disabled="true" placeholder="结束时间" v-model="existData.endtime"></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="合计时间："  prop="summation">
            <el-input v-model="existData.summation" :disabled="true"></el-input>
          </el-form-item>
        </el-row>


        <div class="oneLine" v-show="isEditFlag">
          <el-row>
            <el-form-item label="审批意见：" prop="opinion">
              <el-input type="textarea" v-model="leaveForm.opinion"></el-input>
            </el-form-item>
          </el-row>
          <el-row type="flex" class="row-bg oneLine" justify="end">
            <el-button @click="approveResultChoose('Y')" :type="passedBtn">通过</el-button>
            <el-button @click="approveResultChoose('N')" :type="noPassedBtn">不通过</el-button>
          </el-row>
        </div>
        <el-row class="title_wrap">
          <label class="Title_blue">审批</label>
        </el-row>
        <el-row>
          <SelectTree ref="selectTree" :treeTitle="selectTreeGram.treeTitle" :initOrgId="selectTreeGram.initOrgId"></SelectTree>
        </el-row>
      </el-form>


      <div class="transformRecord">
        <h3>流转记录</h3>
        <el-table :data="transfRecordData" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="40"></el-table-column>
          <el-table-column prop="createdstamp" label="时间" width="100" :formatter="dateFormat"></el-table-column>
          <el-table-column prop="checkname" label="审批人" ></el-table-column>
          <el-table-column prop="opinion" label="审批意见" width="140" ></el-table-column>
          <el-table-column prop="result" label="审批结果" :formatter="statusTxt"></el-table-column>
        </el-table>
      </div>
      <el-row type="flex" class="row-bg oneLine" justify="end" v-show="isEditFlag">
        <el-button type="primary" @click="approveSubmit" >确定</el-button>
        <el-button type="" @click="cancelDialog">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import {validateNumber} from '@/validate/index';
  import { mapGetters } from 'vuex';
  import { Message } from 'element-ui';
  import { leaveStatus } from  '@/common/untils';
  import SelectTree from './selectTree.vue';
  import { getCookie } from '@/common/authService';

  export default{
    components:{
      SelectTree
    },
    data: function () {
      //合计时间天和小时都不能为0
      var vm = this;
      return {
        selectTreeGram:{
          treeTitle:'审批人：',
          initOrgId:null
        },
        passedBtn:'',
        noPassedBtn:"",
        dialogFormVisible:false,
        isEditFlag:false,
        aduitResult:'',
        dialogTitle:'',
        dialogtype:{},
        existData:{},
        leaveForm: {
          opinion:'',
          isPassed:'',
          checkuserid:""
        }
      };
    },
    computed: {
      ...mapGetters({
        userTenantId:'userTenantId',
        leaveTypeArr:'leaveTypeArr',
        dialogBaseInfo:'dialogBaseInfo',
        dialogInfo:'dialogInfo',
        dialogType:'dialogType',
        leavePageType:'leavePageType',
        transfRecordData:'transfRecordData',
        personList: 'personList',
        allPersonList:'allPersonList'
      }),
    },
    beforeDestroy: function(){
     //eventHub.$off('dialogShow');
    },
    created() {
      const vm = this;
      if(vm.personList == null){
        vm.$store.dispatch('getPersonList',{callBack:function (data) {
          vm.$store.dispatch('emitDialogShowEvent');
        }});
      }
      eventHub.$on('dialogHide',function(){
        if(vm.leavePageType == 'approveLeave' || vm.leavePageType == 'staffLeave'){
          vm.dialogFormVisible = false;
        }
      });
      eventHub.$on('dialogShowApprove',function(){
        const pageType = vm.leavePageType;
        if(vm.dialogInfo && vm.dialogBaseInfo && vm.allPersonList) {
          vm.dialogFormVisible = true;
        }
      });
      eventHub.$on('dialogShowStaff',function(){
        const pageType = vm.leavePageType;
        if(vm.dialogInfo && vm.dialogBaseInfo && vm.allPersonList) {
          vm.dialogFormVisible = true;
        }
      });
    },
    methods: {
      callBack(){
        this.aduitResult = '';
        this.passedBtn="";
        this.noPassedBtn="";
        this.decideByDialogType();
      },
      statusTxt(row,column){
        const code = row.result;
        if(code=='N'){
            return '不通过';
        }
        else if(code=='Y'){
          return '通过';
        }
      },
      dateFormat(row) {
        //ie new Date()不认识日期中的'-'，但是认识'/'
        //var date = row.createdstamp.replace(/-/g,"/");
        return new Date(row.createdstamp).format('yyyy-MM-dd');
      },
      showBaseInfo() {
        const data = this.dialogBaseInfo;
        const existData = this.existData;
        existData.personno = data.worknum;
        existData.personname = data.firstname;
        existData.orgname = data.orgname;
        existData.postname = data.postname;
      },
      showInputInfo() {
        const data = this.dialogInfo;
        const existData = this.existData;
        existData.leavetype = data.leavetype;
        existData.reason = data.reason;
        existData.starttime = new Date(data.starttime);
        existData.endtime =  new Date(data.endtime);
        existData.summation = data.summation;
      },
      resetForm() {
        if(this.$refs.leaveForm){
          this.$refs.leaveForm.resetFields();
        }
      },
      decideByDialogType() {
        const vm = this;
        const t = 1;
        if(vm.dialogType=='view'){
          vm.dialogTitle = "请假详情";
          vm.isEditFlag = false;
          this.showBaseInfo();
          this.showInputInfo();
          this.resetForm();
          setTimeout(function () {
            vm.$refs.selectTree.viewTreeSelect();
          },t);
        }
        else if(vm.dialogType =='approve'){
          vm.dialogTitle = "请假审批";
          vm.isEditFlag = true;
          this.resetForm();
          this.showBaseInfo();
          this.showInputInfo();
          setTimeout(function () {
            vm.$refs.selectTree.blankTreeSelect();
          },t);
        }
      },
      approveResultChoose(type) {
        const vm =this;
        this.aduitResult = type;
        const selectTree = vm.$refs.selectTree;
        selectTree.blankTreeSelect();
        if(type == 'Y'){
          this.passedBtn="primary";
          this.noPassedBtn="";
          selectTree.inputDisabledTree = false;
          selectTree.fontColor = true;
          selectTree.treeShow = false;
          selectTree.selectDisabled = false;
        }
        else if(type == 'N'){
          this.passedBtn="";
          this.noPassedBtn="primary";
          selectTree.inputDisabledTree = true;
          selectTree.fontColor = true;
          selectTree.treeShow = false;
          selectTree.selectDisabled = true;
        }
      },
      approveSubmit() {
        const vm = this;
        this.$store.dispatch('startBtnClick');
        if(this.aduitResult == ''){
          Message.error('没有选择审批是否通过！');
          return false;
        }
        else{
          const checkuserid = vm.$refs.selectTree.comeFromDefaultSelectedVal;
          const dialogInfo = this.dialogInfo;
          const sendData={
            'tenantid':dialogInfo.tenantid,
            'leaveid':dialogInfo.leaveid,
            'createduserid':getCookie('userid'),
            'nextuserid':checkuserid,
            'result':this.aduitResult,
            'opinion':this.leaveForm.opinion
          }
          this.$store.dispatch('approvalAskForLeave',sendData);
        }

      },
      cancelDialog() {
        this.dialogFormVisible = false;
      }
    }

  };
</script>
<style lang="scss">
</style>
