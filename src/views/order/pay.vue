<template>
  <div class="wrapper">

    <BaseForm
      :form="form1"
      :data="data1"
      @submit="submit"
    ></BaseForm>

  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {payOrder} from '@/api/apis'

  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'

  export default {
    name: "",
    inject:['reload'],
    data() {
      return {
        form1:{
          MylabelWidth:0,
          inline:false,
          ref:"form1",
          rule:{},
          formlist:[
            {
              title:"",
              fields:[
                {
                    type:'select',
                    name:'payment',
                    style:{'width':'200px'},
                    options:{
                      list:[
                        {
                          label:"余额",
                          value:'1'
                        },
                        {
                          label:"微信",
                          value:'2'
                        },
                        {
                          label:"支付宝",
                          value:'2'
                        },
                      ]
                    },
                    placeholder:"请选择支付方式",
                    func:"select_paytype"
                },
                {
                  type:'password',
                  name:'password',
                  style:{'width':'200px'},
                  placeholder:"支付密码",
                },
                {
                  type:'button',
                  name:"提交",
                  func:'submit',
                  color:'info'
                }
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
      this.orderIds= this.getCache('payOrderIds').split(',');
    },
    methods: {

      submit(){
        let d=this.data1;
        d.list=this.orderIds;
        payOrder(d).then(res=>{})
      }

    }
  }
</script>

<style scoped lang="less">

</style>
