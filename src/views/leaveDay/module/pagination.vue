<template>
  <div class="table-pagination">
    <div class="block">
      <el-pagination  @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="totals">
      </el-pagination>
    </div>
  </div>

</template>
<script>
  import { mapGetters } from 'vuex';

  export default{
    data() {
      return {
        pageSize: 10,
      };
    },
    computed: {
      ...mapGetters({
        currentPage: "pageNo",
        totalListCount:"totalListCount"
      }),
      totals: function(){
         return this.totalListCount?Number(this.totalListCount):0;
      }
    },
    created: function(){

    },
    methods: {
      handleCurrentChange(val) {
        this.$store.dispatch('getPaginationPageNo',val);
      }
    }
  };
</script>
<style lang="scss">
  .table-pagination{
    text-align: center;
    margin-top: 40px;
  }

</style>

