<template>
  <div class="home_page_box">
    <div class="content_header"></div>
    <div class="right-wrapper-box">
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
        <LeaderLeaveDayTable></LeaderLeaveDayTable>
      </div>

    </div>
  </div>

</template>
<script>
  import LeaderLeaveDayTable from './LeaderLeaveDayTable';
  import FilterComponent from './../module/filterComponent';
  import { mapGetters } from 'vuex';

  export default{
    data() {
      return {
        searchInputTxt:''
      };
    },
    computed: {
      ...mapGetters({
        leaveTypeArr:'leaveTypeArr',
        approverInfo:'approverInfo'
      }),

    },
    beforeDestroy: function(){
      //eventHub.$off('dialogHide');
    },
    created() {

    },
    mounted() {
      /*this.$nextTick(function(){
       })*/
    },
    methods: {
      searchLeaveList() {
        this.$store.dispatch('startBtnClick');
        this.$store.dispatch('searchLeaveTableList',this.searchInputTxt);
      }
    },
    components:{
      FilterComponent,
      LeaderLeaveDayTable
    }
  };
</script>
<style lang="scss">

</style>
