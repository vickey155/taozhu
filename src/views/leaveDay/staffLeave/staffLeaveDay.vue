<template>
  <div class="home_page_box">
    <div class="content_header"></div>
    <div class="right-wrapper-two">
      <!--{{activeOrg.orgid}}-->
      <div class="wrapper-left">
        <div class="big-tree-wrap">
          <el-tree :current-node-key="activeOrgId" :data="orgList" node-key="orgid" :props="defaultProps" @node-click="changeOrg"  default-expand-all :expand-on-click-node="false" highlight-current  ></el-tree>
        </div>c
      </div>

      <div class="right-cont">

        <div class="filter-wrapper">
          <FilterComponent ref="FilterComponent">
            <div slot="searchInput">
              <el-button type="text">请假人：</el-button>
              <el-input v-model="searchInputTxt" placeholder="请输入内容"></el-input>
              <el-button type="primary" @click="searchLeaveList">查 询</el-button>
            </div>
          </FilterComponent>
        </div>

        <div class="table-wrapper">
          <StaffLeaveDayTable></StaffLeaveDayTable>
        </div>

      </div>

    </div>
  </div>
</template>
<script>
  import StaffLeaveDayTable from './staffLeaveDayTable.vue';
  import FilterComponent from './../module/filterComponent';
  import { mapGetters } from 'vuex';

  export default{
    data() {
      return {
        searchInputTxt:'',
        defaultProps: {
          children: 'children',
          label: 'orgname'
        }
      };
    },
    computed: {
      ...mapGetters({
        leaveTypeArr:'leaveTypeArr',
        orgList: "orgList",
        activeOrg:'activeOrg'
      }),
      activeOrgId: function () {
        if (this.activeOrg) {
          return this.activeOrg.orgid
        }
      },
    },
    beforeDestroy: function(){
       // console.log(999);
      //eventHub.$off('clearLeaveTypeList');
      //eventHub.$off('treeTwoDataShow');
    },
    created() {
      if(this.orgList == null){
        this.$store.dispatch('getOrgList');
      }
    },
    mounted() {
      /*this.$nextTick(function(){
      })*/
    },
    methods: {
      changeOrg (data,node,vueCom) {
        this.$store.dispatch('startBtnClick');
        this.$store.dispatch('changeOrgByLeave',data);
      },
      searchLeaveList() {
        this.$store.dispatch('startBtnClick');
        this.$store.dispatch('searchLeaveTableList',this.searchInputTxt);
      }
    },
    components:{
      FilterComponent,
      StaffLeaveDayTable
    }
  };
</script>
<style lang="scss">

</style>
