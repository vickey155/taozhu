<template>
  <div class="home_page_box hcm_page">
    <el-menu    class="home_left_nav pull-left"  default-active="1-1-0">

      <el-submenu index="1-1">
        <template slot="title">销售系统</template>
        <el-menu-item index="1-1-0">工作台</el-menu-item>
        <el-menu-item index="1-1-1">工作目标</el-menu-item>
        <el-menu-item index="1-1-2">客户/友商/联系人</el-menu-item>
        <el-menu-item index="1-1-3">情报与知识</el-menu-item>
        <el-menu-item index="1-1-4">客户关系管理(CRM)</el-menu-item>
        <el-menu-item index="1-1-5">合同与订单</el-menu-item>
        <el-menu-item index="1-1-6">售后</el-menu-item>
        <el-menu-item index="1-1-7">销售团队</el-menu-item>
        <el-menu-item index="1-1-8">分析与决策辅助</el-menu-item>
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
