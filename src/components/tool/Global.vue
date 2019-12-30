<script>
import axios from 'axios';
export default
{
  // /*本地环境*/
  // oauth:"http://localhost:65060/",
  // imgapi:"http://image.idz.net/",
  // apifile:"http://mg.idz.net/",
  // api:"http://localhost:62501/",
  // db:"http://localhost:64277/",
  // javaapi:"http://192.168.5.32:8080/",

  // // /*测试环境*/
  // oauth:"http://192.168.100.72/",
  // imgapi:"http://image.idz.net/",
  // apifile:"http://mg.idz.net/",
  // api:"http://192.168.100.72:8081/",
  // javaapi:"http://192.168.5.32:8082/",

  
  // /*正式环境*/
  // oauth:"http://oauth.idz.net/",
  // imgapi:"http://image.idz.net/",
  // apifile:"http://mg.idz.net/",
  // api:"http://mg.idz.net/",


  /*本地环境*/
  oauth:"http://oauth.idz.net/",
  imgapi:"http://image.idz.net/",
  apifile:"http://mg.idz.net/",
  api:"http://mg.idz.net/",
  javaapi:"http://apijava.idz.net:8080/",


  post:(_domain,_module,_params,_fun)=>{
    var subModule = _module;
    var url = "";
    if(subModule.indexOf('/')>-1)
      url = _domain + "api/" + _module + ".ashx"; 
    else
      url = _domain + "api/" + _module + "/ajax.ashx";

    if(_params['t'] == null)
      url = url +"?t=create";
    else
      url = url +"?t="+_params['t'];

    if(_params['accesstoken'] == null)
        url = url + "&accesstoken="+window.localStorage.getItem("accesstoken");
     else
        url = url + "&accesstoken="+_params['accesstoken'];

    var params = {};
    for(var k in _params){
        if(k != "t"&&k != "accesstoken"){
          params[k] = _params[k];
        }
    }
    axios.post(url,params)
        .then(function (response) {
          var data = response.data

          if(typeof data == 'string'){
            data = eval('['+data+']');
            data = data[0];
          }
          if(_fun != null)
            _fun(data);
      })
      .catch(function (error) {
          //console.log(error);
      });
  },
  postjava(path,_params = {}){
    let url=path;

    if(_params['accesstoken'] == null)
      url = url + "?token="+window.localStorage.getItem("accesstoken");
    else
      url = url + "?token="+_params['accesstoken'];
    return new Promise((resolve,reject) => {
      axios({
          url:url,
          data:_params,
          method:"post",
          headers:{
            'Content-Type':'application/x-www-form-urlencoded'
          }
        },
      ).then(res=>{
        resolve(res.data);
      })
        .catch(err=>{
          reject(err)
        })
    })
  },
  getjava(path,_params = {}){
    let url=path;

    if(_params['accesstoken'] == null)
      url = url + "?token="+window.localStorage.getItem("accesstoken");
    else
      url = url + "?token="+_params['accesstoken'];

    if(_params['pageNum']!=null){
      url+="&pageNum="+_params['pageNum'];
    }

    return new Promise((resolve,reject) => {
      axios({
          url:url,
          data:_params,
          method:"get",
          headers:{
            'Content-Type':'application/x-www-form-urlencoded'
          }
        },
      ).then(res=>{
        resolve(res.data);
      })
        .catch(err=>{
          reject(err)
        })
    })
  },

  get:(_domain,_module,_params,_fun)=>{
    
    var url = _domain + "api/" + _module + "/ajax.ashx"
      if(_params['t'] == null)
        url = url +"?t=per";
      else
        url = url +"?t="+_params['t'];
      for(var k in _params){
        if(k != "t" && k!= "accesstoken"){
            url+="&"+k+"="+_params[k];
        }
      }
  
    if(_params['accesstoken'] == null)
        url = url + "&accesstoken="+window.localStorage.getItem("accesstoken");
     else
        url = url + "&accesstoken="+_params['accesstoken'];
      

    axios.get(url,_params)
        .then(function (response) {
          
          var data = response.data;

          

          if(typeof data == 'string'){
            console.log(data)
            data = eval('['+data+']');
            console.log(typeof data)
          }
          else
            data = [data];
            

          
          _fun(data);
      })
      .catch(function (error) {
      });
  },
  OauthApi:(_type,_domain,_module,_params,_fun)=>{
    var subModule = _module;
    var url = "";
    url = _domain + "api/" + (_module.indexOf("?")==-1?_module+"?":_module); 

    if(_params['token'] == null)
        url = url + "&token="+ (window.localStorage.getItem("accesstoken")==null?"": window.localStorage.getItem("accesstoken"));
     else
        url = url + "&token="+(_params['accesstoken']==null?"": _params['accesstoken']);

    var params = {};
    if(_type=='post'){
      for(var k in _params){
          if(k != "token"){
            params[k] = _params[k];
          }
      }
    }else{
      
      for(var k in _params){
          if(k != "token"){
            url+="&"+k+"="+_params[k];
          }
      }

      
    }

    axios[_type](url,params).then(function (response) {

          var data = response.data

          if(typeof data == 'string'){
            data = eval('['+data+']');
            data = data[0];
          }

          if(_fun != null)
            _fun(data);
      })
      .catch(function (error) {
        
      });
  }
}
</script>
