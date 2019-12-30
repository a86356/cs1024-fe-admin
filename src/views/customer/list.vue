<template>
  <div class="wrapper">
    <div class="tablehd">
      <BaseForm
        :form="form1"
        :data="data1"
        @search="search"
      ></BaseForm>
    </div>


    <Modal
      v-model="modal1"
    >
      <div>
        <span>手机号</span>
        <input type="text"  v-model="data2.phone" placeholder="手机号"  >
      </div>
      <div>
        <span>金额</span>
        <input type="text"  v-model="data2.price" placeholder="请输入加减的钱" >
      </div>
      <div>
        <span>备注</span>
        <input type="text"  v-model="data2.remark" placeholder="请输入备注" >
      </div>


      <div slot="footer">
        <Button type="primary" size="large" @click="confirm">确定</Button>
      </div>
    </Modal>

    <Table stripe @on-selection-change="selectChange"  :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :page-size="pSize" :total="counts" @on-change='change_page'></Page>
    </div>
  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {getuserlist,changeUserMoney} from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'

  export default {
    name: "",
    data() {
      return {
        list:[1,2,3],
        modal1:false,
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
            title: "编号",
            key: "id"
          },
          {
            title: "手机号",
            key: "phone"
          },
          {
            title: "公众号openid",
            key: "openid"
          },
          {
            title: "加入时间",
            key: "dateline",
            render:(h,params)=>{
              let timestamp4=  new Date( parseInt(params.row.jointime+'000')).Format('yy-MM-dd hh:mm:ss')
              return h('div',timestamp4);
            },
          },
          {
            title: "余额",
            key: "remainmoney"
          },
          {
            title: "支付宝账号",
            key: "zhifubao"
          },
          {
            title: "支付宝名称",
            key: "zhifubao_name"
          },
          {
            title: "正在提现金额",
            key: "now_withdraw_money"
          },
          {
            title: "提现总金额",
            key: "withdraw_money"
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            align: "center",
            fixed:'right',
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {

                        this.nav({path:'/admin/moneyloglist',query:{phone:params.row.phone}})
                      }
                    }
                  },
                  "金额日志"
                ),
                  h(
                      "Button",
                      {
                          props: {
                              type: "info",
                              size: "small"
                          },
                          style: {
                              marginRight: "5px"
                          },
                          on: {
                              click: () => {
                                  this.modal1=true;
                                  this.data2.price = 0;
                                  this.data2.phone = params.row.phone
                              }
                          }
                      },
                      "加减金额"
                  ),
              ]);
            }
          }
        ],
        data2:{}
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
        getuserlist({
          page:this.page,
          'service':'store.getuserlist',
          ...this.data1
        }).then(res=>{
          this.list1=res.list;
          this.counts=res.count;
        })
      },
      confirm(){
        if(!this.data2.price || !this.data2.phone || !this.data2.remark){
            this.showmsg('info','请输入完整内容');
            return;
        }

        changeUserMoney({
            ...this.data2,
            'service':'store.changeusermoney',
        }).then(res=>{

            this.modal1=false;

            this.showmsg('info',res.data.msg)
        })

        console.log(this.data2)
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
