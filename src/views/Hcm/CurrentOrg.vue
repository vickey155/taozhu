<template>
  <div class="current_org home_page_box">
    <div class="content_header">当前位置:　{{fullName}}</div>
    <div class="left-tree">
      <ul class="btn-group">
        <li @click="addDialog = true"><i class="iconfont icon-tianjia"></i></li>
        <li @click="repeal"><i class="iconfont icon-weibiaoti545"></i></li>
        <li><i class="iconfont icon-yidong"></i></li>
        <li><i class="iconfont icon-hebing"></i></li>
      </ul>
      <el-tree :current-node-key="activeOrgId" :data="orgList" node-key="orgid" @node-click="changeOrg"  :props="defaultProps"  default-expand-all :expand-on-click-node="false" highlight-current></el-tree>
    </div>
    <div class="home_page_box_main">
      <div class="org_info">
        <h4>
          基本信息
          <div class="pull-right">
            <el-button-group v-if="!isEdit">
              <el-button type="primary" @click="isEdit = true" >编辑</el-button>
            </el-button-group>
            <el-button-group v-else>
              <el-button type="primary" @click="editOrg" >保存</el-button>
              <el-button @click="cancel">取消</el-button>
            </el-button-group>
          </div>
        </h4>
        <div class="org_info_box">
          <el-form ref="orgDetailsEdit" :model="orgDetailsEdit" :rules="orgEditRules" label-width="95px">
            <el-row :gutter="20">
              <el-col :offset="2" :span="9">
              <el-form-item class="no-require-icon" label="组织编码:" prop="orgno">
                <el-input :disabled="!isEdit" v-model="orgDetailsEdit.orgno"></el-input>
              </el-form-item>
            </el-col>
              <el-col :offset="2" :span="9">
              <el-form-item label="组织名称:" prop="orgname">
                <el-input :disabled="!isEditAndTopOrg" v-model="orgDetailsEdit.orgname"></el-input>
              </el-form-item>
              </el-col>
          </el-row>
            <el-row :gutter="20">
              <el-col :offset="2" :span="9">
                <el-form-item label="组织类型:">
                    <select :disabled="!isEditAndTopOrg" v-if="orgDetailsEdit.treepath == 1">
                      <option>总公司</option>
                    </select>
                    <select v-else :disabled="!isEditAndTopOrg" v-model="orgDetailsEdit.typename">
                      <option v-for="item in orgType" :key="item.orgType"  :value="item.typename">{{item.name}}</option>
                    </select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :offset="2" :span="9">
                <el-form-item label="起始时间:">
                  <el-date-picker :disabled="!isEdit" type="date" format="yyyy-MM-dd" placeholder="暂无" v-model="begintime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :offset="2" :span="9">
                <el-form-item label="截止日期:">
                  <el-date-picker :disabled="!isEdit" type="date" format="yyyy-MM-dd" placeholder="暂无" v-model="endtime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div>
        <el-tabs v-model="activeName2" type="card">
          <el-tab-pane label="岗位" name="first">
            <el-table
              :data="postListPageData"
              style="width: 100%">
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
                prop="persionnum"
                label="缺编人数"
                :formatter="formatterPersionnum"
              >
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
          </el-tab-pane>
          <el-tab-pane label="员工" name="second">
            <el-table
              :data="personListPageData"
              style="width: 100%">
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
                label="机构/部门">
              </el-table-column>
              <el-table-column
                prop="postname"
                label="岗位名称">
              </el-table-column>
              <el-table-column
                prop="rank"
                label="职级">
              </el-table-column>
            </el-table>
            <div class="block">
              <el-pagination
                v-show="personTotal>10?true:false"
                @current-change="personCurrentChange"
                :current-page="personListPageNo"
                :page-size="personListPageSize"
                layout="prev, pager, next, jumper"
                :total="personTotal">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="部门沿革" name="third">部门沿革</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog
      title="新增下级"
      v-model="addDialog"
      size="tiny">
      <el-form ref="addData" :model="addData" :rules="addRules"  label-width="95px">
        <el-form-item label="当前组织:">
          <span>{{fullName}}</span>
        </el-form-item>
        <el-form-item label="组织编码:" prop="orgno">
          <el-input v-model="addData.orgno"></el-input>
        </el-form-item>
        <el-form-item label="组织名称:" prop="orgname">
          <el-input v-model="addData.orgname"></el-input>
        </el-form-item>
        <el-form-item label="组织角色:">
            <el-radio-group v-model="addData.typename">
              <el-radio v-for="item in orgType" :key="item.orgType" :label="item.name"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="起始时间:" prop="begintime">
              <el-date-picker type="date" placeholder="选择日期" v-model="addData.begintime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止时间:" prop="endtime">
              <el-date-picker type="date" format="yyyy-MM-dd" placeholder="选择日期" v-model="addData.endtime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="新增原因:" prop="memo">
          <el-input type="textarea" v-model="addData.memo"></el-input>
        </el-form-item>
        <el-form-item class="btn-group text-right">
          <el-button @click="addEnter" type="primary">新增</el-button>
          <el-button @click="addDialog = false">取消</el-button>
        </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog
      title="撤销下级"
      v-model="repealDialog"
      size="tiny">
      <el-form ref="repealData" :model="repealData" :rules="repealRules" label-width="95px">
          <el-form-item label="当前组织:">
            <span>{{fullName}}</span>
          </el-form-item>
          <el-form-item label="截止时间:">
            <el-date-picker type="date" placeholder="选择日期" v-model="repealData.endtime" style="width: 100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="撤销原因" prop="memo">
            <el-input type="textarea" v-model="repealData.memo"></el-input>
          </el-form-item>
          <el-form-item class="btn-group text-right">
            <el-button @click="repealEnter" type="primary">撤销</el-button>
            <el-button @click="repealDialog = false">取消</el-button>
          </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { validateOrgCode,validateOrgName,validateDate,validateSpacing } from '@/validate'
  import { deepCopy } from '@/common/untils'
  export default {
    data() {
      return {
        activeName2:"first",
        personListPageNo: 1,
        personListPageSize: 10,
        postListPageNo: 1,
        postListPageSize: 10,
        test: '',
        isEdit: false,
        begintime: '',
        endtime: '',
        defaultProps: {
          children: 'children',
          label: 'orgname'
        },


        //编辑部门数据
        orgDetailsEdit: {

        },
        orgEditRules: {
          orgno: [
            {max:32, message: '组织编码最长为32个字符', trigger: 'blur' },
            { validator: validateOrgCode,trigger: 'blur'}
          ],
          orgname: [
            { required: true, message: '请输入组织名称', trigger: 'blur' },
            { max: 100,min:1, message: '组织名称请只允许输入1到20个字符以内', trigger: 'blur' },
            { validator: validateOrgName,trigger: 'blur'},
          ]
        },



        //新增数据
        addDialog: false,
        addData: {
          orgno: '',
          orgname: '',
          typename: '事业部',
          begintime: new Date(),
          endtime: '9999-12-31',
          memo: ''
        },
        addRules: {
          orgno: [
            {max:32, message: '组织编码最长为32个字符', trigger: 'blur' },
            { validator: validateOrgCode,trigger: 'blur'}
          ],
          orgname: [
            { required: true, message: '请输入组织名称', trigger: 'blur' },
            { max: 100,min:1, message: '组织名称只允许输入1到100个字符以内', trigger: 'blur' },
            { validator: validateOrgName,trigger: 'blur'},
          ],
          memo: [
            { validator: validateOrgName,trigger: 'blur'},
            { max: 255, message: '新增原因最大只能输入255个字符', trigger: 'blur' },
          ]
        },

        //撤销数据
        repealDialog: false,
        repealData: {
          endtime: '',
          memo: ''
        },
        repealRules: {
          memo: [
            { required: true, message: '请输入撤销原因', trigger: 'blur' },
            { validator: validateSpacing,trigger: 'blur'},
            { max: 255, message: '撤销原因最大只能输入255个字符', trigger: 'blur' },
          ]
        }
      };
    },
    computed: {
      ...mapGetters({
        orgList: 'orgList',
        activeOrg: 'activeOrg',
        personList: 'personList',
        postList: 'postList',
        orgDetails: 'orgDetails',
        orgType: 'orgType',
        postPersonList: 'postPersonList'
      }),
      isEditAndTopOrg: function() {
        if(!this.isEdit){
          return false;
        }else{
          if(this.isTopOrg){
            return true;
          }else{
            return false;
          }
        }
      },
      isTopOrg: function() {

        if(this.activeOrg&&this.activeOrg.treepath == 1){
          return false
        }else{
          return true
        }
      },
//      orgDetailsData: function(){
//        if(this.orgDetails){
//          this.begintime = this.orgDetails.begintime
//          this.endtime = this.orgDetails.endtime;
//          this.orgDetailsEdit = deepCopy(this.orgDetails);
//          return deepCopy(this.orgDetails)
//        }else{
//          return {}
//        }
//      },
      activeOrgId: function(){
        if(this.activeOrg){
          return this.activeOrg.orgid
        }
      },
      fullName: function(){
        if(this.activeOrg){
          return this.activeOrg.fullname
        }
      },
      personTotal: function(){
        if(this.personList){
          return this.personList.length
        }
      },
      personListPageData: function(){
        if(this.personList){
          return this.personList.slice(10*(this.personListPageNo - 1),this.personListPageNo*10)
        }
      },
      postTotal: function(){
        if(this.postList){
          return this.postList.length
        }
      },
      postListPageData: function(){
        if(this.postList){
          return this.postList.slice(10*(this.postListPageNo - 1),this.postListPageNo*10)
        }
      },
    },
    methods: {
      formatterPersionnum: function(row,colmn){
        let count = row.persionnum - row.innumber;
        if(count >= 0){
          return row.persionnum - row.innumber
        }else{
          return '超编' + Math.abs(row.persionnum - row.innumber ) + '人';
        }
      },
      repeal: function(){
        if(this.activeOrg.treepath == '1'){
          this.$message.error('总公司不能撤销');
          return false;
        }else{
          this.repealDialog = true;
        }
      },
      cancel: function() {
        this.isEdit = false;
        this.$refs.orgDetailsEdit.resetFields();
        this.orgDetailsEdit = deepCopy(this.orgDetails);
        if(this.orgDetails){
          this.begintime = this.orgDetails.begintime;
          this.endtime = this.orgDetails.endtime;
        }
      },
      addEnter: function () {
        var vm = this;
        this.$refs.addData.validate((valid) => {
          if(valid){
            this.$store.dispatch('addOrg',vm.addData)
          }else{
            return false;
          }
        })
      },
      repealEnter: function(){
        var vm = this;
        this.$refs.repealData.validate((valid) => {
            if(valid){
              this.$store.dispatch('deledtOrg',vm.repealData)
            }else{
              return false;
            }
        })
      },
      changeOrg (data,node,vueCom) {
        this.isEdit = false;
        this.$store.dispatch('changeOrg',data);
      },
      personCurrentChange (val) {
        this.personListPageNo = val;
      },
      postCurrentChange (val) {
        this.postListPageNo = val;
      },
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([3]);
      },
      editOrg (){
        this.orgDetailsEdit.begintime = this.begintime;
        this.orgDetailsEdit.endtime = this.endtime;
        this.$refs.orgDetailsEdit.validate((valid) => {
          if(valid){
            this.$store.dispatch('editOrg',this.orgDetailsEdit)
          }else{
            return false;
          }
        })
      }
    },
    watch: {
      repealDialog: function(){
        if(this.repealDialog == false){
          this.$refs.repealData.resetFields();
          this.repealData.endtime = ''
        }
      },
      addDialog: function(){
        if(this.addDialog == false){
          this.$refs.addData.resetFields();
          this.addData.begintime = new Date();
          this.addData.endtime = '9999-12-31';
          this.addData.typename = '事业部';
          this.addData.memo = ''
        }
      },
      orgDetails: function() {
        this.orgDetailsEdit = deepCopy(this.orgDetails);
        this.begintime = this.orgDetails.begintime;
        this.endtime = this.orgDetails.endtime;
      }
    },
    created: function(){
      var vm = this;
      this.cancel()
      eventHub.$on('SUCCESS_ADD_ORG',function(){
        vm.addDialog = false;
      })
      eventHub.$on('SUCCESS_DEL_ORG',function(){
        vm.repealDialog = false;
      })
      eventHub.$on('SUCCESS_EDIT_ORG',function(){
        vm.isEdit = false;
      })
      if(vm.postList != null){
          this.$store.dispatch('getPostList',{});
        }
      }
  };
</script>

<style lang="scss">
  .current_org{
    background: #fff;
    overflow: hidden;
    .home_page_box_main{
      float: left;
      width: calc(100% - 240px);
      height: calc(100% - 50px);
      padding: 20px;
    }
    .org_info{
      margin-bottom: 30px;
      h4{
        font-size: 14px;
        line-height: 36px;
        color: #333;
      }
      .el-button{
        border-radius: 0;
      }
    }
    .org_info_box{
      width: 100%;
      border: 1px solid #bbb;
      padding: 22px 40px 0;
    }
    .el-pagination{
      padding: 20px 0;
      min-height: 60px;
    }
    .el-tabs--card{
      margin-bottom: 30px;
    }
    .el-dialog{
      width: 500px;
      .el-dialog__body{ padding: 20px 30px 20px 20px;}
      .btn-group{
        padding-top: 30px;
      }
      .el-form-item{
        line-height: 30px;
        margin-bottom: 16px;
        .el-form-item__content{
          line-height: 30px;
          height: auto;
        }
        .el-form-item__label{
          padding: 0;
          height: 30px;
          line-height: 30px;
          padding-right: 10px;;
        }
        .el-input{
          height: 30px;
          line-height: 30px;
          input{
            height: 30px;
          }
        }
      }
    }
    .el-radio{
      margin-left: 0;
      width: 33.3%;
      margin-top: 8px;

    }
    .el-form-item__error{
      padding-top: 2px;
    }
    .no-require-icon{
      &::before{
         content: ' ';
         display: none;
       }
    }
  }
</style>
