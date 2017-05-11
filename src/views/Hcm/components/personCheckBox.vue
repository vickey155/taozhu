<template>
  <el-dialog
    class="personBox personCheckBox"
    :title="title"
    v-model="dialogVisible"
    size="tiny">
    <el-form label-width="85px">
      <h4>基本信息</h4>
      <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名:" prop="firstname">
              <span>{{personDetails.firstname}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别:" prop="gender">
              <!--<el-input v-model="personAddData.gender"></el-input>-->
              <span>{{personDetails.gender=='w'?'女':'男'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号:" prop="worknum">
              <span>{{personDetails.worknum?personDetails.worknum:'暂无'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期:" prop="birthdate">
              <!--<el-input v-model="personAddData.birthdate"></el-input>-->
              <span>{{personDetails.birthdate?personDetails.birthdate:'暂无'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证:" prop="idcard">
              <span>{{personDetails.idcard?personDetails.idcard:'暂无'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <h4>组织岗位信息</h4>
      <div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="部门:" prop="postid">
              <!--<el-input v-model="personAddData.postid"></el-input>-->
              <span>{{personDetails.orgname?personDetails.orgname:'暂无'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="岗位:" prop="postid">
              <!--<el-input v-model="personAddData.postid"></el-input>-->
              <span>{{personDetails.postname?personDetails.postname:'暂无'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <h4>联系方式</h4>
      <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="移动电话:" prop="phone">
              <span>{{personDetails.phone?personDetails.phone:'暂无'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { validateUserCard,validatePhone } from '@/validate'
  import orgTreeInput from './orgTreeInput.vue'
  export default {
    name: 'personneAddBox',
    data: function(){
      return {
        title: '人员视图',
        dialogVisible: false,
      }
    },
    components: {
      orgTreeInput
    },
    computed: {
      ...mapGetters({
        personDetails: "personDetails"
      }),
  },
  methods: {
  },
  mounted: function() {
  }
  };
</script>

<style lang="scss">
 .personCheckBox{
   .el-form-item{
     span{
       position: relative;
       top: -2px;
     }
   }
 }
</style>
