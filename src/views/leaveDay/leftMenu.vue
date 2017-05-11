<template>
  <!--左侧菜单-->
  <div class="left-menu home_left_nav pull-left">
    <el-row class="tac">
      <el-col>
        <el-menu class="el-menu-vertical-demo" theme="dark" router :default-openeds='openeds' :default-active="defaultActive">
          <el-submenu  v-for="(perData,$index) in leftMenuData" :key="perData.name" :index ="perData.indexName" >
            <template slot="title">
              <i class="el-icon-message"></i>{{perData.name}}
            </template>
            <el-menu-item v-for="(item,$ind) in perData.sunList" :key="item.name" :index="item.to">
              {{item.name}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>

</template>
<script>

  export default{
    data: function () {
      return {
        defaultActive:'/workTable/leaveDayPerson',
        openeds:['1'],
        leftMenuData:[
          {
            'name': "我的申请",
            'indexName':'1',
            'sunList': [
              {'name': "请假", "indexName": "1-1", "to": "/workTable/leaveDayPerson"},
              {'name': "费用", "indexName": "1-2", "to": "/workTable/fee"}
            ]
          },
          {
            'name': "我的审批",
            'indexName':'2',
            'sunList': [
              {'name': "请假审批", "indexName": "2-1", "to": "/workTable/leaveDayLeader"},
              {'name': "费用审批", "indexName": "2-2", "to": "/workTable/feeAduit"}
            ]
          }
        ]
      }
    },
    methods: {
    }
  };
</script>
<style lang="scss">
  .left-menu{
    width:240px;
    .el-menu{
      .el-submenu__title{
        color:#fff;
      }
      li{
        //color:#fff;
        a{
          color:#fff;
        }
      }
    }
  }
</style>
