<template>
  <div class="home_page_box">
    <!-- 左侧菜单 -->
    <LeftMenu ref="leftMenu" ></LeftMenu>

    <!--右侧内容块-->
    <div class="home_page_content">
        <div class="home_page_content_box">
          <transition name="slide-fade">
            <router-view></router-view>
          </transition>
        </div>
    </div>
  </div>

</template>
<script>
  import LeftMenu from './leftMenu';
  import { mapGetters } from 'vuex';

  export default{
    data() {
      return {
        defaultActivePath:''
      }
    },
    beforeRouteUpdate (to, from, next) {
      if(to.path == '/workTable'){
        this.$refs.leftMenu.defaultActive = '/workTable/leaveDayPerson';
      }
      else{
        this.$refs.leftMenu.defaultActive = to.path;
      }
      next(vm => {
      })
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if(to.path == '/workTable'){
          vm.$refs.leftMenu.defaultActive = '/workTable/leaveDayPerson';
        }
        else{
          vm.$refs.leftMenu.defaultActive = to.path;
        }
      })
    },
    methods: {
    },
    computed: {
      ...mapGetters({
        personList:'personList'
      }),
    },
    beforeDestroy: function(){
      eventHub.$off('dialogHide');
      eventHub.$off('dialogShow');

    },
    create() {

    },
    components:{
      LeftMenu
    }
  };
</script>
<style lang="scss">
  @import './css/common_table.scss';
  @import './css/dialog.scss';
  .home_page_content_box{
    height: 100%;
    .header{
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      background: #fafafa;
      border-bottom: 1px solid #d5d5d5;
      box-shadow: 2px 2px 3px #ddd;
    }

  }
</style>
