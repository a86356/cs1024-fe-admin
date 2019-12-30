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
      ></BaseForm>

      <div slot="footer">
        <Button type="text" size="large" @click="cancelModal">取消</Button>
        <Button type="primary" size="large" @click="confirmModal">确定</Button>
      </div>

    </Modal>
    <Table stripe @on-selection-change="selectChange"  :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :total="counts" @on-change='change_page'></Page>
    </div>
  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {getEmployee,getEmployeeList,addEmployee,updateEmployee,deleteEmployee,batchDeleteEmployee} from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'

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
                  placeholder:"请输入员工名"
                },
                {
                  type:'button',
                  name:"搜索",
                  func:'search',
                  color:'info'
                },
                {
                  type:'button',
                  name:"新增员工",
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
            name: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
            ],
            telephoneNo: [
              { required: true, message: '请输入联系方式', trigger: 'blur' }
            ],
          },
          formlist:[
            {
              title:"",
              fields:[
                {
                  type:'text',
                  name:'name',
                  placeholder:"请输入员工名",
                  label:"名字"
                },
                {
                  type:'text',
                  name:'telephoneNo',
                  placeholder:"请输入联系方式",
                  label:"联系方式"
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
            title: "名字",
            key: "name"
          },
          {
            title: "联系方式",
            key: "telephoneNo"
          },
          {
            title: "创建时间",
            key: "createTime"
          },
          {
            title: "操作",
            key: "action",
            width: 150,
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

                        this.data2=params.row;
                        this.modal1=true;

                        //this.openPage({TableName:'ERP_Module__create?id='+params.row.ID+'&parentCode='+params.row.ParentCode})
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
                    on: {
                      click: () => {
                        this.removeItem(params.row,deleteEmployee);
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
    methods: {
      loadData(){
        this.loadData_table();
      },
      loadData_table(){
        getEmployeeList({
          pageNum:this.page,
          pageSize:this.pSize,
          search:this.searchForm
        }).then(res=>{
          this.list1=res.data.list;
          this.counts=res.data.count;
        })
      },
      showModal(){
        this.data2={};
        this.modalTitle="新增员工"
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

            batchDeleteEmployee({
              ids:this.ids
            }).then(res=>{
              this.loadData();
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

        if(this.data2.id){

          updateEmployee(this.data2).then(res=>{
            this.modal1=false;
            this.loadData();
          })
        }else{
          addEmployee(this.data2).then(res=>{
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
