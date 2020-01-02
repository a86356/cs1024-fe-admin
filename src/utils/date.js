export function changeIviewDate(dateA) {
  var dateee = new Date(dateA).toJSON();
  var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
  return date;
}
export function testTime(v) {
  return v.toString().indexOf('中国标准时间')>-1 ;
  //console.log(v);
  //console.log(v.search("中国标准时间"));
}

function getLocalTime(nS) {
  //将时间戳（十三位时间搓，也就是带毫秒的时间搓）转换成时间格式
  // d.cTime = 1539083829787
  let date = new Date(nS);
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let day = date.getDate();
  month = month < 10 ? "0"+month:month;
  day = day < 10 ? "0"+day:day;
  date = year+'-'+month+'-'+day;
  console.log(date); // 2018-10-09
  return date;
}

export function cntoymd(d) {
  let _13 = new Date(d).getTime();

  var date = new Date(_13);

  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let day = date.getDate();
  let h=  date.getHours()
  let m=  date.getMinutes()
  let s=  date.getSeconds()
  month = month < 10 ? "0"+month:month;
  day = day < 10 ? "0"+day:day;
  h = h<10 ?"0"+h:h;
  m = m<10 ?"0"+m:m;
  s = s<10 ?"0"+s:s;

  date = year+'-'+month+'-'+day ;
  return date;
}

//Tue Dec 31 2019 11:06:08 GMT+0800 (中国标准时间) 转10位时间戳
export function cnto10time(expired_time) {
  return  new Date(expired_time).getTime()/1000;
}

export function _13toymdhis(t) {
  var date = new Date(t);

  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let day = date.getDate();
  let h=  date.getHours()
  let m=  date.getMinutes()
  let s=  date.getSeconds()
  month = month < 10 ? "0"+month:month;
  day = day < 10 ? "0"+day:day;
  h = h<10 ?"0"+h:h;
  m = m<10 ?"0"+m:m;
  s = s<10 ?"0"+s:s;

  date = year+'-'+month+'-'+day +' '+h+':'+m+':'+s;
  return date;
}
// 10位到yyyy-mm-dd hh:ii:ss
export const formatTime = (timestamp) => {
  var date = new Date(timestamp*1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')

}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
