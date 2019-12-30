<template>
  <div class="wrapper">

    <div class="tablehd">
      <BaseForm
        :form="mysearch.form"
        :data="mysearch.data"
        @search="search"
        @showModal="showModal"
        @batchDelete="batchDelete"
        @search_select_change="search_select_change"
        @batchScan="batchScan"
        @search_select_materialsource="search_select_materialsource"
        @showBatchUpOrDown="showBatchUpOrDown"
        @search_select_category="search_select_category"
      ></BaseForm>
    </div>

    <Modal
      v-model="myBatchUpOrDown.modal"
      title="批量上下架"
     >
      <Button type="success" @click="batchUpOrDown(1)">批量上架</Button>
      <Button type="error" @click="batchUpOrDown(0)">批量下架</Button>
    </Modal>


    <Modal
      v-model="materialscan.modal"
      :title="materialscan.title"
    >
      <BaseForm
        :form="materialscan.form"
        :data="materialscan.data"
      ></BaseForm>

      <div slot="footer">
        <Button type="primary" size="large" @click="materialScanConfirm">确定</Button>
      </div>
    </Modal>


    <Modal
      v-model="edit.modal"
      title="编辑"
    >
      <BaseForm
        :form="edit.form"
        :data="edit.data"
        @upload="upload"
        @selectCategory="selectCategory"
      ></BaseForm>

      <div slot="footer">
        <Button type="primary" size="large" @click="editConfirm">确定</Button>
      </div>
    </Modal>



    <Table stripe @on-selection-change="selectChangeArray"  :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :page-size="pSize" :total="counts" @on-change='change_page'></Page>
    </div>


  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {
    uploadBase64,
    getMyMaterialList,
    batchAddMaterial,
    batchUpdateMaterial,
    updateMaterial,
    deleteMaterial,
    batchDeleteMaterial,
    addMaterialScan,
    getCategoryList,
    pay
  } from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'
  import PAYCONTANTS from '@/constants/payConstant.js'

  export default {
    name: "",
    inject:['reload'],
    data() {
      return {
        categoryList:[],
        categoryIndex:2,
        myBatchUpOrDown:{
          modal:false
        },
        materialscan:{
          modal:false,
          title:"面料扫描",
          form:{
            MylabelWidth:80,
            ref:"mysearch.form",
            rule:{

              expressCompany: [
                { required: true, message: '请输入快递公司', trigger: 'blur' }
              ],
              expressNo: [
                { required: true, message: '请输入快递单号', trigger: 'blur' }
              ]
            },
            formlist:[
              {
                title:"",
                fields:[
                  {
                    type:'text',
                    name:'expressCompany',
                    label:"快递公司",
                  },
                  {
                    type:'text',
                    name:'expressNo',
                    label:"快递单号",
                  }
                ]
              }
            ],
          },
          data:{}
        },
        //form
        
        mysearch:{
          data:{},
          form:{
            MylabelWidth:0,
            inline:true,
            ref:"form",
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
                    type:'select',
                    name:'categoryName',
                    style:{'width':'120px'},
                    options:{
                      list:[]
                    },
                    placeholder:"请选择品类",
                    func:"search_select_category"
                  },
                  {
                    type:'select',
                    name:'type',
                    style:{'width':'150px'},
                    options:{
                      list:[
                        {
                          value:"",
                          label:"全部"
                        },
                        {
                          value:"1",
                          label:"自有面料"
                        },
                        {
                          value:"2",
                          label:"idz面料"
                        },

                      ]
                    },
                    placeholder:"请选择面料来源",
                    func:"search_select_materialsource"
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
                  {
                    type:'button',
                    name:"批量扫描",
                    func:'batchScan',
                    color:'info'
                  },
                  {
                    type:'button',
                    name:"批量上下架",
                    func:'showBatchUpOrDown',
                    color:'success'
                  },
                ]
              }
            ],
          },
        },
        

        edit:{
          form:{
              MylabelWidth:80,
              inline:false,
              ref:"edit.form",
              rule:{
              price: [
                { required: true, message: '请输入价格', trigger: 'blur' }
              ],
                name: [
                { required: true, message: '请输入名称', trigger: 'blur' }
              ],
                categoryId: [
                { required: true, message: '请选择品类', trigger: 'blur' }
              ],
                cost: [
                { required: true, message: '请输入成本', trigger: 'blur' }
              ],
                describe: [
                { required: true, message: '面料描述', trigger: 'blur' }
              ],
                fabricNo: [
                { required: true, message: '请输入面料编号', trigger: 'blur' }
              ],
            },
            formlist:[
              {
                title:"",
                fields:[
                  {
                    type:'text',
                    name:'price',
                    placeholder:"请输入价格",
                    label:"价格"
                  },
                  {
                    type:'text',
                    name:'name',
                    placeholder:"请输入名称",
                    label:"名称"
                  },
                  {
                    type:'select',
                    name:'categoryId',
                    style:{"width":"100px"},
                    label:"品类",
                    options:{
                      list: []
                    },
                    func:"selectCategory"
                  },
                  {
                    type:'text',
                    name:'cost',
                    placeholder:"请输入成本",
                    label:"成本"
                  },
                  {
                    type:'textarea',
                    name:'describe',
                    placeholder:"请输入面料描述",
                    label:"描述",
                  },
                  {
                    type:'text',
                    name:'fabricNo',
                    placeholder:"请输入面料编号",
                    label:"编号"
                  },
                  {
                    type:'checkbox',
                    name:'status',
                    label:"是否上架",
                  },
                  {
                    type:'upload',
                    title:'上传图片',
                    func:"upload",
                    show:true
                  },
                  {
                    type:'image',
                    func:"uploadImg",
                    style:{
                      "width":"100px",
                      "height":"100px"
                    },
                    label:"图片",
                    name:'photoUrl'
                  },
                ]
              }
            ],
          },
          data:{},
          modal:false
        },

        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: "价格",
            key: "price"
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
            title: "成本",
            key: "cost",
          },
          {
            title: "品类名称",
            key: "categoryName",
          },
          {
            title: "状态",
            key: "scanStatus",
            render: (h, params) => {
              let status = params.row.scanStatus;
              let txt;
              switch (status) {
                case 0:
                  txt="不可申请";
                  break;
                case 1:
                  txt="可申请";
                  break;
                case 2:
                  txt="申请中";
                  break;
                case 3:
                  txt="已扫描";
                  break;
              }
              return h('div',txt)
            }
          },
          {
            title: "来源",
            key: "type",
            render: (h, params) => {
              let status = params.row.type;
              let txt;
              switch (status) {

                case 1:
                  txt="自供";
                  break;
                case 2:
                  txt="idz面料";
                  break;
              }
              return h('div',txt)
            }
          },
          {
            title: "是否上架",
            key: "type",
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
            title: "面料描述",
            key: "describe",
            render: (h, params) => {

              if(params.row.describe){
                let  describe = this.filterHTMLTag(params.row.describe)
              }
              return h('div',params.row.describe)
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
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {

                        this.edit.data=params.row;

                        this.edit.modal=true;

                        if(params.row.type==1){
                          this.edit.form.formlist[0].fields[7].show=true;
                        }else{
                          this.edit.form.formlist[0].fields[7].show=false;
                        }

                        this.edit.data.status=this.edit.data.status==1?true:false;

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
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "success",
                //       size: "small"
                //     },
                //     on: {
                //       click: () => {
                //
                //         if(params.row.scanStatus!='1'){
                //           this.showmsg('info','不可申请扫描');
                //           return;
                //         }
                //
                //         this.nav({path:'/admin/applyscan',query:{id:params.row.id}})
                //       }
                //     }
                //   },
                //   "扫描面料"
                // )
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
      search_select_change(){
        this.search();
      },

      showBatchUpOrDown(){
        let arr=this.selectedArray;

        if(arr==''){
          this.showmsg('info','请先勾选');
          return;
        }
        this.myBatchUpOrDown.modal=true;

      },
      batchUpOrDown(s){


        let arr=this.selectedArray;

        if(arr==''){
          this.showmsg('info','请先勾选');
          return;
        }


        let temp=[]
        for(let i=0;i<arr.length;i++){
            let item =arr[i];
            var o={
              status:s,
              categoryId:item.categoryId,
              id:item.id
            }
            temp.push(o)
        }
        batchUpdateMaterial({
          list:temp
        }).then(res=>{
          this.reload();
        })

      },
      search_select_category(e){
        this.search();
      },
      selectCategory(){

      },
      search_select_materialsource(){
        this.search();
      },
      batchScan(){
        let arr =this.selectedArray;
        if(arr.length==0){
          this.showmsg('info','未选中任何项');
          return;
        }

        for(let i=0;i<arr.length;i++){
           let item =arr[i];
           if(item.scanStatus!='1'){
             this.showmsg('info',item.fabricNo+'不可申请扫描');
             return;
           }
        }
        this.materialscan.modal=true;


      },
      materialScanConfirm(){

        let selectedArray =this.selectedArray;
        if(selectedArray.length==0){
          this.showmsg('info','未选中任何项');
          return;
        }

        let rule = this.switchRule(this.materialscan.form.rule);
        let ret = Validator.runwithobj(rule,this.materialscan.data)

        if(ret.result!='success'){
          this.showmsg('info',ret.msg);
          return;
        }



        let col=  [
          {
            title: "面料名称",
            key: "name"
          },
          {
            title: "面料编号",
            key: "fabricNo"
          },
          {
            title: "价格",
            key: "price"
          },
        ];
        let temp=[];
        for(let i=0;i<selectedArray.length;i++){
          let item =selectedArray[i];
          let obj={...item,...this.materialscan.data}
          obj.fabricName=obj.name;
          obj.fabricId=obj.id;
          delete obj.id;

          temp.push(obj)

        }

        var param={
          list:temp
        }

        this.setCache(PAYCONTANTS.PAYCOLUMN,JSON.stringify(col))
        this.setCache(PAYCONTANTS.PAYSELECTED,JSON.stringify(this.selectedArray))
        this.setCache(PAYCONTANTS.PAYPARAM,JSON.stringify(param))
        this.setCache(PAYCONTANTS.OPERTYPE,3)
        this.setCache(PAYCONTANTS.PAYTYPE,'1,2,3')

        this.nav({path:'/admin/pay'});


      },
      upload(params){
        let e = params.data;

        let _this = this
        var files = e.target.files[0]
        if (!e || !window.FileReader) return  // 看支持不支持FileReader
        let reader = new FileReader()
        reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
        reader.onloadend = function () {
          uploadBase64({base64Str:this.result,type:2}).then(res=>{
            _this.$set(_this.edit.data,'photoUrl', res.data.iconUrl)
          })
        }
      },
      loadData(){
        this.loadData_table();
        this.getCategory();
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
            batchDeleteMaterial({
              ids:this.ids
            }).then(res=>{
              this.loadData()
            })
          }
        });



      },
      getCategory(){


        getCategoryList({}).then(res=>{


          let d =res.data.list;


          let arr =[];
          let other={
            label:'全部',
            value:''
          }
          arr.push(other);
          for(let i=0;i<d.length;i++){

            if(d[i].had){
              let o={
                label:d[i].systemName,
                value:d[i].systemCategoryId
              }
              arr.push(o)
            }
          }

          this.categoryList=arr;


          this.mysearch.form.formlist[0].fields[this.categoryIndex].options.list=arr;
          this.edit.form.formlist[0].fields[2].options.list=arr;

        })
      },
      loadData_table(){
        getMyMaterialList({
          pageNum:this.page,
          pageSize:this.pSize,
          search:this.searchForm
        }).then(res=>{
          this.list1=res.data.list;
          this.counts=res.data.total;
        })
      },

      batchAdd(){
        batchAddMaterial({list:this.selectedArray}).then(res=>{})
      },
      showModal(){
        this.edit.data={};
        this.modalTitle="新增面料"
        this.edit.form.formlist[0].fields[7].show=true;

        this.edit.modal=true;
      },
      search(){

    
        this.searchForm = this.mysearch.data;

        console.log(this.searchForm);

        this.page=1;
        this.list1=[];
        this.loadData_table();
      },

      editConfirm(){

        this.edit.data.status =this.edit.data.status?1:0;

        let o=this.edit.data;
        o.status =o.status?1:0;

        let rule =this.edit.form.rule;
        let ret = Validator.runwithobj(rule,o)
        if(ret.result!='success'){
          this.showmsg('info',ret.msg);
          return;
        }


        if(o.id){

          updateMaterial(o).then(res=>{
            this.edit.modal=false;
            this.loadData();
          })
        }else{

          batchAddMaterial({list:[o]}).then(res=>{
            this.edit.modal=false;
            this.loadData();
          })
        }


      }
    }
  }
</script>

<style scoped lang="less">

</style>
