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
            :data="pageList"
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
              prop="mobile"
              label="手机号"
            >
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮件"
            >
            </el-table-column>
            <el-table-column
              label="操作"
             >
              <template scope="scope">
                <el-button type="warning" @click="delUser(scope.$index)" :disabled="userInfo.userid == pageList[scope.$index].userid" >移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" v-if="total > pageSize">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page='pageNum'
              :page-size='pageSize'
              layout="prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="explain">
            <div slot="header" class="clearfix">
              其他说明
            </div>
            <ul>
              <li>1.您可以；</li>
            </ul>
          </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters }       from 'vuex';
  export default {
    name: 'userlistbytenant',
    data: function(){
      return {
        oldPageNum: 1,
        pageNum: 1,
        pageSize: 10,
        serchData: ''
      }
    },
    methods: {
      handleCurrentChange: function(val) {
        this.pageNum = val
      },
      delUser: function(val){
        var vm = this;
        this.$confirm('您将在该团队中删除用户:'+vm.pageList[val].username+' ,是否继续?', '用户删除', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
         this.$store.dispatch('removeUser',vm.pageList[val].userid)
      }).catch(() => {

      });
      }
    },
    computed: {
      ...mapGetters({
        userListByTenantid: 'userListByTenantid',
        userInfo: 'userInfo'
      }),
    total:function(){
      if(this.searchlist){
        return parseInt(this.searchlist.length)
      }
    },
    searchlist: function(){
      var vm = this;
      this.pageNum = 1;
      if(this.userListByTenantid){
        let searchlist = this.userListByTenantid.filter(function(val){
          return (val.username.toLocaleLowerCase().indexOf(vm.serchData.toLocaleLowerCase()) != '-1')
        });
        return searchlist;
      }
    },
    pageList: function() {
      if(this.searchlist){
        return this.searchlist.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize)
      }
    }
  }
};
</script>

<style lang="scss">
  .user_list_by_tenantid{
    .el-button{
      width: 100px;
      height: 32px;
      line-height: 0px;
    }
    .el-input{
      padding:6px 0;
    }
    .el-pagination{
      margin-top: 25px;
    }
  }
</style>
