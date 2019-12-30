<template>
  <div class="wrapper">
    <div style="width: 400px">
      <BaseForm
        :form="form1"
        :data="data1"
        :city="city"
        @submit="submit"
        @showModal="showModal"

      ></BaseForm>
    </div>
  </div>
</template>

<script>
  import BaseForm from '@/components/form/Base'
  import {addShop,getShop,editShop} from '@/api/apis'
  import {_13toymdhis} from '@/utils/date.js'
  import {citys} from "@/utils/citys";
  import Validator from '@/utils/validator.js'

  export default {
    name: "",
    data() {
      return {
        city:citys,
        modalTitle:"",
        form1:{
          inline:false,
          MylabelWidth:80,
          ref:"form1",

          rule:{

          },
          formlist:[
            {
              title:"",
              fields:[
                {
                  type:'text',
                  name:'id',
                  placeholder:"",
                  label:"编号",
                  disabled:true
                },
                {
                  type:'text',
                  name:'name',
                  placeholder:"请输入店铺名",
                  label:"店铺名"
                },
                {
                  type:'pdc',
                  name:'pdc',
                  placeholder:"请选择地址",
                  label:"省市区"
                },
                {
                  type:'text',
                  name:'address',
                  placeholder:"请输入店铺详细地址",
                  label:"详细地址"
                },
                {
                  type:'text',
                  name:'telephoneNo',
                  placeholder:"请输入店铺联系方式",
                  label:"联系方式"
                },
                {
                  type:'text',
                  name:'createTime',
                  placeholder:"",
                  label:"创建时间",
                  disabled:true
                },
                {
                  type:'button',
                  name:"保存",
                  color:'primary',
                  func:'submit'
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
      this.loadData();

    },
    methods: {
      loadData(){
        getShop({id:0}).then(res=>{
          let d =res.data;
          this.data1=res.data;
          this.data1.pdc = [d.province,d.city,d.area];
          this.id =d.id;
        })
      },

      submit(){
        this.data1.id=this.id;


        this.data1=this.resovePdc(this.data1);

        if(this.id==0){

          addShop(this.data1).then(res=>{

          })
        }else{

          editShop(this.data1).then(res=>{

          })
        }
      },
      showModal(){
        this.data2={};
        this.modalTitle="新增店铺"
        this.modal1=true;
      },
      confirmModal(){

        let d =this.data2;
        if(!d.pdc){

          this.showmsg('info','省市区未选择');
          return;
        }
        let province=d.pdc[0];
        let city=d.pdc[1];
        let area='';
        if(d.pdc.length==3){
          area=d.pdc[2];
        }

        let rule = this.switchRule(this.form2.rule);
        let ret = Validator.runwithobj(rule,this.data2)
        if(ret.result!='success'){
          this.showmsg('info',ret.msg);
          return;
        }
        addShop({
          'name':d.name,
          'province':province,
          'city':city,
          'area':area,
          'address':d.address,
          'telephoneNo':d.telephoneNo
        }).then(res=>{
          if(res.code=='0'){
            this.modal1=false;
          }
        })
      },
      search(){
        this.searchForm=this.data1;
        this.page=1;
        this.loadData_table();
      }
    }
  }
</script>

<style scoped lang="less">

</style>
