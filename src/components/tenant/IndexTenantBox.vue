<template>
  <div  v-show="boxIndexTenant" @mouseover="boxIndexTenant = false">
    <div class="index_tenant_box" >
      <div class="header">
        <!--切换团队-->
        <el-row>
          <el-col :span="11"><el-button @click="openCreatTenantBox">创建或加入</el-button></el-col>
          <el-col :span="12" >
            <el-col :span="6"><span>切换团队:</span></el-col>
            <el-col :span="12">
              <div class="model-select" @mouseover = 'boxShow = true' @mouseout = 'boxShow = false'>
              <span >{{tenantname}}</span>
              <ul v-show="boxShow">
                <template>
                  <li v-for="(item,index) in tenantList" @click="switchTenant(index)" >{{item.tenantname}}</li>
                </template>
              </ul>
            </div>
              </el-col>
          </el-col>
        </el-row>
        <div class="main">
        <el-row>
          <!--内容左侧-->
          <el-col :span="19">
            <el-col :span="12"><i>在此可以查看当前团队下的成员</i></el-col>
            <el-col :span="12" class="search"><span><input v-model="serchData" placeholder="人员搜索"><i class="el-icon-search"></i></span></el-col>
            <el-col :span="24">
              <div class="user_box">
                <ul>
                  <li v-for="(item,index) in searchList" style="color:#000"><img :src="userPhoto"><span>{{item.username}}</span></li>
                </ul>
              </div>
            </el-col>
          </el-col>
          <!--内容右侧-->
          <el-col :span="5" class="right">
            <p><img class="user_photo" :src="userPhoto" width="56" height="56"></p>
            <p><el-button @click="getUserSet">个人设置</el-button></p>
            <p><el-button @click="exitTenant">退出</el-button></p>
          </el-col>
        </el-row>
          </div>
        <div class="button">
          <el-button class="el-info" type="primary" @click="getUserlist">团队成员设置</el-button>
          <el-button  class="el-warning" type="danger" @click="openYaoqin">邀请同事</el-button>
        </div>
      </div>
    </div>
    <div class="el-dialog__wrapper input-dialog password-dialog" @mouseover.stop="boxIndexTenant = false"></div>

  </div>
</template>

<script>
  import { mapGetters }  from 'vuex'
  export default {
    name: 'indextenantbox',

    data: function() {
      return {
        boxIndexTenant: false,
        serchData: '',
        boxShow: false,
        userPhoto: require('@/assets/images/userphoto.png')
      }
    },
    methods: {
      openYaoqin: function() {
        eventHub.$emit('open_inviting_box')
        this.boxIndexTenant = false;
      },
      search: function(){

      },
      getUserSet: function(){
        this.boxIndexTenant = false;
        this.$router.push({path: '/home/user/personalinformation'})
      },
      getUserlist: function(){
        this.boxIndexTenant = false;
        this.$router.push({path: '/home/user/userlist'})
      },
      switchTenant: function(index){
        this.$store.dispatch('switchTenant',this.tenantList[index].tenantid);
        this.boxShow = false;
      },
      openCreatTenantBox: function(){
        this.boxIndexTenant = false;
        eventHub.$emit("openCreatTenantBox")
      },
      exitTenant: function(){
        this.boxIndexTenant = false;
        this.$confirm('您将退出:'+this.tenantname+' ,是否继续?', '退出团队', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('exitTenant')
//          this.$store.dispatch('delPerson',{personid: this.personListPageData[index].personid,postid: this.personListPageData[index].postid})
      }).catch(() => {

        });
      }
    },
    computed: {
      ...mapGetters({
        tenantList: 'tenantList',
        tenantid: 'tenantid',
        tenantname: 'tenantname',
        userListByTenantid: 'userListByTenantid'
      }),
      searchList: function(){
        var vm = this;
        if(this.userListByTenantid){
          var searchList = this.userListByTenantid.filter(function(item,index,arr){
            return(item.username.toLowerCase().indexOf(vm.serchData.toLowerCase()) != -1)
          });
          return searchList
        }
      }
    },
    created: function(){
      if(this.getTenantList == null){
        this.$store.dispatch('getTenantList');
      }
      if(this.userListByTenantid == null){
        this.$store.dispatch('userListByTenantId');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .index_tenant_box{
    width: 760px;
    height: 435px;
    position: absolute;
    right: 0;
    top: 60px;
    background: #eee;
    z-index: 9999;
    .header{
      height: 60px;
      line-height: 60px;
      background: #3091f2;
      padding: 0 25px;
    }
  }
  .el-dialog__wrapper{
    background: rgba(0,0,0,.4);
    top: 60px;
    z-index: 2003;
  }
  .el-select-dropdown{
  }

  .model-select{
    position: relative;
    width: 270px;
    span{
      height: 30px;
      line-height: 30px;
      padding: 0 8px;
      border: 1px solid #fff;
      border-radius: 3px;;
      display: inline-block;
      margin-top: 15px;
      width: 100%;
    }
    ul{
      max-height: 200px;
      width: 100%;
      position: absolute;
      left: 1px;
      top: 44px;
      background: #3091f2;
      box-shadow: 0 2px 5px #333;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0 10px;
      z-index: 99;
      li{
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .main{
    background: #EDEDED;
    color: #999;
    .search{
      text-align: right;
      span{
        height: 30px;
        line-height: 30px;
      }
      input{
        line-height: 20px;
        width: 165px;
        height: 30px;
        border: 1px solid #D2D2D2;
        background: #EDEDED;
         border-radius: 5px;
          padding: 0 8px;
        }
      &>span{
          position: relative;
        }
      i{
        position: absolute;
        top: 0px;
        right: 5px;

      }
    }
    .user_box{
      width: 100%;
      height: 255px;
      background: #fff;
      overflow-y: auto;
      li{
        float: left;
        padding: 0 10px;
        box-sizing: border-box;
        width: 122px;
        height: 40px;
        margin: 6px 0 0 5px;
        border-radius: 6px;
        white-space:nowrap;
        text-overflow:ellipsis;
  &:hover{
           background: #f5f5f5;
         }
        span{
          height: 100%;
          line-height: 40px;
          display: inline-block;
          vertical-align: top;
          margin-left: 8px;
        }
        img{
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 50%;
        }
      }
    }
    .right{
      padding-left: 20px;
    text-align: center;
      margin: 20px 0;
      .user_photo{
        border-radius: 50%;
      }
      p{
        line-height: 50px;
      }
      button{
        width: 120px;
        height: 30px;
        line-height: 0px;
        border: 1px solid #d2d2d2;
        margin: 0px 0;
        background: transparent;
        color: #666;
        &:hover{
          background: #3091f2;
          color: #fff;
         }
      }
    }
  }
  button{
    width: 120px;
    height: 30px;
    line-height: 0px;
  }
</style>
