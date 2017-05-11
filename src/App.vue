<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
  @import "assets/scss/_index.scss";
  #app{
  	min-width: 1000px;
    overflow: hidden;
  }
</style>
