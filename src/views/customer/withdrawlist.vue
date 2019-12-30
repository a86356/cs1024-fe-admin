<template>
  <div class="wrapper">
    <div class="tablehd">
      <BaseForm
        :form="form1"
        :data="data1"
        @search="search"
        @showSuccessModal="showSuccessModal"
        @calpaymoney="calpaymoney"
      ></BaseForm>
    </div>

    <Modal
      v-model="modal"
      :title="title"
    >
      <input type="text"  v-model="remark" placeholder="请输入备注" >

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
  import {getwithdrawlist,changewithdrawstatus} from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'

  export default {
    name: "",
    inject:['reload'],
    data() {
      return {
        modal:false,
        title:'',
        remark:'',
        status:'0',
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
                {
                  type:'button',
                  name:"批量成功",
                  func:'showSuccessModal',
                  color:'primary'
                },
                {
                  type:'button',
                  name:"计算金额",
                  func:'calpaymoney',
                  color:'success'
                },
              ]
            }
          ],
        },
        columns1: [

          {
            type: 'selection',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            title: "编号",
            key: "id"
          },
          {
            title: "淘客id",
            key: "bid"
          },
          {
            title: "支付宝",
            key: "zhifubao"
          },
          {
            title: "支付宝姓名",
            key: "zhifubao_name"
          },
          {
            title: "手机号",
            key: "phone"
          },
          {
            title: "提现时间",
            key: "dateline",
            render:(h,params)=>{
              let timestamp4=  new Date( parseInt(params.row.dateline+'000')).Format('yy-MM-dd hh:mm:ss')
              return h('div',timestamp4);
            },
          },
          {
            title: "提现金额",
            key: "money"
          },
          {
            title: "提现状态",
            key: "status",
            render:(h,params)=>{
              let timestamp4=  new Date( parseInt(params.row.jointime+'000')).Format('yy-MM-dd hh:mm:ss')

              //0表示未处理,1成功 2失败

              let s=params.row.status;
              let cnt='';
              if(s==0){
                cnt='未处理'
              }
              if(s==1){
                cnt='成功'
              }
              if(s==2){
                cnt='失败'
              }

              return h('div',cnt);
            },
          },
          {
            title: "备注",
            key: "remark"
          },
          {
            title: "操作",
            key: "action",
            width: 200,
            align: "center",
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
                      type: "error",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {

                        if(this.selectedArray.length==0){
                          this.showmsg('error','没有选择');
                          return;
                        }

                        this.modal=true;
                        this.title='转账失败'
                        this.status=2

                      }
                    }
                  },
                  "失败"
                ),

              ])

            }
          }

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
      calpaymoney(){
        let arr=this.selectedArray;
        if(arr.length==0){
          this.showmsg('info','未选择');
          return;
        }
        let total=0;
        for (let i=0;i<arr.length;i++){
          let item=arr[i];
          if(item.status==0){
            total+=parseFloat(item.money);
          }
        }
        this.showmsg('info','本次需要支付的总金额是='+ Math.ceil(total));
      },
      loadData(){
        this.loadData_table();
      },
      showSuccessModal(){
        this.modal=true;
        this.title='批量成功'
        this.status=1;
      },
      confirm(){
        let remark=this.remark;
        let arr=this.selectedArray;
        let temp=[];

        if(arr.length==0){
          this.showmsg('error','没有选择');
          return;
        }

        for (let i=0;i<arr.length;i++){
          let item=arr[i];
          var o={
            id:item.id,
            status:this.status,
            remark:remark,
            name:item.zhifubao_name,
            phone:item.phone
          }
          temp.push(o)
        }

        changewithdrawstatus({
          list:temp,
          'service':'store.changewithdrawstatus'
        }).then(res=>{
          this.reload();
        })
      },
      loadData_table(){
        getwithdrawlist({
          page:this.page,
          'service':'store.getuserwithdrawlist'
        }).then(res=>{
          this.list1=res.list;
          this.counts=res.count;
        })
      },

      search(){
        this.searchForm = this.data1;
        this.page=1;
        this.loadData_table();
      },
    }
  }
</script>

<style scoped lang="less">

</style>
