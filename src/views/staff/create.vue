<template>
  <div class="wrapper">
    <div class="tablehd">
      <BaseForm
        :form1="form1"
        @submit="submit"
      ></BaseForm>
    </div>

  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  export default {
    name: "",
    data() {
      return {
        form1:{
          inline:true,
          rule:{

          },
          formlist:[
            {
              title:"一级内容",
              fields:[
                {
                  type:'text',
                  name:'username',
                  placeholder:"请输入用户名",
                  style:'width:30%',
                  label:"用户名"
                },
                {
                  type:'text',
                  name:'address',
                  placeholder:"请输入地址",
                  style:'width:30%',
                  label:"地址"
                },
                {
                  type:'text',
                  name:'school',
                  placeholder:"请输入学校",
                  style:'width:30%',
                  label:"学校"
                },
                {
                  type:'text',
                  name:'phone',
                  placeholder:"请输入手机",
                  style:'width:30%',
                  label:"手机"
                },

                {
                  type:'button',
                  name:"提交",
                  func:'submit',
                  color:'primary',
                  style:'display:block'
                }

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
            title: "名字",
            key: "city_name"
          },
          {
            title: "时间",
            key: "startline"
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
                        console.log(params);
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
                        this.removeItem(params);
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
    },
    methods: {
      submit(form1){
        console.log(form1);
      }
    }
  }
</script>

<style scoped lang="less">

</style>
