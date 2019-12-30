import {setCacheData,clearCacheData} from "../../utils/cache";
import Context from '@/main.js'

export default {
  addBreaedCrumb(state,payload){
    let breadCrumb = state.breadcrumb;

    if(breadCrumb.length>12){
      Context.showmsg('info','菜单最多显示12项');
      return;
    }

    let value = payload.value;
    let patharr =[];
    for(let i=0;i<breadCrumb.length;i++){
      patharr.push(breadCrumb[i].path)
    }

    if(patharr.indexOf(value.path)==-1){

      var obj={
        path:value.path,
        title:value.title,
        selected:true
      }
      breadCrumb.push(obj);
    }

    for(var j=0;j<breadCrumb.length;j++){
      if(breadCrumb[j].path==value.path){
        breadCrumb[j].selected=true;
      }else{
        breadCrumb[j].selected=false;
      }
    }

    setCacheData({k:'breadCrumb',v:JSON.stringify(breadCrumb)})
    state.breadcrumb=breadCrumb;

  },
  clearAllBreadCrumb(state,payload){
    state.breadcrumb=[];
    clearCacheData(['breadCrumb'])
  },
  changeBreacCrumb(state,payload){


    let breadCrumb = state.breadcrumb;

    let value = payload.value;

    for(var j=0;j<breadCrumb.length;j++){
      if(breadCrumb[j].path==value.path){
        breadCrumb[j].selected=true;
      }else{
        breadCrumb[j].selected=false;
      }
    }
    setCacheData({k:'breadCrumb',v:JSON.stringify(breadCrumb)})

    state.breadcrumb=breadCrumb;
  }
};
