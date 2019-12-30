<template>
  <div class="wrapper">

    <div class="tablehd" style="width: 500px">
      <BaseForm
        :form="form1"
        :data="data1"
        @submit="submit"
      ></BaseForm>
    </div>

  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {getgzhconfig,updategzhconfig} from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from "@/utils/string.js"
  export default {
    name: "",
    inject:['reload'],
    data() {

      return {

        form1:{
          MylabelWidth:150,
          inline:false,
          ref:"form1",
          rule:{},
          formlist:[
            {
              title:"",
              fields:[
                {
                  type:'text',
                  name:'bid',
                  placeholder:"淘客编号",
                  label:"编码",
                  disabled:true
                },
                {
                  type:'text',
                  name:'appid',
                  placeholder:"请输入appid",
                  label:"公众号appid",
                },
                {
                  type:'text',
                  name:'appsecret',
                  placeholder:"请输入appsecret",
                  label:"公众号appsecret",
                },
                {
                  type:'text',
                  name:'gh_id',
                  placeholder:"请输入公众号id",
                  label:"公众号id",
                },
                {
                  type:'text',
                  name:'tpl_id',
                  placeholder:"请输入模板id",
                  label:"公众号模板id",
                },
                {
                  type:'button',
                  name:"保存",
                  func:'submit',
                  color:'info'
                },

              ]
            }
          ],
        },
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
        getgzhconfig({
          'service':'store.getgzhconfig'
        }).then(res=>{

          this.data1=res;

        })
      },
      submit(){

        this.data1.service='store.setgzhconfig';
        updategzhconfig(this.data1).then(res=>{
          this.showmsg('success','保存成功');
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
