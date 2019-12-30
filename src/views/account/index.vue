<template>
    <div class="wrapper">
      <div>
        <Button type="primary" @click="showModal">修改密码</Button>
      </div>


      <div style="width: 500px">
        <BaseForm
          :form="form3"
          :data="data3"
          @save="save"
        ></BaseForm>
      </div>


      <Modal
        v-model="modal1"
        title="修改密码"
      >
        <BaseForm
          :form="form2"
          :data="data2"
        ></BaseForm>

        <div slot="footer">
          <Button type="text" size="large" @click="cancelModal">取消</Button>
          <Button type="primary" size="large" @click="confirmModal">确定</Button>
        </div>
      </Modal>

    </div>
</template>

<script>
    import { mapState,mapGetters,mapMutations,mapActions} from 'vuex'
    import {changepassword,updateAgent,getAgent} from '@/api/apis';
    import BaseForm from '@/components/form/Base'
    import Validator from '@/utils/validator.js'
    import {_13toymdhis} from '@/utils/date.js'
    import Encrypt from '@/utils/encrypt'

    export default {
        name: "",
        inject:['reload'],
        data() {
            return {

              form2:{
                MylabelWidth:120,
                ref:"form2",
                rule:{
                  newpassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' }
                  ],
                  newpasswordagain: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' }
                  ],
                },
                formlist:[
                  {
                    title:"",
                    fields:[
                      {
                        type:'password',
                        name:'newpassword',
                        placeholder:"请输入新密码",
                        label:"新密码",
                      },
                      {
                        type:"password",
                        name:"newpasswordagain",
                        placeholder:"请再次输入新密码",
                        label:"确认新密码"
                      }
                    ]
                  }
                ],
              },
              form3:{
                MylabelWidth:120,
                ref:"form2",
                rule:{
                  kefuweixin: [
                    { required: true, message: '请输入客服微信', trigger: 'blur' }
                  ],

                },
                formlist:[
                  {
                    title:"",
                    fields:[
                      {
                        type:'text',
                        name:'kefuweixin',
                        placeholder:"请输入客服微信(客户可以通过这个微信找到你)",
                        label:"客服微信",
                      },
                      {
                        type:"button",
                        name:"保存",
                        color:"info",
                        func:"save"
                      }
                    ]
                  }
                ],
              },
              data3:{}
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
            getAgent({
              service:"store.getagent"
            }).then(res=>{
              this.data3=res;
            })
          },
          confirmModal(){

            let rule = this.switchRule(this.form2.rule);
            let ret = Validator.runwithobj(rule,this.data2)
            if(ret.result!='success'){
              this.showmsg('info',ret.msg);
              return;
            }

            this.data2.service='store.changepassword';
            changepassword(this.data2).then(res=>{
              this.modal1=false;
            })
          },

          showModal(){
            this.modal1=true;
          },
          save(){
              if(this.data3.kefuweixin==''){
                this.showmsg('info','请填写客服微信');
                return ;
              }

            updateAgent({
              service:"store.updateagent",
              ...this.data3
            }).then(res=>{
              this.showmsg('info','成功');
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
