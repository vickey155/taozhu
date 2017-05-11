<template>
  <div :class="divDialogType">
    <el-form-item class="modal_tree_input_leave" :label="treeTitle" prop="checkuserid">
      <div @click="showTrees"  :class="['modal_input',{is_disabled:inputDisabledTree}]">
        <i class="el-input__icon el-icon-caret-top"></i>
        <span :class="{lightFont: fontColor}">{{activeOrgName}}</span>
      </div>
      <el-tree v-show="treeShow"  node-key="orgid" :current-node-key="activeOrgId" @node-click="changeOrg" :data="orgList" :props="defaultProps"  default-expand-all  highlight-current :expand-on-click-node="false"></el-tree>
    </el-form-item>
    <el-form-item>
      <el-select v-model="comeFromDefaultSelectedVal" placeholder="请选择" :disabled="selectDisabled"  :placeholder="selectDefaultName" @change="getSelectLabel">
        <el-option v-for="item in selectPersonList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import { getCookie } from '@/common/authService';

  export default {
    name: 'selectTree',
    data: function(){
      return {
        divDialogTypeNum:0,
        inputDisabledTree:false,
        fontColor:true,
        treeShow: false,
        defaultProps: {
          children: 'children',
          label: 'orgname'
        },
        selectDefaultName:'请选择审批人',
        selectDisabled:false,
        comeFromDefaultSelectedVal:'',
        personNames:null,
        initPersonSelect:false,
        activeApproverInfo:{
          actOrgName:'请选择部门',
          actOrgId:null,
          selectedVal:'',
          personName:'',
        }
      }
    },
    props: [
      "initOrgId",
      'treeTitle'
    ],
    computed: {
      ...mapGetters({
        odlOrgList:'odlOrgList',
        orgList: 'orgList',
        personList: 'personList',
        allPersonList:'allPersonList',
        leavePageType:'leavePageType',
        dialogInfo:'dialogInfo',
        dialogType:"dialogType",
      }),
      divDialogType:function(){
         const vm =this;
         const dialogType = vm.dialogType;
         if(dialogType == 'add'){
           vm.blankTreeSelect();
         }
        else if(dialogType == 'approve'){
          vm.blankTreeSelect();
        }
         return dialogType;
      },
      activeOrgName:function(){
        const vm = this;
        return vm.activeApproverInfo.actOrgName;
      },
      activeOrgId: function(){
        const vm = this;
        if(vm.activeApproverInfo.actOrgId && vm.orgList){
          var activeOrg = vm.odlOrgList.filter(function(item,index,arr){
            return (item.orgid == vm.activeApproverInfo.actOrgId)
          });

          if(activeOrg[0]){
            vm.activeApproverInfo.actOrgName = activeOrg[0].orgname;
            vm.fontColor = false;
          }
          else{
            vm.activeApproverInfo.actOrgName = '请选择部门';
            vm.fontColor = true;
          }
          return vm.activeApproverInfo.actOrgId;
        }
        else {
          vm.activeApproverInfo.actOrgName = '请选择部门';
          return this.orgList?this.orgList[0].orgid:'';
        }
      },
      allNewPersonList: function() {
        const vm = this;
        if (!this.allPersonList) return false;
        let newPersonList = vm.allPersonList.filter(function (item, index, arr) {
          return vm.getFitPersonFilter(item);
        });
        return newPersonList

      },
      newPersonList: function(){
        const vm = this;
        if(!this.personList) return false;
        if(vm.activeApproverInfo.actOrgId){
          let newPersonList = vm.personList.filter(function(item,index,arr){
            return vm.getFitPersonFilter(item,vm.activeApproverInfo.actOrgId);
          });
          return newPersonList
        }
        else{
          return [];
        }
      },
      selectPersonList: function() {
        const vm = this;
        var arr = new Array();
        const personArr = vm.newPersonList;
        const selectVal =vm.activeApproverInfo.selectedVal;
        if (personArr.length == 0) {
          vm.selectDefaultName = '没有审批人';
          vm.comeFromDefaultSelectedVal = selectVal;
          if(vm.initPersonSelect){
            vm.selectDisabled = false;
          }
          else{
            vm.selectDisabled = true;
          }
          return [];
        }
        else {
          for (var i = 0; i < personArr.length; i++) {
            const per = personArr[i];
            var option = {label: per.firstname, value: per.userid};
            arr.push(option);
          }
          vm.selectDefaultName = '请选择审批人';
          if(vm.dialogType == 'view'){
            vm.selectDisabled = true;
          }
          else{
            vm.selectDisabled = false;
          }
          return arr;
        }
      }
    },
    methods: {
      showTrees() {
        if(!this.inputDisabledTree){
          this.treeShow = !this.treeShow
        }
      },
      changeOrg(data,node,vueCom) {
        const vm = this;
        vm.fontColor = false;
        vm.activeApproverInfo.actOrgId = data.orgid;
        vm.treeShow = false;
        vm.activeApproverInfo.selectedVal = '';
        vm.initPersonSelect = false;
      },
      getFitPersonFilter(item,origId){
        const vm = this;
        const selfUserid = getCookie('userid');
        const leavePageType = vm.leavePageType;
        var filter = null;
        if(leavePageType == 'staffLeave'){
          if(origId){
            return ((item.orgid == vm.activeApproverInfo.actOrgId) && vm.isExixtNotNull(item.userid) && vm.isExixtNotNull(item.personid));
          }
          else{
            return (vm.isExixtNotNull(item.userid) && vm.isExixtNotNull(item.personid));
          }
        }
        else{
          if(origId){
            return ((item.userid !== selfUserid) && (item.orgid == vm.activeApproverInfo.actOrgId) && vm.isExixtNotNull(item.userid) && vm.isExixtNotNull(item.personid));
          }
          else{
            return ((item.userid !== selfUserid) && vm.isExixtNotNull(item.userid) && vm.isExixtNotNull(item.personid));
          }
        }


      },
      getSelectLabel(value){
        const vm = this;
        vm.comeFromDefaultSelectedVal = value;
        vm.activeApproverInfo.selectedVal = value;
      },
      isExixtNotNull(value) {
         if(value != '' && value != null && value != undefined){
             return true;
         }
         else {
            return false;
         }
      },
      getActiveApproveInfo(){
        const vm =this;
        const approverUserid = vm.dialogInfo.checkuserid;
        let currentApprover = vm.allNewPersonList?vm.allNewPersonList.filter(function(item,index,arr){
          return (item.userid == approverUserid)
        }):'console.log("allNewPersonList is not exist")';
        if(currentApprover[0]){
          vm.activeApproverInfo.actOrgId = currentApprover[0].orgid;
          vm.activeApproverInfo.personName = currentApprover[0].firstname;
          vm.comeFromDefaultSelectedVal = approverUserid;
          vm.activeApproverInfo.selectedVal = approverUserid;
        }
        else{
          console.log("not find the checkuserid in allPersonlist");
        }
      },
      blankTreeSelect(){
        const vm = this;
        vm.inputDisabledTree = false;
        vm.fontColor = true;
        vm.treeShow = false;
        vm.selectDisabled = false;
        vm.initPersonSelect = true;
        vm.activeApproverInfo.selectedVal ='';
        vm.activeApproverInfo.personName ='';
        vm.activeApproverInfo.actOrgId = null;
        vm.activeApproverInfo.actOrgName ='请选择部门';
        //console.log("approverInfo should be null,it's ok");
      },
      editTreeSelect(){
        const vm = this;
        vm.inputDisabledTree = false;
        vm.fontColor = false;
        vm.treeShow = false;
        vm.selectDisabled = false;
        vm.getActiveApproveInfo();
      },
      viewTreeSelect(){
        const vm = this;
        vm.inputDisabledTree = true;
        vm.fontColor = false;
        vm.treeShow = false;
        vm.selectDisabled = true;
        vm.getActiveApproveInfo();

      },
    },

    created() {
      var vm = this;
      if(vm.orgList == null){
        vm.$store.dispatch('getOrgList');
      }
      /*
      if(vm.personList == null){
        vm.$store.dispatch('getPersonList',{callBack:function (data) {
            console.log(0);
          vm.$store.dispatch('emitDialogShowEvent');
        }});
      }*/
      eventHub.$on('CHANGE_ACTIVE_ORG',()=> {
        vm.activeApproverInfo.actOrgId= null;
      });

    }
  };
</script>
<style lang="scss">
  .modal_tree_input_leave{
    .modal_input{
      width: 100%;
      height: 100%;
      border: 1px solid #bfcbd9;
      border-radius: 3px;
      padding: 0 10px ;
      line-height: 2em;
      color:#1f2d3d;
      .el-icon-caret-top{
        color: #bfcbd9;
        font-size: 12px;
        transition: transform .3s;
        transform: translateY(-50%) rotate(180deg);
        line-height: 16px;
        top: 50%;
        cursor: pointer;
      }
      .lightFont{
        color:#97a8be;
      }
    }
    .is_disabled{
      background-color: #f9f9f9;
      color: #48576a;
      cursor: not-allowed;
    }
    .el-tree{
      position: absolute;
      width: 100%;
      top: 30px;
      z-index: 3;
      height: auto;
      max-height:180px;
      overflow: auto;
      .el-tree__empty-block{

      }
    }
    .el-form-item__content{
    }
  }
</style>
