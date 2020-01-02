<template>
    <div style="text-align:center;padding-top:10%" >


      <div style="margin-bottom: 20px;text-align: center;">

        <h1 @click="quicklogin">行者课堂</h1>

      </div>
      <div class="loginform">
        <BaseForm
          :form="form1"
          :data="data1"
          @login="login"
          @showModal="showModal"
          @showResigterModal="showResigterModal"
        ></BaseForm>

      </div>



    </div>
</template>

<script>
import BaseForm from '@/components/form/Base'
import BaseConfig from '@/config/config'
import {login,registerAgent} from '@/api/apis';
import {setCacheData} from "@/utils/cache";
import Validator from '@/utils/validator.js'

export default {
    name:"Login",
    data(){
        return{

          register:{
            form:{
              inline:false,
              ref:"form1",
              rule:{
                phone: [
                  { required: true, message: '请输入手机号', trigger: 'blur' }
                ],
                password: [
                  { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                passwordagain: [
                  { required: true, message: '请再次输入密码', trigger: 'blur' }
                ],
              },
              formlist:[
                {
                  title:"",
                  fields:[
                    {
                      type:'text',
                      name:'phone',
                      placeholder:"请输入手机号",
                      label:"手机号"
                    },
                    {
                      type:'password',
                      name:'password',
                      placeholder:"请输入密码",
                      label:"密码"
                    },
                    {
                      type:'password',
                      name:'passwordagain',
                      placeholder:"请再次输入密码",
                      label:"再次输入密码"
                    },
                  ]
                }
              ],
            },
            data:{},
            modal:false
          },

          form1:{
              inline:true,
              ref:"form1",
              rule:{
                username: [
                  { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                  { required: true, message: '请输入密码', trigger: 'blur' }
                ],
              },
              formlist:[
                {
                  title:"",
                  fields:[
                    {
                      type:'text',
                      name:'username',
                      placeholder:"请输入用户名",
                    },
                    {
                      type:'password',
                      name:'password',
                      placeholder:"请输入密码",
                    },
                    {
                      type:'button',
                      name:"登录",
                      func:'login',
                      color:'primary'
                    },
                    {
                      type:'button',
                      name:"注册",
                      func:'showResigterModal',
                      color:'primary'
                    },
                  ]
                }
              ],
            },
          form2:{
            MylabelWidth:80,
            ref:"form2",
            rule:{
              account: [
                { required: true, message: '请输入手机号', trigger: 'blur' }
              ],
              msgCode: [
                { required: true, message: '请输入短信验证码', trigger: 'blur' }
              ],
              newPassword: [
                { required: true, message: '请输入新密码', trigger: 'blur' }
              ],
            },
            formlist:[
              {
                title:"",
                fields:[
                  {
                    type:'text',
                    name:'account',
                    placeholder:"请输入手机号",
                    label:"手机号"
                  },
                  {
                    type:'msgcode',
                    name:'msgCode',
                    placeholder:"请输入验证码",
                    label:"验证码",
                    func:'sendcode'
                  },
                  {
                    type:"password",
                    name:"newPassword",
                    placeholder:"请输入新密码",
                    label:"新密码"
                  },
                ]
              }
            ],
          },
        }
    },
    created(){

    },
    methods:{
        showResigterModal(){
          this.register.modal=true;
        },
        quicklogin(){
            login({
                service:"admin.login",
                username:'cs',
                password:'2'
            }).then(res=>{

                setCacheData({k:BaseConfig.TOKEN_KEY,v:res.auth_key})
                this.nav({path:BaseConfig.HOME_PATH})
            })
        },
        registerConfirm(){
          let d= this.register.data;
          if(d.password!=d.passwordagain){
            this.showmsg('info','两次输入的密码不一致');
            return
          }
          let ret=Validator.v.vPhone(d.phone);

          if(ret!=true){
            this.showmsg('info',ret);
            return;
          }

          registerAgent({...d,service:'store.register'}).then(res=>{
            this.register.modal=false
            this.showmsg('info','注册成功,请登录');

          }).catch(e=>{
            this.showmsg('info',res.msg);
          })
        },
        login(){

            let rule = this.switchRule(this.form1.rule);
            let ret = Validator.runwithobj(rule,this.data1)
            if(ret.result!='success'){
              this.showmsg('info',ret.msg);
              return;
            }

            this.data1.service='store.login';
            login(this.data1).then(res=>{

              setCacheData({k:BaseConfig.TOKEN_KEY,v:res.auth_key})
              this.nav({path:BaseConfig.HOME_PATH})
            })

        },



    },
  components:{
    BaseForm
  }
}
</script>

<style lang="less">
.loginform{
  width: 200px;
  margin:0 auto;
}
.forgetpassword{
  color: deepskyblue;

}
.forgetpassword:hover{
  text-decoration: underline;
}
</style>
