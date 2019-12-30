<template>
  <div class="wrapper">
    <div class="tablehd">
      <BaseForm
        :form="form1"
        :data="data1"
        @search="search"
        @showModal="showModal"
        @batchDelete="batchDelete"
      ></BaseForm>
    </div>

    <Modal
      v-model="modal1"
      :title="modalTitle"
    >
      <BaseForm
        :form="form2"
        :data="data2"
        :city="city"
      ></BaseForm>

      <div slot="footer">
        <Button type="text" size="large" @click="cancelModal">取消</Button>
        <Button type="primary" size="large" @click="confirmModal">确定</Button>
      </div>
    </Modal>
    <Table stripe @on-selection-change="selectChange"  :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :total="counts" :page-size="pSize" @on-change='change_page'></Page>
    </div>
  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {
    getCustomerAddressList,
    batchDeleteAddress,
    updateCustomerAddress,
    addCustomerAddress,
    deleteCustomerAddress
  } from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'
  import {citys} from "@/utils/citys";

  export default {
    name: "",
    data() {
      return {
        city:citys,
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
                  name:'consigneeName',
                  placeholder:"请输入客户名"
                },
                {
                  type:'text',
                  name:'consigneeTelephoneNo',
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
                  name:"新增",
                  func:'showModal',
                  color:'primary'
                },
                {
                  type:'button',
                  name:"批量删除",
                  func:'batchDelete',
                  color:'error'
                },
              ]
            }
          ],
        },
        form2:{
          MylabelWidth:80,
          inline:false,
          ref:"form2",
          rule:{
            consigneeName: [
              { required: true, message: '请输入客户姓名', trigger: 'blur' }
            ],
            consigneeTelephoneNo: [
              { required: true, message: '请输入联系方式', trigger: 'blur' }
            ],
            address: [
              { required: true, message: '请输入详细地址', trigger: 'blur' }
            ],
            pdc:[
              { required: true, message: '请选择省市区', trigger: 'blur' }
            ]
          },
          formlist:[
            {
              title:"",
              fields:[
                {
                  type:'text',
                  name:'consigneeName',
                  placeholder:"请输入客户姓名",
                  label:"名字"
                },
                {
                  type:'text',
                  name:'consigneeTelephoneNo',
                  placeholder:"请输入手机号",
                  label:"手机号"
                },
                {
                  type:'pdc',
                  name:'pdc',
                  placeholder:"请选择地址",
                  label:"省市区"
                },
                {
                  type:'text',
                  name:'address',
                  placeholder:"请输入详细地址",
                  label:"详细地址"
                },
                {
                  type:'textarea',
                  name:'remark',
                  placeholder:"请输入备注",
                  label:"备注"
                },
                {
                  type:'switch',
                  name:'isDefault',
                  open:'是',
                  close:'否',
                  label:"是否默认"
                }
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
            title: "id",
            key: "id"
          },
          {
            title: "姓名",
            key: "customerName"
          },
          {
            title: "收件人姓名",
            key: "consigneeName"
          },
          {
            title: "客户id",
            key: "customerId"
          },
          {
            title: "省份",
            key: "province"
          },
          {
            title: "市",
            key: "city"
          },
          {
            title: "地区",
            key: "area"
          },
          {
            title: "详细地址",
            key: "address"
          },
          {
            title: "联系方式",
            key: "consigneeTelephoneNo"
          },
          {
            title: "备注",
            key: "remark"
          },
          {
            title: "默认地址",
            key: "isDefault",
            render:(h,params)=>{

              return h('div',params.row.isDefault?'是':'否');
            }
          },
          {
            title: "操作",
            key: "action",
            width: 250,
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
                        this.modalTitle="修改信息"
                        let item=params.row;
                        this.data2=item
                        this.data2.pdc = [item.province,item.city,item.area]
                        this.modal1=true;
                        //thi@s.openPage({TableName:'ERP_Module__create?id='+params.row.ID+'&parentCode='+params.row.ParentCode})
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
                        this.removeItem(params.row,deleteCustomerAddress);
                      }
                    }
                  },
                  "删除"
                )
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
    created() {
      var param = this.$route.query;
      // var param = this.$route.params;
      this.id = param.id;
    },
    methods: {
      loadData(){
        this.loadData_table();
      },
      loadData_table(){
        getCustomerAddressList({
          pageNum:this.page,
          pageSize:this.pSize,
          search:this.searchForm,
          customerId:this.id
        }).then(res=>{
          this.list1=res.data.list;
          this.counts=res.data.total;
        })
      },
      showModal(){
        this.data2={};
        this.modalTitle="新增地址"
        this.modal1=true;
      },
      batchDelete(){

        if(this.ids.length==0){
          this.showmsg('info','未选中任何项');
          return;
        }

        this.$Modal.confirm({
          title: '删除',
          content: '您确定要删除吗?',
          onOk: () => {
            batchDeleteAddress({
              ids:this.ids
            }).then(res=>{
              this.loadData()
            })
          }
        });

      },
      search(){
        this.searchForm = this.data1;
        this.page=1;
        this.loadData_table();
      },
      confirmModal(){

        let rule = this.switchRule(this.form2.rule);
        let ret = Validator.runwithobj(rule,this.data2)
        if(ret.result!='success'){
          this.showmsg('info',ret.msg);
          return;
        }
        let pdc =this.data2.pdc;
        if(pdc.length==3){
          this.data2.province=pdc[0];
          this.data2.city=pdc[1];
          this.data2.area=pdc[2];
        }
        if(pdc.length==2){
          this.data2.province=pdc[0];
          this.data2.city=pdc[1];
        }
        this.data2.customerId=this.id;

        if(this.data2.id){
          updateCustomerAddress(this.data2).then(res=>{

            this.modal1=false;
            this.loadData();
          })
        }else{
          addCustomerAddress(this.data2).then(res=>{

            this.modal1=false;
            this.loadData();
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
