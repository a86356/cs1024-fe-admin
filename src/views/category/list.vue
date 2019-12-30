<template>
  <div class="wrapper">

    <div class="tablehd">
      <BaseForm
        :form="form1"
        :data="data1"
        @search="search"
        @batchAdd="batchAdd"
        @searchSelectChange="searchSelectChange"
        @batchDeleteCategory="batchDeleteCategory"
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
        <Button type="primary" size="large" @click="confirmModal">确定</Button>
      </div>
    </Modal>

    <Table stripe @on-selection-change="selectChange" ref="table" :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :page-size="pSize" :total="counts" @on-change='change_page'></Page>
    </div>
  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {getCategoryList,addCategory,batchAddCategory,updateCategory,batchDeleteCategory} from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from "@/utils/string.js"
  export default {
    name: "",
    inject:['reload'],
    data() {

      return {

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
                  name:'systemName',
                  placeholder:"请输入主系统名称",
                },
                {
                  type:'text',
                  name:'name',
                  placeholder:"请输入自定义名称",
                },
                // {
                //   type:'select',
                //   name:'status',
                //   style:{'width':'200px'},
                //   placeholder:"请选择是否拥有",
                //   options:{
                //     list:[
                //       {
                //         label:"全部",
                //         value:''
                //       },
                //       {
                //         label:"上架",
                //         value:'1'
                //       },
                //       {
                //         label:"下架",
                //         value:'0'
                //       },
                //     ]
                //   },
                //   func:"searchSelectChange"
                // },
                {
                  type:'button',
                  name:"搜索",
                  func:'search',
                  color:'info'
                },
                // {
                //   type:'button',
                //   name:"批量新增",
                //   func:'batchAdd',
                //   color:'primary',
                // },
                // {
                //   type:'button',
                //   name:"批量取消品类",
                //   func:'batchDeleteCategory',
                //   color:'error',
                // },
              ]
            }
          ],
        },
        form2:{
          MylabelWidth:100,
          inline:false,
          ref:"form2",
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
            type: 'selection',
            width: 60,
            align: 'center'
          },

          {
            title: "主系统名称",
            key: "systemName"
          },
          {
            title: "自定义名称",
            key: "name"
          },

          // {
          //   title: "是否拥有该类",
          //   key: "had",
          //   render: (h, params) => {
          //
          //     let txt =  params.row.had ?'已选':'未选'
          //     let color =  params.row.had ?'success':'error'
          //     return h('Tag', {
          //       props: {
          //         type: 'dot',
          //         color: color
          //       }
          //     }, txt);
          //   }
          // },
          {
            title: "是否上架",
            key: "had",
            render: (h, params) => {

              let txt =  params.row.status==1 ?'上架':'下架'
              let color =  params.row.status ?'success':'error'
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, txt);
            }
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
                    on: {
                      click: () => {

                        //this.nav({path:'/admin/editcomponent',params:{id:params.row.id}})
                        let item =params.row;

                        this.nav({path:'/admin/editcomponent',query:{
                            sysCateId:item.systemCategoryId,
                            sysCateName:item.systemName,
                            myCateId:item.id
                        }})

                      }
                    }
                  },
                  "编辑"
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

      },
      batchDeleteCategory(){

        if(this.selectedArray.length==0)return;

        let ids='';
        for(let i=0;i<this.selectedArray.length;i++){
            let item=this.selectedArray[i];
            if(item.id!='0'){
              ids+=item.id+','
            }
        }
        ids=ids.substring(0,ids.length-1)

        batchDeleteCategory({
          ids:ids
        }).then(res=>{
          this.reload();
        })
      },
      searchSelectChange(e){
        this.search();
      },
      selectChange(selection){
        this.selectedArray =selection;
        let ids='';
        for(let i=0;i<selection.length;i++){
          ids+=selection[i].systemCategoryId+','
        }
        if(ids.length>0){
          ids = ids.substr(0,ids.length-1);
        }
        this.ids=ids;
      },
      loadData(){
        this.loadData_table();
      },

      loadData_table(){
        getCategoryList({
          pageNum:this.page,
          pageSize:this.pSize,
          search:this.searchForm
        }).then(res=>{


          this.list1=res.data.list;
          // let arr=res.data.list;
          // let temp=[]
          // for(let i=0;i<arr.length;i++){
          //     let item =arr[i];
          //     if(item.had){
          //       temp.push(item)
          //     }
          // }
          // this.list1=temp;

          this.counts=res.data.count;
        })
      },

      batchAdd(){

        if(this.ids==''){
          this.showmsg('info','未选择任何选项');
          return;
        }
        batchAddCategory({systemCategoryIds:this.ids}).then(res=>{
          this.loadData_table();
        })
      },
      showModal(){
        this.modalTitle="新增"
        this.modal1=true;
      },
      search(){

        //let obj=this.data1;
        // let str='{'
        // Object.keys(obj).forEach(function(key){
        //   console.log(key,obj[key]);
        //   str+=key+'='+obj[key]+','
        // });
        // str= this.cutlast(str);
        // if(str.length>0){
        //   str+='}';
        // }


        let t={...this.data1};
        if(t.had){
          t.had= (t.had=='0'?false:true);
        }

        this.searchForm = t;
        this.page=1;
        this.loadData_table();
      },
      confirmModal(){

        let rule =this.form2.rule;
        let ret = Validator.runwithobj(rule,this.data2)
        if(ret.result!='success'){
          this.showmsg('info',ret.msg);
          return;
        }
        updateCategory(this.data2).then(res=>{
          this.modal1=false;
          this.loadData_table();
        })

      }
    }
  }
</script>

<style scoped lang="less">
  .ivu-tree-title{
    font-size: 16px!important;
  }
</style>
