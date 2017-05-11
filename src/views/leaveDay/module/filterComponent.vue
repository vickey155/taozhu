<template>
  <div class="filter-box">
    <el-row type="flex" class="row-bg">
      <el-col>
        <el-checkbox-group  v-model="checkList">
          <el-checkbox v-for="(item,$index) in leaveTypeArr" :key="item" :label="item" @change="handleCheckedFiltersChange"></el-checkbox>
        </el-checkbox-group>
      </el-col>
      <el-col>
        <slot name="searchInput"></slot>
      </el-col>
    </el-row>
  </div>

</template>
<script>
  import { mapGetters } from 'vuex';

  export default{
    data() {
      return {
        checkList:[],
        book:12
      };
    },
    computed: {
      ...mapGetters({
        leaveTypeArr:'leaveTypeArr',
        leaveTypeChecked:'leaveTypeChecked'
      }),
    },
    mounted() {
      this.$nextTick(() => {
        //console.log(this.leaveTypeArr);
      })
    },
    beforeDestroy (){
      //eventHub.$off('clearLeaveTypeList');
    },
    created() {
      eventHub.$on('clearLeaveTypeList',() =>{

        this.checkList.splice(0,this.checkList.length);

      });
    },
    methods: {
      handleCheckedFiltersChange(event) {
        this.$store.dispatch('getCheckedLeaveType',this.checkList);
      }
    }
  };
</script>
<style lang="scss">
  .filter-box{
    min-width: 300px;
    height: 60px;
    .el-col{
      width: auto;
      &:nth-child(2){
        margin-left: 0.5%;
        min-width: 340px;
      }
    }
    .el-checkbox-group{
      width:650px;
      .el-checkbox{
        margin-left: 0;
        margin-right: 10px;
        line-height: 32px;
      }
    }
    .el-button{
      padding: 7px 10px;
      min-width: 60px;
      &:nth-child(1){
        padding-right: 0;
        color: #1f2d3d;
      }
    }
    .el-input{
      width: 200px;
      .el-input__inner{
        height: 30px;
      }
    }
  }

</style>

