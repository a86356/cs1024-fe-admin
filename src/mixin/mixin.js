import Validator from '@/utils/validator.js'
import {commonapi} from '@/api/apis'

export default {
  data(){
    return {
      list1:[],
      data1:{},
      data2:{},
      data3:{},
      modalTitle1:'',
      modalTitle2:'',
      modalTitle3:'',
      loading1:false,
      modal1:false,
      modal2:false,
      modal3:false,
      id:0,
      ids:"",
      selectedArray:'',
      is_code_sending:false,
      codemsg:"发送验证码",
      MylabelWidth:80,
      page:1,
      pSize:20,
      searchForm:{},
      modalTitle:"",
      counts:0,
      modalForm:false,
      payType:{
        "q1":"余额",
        "q2":"微信",
        "q3":"支付宝"
      },
      PAYCOLUMN:"paycolumn",
      PAYDATA:"paydata",
      searchdata:{},
      uploadToken:'',
      qiniuUploadUrl:"http://upload-z2.qiniup.com",
      baseURL:'http://cdn.cs1024.com/'
    }
  },
  mounted(){

  },
  methods:{
    getUploadToken(){
      return  commonapi({
        service:"admin.getqiniutoken"
      })
    },
    showNoticeSuccess(msg){
      this.$Notice.success({
        title:msg,
        desc: '成功',
      });
    },
    _sendcode(param) {
      let phone = param.mobileNo;
      let ret= Validator.v.vPhone(phone);
      if (ret!=true) {
        this.showmsg('error',ret);
        return false;
      }

      if(this.is_code_sending)return;

      let count = 60;
      let that = this;
      let timer = setInterval(() => {

        if (count-- == 0) {
          that.codemsg = "发送验证码";
          that.is_code_sending = false;
          clearInterval(timer);
        } else {
          that.codemsg = count + "s"
          this.is_code_sending = true;
        }

      }, 1000)
      sendMsg(param).then(res=>{

      })
// 			this.$api.post('membersms.send', {
// 				"phone": this.data1['phone'],
// 				"type": this.code_type
// 			}).then(res => {
// 				if (res.code != '0') {
// 					this.showtoast(res.msg);
// 				}
//
// 			})
    },
    stamp_to_time(fmt) {
    var o = {
      "M+": this.getMonth() + 1, // 月份
      "d+": this.getDate(), // 日
      "h+": this.getHours(), // 小时
      "m+": this.getMinutes(), // 分
      "s+": this.getSeconds(), // 秒
      "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
      "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
    RSAencrypt(pas){
      //实例化jsEncrypt对象
      let jse = new this.$jsEncrypt;
      //设置公钥
      jse.setPublicKey('-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChdK43kKRy5owp7/1wsMwnjIac1+YOmT8f5WrAoVXfiyAcgyUrg30SISYA8lPSG1MDKgqICkbSaGPzLUvNp6pahxbKWqTgNzDhEin9OP0CHDkbvl/agSBjkMHwz6eeZfOpSXBbT6H+/6VjTje04ckBdQoj0svl9FhUXXd7i/HjnwIDAQAB-----END PUBLIC KEY-----');
      //解密
      return jse.encrypt(pas);
    },
    pop(level){
      this.$router.back(level)
    },
    setCache(k,v){
      localStorage.setItem(k,v)
    },
    getCache(key){
      return localStorage.getItem(key)
    },
    removeCache(arr){
      for(let i=0;i<arr.length;i++){
          let item =arr[i];
          localStorage.removeItem(item)
      }
    },
    selectChange(selection){
      this.selectedArray =selection;
      let ids='';
      for(let i=0;i<selection.length;i++){
        ids+=selection[i].id+','
      }
      if(ids.length>0){
        ids = ids.substr(0,ids.length-1);
      }
      this.ids=ids;
    },
    selectChangeArray(selection){
      this.selectedArray =selection;

    },
    switchRule(rule){
      let arr=[];
      Object.keys(rule).forEach(function(key){
        let type ;
        if(rule[key][0].required){
          type='required';
        }
        arr.push([key,type,rule[key][0].message])
      });
      return arr;
    },
    showmsg(type,msg){
      switch (type) {
        case "info":
          this.$Message.info(msg);
          break;
        case "success":
          this.$Message.success(msg);
          break;
        case "warning":
          this.$Message.warning(msg);
          break;
        case "error":
          this.$Message.error({
            content: msg,
            duration: 5
          });
          break;
      }
    },
    showsuccessmsg(msg){
      this.$Message.success(msg);
    },
    nav(path){
      this.$router.push(path);
    },
    cancelModal(){
      this.modal1=false;
    },
    showModal(){
      this.modal1=true;
    },
    change_page(page){
      this.page=page;
      this.loadData_table();
    },
    cutlast(params){
      return params.substr(0, params.length - 1);
    },
    createEntity(_params,_fun){
      var that = this;
      var entity = _params == null?this.formEntity:_params;
      entity['t'] = 'Create' + this.actionList;
      // return;

      var entityParams = {};
      for(var k in entity){

        if(k.indexOf("==")>-1){
          var s = k.split('=');
          entityParams[s[0]] = entity[k]?1:0;
        }
        else if(entityParams[k] == null){
          if(typeof entity[k] == 'object' )
          {
            var val = entity[k].toString();
            if(val.indexOf("Object") == -1)
              entityParams[k] = val
            else
              entityParams[k] =entity[k];
          }
          else{
            entityParams[k] = entity[k];
          }
        }

      }

      this.service(this.moduleName).post(entityParams).then((_d)=>{
        _fun(_d);
      });
    },
    create(){
      var that = this;


      this.$refs.child.createEntity(null,(_d)=>{

        if(_d.status=='fail'){
          this.$Message.error(_d.text);
          return;
        }

        if(that.modalForm != null)
          that.modalForm = false;
        if(that.loadPage!=null)
          that.loadPage();
      });
    },
    showForm(_entity){
      var that = this;
      this.modalForm = true;
      var params = {t:'Model'+this.actionList};
      if(_entity["ID"] != null)
        params["id"] = _entity["ID"];

      this.service(this.moduleName).get(params).then((_data)=>{
        var data = _data.data.length>0?_data.data[0]:{};
        this.$refs.child.changeEntity(data);
      })
    },
    showPage(_entity){
      var that = this;
      var tableName = _entity.TableName.toString();
      delete _entity["TableName"]
      this.$router.push({ path: '/'+tableName,query:_entity});
    },
    openForm(){
      this.modalForm = true;
      this.$refs.child.changeEntity({});
    },
    showDialog(_entity){
      this.modalForm = true;
      console.log(_entity)
      this.childEntity = _entity;
    },
    changeEntity(_val){
      var entity = _val;
      this.formEntity = entity;
    },
    removeItem(param,func){

      this.$Modal.confirm({
        title: '删除',
        content: '您确定要删除吗?',
        onOk: () => {
          func({id:param.id}).then(res=>{
            // this.showmsg('success','删除成功');
            this.loadData()
          })
        }
      });
    },
    expandTree(data){
      for(let a=0;a<data.length;a++){
        data[a].expand=true;
        for(let b=0;b<data[a].children.length;b++){
           data[a].children[b].expand=true;

           for(let c=0;c<data[a].children[b].children.length;c++){
             data[a].children[b].children[c].expand=true;

             for(let d=0;d<data[a].children[b].children[c].children.length;d++){
                 data[a].children[b].children[c].children[d].expand=true;
             }

           }

        }

      }
      return data;
    },
    cancelItem(param,func){

      this.$Modal.confirm({
        title: '取消',
        content: '您确定要取消该记录吗?',
        onOk: () => {
          func({id:param.id}).then(res=>{
            // this.showmsg('success','删除成功');
            this.loadData()
          })
        }
      });
    },
    resolveNumber(v){

      if(v==undefined || v==null || v=='0'){
        return 0;
      }
      return v;
    },
    resovePdc(data1){
      let pdc =data1.pdc;
      if(pdc.length==3){
        data1.province=pdc[0];
        data1.city=pdc[1];
        data1.area=pdc[2];
      }
      if(pdc.length==2){
        data1.province=pdc[0];
         data1.city=pdc[1];
      }

      data1.province = (data1.province==undefined ? data1.city:data1.province);

      return data1;
    },
    backHistory(){
      this.$router.back(-1)
    },
    filterHTMLTag (msg) {
      var msg = msg.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
      msg = msg.replace(/[|]*\n/, '') //去除行尾空格
      msg = msg.replace(/&npsp;/ig, ''); //去掉npsp
      return msg;
    }

  }
}
