<template>
  <div class="creat_tenant_box">
    <el-dialog title="创建或加入团队" :modal="modal" :close-on-click-modal="modal" :show-close="modal" v-model="dialogVisible" >
      <div class="sec">
        <p v-if="modal">您可以申请加入其他团队或者创建新团队，实现跨组织协作！</p>
        <p v-else> 亲，您的账号还没有加入任何的团队哟，您可以</p>
        <el-row type="flex" class="row-bg" justify="center">
          <el-button type="primary" @click="joinTenant">加入团队</el-button>
        </el-row>
        <p>（根据团队名称搜索，申请加入已有团队）</p>
      </div>
      <div class="sec">
        <el-row type="flex" class="row-bg green-btn" justify="center">
          <el-button type="info" @click="createTenant">创建团队</el-button>
        </el-row>
        <p>（创建新的团队）</p>
      </div>
      <div class="sec" v-if="!modal">
        <el-row type="flex" class="row-bg" justify="center">
          <el-button @click="createNow" class="now_btn">立即体验</el-button>
        </el-row>
        <p>（立即体验，稍后再进行信息完善）</p>
      </div>
    </el-dialog>
    <!-- 加入团队 -->
    <el-dialog title="加入团队" :modal="modal" :close-on-click-modal="modal" :show-close="modal" v-model="dialogFormVisible1">
      <div class="sec border_bottom">
        <p>您可以申请加入其他团队或者创建新团队，实现跨组织协作！</p>
        <el-form :model="joinTeamForm">
          <el-form-item label="" class="input-l-wrap yellow-btn">
            <el-input v-model="joinTeamForm.teamName" auto-complete="off" class="input-l" placeholder="请输入团队名称"></el-input>
            <el-button type="primary" class="search-btn" @click="getTenantList">搜 索</el-button>
          </el-form-item>
        </el-form>
        <JoinTeamList ref="joinTeamList" :tenantName="joinTeamForm.teamName"></JoinTeamList>
      </div>
      <div class="sec">
        <!--<div class="blue-border"></div>-->
        <el-row type="flex" class="row-bg green-btn" justify="center">
          <el-button type="info" @click="createTenant">创建团队</el-button>
        </el-row>
        <p>（创建新的团队）</p>
      </div>
      <div class="sec" v-if="!modal">
        <el-row type="flex" class="row-bg" justify="center">
          <el-button @click="createNow" class="now_btn">立即体验</el-button>
        </el-row>
        <p>（立即体验，稍后再进行信息完善）</p>
      </div>
    </el-dialog>
    <!-- 创建团队 -->
    <el-dialog title="创建团队" :modal="modal" :close-on-click-modal="modal" :show-close="modal" v-model="dialogFormVisible2">
      <div class="sec border_bottom">
        <p>您可以申请加入其他团队或者创建新团队，实现跨组织协作！</p>
        <el-row type="flex" class="row-bg" justify="center">
          <el-form :model="createTeamForm" :rules="validataCreateTeamtForm" ref="createTeamForm" class="input-m-wrap">
            <el-form-item label="团队名称:" :label-width="formLabelWidth" prop="teamName">
              <el-input v-model="createTeamForm.teamName" placeholder="请输入团队名称"></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" :label-width="formLabelWidth" prop="contactPhone">
              <el-input v-model="createTeamForm.contactPhone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="联系邮箱:" :label-width="formLabelWidth" prop="email">
              <el-input v-model="createTeamForm.email" placeholder="请输入联系邮箱"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" class="button-m green-btn">
              <el-button type="info" @click="createTenantSubmit" >确认创建</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </div>
      <div class="sec">
        <el-row type="flex" class="row-bg" justify="center">
          <el-button type="primary" @click="joinTenant">加入团队</el-button>
        </el-row>
        <p>（根据团队名称搜索，申请加入已有团队）</p>
      </div>
      <div class="sec" v-if="!modal">
        <el-row type="flex" class="row-bg" justify="center">
          <el-button class="now_btn" @click="createNow">立即体验</el-button>
        </el-row>
        <p>（立即体验，稍后再进行信息完善）</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import { validatePhone } from '@/validate/index'
  import JoinTeamList from './joinTeamList';
  import tenantApi from '@/api/tenant';
  import { Message } from 'element-ui';
  import { mapGetters }  from 'vuex';
  import router from '@/router/index';

  export default {
    components:{
      JoinTeamList
    },
    name: 'creatTenantBox',
    data: function() {
      //验证团队名称是否存在（要求不存在）
      const validateRenantName = (rule, dataVal, callback) => {
        tenantApi.validationTenant({'tenantname': this.createTeamForm.teamName}).then(response => {
          if(response.data.flag == 'success'){
            callback()
          }else{
            callback(new Error(response.data.msg))
          }
        })
      }
      return {
        modal: true,
        dialogVisible:false,
        dialogFormVisible1:false,
        dialogFormVisible2:false,
        formLabelWidth:'90px',
        joinTeamForm:{
          teamName:""
        },
        createTeamForm:{
          teamName:"",
          contactPhone:"",
          email:""
        },
        validataCreateTeamtForm:{
          teamName:[
            {required: true, message: '团队名称不能为空', trigger: 'blur'},
            {validator: validateRenantName,trigger: 'blur'}
          ],
          contactPhone:[
            {required: true, message: '联系电话不能为空', trigger: 'blur'},
            {validator: validatePhone,trigger: 'blur'}
          ],
          email:[
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
          ]
        }
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    watch: {
      dialogFormVisible2: function(){
        if(this.dialogFormVisible2 == false){
          this.$refs.createTeamForm.resetFields()
        }
        if(this.dialogFormVisible2 == true){
          this.createTeamForm.contactPhone = this.userInfo.mobile;
          this.createTeamForm.email = this.userInfo.email;
        }
      }
    },
    created() {
        var vm = this;
        eventHub.$on('createTenant',function () {
          vm.createTenant();
        });
//        console.log(this.userInfo.loginname == null)
        if(this.userInfo.loginname == null){
          this.$store.dispatch('getUserInfo')
        }

    },
    methods: {
      joinTenant() {
        this.dialogVisible = false;
        this.dialogFormVisible2 = false;
        this.dialogFormVisible1 = true;
        this.joinTeamForm.teamName = '';
        if(this.$refs.joinTeamList !== undefined){
          this.$refs.joinTeamList.teamListVisible  = false;
        }

      },
      createTenant() {
        this.dialogVisible = false;
        this.dialogFormVisible1 = false;
        this.dialogFormVisible2 = true;
      },
      getTenantList() {
        var vm = this;
        this.$store.dispatch('startBtnClick');
        if(vm.joinTeamForm.teamName == ''){
          Message.error("请输入团队名称");
          this.$store.dispatch('endBtnClick');
        }
        else {
          this.$refs.joinTeamList.teamListVisible = true;
          this.$refs.joinTeamList.showTenantList();
        }
      },
      createNow(){
        const sendData = {
          tenantinfo:{ phone:this.userInfo.mobile,mobile:this.userInfo.mobile,email:this.userInfo.email},
          tenantname:"",
          userid:this.userInfo.userid
        };
        tenantApi.createTenantTeam(sendData).then(response =>{
          if(response.data.flag == 'success'){
            this.$router.push({path:'/home'});
            this.$store.dispatch('getTenantList');
            this.$store.dispatch('switchTenant',response.data.datas)
          }
        else{
            Message.error(response.data.msg);
          }
        });
      },
      createTenantSubmit() {
        var vm = this;
        this.$store.dispatch('startBtnClick');
        this.$refs.createTeamForm.validate(valid => {
          if(valid){
              const sendData = {
                tenantinfo:{ phone:this.createTeamForm.contactPhone,email:this.createTeamForm.email},
                tenantname:this.createTeamForm.teamName,
                userid:this.userInfo.userid
              }
            tenantApi.createTenantTeam(sendData).then(response =>{
              if(response.data.flag == 'success'){
                Message.success(response.data.msg);
                this.$store.dispatch('getTenantList');
                this.dialogFormVisible2 = false;
                if(vm.modal == false){
                  this.$router.push({path:'/home'});
                  this.$store.dispatch('switchTenant',response.data.datas)
                }
              }
              else{
                Message.error(response.data.msg);
              }
            });
          }else{
            this.$store.dispatch('endBtnClick');
            console.log('error submit!!');
            return false
          }

        })
      }

    },
    created: function(){
      var vm = this;
      if(this.userInfo.mobile == null){
        this.$store.dispatch('getUserInfo')
      }
      eventHub.$on("openCreatTenantBox",function(){
        vm.dialogVisible = true;
      })
    }
  };
</script>

<style lang="scss">
  .creat_tenant_box{
    $green:#3ea49d;
    $hovergreen:#45b6af;
    .sec{
      &:first-child{
        border-bottom: 1px dashed #ccc;
        padding-top: 0;
      }
      &:nth-child(2){
        padding-top: 20px;
        p{
          margin-bottom: 0;
        }
      }
      .search-btn{
        vertical-align: top;
      }
      .el-input{
        vertical-align: top;
      }

      p{
        line-height: 30px;
        text-align: center;
        margin-bottom: 10px;
        &:nth-child(2){
          margin-bottom: 0;
        }
      }
      .el-form-item{
        margin-bottom: 15px;
      }
      .el-form-item__error{
        padding-top: 0;
      }
      .green-btn{
        .el-button {
          background-color: $green;
          &:hover{
            background-color: $hovergreen;
          }
        }
      }
      .yellow-btn{
        .el-button{
          width:100px;
          background-color:#e19644;
          line-height: 20px;
          padding: 5px 0;
          &:hover{
            background-color: #f0ad4e;
          }
        }
      }
      .blue-border{
        background-color: rgba(75,156,255,.5);
        height: 1px;
        margin-bottom: 20px;
      }
      .el-button{
        width:300px;
        padding:10px 5px;
        border:0;
      }
      .button-m{
        .el-button{
          width:100px;
        }
      }
      .input-l-wrap{
        text-align: center;
        margin-bottom: 10px;
        .input-l{
          width:300px;
        }
      }
      .input-m-wrap{
        width:360px;
      }
      input[type=text]{
        height: 30px;
        line-height: 29px;
        padding:0 10px 0 10px;
      }

    }
    .el-dialog{
      min-width:400px;
      width: 600px;
    }

  }

</style>
