<template>
  <div class="home_page_box">
    <div class="content_header"></div>
    <div class="right-wrapper-two person-wrapper">

      <!--<div class="wrapper-left">
       &lt;!&ndash; <LeftTable></LeftTable>&ndash;&gt;
      </div>-->

      <div class="right-cont">
        <div class="filter-wrapper">
          <FilterComponent ref="FilterComponent"></FilterComponent>
        </div>

        <el-row type="flex" class="row-bg" justify="end">
          <el-button type="primary" @click="addLeave()">新增</el-button>
        </el-row>
        <PersonLeaveDayDialog ref="PersonLeaveDayDialog"></PersonLeaveDayDialog>

        <div class="table-wrapper">
          <PersonLeaveDayTable></PersonLeaveDayTable>
        </div>
      </div>

    </div>
  </div>


</template>
<script>
  import LeftTable from './leftTable';
  import PersonLeaveDayDialog from './personLeaveDayDialog';
  import PersonLeaveDayTable from './personLeaveDayTable';
  import FilterComponent from './../module/filterComponent';
  import { mapGetters } from 'vuex';

  export default{
    data() {
      return {
      };
    },
    created(){

    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.FilterComponent.isSearchShow = false;
        this.$refs.PersonLeaveDayDialog.dialogPersonVisible = false;
      })
    },
    computed: {
      ...mapGetters({
        userTenantId:'userTenantId'
      }),
    },
    methods: {
      addLeave() {
        this.$store.dispatch('startBtnClick');
        const pramBase = {
          btnType:'add',
          sendData:{'userid':this.userTenantId.userId}
        };
        this.$store.dispatch('getAddLeaveBaseInfo',pramBase);
      }
    },
    components:{
      //LeftTable,
      FilterComponent,
      PersonLeaveDayTable,
      PersonLeaveDayDialog
    }
  };
</script>
<style lang="scss">

</style>
