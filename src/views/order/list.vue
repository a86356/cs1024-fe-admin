<template>
  <div class="wrapper">

    <div class="tablehd">
      <BaseForm
        :form="form1"
        :data="data1"
        @search="search"
      ></BaseForm>
    </div>


    <Table stripe @on-selection-change="selectChange"  :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :page-size="pSize"  :total="counts" @on-change='change_page'></Page>
    </div>
  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {getorderlist} from '@/api/apis'

  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'
  import PAYCONTANTS from '@/constants/payConstant.js'

  export default {
    name: "",
    inject:['reload'],
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
                  name:'phone',
                  placeholder:"请输入客户手机号"
                },
                {
                  type:'text',
                  name:'orderid',
                  placeholder:"请输入父订单号"
                },
                {
                  type:'button',
                  name:"搜索",
                  func:'search',
                  color:'info'
                }

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
            title: "父订单编号",
            key: "p_orderid"
          },
          {
            title: "子订单编号",
            key: "c_orderid"
          },
          {
            title: "下单人手机",
            key: "phone"
          },
          {
            title: "商品图",
            key: "goodspic",
            render: (h, params) => {
              return h('div',[
                  h('img',{
                    attrs: {
                      src: params.row.goodspic,
                    },
                    style:{
                      'max-width':"100%"
                    }
                  })
                ],
              )
            }
          },
          {
            title: "客户openid",
            key: "openid"
          },

          {
            title: "商品名称",
            key: "goodscnt"
          },
          {
            title: "订单状态",
            key: "status",
          },
          {
            title: "我的佣金",
            key: "mycommission",
          },
          {
            title: "客户佣金",
            key: "cuscommission",
          },

          {
            title: "实付金额",
            key: "realpay",
          },
          {
            title: "创建时间",
            key: "createtime",
            render:(h,params)=>{
              let timestamp4=  new Date( parseInt(params.row.createtime+'000')).Format('yy-MM-dd hh:mm:ss')
              return h('div',timestamp4);
            },
          },
          {
            title: "确认收货时间",
            key: "confirmtime",
            render:(h,params)=>{
              let timestamp4=  new Date( parseInt(params.row.confirmtime+'000')).Format('yy-MM-dd hh:mm:ss')
              return h('div',timestamp4);
            },
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

        getorderlist({
          page:this.page,
          'service':'store.getorderlist',
          ...this.data1
        }).then(res=>{

          this.list1=res.list;
          this.counts=res.count;

        })
      },


      search(){

        this.page=1;
        this.loadData_table();
      },
    }
  }
</script>

<style scoped lang="less">

</style>
