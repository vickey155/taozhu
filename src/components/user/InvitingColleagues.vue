<template>
  <div>
    <el-dialog class="inviting_colleagues" title="邀请同事" v-model="dialogVisible" size="tiny">
      <div class="title_info"><i class="icon el-icon-warning"></i>提示：您可以通过手机号码邀请同事加入到陶朱平台。</div>
      <div slot="title" class="title clearfix pull-left">
        <div class="pull-left">邀请同事</div>
        <div class="pull-right  bulk_import" @click="$refs.ImportExcel.dialogVisible=true;dialogVisible=false"><i class="el-icon-upload2 " ></i>批量导入</div>
      </div>
      <el-form :inline="true" ref="invitingData" :model="invitingData" :rules="invitingRules"  class="demo-form-inline">
          <el-form-item label="姓名" prop="name1">
            <el-input v-model='invitingData.name1'  placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone1">
            <el-input v-model='invitingData.phone1'  placeholder="邀请手机号码"></el-input>
          </el-form-item>

        <el-form-item label="姓名" prop="name2">
          <el-input  v-model='invitingData.name2'  placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone2">
          <el-input  v-model='invitingData.phone2' placeholder="邀请手机号码"></el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="name3">
          <el-input v-model='invitingData.name3'  placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone3">
          <el-input v-model='invitingData.phone3'  placeholder="邀请手机号码"></el-input>
        </el-form-item>


        <el-form-item label="姓名" prop="name4">
          <el-input v-model='invitingData.name4'  placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone4">
          <el-input v-model='invitingData.phone4'  placeholder="邀请手机号码"></el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="name5">
          <el-input v-model='invitingData.name5'  placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone5">
          <el-input v-model='invitingData.phone5'  placeholder="邀请手机号码"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center" style="padding-left: 30px">
        <el-button type="primary" @click="invitingBtn" :disabled="btnDisabled">邀请</el-button>
        <el-button @click="nextInviting">下次再说</el-button>
        <a class="reset_btn" @click="resetForm">清空</a>
      </div>
    </el-dialog>

    <!--批量导入-->
    <ImportExcel ref="ImportExcel"></ImportExcel>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ImportExcel from './ImportExcel.vue'
  import { validateInvitingUserName,validatePhone } from '@/validate/'
  export default {
    name: 'InvitingColleagues',
    data: function() {
      return {
        dialogVisible: false,
        invitingData: {
          name1: '',
          name2: '',
          name3: '',
          name4: '',
          name5: '',
          phone1: '',
          phone2: '',
          phone3: '',
          phone4: '',
          phone5: '',
        },
        invitingRules: {
          name1:[
            { validator: validateInvitingUserName,  message: '姓名格式不正确', trigger: 'blur'},
          ],
          name2:[
            { validator: validateInvitingUserName, message: '姓名格式不正确', trigger: 'blur'},
          ],
          name3:[
            { validator: validateInvitingUserName, message: '姓名格式不正确', trigger: 'blur'},
          ],
          name4:[
            { validator: validateInvitingUserName, message: '姓名格式不正确', trigger: 'blur'},
          ],
          name5:[
            { validator: validateInvitingUserName, message: '姓名格式不正确', trigger: 'blur'},
          ],
          phone1: [
            { validator: validatePhone, message: '请输入正确的手机号', trigger: 'blur'},
          ],
          phone2: [
            { validator: validatePhone, message: '请输入正确的手机号', trigger: 'blur'},
          ],
          phone3: [
            { validator: validatePhone, message: '请输入正确的手机号', trigger: 'blur'},
          ],
          phone4: [
            { validator: validatePhone, message: '请输入正确的手机号', trigger: 'blur'},
          ],
          phone5: [
            { validator: validatePhone, message: '请输入正确的手机号', trigger: 'blur'},
          ],

        }
      }
    },
    components: {
      ImportExcel
    },
    methods: {
      invitingBtn: function(){
        let isNone = false;
        let vm = this;
        vm.$store.dispatch('startBtnClick')
        const data  = this.invitingData;
        for(let key in data){
          if(data[key].length> 0){
            isNone = true;
          }
        }
        if(!isNone){
          this.$message.error('请输入邀请信息');
          vm.$store.dispatch('endBtnClick')
          return false;
        }
        this.$refs.invitingData.validate(function(valid){
          let userinfobo = [];
          if(valid){
            if(vm.invitingData.name1&&vm.invitingData.phone1){
              userinfobo.push({"username": vm.invitingData.name1, "loginname": vm.invitingData.phone1});
            }
            if(vm.invitingData.name2&&vm.invitingData.phone2){
              userinfobo.push({"username": vm.invitingData.name2, "loginname": vm.invitingData.phone2});
            }
            if(vm.invitingData.name3&&vm.invitingData.phone3){
              userinfobo.push({"username": vm.invitingData.name3, "loginname": vm.invitingData.phone3});
            }
            if(vm.invitingData.name4&&vm.invitingData.phone4){
              userinfobo.push({"username": vm.invitingData.name4, "loginname": vm.invitingData.phone4});
            }
            if(vm.invitingData.name5&&vm.invitingData.phone5){
              userinfobo.push({"username": vm.invitingData.name5, "loginname": vm.invitingData.phone5});
            }
            if(userinfobo.length == 0){
              vm.$message.error('请输入完整的邀请信息');
              vm.$store.dispatch('endBtnClick');
            }else{
              vm.$store.dispatch('startBtnClick')
              vm.$store.dispatch('tenantInvitate',userinfobo)
            }
          }else{
            vm.$store.dispatch('endBtnClick')
            return false;
          }
        })
      },
      resetForm: function(){
        this.$refs.invitingData.resetFields();
      },
      nextInviting: function(){
        this.dialogVisible = false;
      }

    },
    watch: {
      dialogVisible: function(){
        if(this.dialogVisible == false){
          this.resetForm();
        }
      }
    },
    computed: {
      ...mapGetters({
        btnDisabled: 'btnDisabled'
      }),
  },
  created: function () {
    var vm = this;
    eventHub.$on('SUCCESS_TENANT_INVITATE',function(){
      vm.dialogVisible = false;
    })
  }
  };
</script>

<style lang="scss">
  .inviting_colleagues{
    .el-dialog__header{
      height: 50px;
    }
    .title{
      width: 95%;
      font-size: 14px;
      i{
        margin-right: 10px;
      }
      .bulk_import{
        cursor: pointer;
      }
    }
    .el-dialog{
      width: 600px;
    }
    .el-dialog__body{
      padding: 15px 40px 40px;
    }
    .title_info{
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 15px;
    }
    .icon{
      margin-right: 10px;
    }
    .el-form{
      margin-top: 20px;
      text-align: center;
    }
    .el-form-item{
      margin-bottom: 22px;
    }
    .reset_btn{
      margin-left: 10px;
    }
  }
</style>
