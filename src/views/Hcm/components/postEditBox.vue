<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    size="tiny">
    <el-form ref="editPostData" :model="editPostData" :rules="addPostRules" label-width="95px">
      <el-form-item label="岗位名称:" prop="postname">
        <el-input v-model="editPostData.postname"></el-input>
      </el-form-item>
      <el-row class="clearfix">
        <el-col :span="12">
          <el-form-item label="岗位编码:" prop="postno">
            <el-input v-model="editPostData.postno"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级岗位" prop="parentpostname">
            <select v-model="editPostData.parentpostname">
              <option>无</option>
              <option v-for="item in postList">{{item.postname}}</option>
            </select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位职级:" prop="rank">
            <select>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="定编人数:" prop="persionnum">
            <el-input v-model="editPostData.persionnum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="textareaBox" label="岗位职责" prop="responsibility">
        <el-input type="textarea" v-model="editPostData.responsibility"></el-input>
      </el-form-item>
      <el-form-item label="任职要求" class="textareaBox" prop="postspecification">
        <el-input type="textarea" v-model="editPostData.postspecification"></el-input>
      </el-form-item>
      <el-form-item class="text-right" style="margin-top:15px;margin-bottom: 0">
        <el-button class="addBtn" type="primary" @click="savePost">保存</el-button>
        <el-button class="addBtn" @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { deepCopy } from '@/common/untils'
  import { validateNumber,validateOrgCode,validateOrgName,validateDate }from '@/validate'
  export default {
    name: 'postAddBox',
    data: function(){
      return {
        dialogVisible: false,
        title: '编辑岗位',
        postid: '',
        test: '',
        editPostData: {},
        addPostRules:{
          postname: [
            { required: true, message: '请输入岗位名称', trigger: 'blur' },
            { max: 100, message: '岗位名称最大只能输入100个字符', trigger: 'blur' },
            { validator: validateOrgName,trigger: 'blur'},
          ],
          postno: [
            {max:32, message: '岗位编码最长为32个字符', trigger: 'blur' },
            { validator: validateOrgCode,message: '只允许英文及数字',trigger: 'blur'}
          ],
          persionnum: [
            { required: true, message: '请输入定编人数', trigger: 'blur' },
            { max: 10,message: '最多输入十个数字'},
            { validator: validateNumber, trigger: 'blur'}
          ],
          responsibility: [
            { max: 255, message: '岗位职责最大只能输入255个字符', trigger: 'blur' },
          ],
          postspecification: [
            { max: 255, message: '任职要求最大只能输入255个字符', trigger: 'blur' },
          ]
        }
      }
    },
    computed: {
      ...mapGetters({
        postList: 'postList',
        postDetails: 'postDetails'
      }),
//      editPostData: function(){
//        if(this.postDetails == null&&this.postDetails == undefined){
//          let postDetails = {};
//          postDetails = this.postDetails;
//          postDetails.persionnum = postDetails.persionnum.toString();
//          return postDetails
//        }else{
//          return {
//            postname: '',
//            postno: '',
//            rank: '1',
//            parentpostname: '无',
//            persionnum: '',
//            responsibility: '',
//            postspecification: ''
//
//          }
//        }
//      }
    },
  methods: {
    savePost: function(){
      var vm = this;
      this.$refs.editPostData.validate((valid) => {
        if(valid){
          let editPostData = vm.editPostData;
          editPostData.postid = vm.postid
          vm.$store.dispatch('editPost',vm.editPostData);
        }else{
          return false;
    }
    })
    }
  },
  watch: {
    dialogVisible: function(){
      if(this.dialogVisible == false){
        this.$refs.editPostData.resetFields();
      }
    },
    postDetails: function() {
      this.editPostData = deepCopy(this.postDetails);
      this.editPostData.persionnum = this.editPostData.persionnum.toString()
    }
  },
  created: function() {
    const vm  = this;
    eventHub.$on('SUCCESS_EDIT_POST',function(){
      vm.dialogVisible = false;
    })
  }
  };
</script>

<style lang="scss">
  .el-dialog{
    width: 480px;
  .el-dialog__body{
    padding-right: 40px;
  }
  }
  th{
    min-width: none;
  }
  .textareaBox{
  .el-form-item__content{
    height: 75px;
  }
  }
</style>
