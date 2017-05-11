<template>
  <div class="home_page_box">
    <!--左侧菜单-->
    <el-menu  class="home_left_nav pull-left" unique-opened router :default-openeds='openeds' :default-active='defaultActive'>
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-setting"></i>基本设置</template>
        <el-menu-item index="/home/user/personalinformation">个人资料</el-menu-item>
        <el-menu-item index="/home/user/pendingaudit">待审核列表</el-menu-item>
        <el-menu-item index="/home/user/userlist">团队成员设置</el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="home_page_content">
      <div class="home_page_content_box">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data: function () {
      return {
        "openeds": ['1'],
        defaultActive: ''

      }
    },
    beforeRouteUpdate (to, from, next) {
      this.defaultActive = to.path
      next(vm => {
      })
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.defaultActive = to.path
      })
    }
  };
</script>

<style lang="scss">

</style>
