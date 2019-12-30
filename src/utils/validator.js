
let v = {
  vPhone: function (v) {
    let reg = /^1[3|4|5|7|8]\d{9}$/;
    if (reg.test(v)) {
      return true;
    }
    return "手机号码格式错误";
  },
  vEmail: function (v) {
    let reg = /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

    if (reg.test(v)) {
      return true;
    }
    return "邮件格式错误";
  },
  vUserName: function (v) {
    let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,10}$/;

    if (reg.test(v)) {
      return true;
    }
    return "用户名必须是2-12位";
  },
  vNonvoid: function (v, msg) {


    if (v=='' || v==undefined) {
      return msg;
    }
    return true;
  },
  vPassword: function (v) {
    let reg = /^[0-9A-Za-z_.]{6,12}$/;
    if (reg.test(v)) {
      return true;
    }
    return "密码必须大于6位且小于12位";
  },
  vProvince: function (v) {
    if (!v) {
      return "省份不能为空";
    }
    return true;
  },
  vCity: function (v) {
    if (!v) {
      return "市不能为空";
    }
    return true;
  },
  vDistrict: function (v) {
    if (!v) {
      return "区不能为空";
    }
    return true;
  },
  vAddress: function (v) {
    if (!v) {
      return "地址不能为空";
    }
    return true;
  },
  vDefaultAddress: function (v) {
    if (v != 0 && v != 1) {
      return "默认地址设置错误";
    }
    return true;
  },
  vNonneg: function (v, msg) {
    if (v < 0) {
      return msg;
    }
    return true;
  },
  vDefault: function (v) {
    if (v != 0 && v != 1) {
      return "默认勾选错误";
    }
    return true;
  },
  vBirthday: function (v) {
    if (!v || v == '') {
      return "生日不能为空";
    }
    return true;
  },
  vSex: function (v) {

    if (v != 0 && v != 1) {
      return "性别格式错误";
    }
    return true;
  },
  vPosNumber:function (num) {
    var reg = /^\d+(?=\.{0,1}\d+$|$)/
    if(reg.test(num)) return true;
    return "必须输入正数" ;
  }

}

const run  = (rules,data) => {


  for(let i =0;i<rules.length;i++){
    rules[i][3] = data[rules[i][0]];

    let item = rules[i]
    let type = rules[i][1];
    let msg = rules[i][2];
    let value = rules[i][3];


    if(type=='required'){
      let ret = v.vNonvoid(value, msg);
      if (ret!=true){
        return ret;
      }
    }
    if (type == 'phone') {
      let ret = v.vPhone(value, msg);
      if (ret != true) {
        return ret;
      }
    }
  }
  return true;
}


const runwithobj = (rules, data) => {

  for (let i = 0; i < rules.length; i++) {
    rules[i][3] = data[rules[i][0]];

    let item = rules[i]
    let type = rules[i][1];
    let msg = rules[i][2];
    let value = rules[i][3];

    if (type == 'required') {
      let ret = v.vNonvoid(value, msg);
      if (ret != true) {
        return {
          'result':"fail",
          "msg":ret,
          'key':item[0]
        }
      }
    }
    if (type == 'phone') {
      let ret = v.vPhone(value, msg);
      if (ret != true) {


        return {
          'result': "fail",
          "msg": ret,
          'key': item[0]
        }
      }
    }
  }
  return {
    'result': "success",
  };
}

export default {
  run: run,
  runwithobj: runwithobj,
  v:v
}
