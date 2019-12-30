<template>
  <div class="wrapper">
    <div style="margin-bottom: 20px;">
      <h2 style="margin-bottom: 10px;">支付商品</h2>
      <Table stripe @on-selection-change="selectChange"  :loading="loading1"  border :columns="column1" :data="selected"></Table>
    </div>

    <BaseForm
      :form="form1"
      :data="data1"
      @submit="submit"
    ></BaseForm>

  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {pay} from '@/api/apis'

  import Validator from '@/utils/validator.js'
  import {cutlast} from '@/utils/string.js'
  import {cntoymd} from '@/utils/date.js'
  import PAYCONTANTS from '@/constants/payConstant.js'
  import Encrypt from '@/utils/encrypt'

  export default {
    name: "",
    inject:['reload'],
    data() {
      return {
        form1:{
          MylabelWidth:0,
          inline:false,
          ref:"form1",
          rule:{
            payment: [
              { required: true, message: '请选择支付方式', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入支付密码', trigger: 'blur' }
            ],
          },
          formlist:[
            {
              title:"",
              fields:[
                {
                  type:'select',
                  name:'payment',
                  style:{'width':'200px'},
                  options:{
                    list:[]
                  },
                  placeholder:"请选择支付方式",
                  func:"select_paytype"
                },
                {
                  type:'password',
                  name:'password',
                  style:{'width':'200px'},
                  placeholder:"请输入支付密码",
                },
                {
                  type:'button',
                  name:"支付",
                  func:'submit',
                  color:'info'
                }
              ]
            }
          ],
        },
        column1:[],
        operType:'',
        selected:[],
        payparam:{}
      }
    },
    components: {
      BaseForm
    },
    mounted() {

      this.column1=JSON.parse(this.getCache(PAYCONTANTS.PAYCOLUMN))
      this.selected=JSON.parse(this.getCache(PAYCONTANTS.PAYSELECTED))
      this.payparam=JSON.parse(this.getCache(PAYCONTANTS.PAYPARAM))
      this.operType=this.getCache(PAYCONTANTS.OPERTYPE)
      let arr=this.getCache(PAYCONTANTS.PAYTYPE).split(',')
      let t=[];
      for(let i=0;i<arr.length;i++){
          let item =arr[i];
          if(item=='1'){
            t.push({label:"余额", value:'1'})
          }
          if(item=='2'){
            t.push({label:"微信", value:'2'})
          }
          if(item=='3'){
            t.push({label:"支付宝", value:'3'})
          }
      }
      this.form1.formlist[0].fields[0].options.list=t;
    },
    methods: {

      submit(){
        let rule = this.switchRule(this.form1.rule);
        let ret = Validator.runwithobj(rule,this.data1)

        if(ret.result!='success'){
          this.showmsg('info',ret.msg);
          return;
        }
        let o={...this.data1};
        o.operType=this.operType;


        o.param=this.payparam;
        o.password = Encrypt.encrypt(o.password)

        pay(o).then(res=>{

          setTimeout(()=>{
            if(res.code==0){
              this.pop();
            }
          })


        })

      }

    }
  }
</script>

<style scoped lang="less">

</style>
