<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    class="post_check"
    size="tiny">
    <el-form ref="addPostData" label-width="95px">
      <el-form-item  label="岗位名称:" prop="postname">
        <span>{{addPostData.postname}}</span>
      </el-form-item>
      <el-row class="clearfix">
        <el-col :span="12">
          <el-form-item label="岗位编码:" prop="postno">
            <span>{{addPostData.postno}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级岗位:" prop="parentpostname">
            <span>{{addPostData.parentpostname}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位职级:" prop="rank">
            <span>{{addPostData.rank}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="定编人数:" prop="persionnum">
            <span>{{addPostData.persionnum}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item  label="岗位职责:" prop="responsibility">
        <span class="right-box">{{addPostData.responsibility}}</span>
      </el-form-item>
      <el-form-item label="任职要求:"  prop="postspecification">
        <span class="right-box">{{addPostData.postspecification}}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'checkBox',
    data: function(){
      return {
        dialogVisible: false,
        title: '岗位视图',
      }
    },
    computed: {
      ...mapGetters({
        postList: 'postList',
        postDetails: 'postDetails'
      }),
      addPostData: function(){
        if(this.postDetails){
          return this.postDetails
        }else{
          return {
            postname: '',
            postno: '',
            rank: '1',
            parentpostname: '无',
            persionnum: '',
            responsibility: '',
            postspecification: ''

          }
        }
      }
    },
  };
</script>

<style lang="scss">
  .post_check{
    word-break:break-all; /*支持IE，chrome，FF不支持*/
    word-wrap:break-word;/*支持IE，chrome，FF*/
    .el-form-item__content{
      height: auto;
    }
    .right-box{
      height: 90px;
      width: 100%;
      padding: 0 10px;
      display: inline-block;
      border: 1px solid #eee;
      overflow: auto;
    }
  }
  .el-dialog{
    width: 480px;
  .el-dialog__body{
    padding-right: 40px;
  }
  }
</style>
