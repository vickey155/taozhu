<template>
  <div>
    <el-dialog class='input-dialog' v-model="boxEmail" v-if="isEmail" title="绑定邮箱">
      <i class="title"><span></span>为了保证您的帐号安全，绑定邮箱前请先进行安全验证</i>
      <el-form ref="dataEmail" :model='dataEmail' :rules='validateEmail'  label-width="80px">
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="邮箱:"prop='email'>
              <el-input v-model="dataEmail.email" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="">
              <el-button type="primary" @click="confirm">确认</el-button>
              <el-button @click="boxEmail = false">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="boxMobile = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span> -->
    </el-dialog>
    <el-dialog class='input-dialog' v-model="boxEmail" v-else title="绑定邮箱">
      <i class="title"><span></span>我们已经向您的邮箱{{dataEmail.email}}发送了一封绑定链接
        请从邮件中点击链接完成绑定！ </i>
        <div class="btn-group">
          <el-button type="primary" @click="endSend">已经验证</el-button>
          <el-button type="danger" @click="coutDown" :disabled="emailCount!=0" >{{emailCount == 0?'重新发送': emailCount+"s后重新发送"}}</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters }  from 'vuex'
  export default {
    name: 'changeemail',
    data: function(){
      return {
        boxEmail: false,
        isEmail: true,
        dataEmail: {
          email: ''
        },
        validateEmail: {
          email: [
            {  required: true, message: '请输入邮箱', trigger: 'blur' },
            {type:'email',message:'请输入正确的邮箱账号',trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapGetters({
        emailCount: 'emailCount'
      }),
    },
    methods:{
      confirm: function(){
        var vm = this;
        this.$refs.dataEmail.validate(function(valid) {
          if (valid) {
            vm.$store.dispatch('sendLink',vm.dataEmail)
          }else{
            return false;
          }
        });
      },
      coutDown: function() {
        this.$store.dispatch('sendLink',this.dataEmail);
      },
      endSend: function() {
        this.boxEmail = false;
        this.$store.dispatch('getUserInfo');
      }
    },
    watch: {
      boxEmail: function(){
        this.isEmail = true;
        if(this.$refs["dataEmail"]){
          this.$refs["dataEmail"].resetFields();
        }
      }
    },
    created: function(){
      var vm = this;
      eventHub.$on('SUCCESS_CHANGE_EMAIL_SEND',function(){
        vm.isEmail = false
      });
    }
  };
</script>

<style scoped lang="scss">
.title{
  padding-left: 15px;
  text-align: center;
}
  .btn-group{
    text-align: center;
  }
</style>
