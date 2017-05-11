<template>
  <div class="home_page_box hcm_page">
    <el-menu   unique-opened  class="home_left_nav pull-left" router  :default-active='defaultActive'>
      <el-submenu index="1">
        <template slot="title"><i class="iconfont icon-zuzhi1"></i>组织管理</template>
        <el-submenu index="1-1">
          <template slot="title"><i class="iconfont icon-zuzhi"></i>组织架构</template>
          <el-menu-item index="/home/hcm/currentorg">当前组织架构</el-menu-item>
          <el-menu-item index="1-1-2">组织架构计划版本</el-menu-item>
          <el-menu-item index="1-1-3">架构一览</el-menu-item>
        </el-submenu>
        <el-submenu index="1-2">
          <template slot="title"><i class="iconfont icon-zuzhiguanli"></i>组织单元</template>
          <el-menu-item index="1-2-1">事业部</el-menu-item>
          <el-menu-item index="1-2-2">子公司</el-menu-item>
          <el-menu-item index="1-2-3">分公司</el-menu-item>
          <el-menu-item index="1-2-4">部门</el-menu-item>
          <el-menu-item index="1-2-5">科室/班组</el-menu-item>
        </el-submenu>
        <el-submenu index="1-3">
          <template slot="title"><i class="iconfont icon-iconfontgongwenbao"></i>岗位管理</template>
          <el-menu-item index="/home/hcm/postsetting">岗位设置</el-menu-item>
          <el-menu-item index="1-3-2">岗位分析</el-menu-item>
          <el-menu-item index="1-3-3">岗位评价</el-menu-item>
          <el-menu-item index="1-3-4">定编人员</el-menu-item>
          <el-menu-item index="1-3-5">人岗匹配</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="iconfont icon-renshiguanli"></i>人事管理</template>
        <el-menu-item index="/home/hcm/personnelfiles">人事档案</el-menu-item>
        <el-menu-item index="2-2">职称管理</el-menu-item>
        <el-menu-item index="/home/hcm/leaveDayStaff">考勤管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="3"><i class="iconfont icon-baobiao"></i>报表中心</el-menu-item>
      <el-menu-item index="4"><i class="el-icon-message"></i>文件管理</el-menu-item>
    </el-menu>
    <div class="home_page_content">
      <transition name="slide-fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data: function(){
      return {
        defaultActive: '/home/hcm/currentorg'
      }
    },
    mounted: function(){
      if(this.postList == null){
        var vm = this;
        this.$store.dispatch('initHcmData');
      }
    }
  };
</script>

<style lang="scss">
  @import '../../assets/scss/pages/hcm.scss';
</style>
