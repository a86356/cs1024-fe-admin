<template>
  <div class="wrapper">
    <div class="tablehd">
      <BaseForm
        :form="form1"
        :data="data1"
        @search="search"
        @goAddPage="goAddPage"
        @batchDelete="batchDelete"
      ></BaseForm>
    </div>


    <Table stripe width="1600" @on-selection-change="selectChange"  :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page  :page-size="pSize" :total="counts" @on-change='change_page'></Page>
    </div>
  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {getBodyDataList,batchDeleteBodyData,deleteBodyData} from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'

  export default {
    name: "",
    data() {
      return {
        customerId:0,
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
                  func:'search',
                  color:'info'
                },
                {
                  type:'button',
                  name:"新增",
                  func:'goAddPage',
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
              { required: true, message: '请输入用户姓名', trigger: 'blur' }
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
            align: 'center',
            fixed: 'left'
          },
          {
            title: "编号id",
            key: "id",
            width:100
          },
          {
            title: "客户id",
            key: "customerId",
            width:100
          },
          {
            title: "客户名",
            key: "customerName",
            width:100
          },
          {
            title: "肩宽",
            key: "shoulderWidth",
            width:100
          },
          {
            title: "袖长",
            key: "sleeveLength",
            width:100
          },
          {
            title: "袖肥",
            key: "sleeveWidth",
            width:100
          },
          {
            title: "袖口",
            key: "cuff",
            width:100
          },
          {
            title: "领围",
            key: "neckGirth",
            width:100
          },
          {
            title: "胸围",
            key: "bustGirth",
            width:100
          },
          {
            title: "肚围",
            key: "bellyGirth",
            width:100
          },
          {
            title: "下摆",
            key: "sweep",
            width:100
          },

          {
            title: "前衣长",
            key: "frontLength",
            width:100
          },

          {
            title: "后衣长",
            key: "backLength",
            width:100
          },
          {
            title: "左肩斜度",
            key: "leftShoulderSlope",
            width:100
          },
          {
            title: "右键斜度",
            key: "rightShoulderSlope",
            width:100
          },

          {
            title: "腰围",
            key: "waist",
            width:100
          },
          {
            title: "臀围",
            key: "hipline",
            width:100
          },
          {
            title: "横裆",
            key: "crosspiece",
            width:100
          },
          {
            title: "通裆",
            key: "crotchWidth",
            width:100
          },
          {
            title: "裤长",
            key: "outseam",
            width:100
          },
          {
            title: "内长",
            key: "insideLength",
            width:100
          },
          {
            title: "脚口",
            key: "panls",
            width:100
          },
          {
            title: "身高",
            key: "height",
            width:100
          },
          {
            title: "创建时间",
            key: "createTime",
            width:100
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

                        this.nav({path:'/admin/customerbodyedit',query:{bodyId:params.row.id,customerId:this.customerId}})
                      }
                    }
                  },
                  "编辑"
                ),
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
    created(){
      var param = this.$route.query;
      this.customerId =param.customerId;

    },
    methods: {
      loadData(){
        this.loadData_table();
      },
      goAddPage(){

        this.nav({path:'/admin/customerbodyedit',query:{bodyId:0,customerId:this.customerId}})

      },
      loadData_table(){

        let s=this.searchForm;
        s.customerId=this.customerId
        getBodyDataList({
          pageNum:this.page,
          pageSize:this.pSize,
          search:s,

        }).then(res=>{
          this.list1=res.data.list;
          this.counts=res.data.count;
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

        this.$Modal.confirm({
          title: '删除',
          content: '您确定要删除吗?',
          onOk: () => {
            batchDeleteBodyData({
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

    }
  }
</script>

<style scoped lang="less">

</style>
