<template>
  <div>
    <div>
      <h1>返利比例举例:我设置了一条记录佣金范围是15-30,返利比例是0.5.现在有一个订单，我的佣金是20元，,那么我的客户获得10元，我也获得10元</h1>
      <h2 style="color: red;">(备注)佣金范围不要重复，否则会造成覆盖</h2>
    </div>
    <div style="height: 40px;">

    </div>
    <div>
      <Button type="primary" @click="showAddModal">新增</Button>
    </div>
    <div style="height: 20px;">

    </div>
    <Table stripe  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :page-size="pSize" :total="counts" @on-change='change_page'></Page>
    </div>


    <Modal
      v-model="fanli.modal"
      :title="fanli.title"
    >
      <BaseForm
        :form="fanli.form"
        :data="data"
      ></BaseForm>

      <div slot="footer">
        <Button type="primary" size="large" @click="fanliConfirm">确定</Button>
      </div>
    </Modal>

  </div>


</template>


<script>
  import BaseForm from '@/components/form/Base'
  import {addFanliRate,deleteFanliRate,getFanliRateList,updateFanliRate} from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'

  export default {
    name: "",
    inject:['reload'],
    data() {
      return {
        list1:[],
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
            title: "开始点",
            key: "start"
          },
          {
            title: "结束点",
            key: "end"
          },
          {
            title: "比例",
            key: "rate"
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
                        this.data={...params.row};
                        this.fanli.title="编辑";
                        this.fanli.modal=true;
                      }
                    }
                  },
                  "编辑"
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
                          this._deleteFanliRate(params.row.id)
                      }
                    }
                  },
                  "删除"
                ),
              ]);
            }
          }
        ],
        fanli:{
          form:{
            inline:false,
            ref:"form1",
            rule:{
              start: [
                { required: true, message: '请输入开始点', trigger: 'blur' }
              ],
              end: [
                { required: true, message: '请输入结束', trigger: 'blur' }
              ],
              passwordagain: [
                { required: true, message: '请再次输入密码', trigger: 'blur' }
              ],
            },
            formlist:[
              {
                title:"",
                fields:[
                  {
                    type:'text',
                    name:'start',
                    placeholder:"请输入开始点金额",
                    label:"起始金额"
                  },
                  {
                    type:'text',
                    name:'end',
                    placeholder:"请输入结束点金额",
                    label:"结束金额"
                  },
                  {
                    type:'text',
                    name:'rate',
                    placeholder:"请输入比例(50%就输入0.5)",
                    label:"返利比例"
                  },

                ]
              }
            ],
          },
          data:{},
          modal:false,
          title:""
        },
        data:{}

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
      showAddModal(){
        this.data={};
        this.fanli.modal=true;
      },
      fanliConfirm(){

        if(Validator.v.vPosNumber(this.data.start)!=true){
          this.showmsg('info','输入必须是正数');
          return;
        }
        if(Validator.v.vPosNumber(this.data.end)!=true){
          this.showmsg('info','输入必须是正数');
          return;
        }
        if(Validator.v.vPosNumber(this.data.rate)!=true){
          this.showmsg('info','输入必须是正数');
          return;
        }



        if(parseFloat(this.data.start)>parseFloat(this.data.end)){
          this.showmsg('info','起始金额不能大于结束金额');
          return;
        }



        if( parseFloat(this.data.rate)>1 || parseFloat(this.data.rate)<0){
          this.showmsg('info','返利比例应该在0-1之间');
          return;
        }

        if(this.data.id){
          updateFanliRate({
            ...this.data,
            'service':"store.updatefanli",
          }).then(res=>{

            this.showmsg('info',"成功")
            this.fanli.modal=false
            this.reload()
          })
        }else{
          addFanliRate({
            ...this.data,
            'service':"store.addfanli"
          }).then(res=>{
            this.showmsg('info',"成功")
            this.fanli.modal=false
            this.reload()

          })
        }




      },
      _deleteFanliRate(id){

        this.$Modal.info({
          title:"删除",
          content:"是否要删除?",
          onOk:()=>{

            deleteFanliRate({
              service:"store.deletefanli",
              id:id
            }).then(res=>{
              this.showmsg('info','删除成功');
              this.reload();
            })
          }
        })
      },

      loadData_table(){
        getFanliRateList({
          page:this.page,
          'service':'store.getfanlilist',
          ...this.data1
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
