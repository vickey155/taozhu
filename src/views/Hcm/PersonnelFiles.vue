<template>
  <div class="home_page_box personnel_files">
    <div class="content_header">
      <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="工号:">
          <el-input v-model="search.worknum" placeholder="工号"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="search.firstname" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <orgTreeInput class="org_tree_input"></orgTreeInput>
        </el-form-item>
        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="searchPersonList">查询</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div class="main_box home_page_box_main">
      <div class="btn-group">
        <el-button type="primary" @click="$refs.ImportExcel.dialogVisible = true;$refs.ImportExcel.chooseExcel=true">Excel导入</el-button>
        <el-button type="primary" @click="accountImport">从用户系统导入</el-button>
        <el-button type="success" @click="openAddPerson">新增人员</el-button>
      </div>
      <el-table
        border
        :data="personListPageData"
        style="width: 100%">
        <!--<el-table-column-->
          <!--prop="firstname"-->
          <!--label="序号">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="worknum"
          label="工号">
        </el-table-column>
        <el-table-column
          prop="firstname"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="fullname"
          resizable
          label="机构/部门">
        </el-table-column>
        <el-table-column
          prop="postname"
          label="岗位">
        </el-table-column>
        <el-table-column
          :formatter="genderFormatter"
          label="性别">
        </el-table-column>
        <el-table-column
          :formatter="birthdateFormatter"
          label="出生日期">
        </el-table-column>
        <el-table-column
          prop="loginname"
          label="绑定账号">
        </el-table-column>
        <el-table-column
          label="操作">
          <template scope="scope">
            <a @click="checkPerson(scope.$index)"><i class="iconfont icon-chakan"></i></a>
            <a @click="openEditBox(scope.$index)"><i class="iconfont icon-bianji"></i></a>
            <a @click="delPerson(scope.$index)"><i class="iconfont icon-shanchu"></i></a>
            <a><i v-if="!scope.row.loginname" class="iconfont icon-bangding" @click="bindUser(scope.$index)" ></i><i @click="unbundlingUser(scope.$index)" v-else class="iconfont icon-jiebang"></i></a>
          </template>
        </el-table-column>

      </el-table>
      <div class="block">
        <el-pagination
          v-if="personTotal>10"
          @current-change="personCurrentChange"
          :current-page="personListPageNo"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="personTotal">
        </el-pagination>
      </div>
    </div>
    <!--新增岗位-->
    <personneAddBox ref="personneAddBox"></personneAddBox>
    <!--岗位视图-->
    <personCheckBox ref="personCheckBox"></personCheckBox>
    <!--编辑岗位-->
    <personneEditBox ref="personneEditBox"></personneEditBox>
    <!--绑定用户窗口-->
    <userNotLinkBox ref="userNotLinkBox"></userNotLinkBox>
    <!--从Excel导入-->
    <ImportExcel ref="ImportExcel"></ImportExcel>
  </div>
</template>

<script>
  import personneAddBox from './components/personneAddBox'
  import personCheckBox from './components/personCheckBox'
  import personneEditBox from './components/personneEditBox'
  import userNotLinkBox from './components/userNotLinkBox'
  import orgTreeInput from './components/orgTreeInput.vue'
  import ImportExcel from './components/ImportExcel.vue'
  import { mapGetters } from 'vuex';
  export default {
    name: 'PersonnelFiles',
    data: function(){
      return {
        personListPageNo: 1,
        personListPageSize: 10,
        search: {
          worknum: '',
          firstname: '',
          treepath: ''
        }
      }
    },
    components: {
      personneAddBox,
      personCheckBox,
      personneEditBox,
      userNotLinkBox,
      orgTreeInput,
      ImportExcel
    },
    computed: {
      ...mapGetters({
        odlOrgList: 'odlOrgList',
        orgList: 'orgList',
        activeOrg: 'activeOrg',
        personList: 'allPersonList',
        postList: 'postList',
      }),
      personTotal: function(){
        if(this.personList){
          return this.searchList.length
        }
      },
      searchList: function(){
        if(this.personList){
          const vm = this;
          let personList = vm.personList;
          let searchList = personList.filter(function(val,index,arr){
            if(vm.search.treepath !=1){
              return (val.worknum.indexOf(vm.search.worknum) != -1&&val.firstname.indexOf(vm.search.firstname)!= -1&&val.treepath == vm.search.treepath)
            }else{
              return (val.worknum.indexOf(vm.search.worknum) != -1&&val.firstname.indexOf(vm.search.firstname)!= -1)
            }
          });
          return searchList;
        }
      },
      personListPageData: function(){
        if(this.personList){
          return this.searchList.slice(10*(this.personListPageNo - 1),this.personListPageNo*10)
        }
      }
    },
    methods: {
      openAddPerson (){
        console.log(this.$refs)
        this.$refs.personneAddBox.dialogVisible = true;
        eventHub.$off('CHOOSE_INPUT_TREEPATH')
      },
      personCurrentChange (val) {
        this.personListPageNo = val;
      },
      genderFormatter(row, column) {
        return row.gender=='w'?'女':'男';
      },
      birthdateFormatter(row, column) {
        return row.birthdate?new Date(row.birthdate).format('yyyy-MM-dd'):' '
      },
      delPerson: function(index){
        if(this.personListPageData[index].loginname){
          this.$message.error('此人员已绑定账号，请先解绑');
          return false;
        }
        this.$confirm('您将在该团队撤销人员:'+this.personListPageData[index].firstname+' ,是否继续?', '人员撤销', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
            this.$store.dispatch('delPerson',{personid: this.personListPageData[index].personid,postid: this.personListPageData[index].postid})
        }).catch(() => {

        });
      },
      checkPerson: function (index){
        this.$store.dispatch('findById',this.personListPageData[index].personid);
        this.$refs.personCheckBox.dialogVisible = true;
        },
      openEditBox: function(index){
        this.$refs.personneEditBox.personid = this.personListPageData[index].personid;
        this.$store.dispatch('findById',this.personListPageData[index].personid);
        this.$refs.personneEditBox.dialogVisible = true;
        eventHub.$off('CHOOSE_INPUT_TREEPATH')
      },
      bindUser: function(index){
        this.$store.dispatch('findUserNotLinkPersonList');
        this.$refs.userNotLinkBox.personid = this.personListPageData[index].personid;
        this.$refs.userNotLinkBox.dialogVisible = true;
      },
      unbundlingUser: function(index){
        console.log(this.personListPageData[index]);
        var sendData = {userid: this.personListPageData[index].userid,personid: this.personListPageData[index].personid}
        this.$store.dispatch('unbundlingUser',sendData)
      },
      accountImport: function(data){
        this.$confirm('是否确认从用户系统导入', '用户系统导入', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
          }).then(() => {
          this.$store.dispatch('accountImport')
          }).catch(() => {

            });
      },
      searchPersonList: function(){

      },
      test: function(){
        var vm = this;
        eventHub.$on("CHOOSE_INPUT_TREEPATH",function(orgid){
          let activeOrg;
          if(vm.odlOrgList){
            activeOrg = vm.odlOrgList.filter(function(val,index,arr){
              return (val.orgid == orgid)
            });
            vm.search.treepath = activeOrg[0].treepath;
          }else{
            vm.search.treepath = 1;
          }
        })
      }
    },
    created: function(){
      var vm = this;
      this.test()
    }
  };
</script>

<style lang="scss">
  .personnel_files{
    background: #fff;
    .btn-group{
      margin-bottom: 20px;
    }
    .content_header{
      .el-form-item{
        margin: 0;
        line-height: 50px;
      }
      .el-button{
        margin: 5px 0 5px 20px;
      }
      .el-form-item__label{
        vertical-align: top;
        line-height: 50px;
        padding: 0 10px 0 0;
      }
      .el-input{
        padding: 5px 0;
      }
      .org_tree_input{
        .modal_input{
          width: 175px;
          background: #fff;
          margin-top: 5px;
          line-height: 36px;
        }
      }
    }
    .home_page_box_main{
      height: calc(100% - 50px);
      padding:20px;
    }
    .main_box{
      .el-pagination{
        margin: 30px 0;
      }
    }
  }
</style>
