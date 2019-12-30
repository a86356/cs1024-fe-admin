<template>
  <div class="wrapper">

    <div class="tablehd" style="width: 500px">
      <BaseForm
        :form="form1"
        :data="data1"
        @submit="submit"
        @auth="auth"
      ></BaseForm>
    </div>

  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {gettkconfig,settkconfig} from '@/api/apis'
  import Validator from '@/utils/validator.js'
  import {cutlast} from "@/utils/string.js"
  export default {
    name: "",
    inject:['reload'],
    data() {

      return {

        form1:{
          MylabelWidth:120,
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
                  name:'pid',
                  placeholder:"请输入阿里妈妈的一个pid",
                  label:"阿里妈妈pid",
                },
                {
                  type:'text',
                  name:'tb_user_id',
                  placeholder:"请点击授权按钮授权",
                  label:"淘客授权id",
                  disabled:true
                },
                {
                  type:'text',
                  name:'tb_user_nickname',
                  placeholder:"请点击授权按钮授权",
                  label:"淘客用户名",
                  disabled:true
                },
                {
                  type:'text',
                  name:'auth_expired',
                  placeholder:"请点击授权按钮授权",
                  label:"授权过期时间",
                  disabled:true
                },
                {
                  type:'button',
                  name:"保存",
                  func:'submit',
                  color:'info'
                },
                {
                  type:'button',
                  name:"授权",
                  func:'auth',
                  color:'primary'
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
    created(){
      if(this.$route.query.msg=='授权成功'){
        this.data1.tb_user_id=this.$route.query.taobao_user_id
        this.data1.tb_user_nickname=this.$route.query.taobao_user_nick
        this.data1.auth_expired=this.$route.query.expire_time
        this.showmsg('success','授权成功');

      }

    },
    methods: {

      auth(){
        let url="http://taobao.taokouling.com/index/callback?url=http://localhost:8080/admin/tkconfig"
        window.location.href=url;
      },

      loadData(){
        this.loadData_table();
      },

      loadData_table(){
        gettkconfig({
          'service':'store.gettkconfig',
          ...this.data1
        }).then(res=>{

          this.data1=res;
          this.showmsg(res.msg)


        })
      },
      submit(){

        this.data1.service='store.settkconfig';
        settkconfig(this.data1).then(res=>{
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
