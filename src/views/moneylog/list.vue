<template>
  <div class="wrapper">


    <Table stripe @on-selection-change="selectChange"  :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :page-size="pSize" :total="counts" @on-change='change_page'></Page>
    </div>
  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {getUserMoneyLogList} from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'

  export default {
    name: "",
    data() {
      return {
        phone:'',
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
            title: "淘客id",
            key: "bid"
          },
          {
            title: "公众号openid",
            key: "openid"
          },
          {
            title: "手机号",
            key: "phone"
          },
          {
            title: "时间",
            key: "dateline",
            render:(h,params)=>{
              let timestamp4=  new Date( parseInt(params.row.dateline+'000')).Format('yy-MM-dd hh:mm:ss')
              return h('div',timestamp4);
            },
          },
          {
            title: "模块",
            key: "module",
            render:(h,params)=>{
              let row=params.row;
              let cnt=''
              switch (row.module){
                case 'checkin':
                  cnt="签到";
                  break;
                case 'order':
                  cnt="订单";
                  break;
                default:
                  cnt="未知"
                  break
              }
              return h('div',cnt);
            },
          },
          {
            title: "之前的金额",
            key: "origin_money"
          },
          {
            title: "改变的金额",
            key: "change_money"
          },
          {
            title: "之后的金额",
            key: "after_money"
          },
          {
            title: "备注",
            key: "remark"
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
    created(){
      var param = this.$route.query;

      this.phone =param.phone;
      if(this.phone==''){
        this.showmsg('info','该用户手机不存在');
      }

    },
    methods: {
      loadData(){
        this.loadData_table();
      },
      loadData_table(){
        getUserMoneyLogList({
          page:this.page,
          'service':'store.getusermoneyloglist',
          phone:this.phone
        }).then(res=>{
          this.list1=res.list;
          this.counts=res.count;
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
        this.searchForm = this.data1;
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
