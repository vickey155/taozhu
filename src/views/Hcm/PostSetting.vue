<template>
  <div class="home_page_box post_setting">
    <div class="content_header">当前位置:{{fullname}}</div>
    <div class="left-tree">
      <el-tree :current-node-key="activeOrgId" :data="orgList" node-key="orgid" @node-click="changeOrg"   :props="defaultProps"  default-expand-all :expand-on-click-node="false" highlight-current></el-tree>
    </div>
    <div class="right_box home_page_box_main">
      <div class="text-right"><el-button class="addBtn" type="primary" @click="$refs.postAddBox.dialogVisible = true">新增</el-button></div>
      <el-table
        border
        :data="postListPageData">
        <el-table-column
          prop="postno"
          label="岗位编码">
        </el-table-column>
        <el-table-column
          prop="postname"
          label="岗位名称">
        </el-table-column>
        <el-table-column
          prop="fullname"
          label="机构/部门">
        </el-table-column>
        <el-table-column
          prop="persionnum"
          label="定编人数">
        </el-table-column>
        <el-table-column
          prop="innumber"
          label="在编人数">
        </el-table-column>
        <el-table-column
          prop="rank"
          label="职级">
        </el-table-column>
        <el-table-column
          prop="createdstamp"
          label="创建时间"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <template scope="scope">
            <a @click="openCheckBox(scope.$index)"><i class="iconfont icon-chakan"></i></a>
            <a @click="openEditBox(scope.$index)"><i class="iconfont icon-bianji"></i></a>
            <a @click="delPost(scope.$index)"><i class="iconfont icon-shanchu"></i></a>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          v-show="postTotal>10?true:false"
          @current-change="postCurrentChange"
          :current-page="postListPageNo"
          :page-size="postListPageSize"
          layout="prev, pager, next, jumper"
          :total="postTotal">
        </el-pagination>
      </div>
    </div>
    <!--//新增岗位-->
    <postAddBox ref="postAddBox"></postAddBox>
    <!--查看岗位-->
    <postCheckBox ref="postCheckBox"></postCheckBox>
    <!--编辑岗位-->
    <postEditBox ref="postEditBox"></postEditBox>
  </div>
</template>

<script>
  import postAddBox from './components/postAddBox.vue'
  import postCheckBox from './components/postCheckBox.vue'
  import postEditBox from './components/postEditBox.vue'
  import { mapGetters } from 'vuex';
  export default {
    name: 'PostSetting',
    data: function(){
      return {
        postListPageNo: 1,
        postListPageSize: 10,
        defaultProps: {
          children: 'children',
          label: 'orgname'
        }
      }
    },
    components: {
      postAddBox,
      postCheckBox,
      postEditBox
    },
    computed: {
      ...mapGetters({
        orgList: 'orgList',
        activeOrg: 'activeOrg',
        personList: 'personList',
        postList: 'postList',
      }),
      fullname: function(){
        if(this.activeOrg){
          return this.activeOrg.fullname
        }
      },
      activeOrgId: function(){
        if(this.activeOrg){
          return this.activeOrg.orgid
        }
      },
      postTotal: function(){
        if(this.postList){
          return this.postList.length
        }
      },
      postListPageData: function() {
        if (this.postList) {
          return this.postList.slice(10 * (this.postListPageNo - 1), this.postListPageNo * 10)
        }
      }
    },
    methods: {
      openCheckBox: function(index){
        this.$store.dispatch('getPostDetails',{orgpostid: this.postListPageData[index].orgpostid});
        this.$refs.postCheckBox.dialogVisible = true;
      },
      openEditBox: function(index){
        this.$store.dispatch('getPostDetails',{orgpostid: this.postListPageData[index].orgpostid});
        this.$refs.postEditBox.postid = this.postListPageData[index].orgpostid;
        this.$refs.postEditBox.dialogVisible = true;
      },
      delPost: function(index){
        this.$confirm('您将在该团队撤销岗位:'+this.postListPageData[index].postname+' ,是否继续?', '岗位撤销', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
          }).then(() => {
          this.$store.dispatch('delPost',this.postListPageData[index].orgpostid)
        }).catch(() => {

        });
      },
      changeOrg (data,node,vueCom) {
        this.$store.dispatch('changeOrg',data);
      },
      formatter: function (row,column) {
        return new Date(row.createdstamp).format('yyyy-MM-dd')
      },
      postCurrentChange (val) {
        this.postListPageNo = val;
      },
    }
  };
</script>

<style lang="scss">
  .post_setting{
    .home_page_box_main{
      padding: 20px;
      height: calc(100% - 50px);
      background: #fff;
    }
    .addBtn{
      border-radius: 0;
      position: relative;
      left: -1px;
    }
    .el-pagination{
      margin: 30px 0;
    }
  }
</style>
