import {

  updateOrder,

} from '@/api/apis'

class OrderEditService {

  getBodyLeftKeys(){
    return [
      'shoulderWidth',
      'sleeveLength',
      'sleeveWidth',
      'cuff',
      'neckGirth',
      'bustGirth',
      'bellyGirth',
      'sweep',
      'frontLength',
      'backLength',
      'leftShoulderSlope',
      'rightShoulderSlope',
      'waist',
      'hipline',
      'crosspiece',
      'crotchWidth',
      'outseam',
      'insideLength',
      'panls'
    ]
  }



  //保存订单的数据处理
  dealSaveOrderData(obj1){

    console.log(obj1);

    const {choose_goods,nodes,addressId,body,orderId,channel,customerId,bodyId,allGoodsData} =obj1


    let arr1=[];
    for(let i=0;i<nodes.length;i++){
      let obj={
        componentId:nodes[i].id,
        systemComponentId:nodes[i].systemComponentId
      }
      arr1.push(obj);
    }


    choose_goods.orderGoodsDetailList=arr1;

    //收货地址
    choose_goods.customerLogisticInfo={
      id:addressId
    }

    //身体数据
    let arrbatch=this.getBodyLeftKeys();

    var measure={
      id:bodyId,
      goodsId:choose_goods.id,
    }

    var temp_body={...body};

    temp_body.patternId=body.patternId || '';
    temp_body.patternStandardId=body.patternStandardId || '';

    for(let i=0;i<arrbatch.length;i++){
      let key=arrbatch[i];
      let a=body[key+'1'];
      let b=body[key+'2'];
      let c=body[key+'3'];
      let d=body[key+'4'];
      let e=body[key+'5'];
      let arr=[a,b,c,d,e];

      for(let m=0;m<arr.length;m++){
        if(arr[m]==undefined || arr[m]==null ){
          arr[m]=0
        }
        arr[m]=parseFloat(arr[m]);
      }
      temp_body[key]=arr;
    }

    measure = Object.assign(measure, temp_body);


    choose_goods.measure=measure;

    let temp=[];
    for(let i=0;i<allGoodsData.length;i++){
        let item =allGoodsData[i];
        if(item.id==choose_goods.id){
          temp.push(choose_goods)
        }else {
          temp.push(item)
        }
    }
    choose_goods.customerBodyData={
        id:body.bodyDataNo
    }

    let obj={
      id:orderId,
      channel:channel,
      customerId:customerId,
      orderGoodsList:[choose_goods]
    }

    return obj;
  }



  dealAddressData(obj){
    const {ids,myaddress,customerId}=obj;
    if(!ids){
      this.showmsg('info','请先勾选商品');
      return;
    }

    let arr=ids.split(',')
    let temp=[];
    for(let i=0;i<arr.length;i++){
      temp.push(parseInt(arr[i]))
    }
    // if(!myaddress.id){
    //
    // }

    myaddress.province = myaddress.pdc[0] ==undefined ?myaddress.city:myaddress.pdc[0]
    myaddress.city = myaddress.pdc[1] || ''
    myaddress.area = myaddress.pdc[2] || ''
    myaddress.customerId= customerId
    if(myaddress.isDefault==undefined){
      myaddress.isDefault=false;
    }

    return {
      myaddress:myaddress,
      temp: temp,
    }
  }
}

export default OrderEditService;
