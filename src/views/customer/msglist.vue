<template>
  <div class="wrapper">
    <div class="tablehd">
      <BaseForm
        :form="form1"
        :data="data1"
        @search="search"
      ></BaseForm>
    </div>

    <Table stripe   :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :page-size="pSize" :total="counts" @on-change='change_page'></Page>
    </div>
  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {getMsgList} from '@/api/apis'
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
          rule:{},
          formlist:[
            {
              title:"",
              fields:[
                {
                  type:'text',
                  name:'phone',
                  placeholder:"请输入客户手机号"
                },
                {
                  type:'button',
                  name:"搜索",
                  func:'search',
                  color:'info'
                },

              ]
            }
          ],
        },
        columns1: [
          {
            title: "编号",
            key: "id"
          },
          {
            title: "商户id",
            key: "bid"
          },
          {
            title: "公众号openid",
            key: "openid"
          },
          {
            title: "手机号",
            key: "phone"
          },
          {
            title: "收到的消息",
            key: "msg"
          },
          {
            title: "回复的消息",
            key: "msgtouser"
          },
          {
            title: "创建时间",
            key: "dateline",
            render:(h,params)=>{
              let timestamp4=  new Date( parseInt(params.row.dateline+'000')).Format('yy-MM-dd hh:mm:ss')
              return h('div',timestamp4);
            },
          },

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
        getMsgList({
          page:this.page,
          'service':'store.getmsglist',
          ...this.data1
        }).then(res=>{
          this.list1=res.list;
          this.counts=res.count;
        })
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
