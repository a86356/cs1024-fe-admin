<template>
  <div class="wrapper">

    <div class="account">
      <BaseForm
        :form="form1"
        :data="data1"
        @submit="submit"
      ></BaseForm>
    </div>

  </div>
</template>

<script>
  import { mapState,mapGetters,mapMutations,mapActions} from 'vuex'
  import {addMaterialScan} from '@/api/apis';
  import BaseForm from '@/components/form/Base'
  import Validator from '@/utils/validator.js'
  import {_13toymdhis} from '@/utils/date.js'

  export default {
    name: "",
    data() {
      return {
        data1:{fee:50},
        form1:{
          MylabelWidth:80,
          ref:"form1",
          rule:{
            expressCompany: [
              { required: true, message: '请输入快递公司', trigger: 'blur' }
            ],
            expressNo: [
              { required: true, message: '请输入快递单号', trigger: 'blur' }
            ],
            payType: [
              { required: true, message: '请选择支付方式', trigger: 'blur' }
            ],
          },
          formlist:[
            {
              title:"",
              fields:[
                {
                  type:'text',
                  name:'fabricId',
                  label:"面料id",
                  disabled:true
                },
                {
                  type:'text',
                  name:'fee',
                  label:"扫描费用",
                  disabled:true
                },
                {
                  type:'text',
                  name:'expressCompany',
                  label:"快递公司",
                },
                {
                  type:'text',
                  name:'expressNo',
                  label:"快递单号",
                },
                {
                  type:'select',
                  name:'payType',
                  placeholder:"",
                  label:"支付方式",
                  options:{
                    list:[
                      {
                        label:"余额",
                        value:'1'
                      },
                      {
                        label:"支付宝",
                        value:'2'
                      },
                      {
                        label:"微信",
                        value:'3'
                      },
                    ]
                  },
                  func:"change_paytype"
                },
                {
                  type:'button',
                  name:'立即支付',
                  color:'primary',
                  func:"submit"
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

    },
    created(){
      var param = this.$route.query;
      this.data1.fabricId =param.id;
    },
    methods: {
      confirmModal(){

        let rule = this.switchRule(this.form1.rule);
        let ret = Validator.runwithobj(rule,this.data1)
        if(ret.result!='success'){
          this.showmsg('info',ret.msg);
          return;
        }

        editPassword(this.data1).then(res=>{
          this.showmsg('success',res.msg);
          setTimeout(()=>{
            this.modal1=false;
          },1000)
        })
      },
      submit(){
        let rule = this.switchRule(this.form1.rule);
        let ret = Validator.runwithobj(rule,this.data1)
        if(ret.result!='success'){
          this.showmsg('info',ret.msg);
          return;
        }
        addMaterialScan(this.data1).then(res=>{

        })
      }
    }
  }
</script>

<style scoped lang="less">
  .account{
    width: 300px;
    margin-top: 20px;
  }
</style>
