<template>
  <div class="wrapper">
    <div class="tablehd">

      <h1> 账户余额:{{data1.balance}}</h1>
    </div>
    <div class="tablehd">
      <BaseForm
        :form="form2"
        :data="data2"
        @search="search"
        @showModal="showModal"
        @batchDelete="batchDelete"
        @gopay="gopay"
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
  import {getWalletsChangeRecords,getWallets} from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'
  import PAYCONTANTS from '@/constants/payConstant.js'

  export default {
    name: "",
    data() {
      return {

        data1:{
          balance:'0',
        },
        data2:{},
        form2:{
          MylabelWidth:0,
          inline:true,
          ref:"form2",
          rule:{},
          formlist:[
            {
              title:"",
              fields:[
                // {
                //   type:'text',
                //   name:'tradeNo',
                //   placeholder:"请输入流水号",
                // },
                // {
                //   type:'select',
                //   name:'use',
                //   placeholder:"请输入用途",
                //   style:{"width":"150px"},
                //   options:{
                //     list:[
                //       {
                //         label:"充值",
                //         value:'1'
                //       },
                //       {
                //         label:"定制下单",
                //         value:'2'
                //       },
                //       {
                //         label:"量体师预约",
                //         value:'3'
                //       },
                //     ]
                //   },
                //   func:"change_use"
                // },
                // {
                //   type:'select',
                //   name:'payType',
                //   placeholder:"请选择支付方式",
                //   style:{"width":"150px"},
                //   options:{
                //     list:[
                //       {
                //         label:"余额",
                //         value:'1'
                //       },
                //       {
                //         label:"支付宝",
                //         value:'2'
                //       },
                //       {
                //         label:"微信",
                //         value:'3'
                //       },
                //     ]
                //   },
                //   func:"change_payway"
                // },
                // {
                //   type:'button',
                //   name:"搜索",
                //   func:'search',
                //   color:'info',
                // },
                {
                  type:'text',
                  name:"cz",
                  placeholder:"请输入充值金额"
                },
                {
                  type:'button',
                  name:"充值",
                  func:'gopay',
                  color:'primary',
                }
              ]
            }
          ],
        },
        columns1: [
          {
            title: "流水号",
            key: "billNo"
          },
          {
            title: "变动金额",
            key: "amount"
          },

          {
            title: "用途",
            key: "source",

          },
          {
            title: "支付方式",
            key: "payment",
            render:(h,params)=>{
              let cnt;
              switch (params.row.payment) {
                case 1:
                  cnt="余额";
                  break;
                case 2:
                  cnt="支付宝";
                  break;
                case 3:
                  cnt="微信";
                  break;
              }
              return h('div',cnt);
            }
          },
          {
            title: "是否支付",
            key: "isPay",
            render:(h,params)=>{
              let cnt;
              switch (params.row.isPay) {
                case 1:
                  cnt="已支付";
                  break;
                case 0:
                  cnt="未支付";
                  break;
              }
              return h('div',cnt);
            }
          },
          {
            title: "变更时间",
            key: "createTime"
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
         this.getWalletinfo();
         this.loadData_table();
      },
      gopay(){
         if(!this.data2.cz){
           this.showmsg('info','请输入充值金额');
           return;
         }


        let col=  [
          {
            title: "充值金额",
            key: "cz"
          }
        ];
        var param={
          amount:this.data2.cz
        }

        this.setCache(PAYCONTANTS.PAYCOLUMN,JSON.stringify(col))
        this.setCache(PAYCONTANTS.PAYSELECTED,JSON.stringify([{cz:this.data2.cz}]))
        this.setCache(PAYCONTANTS.PAYPARAM,JSON.stringify(param))
        this.setCache(PAYCONTANTS.OPERTYPE,1)
        this.setCache(PAYCONTANTS.PAYTYPE,'2,3')
        this.nav({path:'/admin/pay'});

      },
      getWalletinfo(){
        getWallets({}).then(res=>{
          this.data1=res.data;
        })
      },
      loadData_table(){

        getWalletsChangeRecords({
          pageNum:this.page,
          pageSize:this.pSize,
          search:this.searchForm,
        }).then(res=>{
          this.list1=res.data.list;
          this.counts=res.data.count;
        })
      },
      showModal(){
        this.data2={};
        this.modalTitle="新增客户"
        this.modal1=true;
      },
      batchDelete(){
        if(this.ids.length==0){
          this.showmsg('info','未选中任何项');
          return;
        }
        batchDeleteCustomerData({
          ids:this.ids
        }).then(res=>{

        })

      },
      search(){
        this.searchForm = this.data2;
        this.page=1;
        this.loadData_table();
      },

      confirmModal(){
        this.data2.birthDay =cntoymd(this.data2.birthDay);
        let rule = this.switchRule(this.form2.rule);
        let ret = Validator.runwithobj(rule,this.data2)
        if(ret.result!='success'){
          this.showmsg('info',ret.msg);
          return;
        }

        if(this.data2.id){
          updateCustomer(this.data2).then(res=>{
            setTimeout(()=>{
              this.modal1=false;
            },1000)
          })
        }else{
          addCustomer(this.data2).then(res=>{
            setTimeout(()=>{
              this.modal1=false;
            },1000)
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
