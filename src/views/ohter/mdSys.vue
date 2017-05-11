<template>
  <div class="home_page_box hcm_page">
    <el-menu    class="home_left_nav pull-left"  default-active="1-1-0">

      <el-submenu index="1-1">
        <template slot="title">主数据系统</template>
        <el-menu-item index="1-1-0">外部组织与联系人</el-menu-item>
        <el-menu-item index="1-1-1">内部组织与员工</el-menu-item>
        <el-menu-item index="1-1-2">产品与物料</el-menu-item>
        <el-menu-item index="1-1-3">订单</el-menu-item>
        <el-menu-item index="1-1-4">项目</el-menu-item>
        <el-menu-item index="1-1-5">设备与设施</el-menu-item>
        <el-menu-item index="1-1-6">会计科目</el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="home_page_content developing">
      此功能待开发中，敬请期待....
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data: function(){
      return {
      }
    }
  };
</script>

<style lang="scss">
  .developing{
    text-align: center;
    position: relative;
    padding-top: 200px;
    font-size: 20px;
  }
</style>
