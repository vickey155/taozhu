<template>
  <div class="left-table">
    <div class="table-head clearfix">
      <span class="bgColor">年假余额</span>
      <span> 0天</span>
    </div>
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <th width="34%">请假类型</th>
        <th width="33%">本月累计</th>
        <th width="33%">本年累计</th>
      </tr>
      <tr v-for="(item, $index) in tableData" :key="item.name" >
        <td>{{item.name}}</td>
        <td>{{item.monthNum}}</td>
        <td>{{item.yearNum}}</td>
      </tr>
    </table>

  </div>

</template>
<script>

  export default{
    data() {
      return {
        tableData: [{
          yearNum: '4',
          name: '事假',
          monthNum: '2'
        }, {
          yearNum: '3',
          name: '病假',
          monthNum: '2'
        }, {
          yearNum: '2',
          name: '探亲假',
          monthNum: '2'
        }]
      };
    },

    methods: {
    },
    components:{

    }
  };
</script>
<style lang="scss">
  .left-table{
    width:100%;
    padding:147px 10px 0 10px;
    $borderC:#000;
    .fontStyle{
      line-height: 22px;
      font-size: 12px;
      color: #333;
      text-align: center;
    }
    @mixin tdth{
      @extend .fontStyle;
      border-right:1px solid $borderC;
      border-top:1px solid $borderC;
      font-weight: normal;
      padding:3px 5px;
    }
    table{
      width:100% !important;
      border-left:1px solid $borderC;
      border-bottom:1px solid $borderC;
      th{
        @include tdth;
      }
      td{
        @include tdth;
      }
    }
    .table-head{
      width:100%;
      border:1px solid $borderC;
      border-bottom: 0;
      span{
        @extend .fontStyle;
        display: inline-block;
        padding:3px 5px;
        vertical-align: top;
      }
      .bgColor{
        width: 25%;
        border-right:1px solid $borderC;
        margin-right:20%;
        background-color: #3399ff;
      }
    }

  }

</style>

