<template>
  <el-dialog
    class="personBox"
    :title="title"
    v-model="dialogVisible"
    size="tiny">
    <el-form label-width="85px" ref="personAddData" :model="personAddData" :rules="personAddRules">
      <h4>基本信息</h4>
      <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名:" class="new_error_info" prop="firstname">
              <el-input v-model="personAddData.firstname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别:" prop="gender">
              <!--<el-input v-model="personAddData.gender"></el-input>-->
              <select v-model="personAddData.gender">
                <option>男</option>
                <option>女</option>
              </select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号:" prop="worknum">
              <el-input v-model="personAddData.worknum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期:" prop="birthdate">
              <!--<el-input v-model="personAddData.birthdate"></el-input>-->
              <el-date-picker type="date" placeholder="选择日期" v-model="birthdate" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证:" prop="idcard">
              <el-input v-model="personAddData.idcard"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <h4>组织岗位信息</h4>
      <div>
        <el-row>
          <el-col :span="24">
            <orgTreeInput ></orgTreeInput>
          </el-col>
          <el-col :span="24">
            <el-form-item label="岗位:" prop="postid">
              <!--<el-input v-model="personAddData.postid"></el-input>-->
              <select v-model="personAddData.postname">
                <option>无</option>
                <option v-for="item in orgPostList">{{item.postname}}</option>
              </select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <h4>联系方式</h4>
      <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="移动电话:" prop="phone">
              <el-input v-model="personAddData.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="text-right">
        <el-button type="primary" @click="confirm">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { deepCopy } from '@/common/untils'
  import { validateUserCard,validateOrgCode,validatePhone,validateUserName } from '@/validate'
  import orgTreeInput from './orgTreeInput.vue'
  export default {
    name: 'personneAddBox',
    data: function(){
      return {
        title: '编辑人员',
        dialogVisible: false,
        defaultProps: {
          children: 'children',
          label: 'orgname'
        },
        birthdate:'',
//        personAddData: {
//          firstname: '',
//          gender: '男',
//          worknum: '',
//          birthdate: '',
//          idcard: '',
//          postname: '',
//          phone: '',
//        },
        personAddRules: {
          firstname: [
            { required: true, message: '请填写姓名', trigger: 'blur' },
            { max: 100, message: '最多输入100个字符', trigger: 'blur' },
            {validator: validateUserName,trigger:'blur'}
          ],
          worknum: [
            {validator: validateOrgCode,message:'只允许英文及数字',trigger:'blur'},
            { max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          idcard: [
            {validator: validateUserCard,trigger:'blur'}
          ],
          phone: [
            {validator: validatePhone,trigger:'blur'}
          ]

        },
        initOrgId: '',
        activeOrgId: '',
        personid: '',
      }
    },
    components: {
      orgTreeInput
    },
    computed: {
      ...mapGetters({
        orgList: 'orgList',
        postList: 'postList',
        personDetails: "personDetails"
      }),
    personAddData: function(){
      if(this.personDetails){
        let personDetails = deepCopy(this.personDetails);
        personDetails.gender = personDetails.gender == 'w'?'女':'男';
        this.birthdate = personDetails.birthdate;
        return personDetails
      }else{
        return  {
          firstname: '',
          gender: '男',
          worknum: '',
          birthdate: '',
          idcard: '',
          postname: '',
          phone: '',
        }
      }
    },
    orgPostList: function(){
      var vm = this;
      if(this.activeOrgId){
        let orgPostList = vm.postList?vm.postList.filter(function(item,index,arr){
          return (item.orgid == vm.activeOrgId)
        }):['暂无岗位'];
        if(orgPostList.length){
          this.personAddData.postname = orgPostList[0].postname
        }
        return orgPostList.length>0?orgPostList:['暂无岗位']
      }else{
        this.personAddData.postname = this.postList?this.postList.length>0?this.postList[0].postname:'':''
        return this.postList
      }
    }
  },
  methods: {
    confirm: function(){
      var vm = this;
      this.$refs.personAddData.validate((valid) => {
        if(valid){
          let sendData = vm.personAddData;
          sendData.orgid = vm.activeOrgId?vm.activeOrgId:vm.orgList[0].orgid;
          sendData.personid = vm.personid;
          sendData.birthdate = vm.birthdate;
          vm.$store.dispatch('editPerson',sendData)
        }else{
          return false;
    }
    })
    }
  },
  watch: {
    dialogVisible: function (){
      if(this.dialogVisible == false){
        this.$parent.test();
      }
    }
  },
  mounted: function(){
    var vm = this;
    eventHub.$on("CHOOSE_INPUT_ORG",function(activeOrgId){
      vm.activeOrgId = activeOrgId;
    });
    eventHub.$on('SUCCESS_EDIT_PERSON',function(){
      vm.dialogVisible = false;
    })
  }
  };
</script>

<style lang="scss">
  .personBox{
  .el-form-item{
    margin-bottom: 24px;
  }
  .new_error_info{
  .el-form-item__error{
    width: 300px;
  }
  }
  }
</style>
