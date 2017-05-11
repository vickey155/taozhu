<template>
  <div style="height: 100%">
    <!--//头部菜单-->
    <el-menu theme="dark"  class="home_top_nav" mode="horizontal" default-active="/home/hcm/" router>
      <el-menu-item v-for="(item,index) in navTopData" :key="item.name" :index="item.to" >
        {{item.name}}
        <!--<router-link :to="item.to">{{item.name}}</router-link>-->
      </el-menu-item>
      <el-submenu index="more" class="top-more" router>
        <template slot="title">更多</template>
        <el-menu-item v-for="(item,index) in moreTopDate" :key="item.name" :index="item.to">{{item.name}}</el-menu-item>
      </el-submenu>
      <div class="pull-right">
        <router-link to="/home/user/pendingaudit">
          <div  index="new_msg" class="new_msg pull-left home_right_item">
            <el-badge :value="applicationListCount" class="item">
              <span class="iconfont icon-user-bar-message"></span>
            </el-badge>
          </div>
        </router-link>
        <div @mouseover="$refs.IndexTenantBox.boxIndexTenant = true" @mouseout="$refs.IndexTenantBox.boxIndexTenant = false"  index="user_info" class="user_info pull-left home_right_item">
          <slot>
            <div class="userInfo_left">
              <h3>{{userInfo.username}}<span class="el-icon-caret-bottom"></span></h3>
              <p>{{tenantname}}</p>
            </div>
            <div><image src=""></image></div>
          </slot>
          <!--团队弹窗-->
          <IndexTenantBox ref="IndexTenantBox"></IndexTenantBox>
        </div>
        <div class="pull-right">
          <el-submenu index="user_seeting" class="user_seeting"  router="false" >
            <template slot="title">陶朱平台</template>
            <!--<el-menu-item v-for="(item,index) in userSeeting"  :key="item.name" :index="item.indexName"><router-link :to="item.to">{{item.name}}</router-link></el-menu-item>-->
            <el-menu-item index="personalinformation"><router-link to="/home/user/personalinformation">基本信息</router-link></el-menu-item>
            <el-menu-item index="userlist"><router-link to="/home/user/userlist"></router-link>团队成员设置</el-menu-item>
            <div class="el-menu-item" index="recommend" @click="$refs.Recommend.dialogVisible = true">推荐拿福利</div>
            <div class="el-menu-item" index="InvitingColleagues" @click="$refs.InvitingColleagues.dialogVisible = true">邀请同事</div>
            <div class="el-menu-item" index="creattenantbox" @click="$refs.CreatTenantBox.dialogVisible = true">创建或加入团队</div>
            <el-menu-item index = 'userSeeting-logout' @click='logout'>退出</el-menu-item>
          </el-submenu>
          <!--创建或加入团队弹窗-->
          <CreatTenantBox ref="CreatTenantBox"></CreatTenantBox>
          <!--推荐拿福利-->
          <Recommend ref="Recommend"></Recommend>
          <!--邀请同事-->
          <InvitingColleagues ref="InvitingColleagues"></InvitingColleagues>
        </div>

        <!--<div  index="user_setting" class="pull-left home_right_item">陶朱平台<span class="el-icon-arrow-right"></span></div>-->
      </div>
    </el-menu>
    <div class="clearfix home_page">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import IndexTenantBox from '@/components/tenant/IndexTenantBox'
  import Recommend from '@/components/user/Recommend'
  import InvitingColleagues from '@/components/user/InvitingColleagues'
  import CreatTenantBox from '@/components/tenant/createTenantBox/creatTenantBox'
  export default{
    data: function(){
      return {
        boxIndexTenant: true,
        navTopData:[
          {'name':"工作台",'to':"/workTable",'indexName':'6'},
          {'name':"人力资本系统",'to':"/home/hcm/",'indexName':'6-3'},
          {'name':"战略与执行系统",'to':"/home/StrategySys",'indexName':'1'},
          {'name':"销售系统",'to':"/home/salesys",'indexName':'2'},
          {'name':"营销系统",'to':"/home/MarketSys",'indexName':'3'},
          {'name':"运营系统",'to':"/home/OperateSys",'indexName':'4'},
        ],
        moreTopDate: [
          {'name':"项目管理系统",'to':"/home/pmSys",'indexName':'5'},
          {'name':"研发系统",'to':"/home/RDSys",'indexName':'6-1'},
          {'name':"企业资产系统",'to':"/home/eamSys",'indexName':'6-2'},
          {'name':"财务资本系统",'to':"/home/fccSys",'indexName':'6-4'},
          {'name':"环境与政策系统",'to':"/home/epSys",'indexName':'6-5'},
          {'name':"主数据系统",'to':"/home/mdSys",'indexName':'6-6'},
        ],
        userSeeting: [
          {'name': "基本信息",indexName: 'userSeeting-1'  ,'to':'/home/user/'},
          {'name': "团队成员设置",indexName: 'userSeeting-2' ,'to':'/home/user/userlist'},
          {'name': "推荐拿福利",indexName: 'userSeeting-3' ,'to':'/home/user/'},
          {'name': "创建或加入团队",indexName: 'userSeeting-4' ,'to':'/home/user'},
        ],
      }
    },
    components:{
      IndexTenantBox,
      CreatTenantBox,
      Recommend,
      InvitingColleagues
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo',
        tenantname: 'tenantname',
        orgList: 'orgList',
        applicationList: 'applicationList'
      }),
      applicationListCount: function(){
        if(this.applicationList){
          return this.applicationList.length
        }
      }
    },
    methods: {
      logout: function() {
        this.$store.dispatch('localLogout');
      }
    },
    created: function(){
      var vm = this;
      eventHub.$on('open_inviting_box',function(){
        vm.$refs.InvitingColleagues.dialogVisible = true;
      })
      this.$store.dispatch('applicationList');
    },

  };
</script>
<style lang="scss" >
  @import "./../assets/scss/utils/_variables.scss";
  .home_page{
    background: $home_left_nav_bg;
    height: calc(100% - 60px);
  }
  .home_top_nav{
    position: relative;
  .top-more{
    .el-submenu__title{
      border-bottom: none !important;
      background: #3399ff!important;
    }
  }
  .el-badge{
    position: inherit;

  }
    .new_msg{
      padding: 0 40px;
      sup{
        transform: none;
        width: 30px;
        position: absolute !important;
        left: 10px !important;
        top: 6px !important;
      }
    }
  }
  .home_page_box{
    height: 100%;
    width: 100%;
  }
  .home_page_content{
    background: #eee;
    height: 100%;
    margin-left: 240px;
  }
  .home_page_content_box{
    width: 100%;
    overflow: hidden;
  }
  .home_page_box_main{
    height: 100%;
    overflow-y: auto;
  }

  .home_top_nav .user_seeting{
    background-color: #3399ff!important;
    .el-submenu__title{
      padding-right: 30px;
    }
  }
  .home_right_item{
    position: relative;
  }
</style>
