<template>
  <div class="wrapper">
    <div class="tablehd">
      <BaseForm
        :form="form1"
        :data="data1"
        @search="search"
        @showModal="showModal"
        @batchAdd="batchAdd"
      ></BaseForm>
    </div>

    <Modal
      v-model="modal1"
      :title="modalTitle"
    >
      <BaseForm
        :form="form2"
        :data="data2"
      ></BaseForm>

      <div slot="footer">
        <Button type="text" size="large" @click="cancelModal">取消</Button>
        <Button type="primary" size="large" @click="confirmModal">确定</Button>
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
  import {getSystemFabricsList,batchAddMaterial,batchUpdateMaterial,updateMaterial,deleteMaterial,batchDeleteMaterial,addMaterialScan} from '@/api/apis'
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
          rule:{

          },
          formlist:[
            {
              title:"",
              fields:[
                {
                  type:'text',
                  name:'name',
                  placeholder:"请输入面料名称"
                },
                {
                  type:'text',
                  name:'fabricNo',
                  placeholder:"请输入面料编号"
                },
                {
                  type:'button',
                  name:"搜索",
                  func:'search',
                  color:'info'
                },
                {
                  type:'button',
                  name:"批量新增",
                  func:'batchAdd',
                  color:'primary'
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
            name: [
              { required: true, message: '请输入客户姓名', trigger: 'blur' }
            ],
            sex: [
              { required: true, message: '请选择客户性别', trigger: 'blur' }
            ],
            remark: [
              { required: true, message: '请选择客户性别', trigger: 'blur' }
            ],
          },
          formlist:[
            {
              title:"",
              fields:[
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
                  }
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
            title: "建议零售价",
            key: "price"
          },
          {
            title: "供货价",
            key: "cost"
          },
          {
            title: "面料名称",
            key: "name"
          },
          {
            title: "面料编号",
            key: "fabricNo"
          },
          {
            title: "面料图",
            key: "photoUrl",
            render: (h, params) => {
              return h('div',[
                h('img',{
                  attrs: {
                    src: params.row.photoUrl,
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
            title: "品类名称",
            key: "categoryName",

          },
          {
            title: "面料描述",
            key: "describe",
            render: (h, params) => {
              let  describe = this.filterHTMLTag(params.row.describe)
              return h('div',describe)
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



                        batchAddMaterial({list:[params.row]}).then(res=>{
                          this.reload();
                        })

                      }
                    }
                  },
                  "添加到我的面料"
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
    methods: {
      loadData(){
        this.loadData_table();
      },
      loadData_table(){
        getSystemFabricsList({
          pageNum:this.page,
          pageSize:this.pSize,
          search:this.searchForm
        }).then(res=>{
          this.list1=res.data.list;
          this.counts=res.data.total;
        })
      },

      selectChange(selection){

        this.selectedArray=selection;
      },
      batchAdd(){

        if(this.selectedArray==''){
          this.showmsg('info','请先勾选');
          return;
        }

        batchAddMaterial({list:this.selectedArray}).then(res=>{

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
