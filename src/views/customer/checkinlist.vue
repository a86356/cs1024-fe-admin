<template>
  <div class="wrapper">
    <div class="tablehd">
      <BaseForm
        :form="form1"
        :data="data1"

      ></BaseForm>
    </div>


    <Table stripe @on-selection-change="selectChange"  :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :page-size="pSize" :total="counts" @on-change='change_page'></Page>
    </div>
  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {getcheckinlist} from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'

  export default {
    name: "",
    data() {
      return {
        form1:{
          MylabelWidth:0,
          inline:true,
          ref:"form1",
          rule:{},
          formlist:[
            {
              title:"",
              fields:[

                {
                  type:'text',
                  name:'mobileNo',
                  placeholder:"请输入客户手机号"
                },
                {
                  type:'button',
                  name:"搜索",
                  func:'search',
                  color:'info'
                },
              ]
            }
          ],
        },
        columns1: [
          {
            title: "编号",
            key: "id"
          },
          {
            title: "手机号",
            key: "phone"
          },
          {
            title: "签到时间",
            key: "dateline",
            render:(h,params)=>{
              let timestamp4=  new Date( parseInt(params.row.dateline+'000')).Format('yy-MM-dd hh:mm:ss')
              return h('div',timestamp4);
            },
          },
          {
            title: "签到获得的金额",
            key: "checkin_money"
          },
        ],
      }
    },
    components: {
      BaseForm
    },
    mounted() {
      this.loadData();
    },
    methods: {
      loadData(){
        this.loadData_table();
      },
      loadData_table(){
        getcheckinlist({
          page:this.page,
          service:"store.getusercheckinlist"
        }).then(res=>{

          this.list1=res.list;
          this.counts=res.count;
        })
      },




    }
  }
</script>

<style scoped lang="less">

</style>
