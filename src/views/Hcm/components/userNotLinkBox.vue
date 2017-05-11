<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    class="userNotLinkBox"
    size="tiny">
    <div>
      <el-row>
        <el-col :span="24"><el-input v-model="searchData" placeholder="请输入内容"></el-input></el-col>
      </el-row>
      <div>
        <el-table
          :data="searchList"
          border
          style="width: 100%">
          <el-table-column
            prop="loginname"
            label="绑定账号">
          </el-table-column>
          <el-table-column
            label="操作">
            <template scope="scope">
              <el-button type="primary" @click="personLinkUser(scope.$index)">绑定</el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'postAddBox',
    data: function() {
      return {
        dialogVisible: false,
        title: '绑定账号',
        personid: '',
        searchData: '',
        list: []
      }
    },
    computed: {
      ...mapGetters({
        userNotLinkList: "userNotLinkList"
      }),
      searchList: function(){
        var vm = this;
        let searchList = this.list.filter(function(val){
          return (val.loginname.indexOf(vm.searchData) != -1)
        })
        return searchList;
      }
    },
    methods: {
      personLinkUser: function (index) {
        this.$store.dispatch('personLinkUser',{personid:this.personid,userid: this.list[index].userid,loginname: this.list[index].loginname })
      }
    },
    watch:{
      userNotLinkList: function(){
        this.list = this.userNotLinkList != null?this.userNotLinkList: []
      }
    },
    created: function(){
      var vm = this;
      eventHub.$on('SUCCESS_PERSON_LINK_USER',function(){
        vm.dialogVisible = false;
      })
    }
  };
</script>

<style lang="scss">
  .userNotLinkBox{
  .el-dialog{
    width: 400px;
  }
    .el-dialog__body{
      padding-right: 20px;
    }
    .el-table{
      margin-top: 20px;
      max-height: 300px;
      overflow-y: auto;
    }
  }
</style>
