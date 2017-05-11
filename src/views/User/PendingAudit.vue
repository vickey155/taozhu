<template>
  <div class="user_list_by_tenantid">
    <div class="content_header">
      <el-row>
        <el-col :span="5">
          <el-input
            placeholder="请选择搜索的姓名"
            icon="search"
            v-model="serchData"
          >
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20" class="personal_information" style="margin-left: 0;margin-right: 0">
      <el-col :span="16">
        <el-card>
          <el-table
            :data="searchList"
            style="width: 100%" tyep="index">
            <el-table-column
              prop="username"
              label="姓名"
            >
            </el-table-column>
            <el-table-column
              prop="loginname"
              label="账号"
            >
            </el-table-column>
            <el-table-column
              label="操作"
            >
              <template scope="scope">
                <el-button  type="success" @click="confirm(scope.$index)">同意</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="explain">
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'pendingaudit',
    data: function() {
      return {
        serchData: ''
      }
    },
    computed: {
      ...mapGetters({
        applicationList: 'applicationList'
      }),
      searchList: function() {
        var vm = this;
        if(this.applicationList){
          let searchList =  this.applicationList.filter(function(val,index,arr){
            console.log(val)
            return (val.username.indexOf(vm.serchData) != -1)
          })
          return searchList
        }
      },
    },
  methods: {
    confirm: function(index){
        this.$store.dispatch('processingApplication',this.applicationList[index])
      }
    },
  };
</script>

<style lang="scss">

</style>
