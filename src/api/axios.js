import axios from 'axios';
import {getCacheData} from "@/utils/cache";
import BaseConfig from '@/config/config'
import Context from '@/main.js'
import Encrypt from '@/utils/encrypt'



axios.defaults.timeout = 15000;
axios.defaults.baseURL =BaseConfig.baseURL;

//http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
  //  config.data = JSON.stringify(config.data);
    let token = getCacheData(BaseConfig.TOKEN_KEY);

    config.headers = {
      'Content-Type':' application/json',
    }
    if(token){
      config.headers['token']=token
    }

    //  config.params = {'token':'FFE23FD9CD6C7D67C39DD69AE848C8C7F9A51884390C9B9DAA891E23A11DBD396976C48DF92AFBE8D6FC49BE51995B95757AB728453C7FD0DC9AF65A563B392C'}

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {

    //错误处理
    // if(response.data.code=='0'){
    //     return response.data.data;
    // }
    // Modal.info({
    //     title:"提示",
    //     content:response.msg
    // })

    return response;
  },
  error => {
    return Promise.reject(error)
  }
)



export function getcommonlist() {
  return  params=> {
    return new Promise((resolve,reject) => {
      let obj={
        service:"admin.getlist",
        ...params
      }

      axios['post'](BaseConfig.baseURL,obj)
        .then(response => {

          //token 过期
          let code =response.data.code;


          if(code!='0'){

            Context.showmsg('error',response.data.msg);
            reject(response.data);
            return;
          }

          if(code=='0'){

            // Context.showmsg('success',response.data.msg);
            resolve(response.data.data);
            return;
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}


export function createApi(){
  return  params=> {
    return new Promise((resolve,reject) => {

      axios['post'](BaseConfig.baseURL,params)
        .then(response => {

          //token 过期
          let code =response.data.code;


          if(code!='0'){

            Context.showmsg('error',response.data.msg);
            reject(response.data);
            return;
          }

          if(code=='0'){

           // Context.showmsg('success',response.data.msg);
            resolve(response.data.data);
            return;
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
