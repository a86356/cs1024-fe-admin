<template>
  <div class="wrapper">
    <div class="tablehd">
      <BaseForm
        :form="edit.form"
        :data="edit.data"
        @search="search"
        @showModal="showModal"
      ></BaseForm>
    </div>
    <Tree class="mytree" ref="tree" :data="tree.data" @on-check-change="checkChange" @on-select-change="selectChange"
          show-checkbox multiple></Tree>

    <div style="margin-top: 50px;">
      <Button type="primary" @click="submit">保存</Button>
    </div>
  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {
    getComponentLists,
    batchAddCategory,
    updateComponent,
    getComponentBySystemId,
    getComponentByMyId
  } from '@/api/apis'
  import Validator from '@/utils/validator.js'

  export default {
    name: "",
    data() {
      return {
        sysCateId:'',
        sysCateName:'',
        myCateId:'',
        tree:{
          data:[]
        },
        single:true,
        edit:{
          form:{
            MylabelWidth:80,
            ref:"form",
            rule:{
              name: [
              ],
            },
            formlist:[
              {
                title:"",
                fields:[
                  {
                    type:'text',
                    name:'name',
                    label:"自定义名称",
                    placeholder:"请输入自定义名称",
                    style:{width:'200px'}
                  },
                  {
                    type:'checkbox',
                    name:'status',
                    label:"是否上架",
                  }
                ]
              }
            ],
          },
          data:{}
        },

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
      this.sysCateId = param.sysCateId;
      this.sysCateName = param.sysCateName;
      this.myCateId = param.myCateId;
    },
    methods: {
      submit() {

        let nodes = this.$refs.tree.getCheckedNodes();

        let arr=[]
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].level == 4) {
            arr.push(nodes[i])
          }
        }

        if (arr.length == 0) {
          this.showmsg('info', '未选择数据');
          return;
        }
        let o=this.data1;

        o.name= this.edit.data.name || '';
        //1 上架。2下架
        o.status = this.edit.data.status?1:0;

        o.components=arr;
        o.systemCategoryId =this.sysCateId;
        o.id =this.myCateId;

        batchAddCategory(o).then(res => {
          this.pop();
        })

      },
      checkChange(){

      },
      loadData() {
        this.loadData_table();
      },

      loadData_table() {


        if(this.myCateId>0){
          getComponentByMyId({
            id:this.myCateId
          }).then(res=>{
            let d=res.data;

            this.edit.data =res.data;

            this.$set(this.edit.data,'status',res.data.status==1?true:false);
            this.tree.data= this.expandTree([this.createTree(d)]);

            console.log(this.tree.data);
          })


        }else{

          getComponentBySystemId({
            id:this.sysCateId,
            systemCategoryName:this.sysCateName
          }).then(res=>{
            let d=res.data;
            this.edit.data =res.data;

            this.tree.data= this.expandTree([this.createTree(d)]);

          })
        }


      },
      createTree(data){
           let temp=data.componentStructure;
           for(let a=0;a<temp.children.length;a++){

             for (let b=0;b<temp.children[a].children.length;b++){
               let third = temp.children[a].children[b];

               temp.children[a].children[b].children=third.components
             }
           }
           return temp;
      },
      batchAdd() {
        batchAddComponent({list: this.selectedArray}).then(res => {})
      },
      showModal() {
        this.modalTitle = "新增"
        this.modal1 = true;
      },
      search() {
        this.searchForm = this.data1;
        this.page = 1;
        this.loadData_table();
      },

    }
  }
</script>

<style scoped>

  /deep/ .ivu-tree .ivu-tree-children .ivu-tree-children .ivu-tree-children li{
    display: flex;
  }

  /deep/ .ivu-tree .ivu-tree-children .ivu-tree-children .ivu-tree-children li ul{
    margin-top: 20px;
  }
  /deep/ .ivu-tree .ivu-tree-children .ivu-tree-children .ivu-tree-children li ul:nth-child(4){
    margin-left: -80px;
  }

  /deep/ .ivu-tree  {
    font-size: 18px;
  }

</style>
