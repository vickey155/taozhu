<template>
  <div class="home_page_box hcm_page">
    <el-menu    class="home_left_nav pull-left"  default-active="1-1-0">

      <el-submenu index="1-1">
        <template slot="title">企业资产</template>
        <el-menu-item index="1-1-0">无形资产</el-menu-item>
        <el-menu-item index="1-1-1">知识管理</el-menu-item>
        <el-menu-item index="1-1-2">固定资产</el-menu-item>
        <el-menu-item index="1-1-3">不动产</el-menu-item>
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
