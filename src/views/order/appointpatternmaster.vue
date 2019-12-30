<template>
  <div class="wrapper">
    <div class="tablehd">
      <BaseForm
        :form="search.form"
        :data="search.data"
        @doSearch="doSearch"
      ></BaseForm>
    </div>

    <Modal
      v-model="address.modal"
      :title="address.title"
    >
      <BaseForm
        :form="address.form"
        :data="address.data"
        :city="city"
      ></BaseForm>

      <div slot="footer">
        <Button type="primary" size="large" @click="addressconfirm">确定</Button>
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
  import {
    cancelAppoint,
    updateAppoint,
    deleteAppoint,
    getAppointList
  } from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'
  import {citys} from "@/utils/citys";

  export default {
    name: "",
    inject:['reload'],
    data() {
      return {
        city:citys,
        search:{
          form: {
            MylabelWidth:0,
            inline:true,
            ref:"search",
            rule:{},
            formlist:[
              {
                title:"",
                fields:[
                  {
                    type:'text',
                    name:'name',
                    placeholder:"请输入客户名"
                  },
                  {
                    type:'text',
                    name:'mobileNo',
                    placeholder:"请输入客户手机号"
                  },
                  {
                    type:'button',
                    name:"搜索",
                    func:'doSearch',
                    color:'info'
                  },

                ]
              }
            ],
          },
          data:{}
        },
        address:{
          modal:false,
          title:"编辑",
          form:{
            MylabelWidth:80,
            ref:"address",
            rule:{
              name: [
                { required: true, message: '请输入预约人姓名', trigger: 'blur' }
              ],
              mobileNo: [
                { required: true, message: '请输入预约人手机', trigger: 'blur' }
              ],
              appointmentTime:[
                { required: true, message: '请选择预约时间', trigger: 'blur' }
              ],
              pdc:[
                { required: true, message: '请选择省市区', trigger: 'blur' }
              ],
              address:[
                { required: true, message: '请输入地址', trigger: 'blur' }
              ]
            },
            formlist:[
              {
                title:"",
                fields:[
                  {
                    type:'text',
                    name:'name',
                    label:"预约人",
                    placeholder:"请输入预约人姓名"
                  },
                  {
                    type:'text',
                    name:'mobileNo',
                    label:"手机号",
                    placeholder:"请输入预约人手机号"
                  },
                  {
                    type:'datetime',
                    name:'appointmentTime',
                    label:"预约时间",
                    placeholder:"请选择预约人时间",
                    format:"yyyy-MM-dd HH:mm",
                  },
                  {
                    type:'pdc',
                    name:'pdc',
                    label:"省市区",
                    placeholder:"请选择预约地区"
                  },
                  {
                    type:'text',
                    name:'address',
                    label:"详细地址",
                    placeholder:"请输入预约详细地址"
                  }
                ]
              }
            ],
          },
          data:{}
        },
        form2:{
          MylabelWidth:80,
          inline:false,
          ref:"form2",
          rule:{
            name: [
              { required: true, message: '请输入客户姓名', trigger: 'blur' }
            ],
            sex: [
              { required: true, message: '请选择客户性别', trigger: 'blur' }
            ],
            remark: [
              { required: true, message: '请选择客户备注', trigger: 'blur' }
            ],
            customerNo: [
              { required: true, message: '请选择客户编号', trigger: 'blur' }
            ],
          },
          formlist:[
            {
              title:"",
              fields:[
                {
                  type:'text',
                  name:'customerNo',
                  placeholder:"请输入客户编号",
                  label:"客户编号"
                },
                {
                  type:'text',
                  name:'name',
                  placeholder:"请输入客户姓名",
                  label:"名字"
                },
                {
                  type:'text',
                  name:'mobileNo',
                  placeholder:"请输入手机号",
                  label:"手机号"
                },
                {
                  type:'datepicker',
                  name:'birthDay',
                  placeholder:"请选择生日",
                  label:"生日"
                },
                {
                  type:'select',
                  name:'sex',
                  style:{"width":"100px"},
                  label:"性别",
                  options:{
                    list:[
                      {
                        label:"男",
                        value:'1'
                      },
                      {
                        label:"女",
                        value:'2'
                      },
                      {
                        label:"其他",
                        value:'3'
                      },
                    ]
                  },
                  func:"selectChange"
                },
                {
                  type:'text',
                  name:'remark',
                  placeholder:"请输入备注",
                  label:"备注"
                },
              ]
            }
          ],
        },
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: "预约编号",
            key: "id"
          },
          {
            title: "订单编号",
            key: "orderNo"
          },
          {
            title: "预约人姓名",
            key: "name"
          },
          {
            title: "预约人联系方式",
            key: "mobileNo"
          },
          {
            title: "预约时间",
            key: "appointmentTime"
          },
          {
            title: "地址",
            key: "addr",
            render:(h,params)=>{

              let item=params.row;
              let cnt =item.province+item.city+item.area+item.address
              return h('div',cnt);
            },
          },
          {
            title: "预约状态",
            key: "status",
            render:(h,params)=>{

              let item=params.row;
              console.log(item);
              let cnt='';
              switch (item.status) {
                case 1:
                  cnt='未支付';
                  break;
                case 2:
                  cnt='已支付';
                  break;
                case 3:
                  cnt='已预约';
                  break;
                case 4:
                  cnt='已取消';
                  break;
                case 5:
                  cnt='已退款';
                  break;
                case 6:
                  cnt='已完成';
                  break;
                default:
                  break;
              }

              return h('div',cnt);
            },
          },
          {
            title: "操作",
            key: "action",
            width: 300,
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

                        let item=params.row;
                        this.address.data=params.row;
                        this.address.data.pdc = [item.province,item.city,item.area]
                        this.address.modal=true;
                        //this.openPage({TableName:'ERP_Module__create?id='+params.row.ID+'&parentCode='+params.row.ParentCode})
                      }
                    }
                  },
                  "编辑"
                ),
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "error",
                //       size: "small"
                //     },
                //     style: {
                //       marginRight: "5px"
                //     },
                //     on: {
                //       click: () => {
                //         this.removeItem(params.row,deleteAppoint);
                //       }
                //     }
                //   },
                //   "删除"
                // ),
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "info",
                //       size: "small"
                //     },
                //     style: {
                //       marginRight: "5px"
                //     },
                //     on: {
                //       click: () => {
                //         this.cancelItem(params.row,cancelAppoint);
                //       }
                //     }
                //   },
                //   "取消预约"
                // ),
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "info",
                //       size: "small"
                //     },
                //     style: {
                //       marginRight: "5px"
                //     },
                //     on: {
                //       click: () => {
                //         //this.removeItem(params.row,deleteCustomerData);
                //         this.nav({path:'/admin/customerbodyedit?id='+params.row.id})
                //       }
                //     }
                //   },
                //   "新增身体数据"
                // ),
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "info",
                //       size: "small"
                //     },
                //     on: {
                //       click: () => {
                //         //this.removeItem(params.row,deleteCustomerData);
                //         this.nav({path:'/admin/customeraddresslist?id='+params.row.id})
                //       }
                //     }
                //   },
                //   "地址信息"
                // ),
              ]);
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
      loadData(){
        this.loadData_table();
      },
      addressconfirm(){
        let rule = this.switchRule(this.address.form.rule);
        let ret = Validator.runwithobj(rule,this.address.data)

        if(ret.result!='success'){
          this.showmsg('info',ret.msg);
          return;
        }
        let pdc =this.address.data.pdc;
        if(pdc.length==3){
          this.address.data.province=pdc[0];
          this.address.data.city=pdc[1];
          this.address.data.area=pdc[2];
        }
        if(pdc.length==2){
          this.address.data.province=pdc[0];
          this.address.data.city=pdc[1];
        }

        updateAppoint(this.address.data).then(res=>{
          this.reload();
        })
      },
      loadData_table(){

        getAppointList({
          pageNum:this.page,
          pageSize:this.pSize,
          search:this.searchForm
        }).then(res=>{
          this.list1=res.data.list;
          console.log(res.data.list);
          this.counts=res.data.count;
        })

      },
      editconfirmModal(){

        updateAppoint(this.edit.data).then(res=>{})
        
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
      doSearch(){
        this.searchForm = this.search.data;
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
