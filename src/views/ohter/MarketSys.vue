<template>
  <div class="home_page_box hcm_page">
    <el-menu    class="home_left_nav pull-left"  default-active="1-1-0">

      <el-submenu index="1-1">
        <template slot="title">营销系统</template>
        <el-menu-item index="1-1-0">工作台</el-menu-item>
        <el-menu-item index="1-1-1">目标与计划</el-menu-item>
        <el-menu-item index="1-1-2">营销团队</el-menu-item>
        <el-menu-item index="1-1-3">联络单位/联系人</el-menu-item>
        <el-menu-item index="1-1-4">行动</el-menu-item>
        <el-menu-item index="1-1-5">传统营销</el-menu-item>
        <el-menu-item index="1-1-6">产品定价</el-menu-item>
        <el-menu-item index="1-1-7">渠道管理</el-menu-item>
        <el-menu-item index="1-1-8">促销管理</el-menu-item>
        <el-menu-item index="1-1-9">营销项目管理</el-menu-item>
        <el-menu-item index="1-1-10">营销费用</el-menu-item>
        <el-menu-item index="1-1-11">分析与决策辅助</el-menu-item>
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
