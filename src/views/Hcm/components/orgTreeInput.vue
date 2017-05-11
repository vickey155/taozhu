<template>
  <el-form-item class="modal_tree_input" label="部门:" prop="orgid">
    <div class="modal_input" @click="treeShow = !treeShow">{{activeOrgName}}</div>
    <el-tree v-if="treeShow"  node-key="orgid" :current-node-key="activeOrgId" @node-click="changeOrg" :data="orgList" :props="defaultProps"  default-expand-all :expand-on-click-node="false" highlight-current></el-tree>
  </el-form-item>
</template>
<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'personneAddBox',
    data: function(){
      return {
        treeShow: false,
        defaultProps: {
          children: 'children',
          label: 'orgname'
        },
        initOrgIdEnd: '',
        activeOrgName: ''
      }
    },
    props: [
      "initOrgId"
    ],
    computed: {
      ...mapGetters({
        orgList: 'orgList',
        odlOrgList: 'odlOrgList'
      }),

      activeOrgId: function(){
        var vm = this;
        if(this.initOrgIdEnd){
          let activeOrg = this.odlOrgList.filter(function(item,index,arr){
            return (item.orgid == vm.initOrgIdEnd)
          })
          this.activeOrgName = activeOrg[0].orgname
        }else{
          this.activeOrgName = this.orgList?this.orgList[0].orgname:'';
        }
        return this.initOrgIdEnd?this.initOrgIdEnd:this.orgList?this.orgList[0].orgid:'';
      },
    },
    methods: {
      changeOrg: function(data,node,vueCom){
        var vm = this;
        this.initOrgIdEnd = data.orgid;
        this.activeOrgName = data.orgname
        eventHub.$emit("CHOOSE_INPUT_TREEPATH",vm.activeOrgId);
        eventHub.$emit("CHOOSE_INPUT_ORG",data.orgid);
        this.treeShow = false;
      }
    },
    created: function(){
      var vm = this;
      this.initOrgIdEnd = this.initOrgId;
      eventHub.$emit("CHOOSE_INPUT_TREEPATH",vm.activeOrgId);
      eventHub.$emit("CHOOSE_INPUT_ORG",vm.activeOrgId);
    }
  };
</script>
<style lang="scss">
  .modal_tree_input{
    .modal_input{
      overflow: hidden;
      word-break:break-all;
      width: 100%;
      height: 100%;
      border: 1px solid #bfcbd9;
      border-radius: 3px;
      padding: 0 10px ;
      line-height: 2em;
    }
    .el-tree{
      position: absolute;
      width: 100%;
      top: 30px;
      z-index: 3;
      max-height: 200px;
      overflow: auto;
    }
  }
</style>
