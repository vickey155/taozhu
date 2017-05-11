<template>
  <el-dialog
    class="import_excel person_excel"
    title="导入本地Excel"
    v-model="dialogVisible"
    size="tiny">
    <div slot="title" class="title clearfix">
      <div class="pull-left">导入本地Excel</div>
    </div>
    <div v-show="chooseExcel">
      <div >
        <el-upload
          class="upload_box"
          ref="upload"
          :multiple="multiple"
          :headers="headers"
          :action="sendUrl"
          :data="sendData"
          :on-change="change"
          :on-preview="handlePreview"
          :on-success="successImport"
          :on-error="errorImport"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary"><i class="el-icon-upload2 "></i>选取文件</el-button>
          <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
          <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>
      </div>
      <div class="import_hint">
        <div>
          <span>Excel文件请符合以下标准：</span>
          <ul>
            <li>后缀名为xls或者xlsx</li>
            <li>数据请勿放在合并的单元格中</li>
            <li>文件大小请勿超过2MB,导入条数不超过100条</li>
          </ul>
        </div>
        <div>&nbsp;</div>
        <div>
          <span>导入步骤：</span>
          <ul>
            <li>第一步，下载<a href="javascript:;" @click="downloadTemplates">人员导入模板</a>；</li>
            <li>第二步，预览要导入的数据；</li>
          </ul>
        </div>
      </div>
      <div class="text-right btn_group">
        <el-button type="success"  @click="submitUpload">下一步</el-button>
      </div>
    </div>
    <div v-show="!chooseExcel">
      <div class="end_info"><i class="el-icon-information"></i>{{info}}</div>
      <div class="text-right btn_group">
        <el-button @click="chooseExcel = true">上一步</el-button>
        <el-button type="success" @click="dialogVisible = false">完成</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { getCookie } from '@/common/authService'
  import { API_ROOT,apiVersion } from '@/config'
  export default {
    name: 'ImportExcel',
    data: function(){
      return {
        dialogVisible: false,
        multiple: false,
        chooseExcel: true,
        info: '',
        sendUrl: API_ROOT + 'tz-party/partyperson/excelUpload.htm',
        headers:{
          token: getCookie('tokenid'),
          "api-version":apiVersion
        },
        sendData: {
          tenantid: getCookie("tenantid"),
          userid: getCookie('userid')
        }
      }
    },
    methods: {
      submitUpload() {
        this.$refs.upload.submit();
      },
      change: function(file, fileList){
        if(fileList&&fileList.length>=2){
          fileList.splice(0,1)
        }
      },
      downloadTemplates(){
        window.open("./static/excel/employeeImport.xlsx");
      },
      successImport(response, file, fileList){
        this.$refs.upload.clearFiles();
        this.info = response.msg;
        this.chooseExcel = false;
        this.$store.dispatch('getPersonList',{})
      },
      errorImport(err, file, fileList){
       this.$message.error('上传文件失败');
        this.$refs.upload.clearFiles();
      },
      handlePreview(file) {
        console.log(file);
      }
    },
  };
</script>

<style lang="scss">
  .import_excel{
  .el-dialog__header{
    height: 48px;
  }
  .title{
    font-size: 14px;
    width: 95%;
    float:left;
    .bulk_import{
      cursor: pointer;
    }
  }
    .el-dialog{
      width: 700px;
      border-radius: 4px;
      .el-dialog__header{
        background: #eee;
      }
    }
  .el-dialog__body{
    padding: 0;;
  }
  .import_hint{
    padding: 20px 30px;
    color: #666;
    background: #eee;
    line-height: 25px;
    ul{
      color: #b1b1b1;
      li{
        list-style-type:disc;
      }
    }
  }
  .upload_box{
    text-align: center;
    padding: 30px 0;
    margin: 20px;
    border: 1px dashed #eee;
  }
  .btn_group{
    padding:10px 20px;
  }
  .el-icon-upload2{
    margin-right: 10px;
  }
  .end_info{
    padding: 40px 20px 20px;
    i{
      margin-right: 10px;
    }
  }
  }

</style>
