<template>
  <div class="dialog-wrapper person-dialog">
    <el-dialog :title="dialogTitle" v-model="dialogPersonVisible" @open="callBack">
      <el-form :model="leaveForm" :rules="rules" ref="leaveForm" label-width="100px" :inline="true">
        <div class="input-txt-wrap">
          <el-form-item label="工号：">
            <el-input v-model="existData.personno" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input v-model="existData.personname" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="部门：">
            <el-input v-model="existData.orgname" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职务：">
            <el-input v-model="existData.postname" :disabled="true"></el-input>
          </el-form-item>
        </div>
        <div class="oneLine">
          <el-form-item label="类别：" prop="leavetype" class="margin-error">
            <el-radio-group v-model="leaveForm.leavetype" >
              <el-radio v-for="(item,$index) in leaveTypeArr" :key="item" :label="item" :name="item" :disabled="inputDisabled"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row>
            <el-form-item label="请假事由：" prop="reason">
              <el-input type="textarea" v-model="leaveForm.reason" :disabled="inputDisabled"></el-input>
            </el-form-item>
          </el-row>
        </div>

        <el-form-item label="起始时间：" prop="starttime">
            <el-date-picker type="datetime" placeholder="起始时间" v-model="leaveForm.starttime" :disabled="inputDisabled"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endtime">
          <el-date-picker type="datetime" placeholder="结束时间" v-model="leaveForm.endtime" :disabled="inputDisabled"></el-date-picker>
        </el-form-item>
        <div class="input-s-wrapper" :class="{errHide:isErrHide}">
          <el-form-item label="合计时间："  prop="sumDay">
            <el-input v-model="leaveForm.sumDay" placeholder="天" :disabled="inputDisabled"></el-input>
            <label>天</label>
          </el-form-item>
            <el-form-item  prop="sumHour">
            <el-input v-model="leaveForm.sumHour" placeholder="小时" :disabled="inputDisabled"></el-input>
            <label>小时</label>
          </el-form-item>
          <div class="sumTime-err" v-show="isErrHide">天数和小时都不能为0</div>
        </div>
        <el-row class="title_wrap">
          <label class="Title_blue">审批</label>
        </el-row>
        <el-row>
          <SelectTree ref="selectTree" :treeTitle="selectTreeGram.treeTitle" :initOrgId="selectTreeGram.initOrgId"></SelectTree>
        </el-row>
        <el-row type="flex" class="row-bg oneLine btn-wrap" justify="end" v-show="!inputDisabled">
          <el-button type="primary" @click="addLeaveSubmit" >提交</el-button>
          <el-button @click="addLeaveSave" >保存</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>

  import {validateNumber} from '@/validate/index';
  import { mapGetters } from 'vuex';
  import { getNumberByTime } from '@/common/untils';
  import SelectTree from './../module/selectTree';

  export default{
    components:{
      SelectTree
    },
    data: function () {
      //合计时间天和小时都不能为0
      var vm = this;
      const validateSumTime = (rules,value,callback) => {
          const leaveD = vm.leaveForm;
          if(leaveD.sumDay == '0' && leaveD.sumHour == '0'){
            callback(new Error(' '));
            vm.isErrHide = true;
          }
          else{
            vm.isErrHide = false;
            callback();
          }
      };
      return {
        selectTreeGram:{
          treeTitle:'审批人：',
          initOrgId:null
        },
        isErrHide:false,
        dialogTitle:'',
        dialogPersonVisible:false,
        existData:{},
        inputDisabled:false,
        leaveForm: {
          leavetype:"",
          reason: "",
          starttime: "",
          endtime: "",
          sumDay:"",
          sumHour: "",
          checkuserid:""
        },
        rules: {
          leavetype: [
            { required: true, message: '请选择请假类型', trigger: 'change' }
          ],
          reason: [
            { required: true, message: '请填写请假事由', trigger: 'blur' }
          ],
          starttime: [
            { type: 'date', required: true, message: '请选择起始时间', trigger: 'change' }
          ],
          endtime: [
            { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
          ],
          sumDay: [
            { required: true, message: '请填写天数', trigger: 'blur' },
            { validator:validateNumber,trigger:'blur'},
            { validator:validateSumTime,trigger:'blur'}
          ],
          sumHour: [
            { required: true, message: '请填写小时', trigger: 'blur' },
            { validator:validateNumber,trigger:'blur'},
            { validator:validateSumTime,trigger:'blur'}
          ],
          checkuserid: [
            { required: true, message: '请选择审批人', trigger: 'change' }
          ]
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
        orgList:'orgList',
        personList:"personList",
        allPersonList:'allPersonList',
      }),
    },
    created() {
      var vm = this;
      if(vm.personList == null){
        vm.$store.dispatch('getPersonList',{callBack:function (data) {
          vm.$store.dispatch('emitDialogShowEvent');
        }});
      }
      eventHub.$on('dialogHide',function(){
        if(vm.leavePageType == 'personLeave') {
            vm.dialogPersonVisible = false;
        }
      });
      eventHub.$on('dialogShowPerson',function(){
        const dialogType = vm.dialogType;
        if(dialogType == 'add'){
          if(vm.dialogBaseInfo) {
            vm.dialogPersonVisible = true;
          }
        }
        else{
          if(vm.dialogInfo && vm.dialogBaseInfo && vm.allPersonList) {
            vm.dialogPersonVisible = true;
          }
        }
      });

    },
    methods: {
      callBack(){
          this.decideByDialogType();
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
        const leaveForm = this.leaveForm;
        leaveForm.leavetype = data.leavetype;
        leaveForm.reason = data.reason;
        leaveForm.starttime = new Date(data.starttime);
        leaveForm.endtime =  new Date(data.endtime);
        leaveForm.sumDay = getNumberByTime(data.summation,'day');
        leaveForm.sumHour = getNumberByTime(data.summation,'hour');
      },
      resetForm() {
        if(this.$refs.leaveForm){
          this.$refs.leaveForm.resetFields();
        }
      },
      decideByDialogType() {
        const vm = this;
        const t = 1;
        if(vm.dialogType=='add'){
          vm.dialogTitle = "我要请假";
          vm.inputDisabled = false;
          vm.showBaseInfo();
          vm.resetForm();
          const leaveForm = this.leaveForm;
          leaveForm.leavetype = '';
          leaveForm.reason = '';
          leaveForm.starttime = '';
          leaveForm.endtime =  '';
          leaveForm.sumDay = '';
          leaveForm.sumHour = '';
          setTimeout(function () {
            vm.$refs.selectTree.blankTreeSelect();
          },t);

        }
        else if(vm.dialogType =='edit'){
          vm.inputDisabled = false;
          vm.dialogTitle = "编辑我的请假";
          vm.resetForm();
          vm.showBaseInfo();
          vm.showInputInfo();
          setTimeout(function () {
            vm.$refs.selectTree.editTreeSelect();
          },t);
        }
        else if(vm.dialogType =='view'){
          vm.inputDisabled = true;
          vm.dialogTitle = "查看我的请假";
          vm.resetForm();
          vm.showBaseInfo();
          vm.showInputInfo();
          setTimeout(function () {
            vm.$refs.selectTree.viewTreeSelect();
          },t);
        }
      },
      addLeaveSave() {
        const vm = this;
        this.$store.dispatch('startBtnClick');
        const leaveForm = vm.leaveForm;
        leaveForm.checkuserid = vm.$refs.selectTree.comeFromDefaultSelectedVal;
        const sendData = {
          'reason':leaveForm.reason,
          'leavetype':leaveForm.leavetype,
          'starttime':leaveForm.starttime,
          'endtime':leaveForm.endtime,
          'summation':leaveForm.sumDay + '天'+ leaveForm.sumHour+'小时',
          'checkuserid':leaveForm.checkuserid,
        };
        vm.$refs.leaveForm.validate((valid) => {
          if (valid) {
            if(vm.dialogType == 'edit'){
              sendData.leaveid = vm.dialogInfo.leaveid;
              sendData.tenantid = vm.dialogInfo.tenantid;
              this.$store.dispatch('editAskForLeave',sendData);
            }
            else if(vm.dialogType == 'add'){
              sendData.userid = vm.userTenantId.userId;
              sendData.tenantid = vm.userTenantId.tenantId;
              this.$store.dispatch('saveAskForLeave',sendData);
            }
          }
          else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      addLeaveSubmit() {
        const vm = this;
        this.$store.dispatch('startBtnClick');
        const leaveForm = vm.leaveForm;
        leaveForm.checkuserid = vm.$refs.selectTree.comeFromDefaultSelectedVal;
        const sendData = {
          'reason':leaveForm.reason,
          'leavetype':leaveForm.leavetype,
          'starttime':leaveForm.starttime,
          'endtime':leaveForm.endtime,
          'summation':leaveForm.sumDay + '天'+ leaveForm.sumHour+'小时',
          'checkuserid':leaveForm.checkuserid
        };
        vm.$refs.leaveForm.validate((valid) => {
          if (valid) {
            if(vm.dialogType == 'edit'){
              sendData.leaveid = vm.dialogInfo.leaveid;
              sendData.tenantid = vm.dialogInfo.tenantid;
              this.$store.dispatch('commitAskForLeave',sendData);
            }
            else if(vm.dialogType == 'add') {
              sendData.userid = vm.userTenantId.userId;
              sendData.tenantid = vm.userTenantId.tenantId;
              this.$store.dispatch('commitAskForLeave',sendData);
            }
          }
          else {
            console.log('error submit!!');
            return false;
          }
        })
      }
    },
  };
</script>
<style lang="scss">

</style>
