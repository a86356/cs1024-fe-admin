<template>
  <div class="wrapper">

    <div class="tablehd">
      <BaseForm
        :form="form1"
        :data="data1"
        @search="search"
        @showModal="showModal"
      ></BaseForm>
    </div>

    <Modal
      v-model="modal1"
      :title="modalTitle"
    >

      <Tree :data="data2" @on-check-change="checkChange" @on-select-change="selectChange"   show-checkbox multiple></Tree>

      <div slot="footer">
        <Button type="primary" size="large" @click="confirmModal1">确定</Button>
      </div>
    </Modal>

    <Modal
      v-model="modal2"
      :title="modalTitle"
    >
      <BaseForm
        :form="form3"
        :data="data3"
      ></BaseForm>

      <div slot="footer">
        <Button type="primary" size="large" @click="confirmModal3">确定</Button>
      </div>
    </Modal>

    <Table stripe ref="table" :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :page-size="pSize" :total="counts" @on-change='change_page'></Page>
    </div>
  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {getComponentList,batchAddComponent,updateComponent} from '@/api/apis'
  import Validator from '@/utils/validator.js'

  export default {
    name: "",
    data() {
      return {
        data2:[],
        data3:{},
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
        form3:{
          MylabelWidth:100,
          inline:false,
          ref:"form3",
          rule:{},
          formlist:[
            {
              title:"",
              fields:[
                {
                  type:'text',
                  name:'name',
                  placeholder:"请输入自定义名称",
                  label:"自定义名称"
                },
              ]
            }
          ],
        },
        columns1: [
          {
            title: "部件id",
            key: "id"
          },
          {
            title: "主系统名称",
            key: "systemName"
          },
          {
            title: "自定义名称",
            key: "name"
          },

          {
            title: "主系统部件id",
            key: "systemComponentId",
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

                        let idx = params.index;
                        //this.data2=this.list1[idx].children;

                        this.nav({path:'/admin/editcomponent',query:{id:idx}})

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
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.removeItem(params.row,deleteMaterial);

                      }
                    }
                  },
                  "删除"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.nav({path:'/admin/applyscan',params:{id:params.row.id}})
                      }
                    }
                  },
                  "扫描面料"
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
      uploadImg(){

      },
      checkChange(e){
        console.log(e)
      },
      selectChange(e){
        this.modal2=true;
      },
      loadData(){
        this.loadData_table();
      },

      loadData_table(){
        getComponentList({
          pageNum:this.page,
          pageSize:this.pSize,
          search:this.searchForm
        }).then(res=>{
          this.list1=res.data.list;
          this.data2=res.data.list;
          this.counts=res.data.count;
        })
      },

      batchAdd(){
        batchAddComponent({list:this.selectedArray}).then(res=>{})
      },
      showModal(){
        this.modalTitle="新增"
        this.modal1=true;
      },
      search(){
        this.searchForm = this.data1;
        this.page=1;
        this.loadData_table();
      },
      confirmModal1(){
        console.log(1);
      },
      confirmModal3(){

        let rule =this.form3.rule;
        let ret = Validator.runwithobj(rule,this.data3)
        if(ret.result!='success'){
          this.showmsg('info',ret.msg);
          return;
        }
        // if(this.data2.id){
        //   updateMaterial(this.data2).then(res=>{
        //     setTimeout(()=>{
        //       this.modal1=false;
        //     },1000)
        //   })
        // }else{
        //   batchUpdateMaterial({list:[this.data2]}).then(res=>{
        //     setTimeout(()=>{
        //       this.modal1=false;
        //     },1000)
        //   })
        // }
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/ .ivu-tree-title{
    font-size: 16px!important;
  }
</style>
