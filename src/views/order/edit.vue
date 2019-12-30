<template>
  <div class="wrapper" ref="wrap">
    <div class="savebtn">
      <!--<Button type="success" @click="saveOrder">保存订单</Button>-->
    </div>





    <div class="hd">

      <div class="title">第一步:选择客户<span style="color: red">   备注:(新增订单必须先选择客户)</span></div>
      <div class="customerinfo">
        <div class="item">
          <div class="tit">客户编号:</div> <div class="cnt">{{data1.customerinfo.customerNo}}</div>
        </div>
        <div class="item">
          <div class="tit">客户姓名:</div> <div class="cnt">{{data1.customerinfo.name}}</div>
        </div>
        <div class="item">
          <div class="tit">客户手机:</div> <div class="cnt">{{data1.customerinfo.mobileNo}}</div>
        </div>

      </div>
      <BaseForm
        :form="form_searchcustomer"
        :data="data_searchcustomer"
        @showSearchModal="showSearchModal"
        @showAddCustomerModal="showAddCustomerModal"
      ></BaseForm>
    </div>


    <div class="hd">

      <div class="title">第二步:选择收款方式</div>
      <div class="customerinfo">
        <BaseForm
          :form="receimoney.form"
          :data="receimoney.data"
          @receive_money_change="receive_money_change"

        ></BaseForm>
      </div>

    </div>

    <div class="addcustomer">
      <Modal
        v-model="addcustomer_modal"
        title="新增客户"
      >
        <BaseForm
          :form="addcustomer_form"
          :data="addcustomer_data"
        ></BaseForm>

        <div slot="footer">
          <Button type="text" size="large" @click="cancelModal">取消</Button>
          <Button type="primary" size="large" @click="confirmAddCustomer">确定</Button>
        </div>
      </Modal>
    </div>

    <div class="searchResult">
      <Modal
        v-model="modal_seachResult"
        title="搜索结果"
        width="1000px"
      >
        <Table stripe @on-selection-change="select_customer"  :loading="loading1"  border :columns="columns_searchresult" :data="list_searchresult"></Table>

        <div slot="footer">
          <Button type="primary" size="large" @click="confirmCustomerSearchResult">确定</Button>
        </div>
      </Modal>
    </div>


    <div class="goodswrap">
      <div class="title">第三步:新增商品</div>
        <Button type="primary" style="margin-bottom: 10px;" @click="showAddGoodsModal">新增商品</Button>
        <!--<Button type="error" style="margin-bottom: 10px;margin-left: 10px" @click="showBatchDeleteGoodsModal">批量删除</Button>-->
      <div class="table">
        <Table ref="table"  @on-row-click="goods_row_click" 	 stripe @on-selection-change="goods_select"  :loading="loading1"  border :columns="goods_column" :data="goods_tabledata"></Table>
      </div>

      <Modal
        title="提示"
        v-model="noCustomerInfoModal"
      >
        <h2>必须先选择客户才可以新增订单</h2>
      </Modal>

    </div>


    <div class="tabswrap">
      <div class="title">第四步:输入其他信息</div>
      <!--<Tabs type="card" @on-click="change_order_tab" >-->
        <!--<TabPane label="商品详情" ></TabPane>-->
        <!--<TabPane label="基础订单" ></TabPane>-->
        <!--<TabPane label="身体数据" ></TabPane>-->
        <!--<TabPane label="收货地址" ></TabPane>-->
      <!--</Tabs>-->

      <div class="goodstab">
        <div class="item" :class="orderTabIndex==0?'active':''" @click="change_order_tab(0)">
          商品详情
        </div>
        <div class="item" :class="orderTabIndex==1?'active':''" @click="change_order_tab(1)">
          基础订单
        </div>
        <div class="item" :class="orderTabIndex==2?'active':''" @click="change_order_tab(2)">
          身体数据
        </div>
        <div class="item" :class="orderTabIndex==3?'active':''" @click="change_order_tab(3)">
          收货地址
        </div>

      </div>

    </div>

    <div class="order_base"  :class="orderTabIndex==0?'':'hide'">
      <div style="width: 400px">
        <BaseForm
          :form="goodsdetail.form"
          :data="goodsdetail.data"
          @selectCategory="selectCategory"
          @selectMaterial="selectMaterial"
          @confirmAddGoods="confirmAddGoods"
        ></BaseForm>
      </div>

    </div>

    <div class="order_base"   :class="orderTabIndex==1?'':'hide'">

      <div>
        <Button type="primary" @click="saveOrder">保存订单</Button>
      </div>
      <Tree class="mytree" ref="componenttree" :data="treeData"  @on-select-change="selectChange"
            show-checkbox multiple></Tree>
    </div>


    <div class="order_body"   :class="orderTabIndex==2?'':'hide'">

      <div class="wrapper" :class="choose_goods.id?'':'hide'" >

        <div class="body">
          <BaseForm
            :form="goodsBody.form"
            :data="goodsBody.data"
            @calfinalcloth1="calfinalcloth1"
            @calfinalcloth2="calfinalcloth2"
            @change_pattern="change_pattern"
            @change_tmy="change_tmy"
            @change_body_jt="change_body_jt"
            @saveOrder="saveOrder"
          ></BaseForm>

          <div class="df cnt">
            <div class="left">
              <div class="df hd">
                <div class="bodytabwrap">
                  <div v-for="(item1) in bodyuptabs" class="item">
                    <div>{{item1.title}}</div>
                  </div>
                </div>
              </div>
              <div v-for="(item1,index1) in bodylist">
                <div class="df">
                  <div v-for="(item2,index2) in item1">
                    <div v-if="item2.type=='title'" class="part_title">
                      <span>{{item2.name}}</span>
                    </div>
                    <div v-if="item2.type=='input'" class="part_title">
                      <Input  :disabled="item1.disabled" @on-change="change_cal1" :type="item2.formtype" class="input_1" v-model="goodsBody.data[item2.name]">
                      </Input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="df hd">
                <div class="tit">
                  修正位置
                </div>
                <div class="tit">
                  数值
                </div>
              </div>
              <div v-for="(item1,index1) in fixupPart">
                <div class="df">
                  <div v-for="(item2,index2) in item1.item">
                    <div v-if="item2.type=='title'" class="part_title">
                      <span>{{item2.name}}</span>
                    </div>
                    <div v-if="item2.type=='input'" class="part_title">
                      <input v-model="goodsBody.data[item2.name]" :max="item2.max" :min="item2.min" @focus="inputFocus" :data-index="item2.index" type="number" class="myinput">
                    </div>
                    <div v-if="item2.type=='msg'" :class="fixIndex==item2.index?'':'hide'"  class="part_title" style="font-size: 12px;color: red;">
                      <!--<span>{{item2.name}}</span>-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="addresswrap" :class="orderTabIndex==3?'':'hide'">
      <div>
        <BaseForm
          :form="form_selected_address"
          :data="data1.selectedaddress"
          :city="city"
          @select_address="select_address"
        ></BaseForm>
      </div>
      <BaseForm
        :form="addressEdit.form"
        :data="addressEdit.data"
        :city="city"

        @bindAddress="bindAddress"
      ></BaseForm>
    </div>


    <div class="hd">

      <div class="title">第五步:支付</div>
      <div class="customerinfo">
        <Button type="primary" @click="go_pay">支付订单</Button>
      </div>

    </div>

  </div>
</template>

<script>
  import $ from 'jquery'
  import Validator from '@/utils/validator.js'
  import PAYCONTANTS from '@/constants/payConstant.js'

  import {
    getComponentLists,
    getCustomerList,
    searchCustomer,
    getCustomerAddressList,
    getOrderGoodsList,
    batchDeleteOrderGoods,
    addOrderGoods,
    bindCustomerWithOrder,
    addCustomer,
    getMyMaterialList,
    getCategoryList,
    getOrderCustomer,
    deleteOrderGoods,
    updateOrderGoods,
    getComponentTree,
    getPatternByCategory,
    getTmyByCategoryId,
    addCustomerAddress,
    updateCustomerAddress,
    batchBindAddress,
    updateOrder,
    getOrderOne,
    getOrderGoodsOne,
    getBodyDataList
  } from '@/api/apis'
  import BaseForm from '@/components/form/Base'
  import {citys} from "@/utils/citys";
  import OrderEditService from  '@/services/order/OrderEditService'
  import PIC from '@/constants/picConstant.js'
  import {cntoymd} from '@/utils/date.js'

  export default {
    name: "",
    inject:['reload'],

    data() {
      return {
        noCustomerInfoModal:false,
        currentGoodsId:'',
        test:1,
        name_part:'name1',
        status:{
          is_change_goods:'0'
        },
        service:'',
        orderNo:'',
        orderId:'',
        orderone:{},
        addressId:'',
        bodyId:'0',
        city:citys,
        goodsInfo:{},
        channel:1,
        arrbatch:[
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
        ],
        //临时数据
        data_temp:{},
        //selected
        selected:{},
        choose_goods:{},
        //data
        data2: {},
        data1:{
          body:{},
          myaddress:{},
          selectedaddress:{},
          customerinfo:{}
        },
        treeData:[],
        data_searchcustomer:{},
        receimoney:{
          data:{
            customerPayment:'0'
          },
          form:{
            MylabelWidth:80,
            inline:false,
            ref:"goodsdetailform",
            rule:{

            },
            formlist:[
              {
                title:"",
                fields:[
                  {
                    type:'select',
                    name:'customerPayment',
                    style:{'width':'200px'},
                    options:{
                      list:[
                        {
                          value:"0",
                          label:"未收款"
                        },
                        {
                          value:"1",
                          label:"银联收款"
                        },
                        {
                          value:"2",
                          label:"现金收款"
                        },
                        {
                          value:"3",
                          label:"支付宝收款"
                        },
                        {
                          value:"4",
                          label:"微信收款"
                        },
                        {
                          value:"5",
                          label:"其他收款"
                        },
                      ]
                    },
                    placeholder:"请收款方式",
                    label:"收款方式",
                    func:"receive_money_change"
                  },
                ]
              }
            ],
          }
        },
        goodsdetail:{
          data:{
            categoryId:''
          },
          form:{
            MylabelWidth:80,
            inline:false,
            ref:"goodsdetailform",
            rule:{
              categoryId: [
                { required: true, message: '请选择品类', trigger: 'blur' }
              ],
              fabricId: [
                { required: true, message: '请选择面料', trigger: 'blur' }
              ],
              nums: [
                { required: true, message: '请输入定制数量', trigger: 'blur' }
              ],
              price: [
                { required: true, message: '请输入售价', trigger: 'blur' }
              ],

            },
            formlist:[
              {
                title:"",
                fields:[
                  {
                    type:'select',
                    name:'categoryId',
                    style:{'width':'100%'},
                    options:{
                      list:[]
                    },
                    placeholder:"请选择品类",
                    func:"selectCategory",
                    label:"品类"
                  },
                  {
                    type:'masteriallist',
                    name:'fabricId',
                    style:{'width':'100%'},
                    options:{
                      list:[]
                    },
                    placeholder:"请选择面料",
                    func:"selectMaterial",
                    label:"",
                  },
                  {
                    type:'text',
                    name:'nums',
                    placeholder:"请输入定制数量",
                    label:"定制数量"
                  },
                  {
                    type:'text',
                    name:'price',
                    placeholder:"请输入售价",
                    label:"售价"
                  },
                  {
                    type:'textarea',
                    name:'remark',
                    placeholder:"备注",
                    label:"备注"
                  },
                  {
                    type:'button',
                    name:'确定',
                    func:"confirmAddGoods",
                    color:'primary'
                  },
                ]
              }
            ],
          }
        },
        
        data_bodyup:{},
        data_bodydown:{},
        addcustomer_data:{},
        //modal
        goods_modal:false,
        addcustomer_modal:false,
        modal_seachResult:false,
        //list
        list_searchresult:[],
        goods_tabledata:[],
        list1:[],
        //form
        form_searchcustomer:{
          MylabelWidth:0,
          inline:true,
          ref:"form_searchcustomer",
          rule:{},
          formlist:[
            {
              title:"",
              fields:[
                {
                  type:'text',
                  name:'param',
                  placeholder:"请输入手机号或客户名"
                },
                {
                  type:'button',
                  name:"查找用户",
                  func:'showSearchModal',
                  color:'info'
                },
                {
                  type:'button',
                  name:"新增客户",
                  func:'showAddCustomerModal',
                  color:'primary'
                },
              ]
            }
          ],
        },

        goodsBody:{
          form:{
           MylabelWidth:0,
          inline:true,
          ref:"goodsBody.form",
          rule:{},
          formlist:[
          {
            title:"",
            fields:[
              {
                type:'select',
                name:'patternId',
                style:{'width':'200px'},
                options:{
                  list:[]
                },
                placeholder:"请选择版型",
                func:"change_pattern"
              },
              {
                type:'select',
                name:'patternStandardId',
                style:{'width':'200px'},
                options:{
                  list:[]
                },
                placeholder:"请选择套穿型号",
                func:"change_tmy"
              },
              {
                type:'select',
                name:'bodyDataNo',
                style:{'width':'200px'},
                options:{
                  list:[]
                },
                placeholder:"请选择客户净体数据",
                func:"change_body_jt"
              },
              {
                type:'button',
                name:"计算成衣(参考+加减)",
                func:'calfinalcloth1',
                color:'success'
              },
              {
                type:'button',
                name:"计算成衣(净体+放量)",
                func:'calfinalcloth2',
                color:'info'
              },
              {
                type:'button',
                name:"保存订单",
                func:'saveOrder',
                color:'primary'
              },
            ]
          }
        ],
      },
          data:{}
        },


        addressEdit:{
          data:{},
          form:{
            MylabelWidth:80,
            inline:false,
            ref:"form_address",
            rule:{
              consigneeName: [
                { required: true, message: '请输入客户姓名', trigger: 'blur' }
              ],
              consigneeTelephoneNo: [
                { required: true, message: '请输入联系方式', trigger: 'blur' }
              ],
              address: [
                { required: true, message: '请输入详细地址', trigger: 'blur' }
              ],
              pdc:[
                { required: true, message: '请选择省市区', trigger: 'blur' }
              ]
            },
            formlist:[
              {
                title:"",
                fields:[
                  {
                    type:'text',
                    name:'consigneeName',
                    placeholder:"请输入客户姓名",
                    label:"名字",
                  },
                  {
                    type:'text',
                    name:'consigneeTelephoneNo',
                    placeholder:"请输入手机号",
                    label:"手机号",
                  },
                  {
                    type:'pdc',
                    name:'pdc',
                    placeholder:"请选择省市区",
                    label:"省市区"
                  },
                  {
                    type:'text',
                    name:'address',
                    placeholder:"请输入详细地址",
                    label:"详细地址"
                  },
                  {
                    type:'textarea',
                    name:'remark',
                    placeholder:"请输入备注",
                    label:"备注"
                  },
                  {
                    type:'switch',
                    name:'isDefault',
                    open:'是',
                    close:'否',
                    label:"是否默认"
                  },
                  {
                    type:'button',
                    name:"保存",
                    func:'bindAddress',
                    color:'primary'
                  },

                ]
              }
            ],
          },
        },

        form_selected_address:{
          MylabelWidth:80,
          inline:false,
          ref:"form_selected_address",
          rule:{},
          formlist:[
            {
              title:"",
              fields:[
                  {
                    type:'select',
                    name:'address',
                    style:{'width':'500px'},
                    options:{
                      list:[]
                    },
                    func:"select_address"
                  },

              ]
            }
          ],
        },
        addcustomer_form:{
          MylabelWidth:80,
          inline:false,
          ref:"addcustomer_form",
          rule:{
            name: [
              { required: true, message: '请输入客户姓名', trigger: 'blur' }
            ],
            sex: [
              { required: true, message: '请选择客户性别', trigger: 'blur' }
            ],
            remark: [
              { required: true, message: '请选择客户性别', trigger: 'blur' }
            ],
            customerNo: [
              { required: true, message: '请输入客户编号', trigger: 'blur' }
            ],
          },
          formlist:[
            {
              title:"",
              fields:[
                {
                  type:'text',
                  name:'customerNo',
                  placeholder:"请输入客户编号",
                  label:"客户编号"
                },
                {
                  type:'text',
                  name:'name',
                  placeholder:"请输入客户姓名",
                  label:"名字"
                },
                {
                  type:'text',
                  name:'mobileNo',
                  placeholder:"请输入手机号",
                  label:"手机号"
                },
                {
                  type:'datepicker',
                  name:'birthDay',
                  placeholder:"请选择生日",
                  label:"生日"
                },
                {
                  type:'select',
                  name:'sex',
                  style:{"width":"100px"},
                  label:"性别",
                  options:{
                    list:[
                      {
                        label:"男",
                        value:'1'
                      },
                      {
                        label:"女",
                        value:'2'
                      },
                      {
                        label:"其他",
                        value:'3'
                      },
                    ]
                  },
                  func:"selectChange"
                },
                {
                  type:'textarea',
                  name:'remark',
                  placeholder:"请输入备注",
                  label:"备注"
                },
              ]
            }
          ],
        },
        //column
        columns_searchresult: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: "id",
            key: "id"
          },
          {
            title: "客户编号",
            key: "customerNo"
          },
          {
            title: "客户名",
            key: "name"
          },
          {
            title: "备注",
            key: "remark"
          },

          {
            title: "性别",
            key: "sex",
            render:(h,params)=>{
              let sex;
              switch (params.row.sex) {
                case 1:
                  sex="男";
                  break;
                case 2:
                  sex="男";
                  break;
                case 3:
                  sex="其他";
                  break;
              }
              return h('div',sex);
            }
          },
          {
            title: "备注",
            key: "remark"
          },
        ],
        goods_column: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: "订单编号",
            key: "orderNo"
          },


          {
            title: "品类名称",
            key: "categoryName"
          },

          {
            title: "面料名",
            key: "fabricName"
          },
          {
            title: "定制数量",
            key: "nums"
          },
          {
            title: "成本价",
            key: "cost"
          },
          {
            title: "总成本价",
            key: "costAmount"
          },
          {
            title: "售价",
            key: "price"
          },
          {
            title: "总售价",
            key: "sellAmount"
          },
          {
            title: "备注",
            key: "remark"
          },
          {
            title: "操作",
            key: "action",
            width: 300,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {


                        this._goods_row_click(params);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.removeItem(params.row,deleteOrderGoods);
                      }
                    }
                  },
                  "删除"
                ),
              ]);
            }
          }
        ],

        //其他
        orderTabIndex:'0',
        fixIndex:1,
        index:0,
        bodyuptabs:[
          {
            title:"部位",
            type:"title"
          },
          {
            title:"规格表",
            type:"title"
          },
          {
            title:"成衣",
            type:"title"
          },
          {
            title:"加减",
            type:"title"
          },
          {
            title:"净体",
            type:"title"
          },
          {
            title:"放量",
            type:"title"
          }
        ],
        bodylist:[
          [
            {
              type:"title",
              name:"肩宽",
            },
            {
              type:"input",
              formtype:'number',
              name:"shoulderWidth1"
            },
            {
              type:"input",
              formtype:'number',
              name:"shoulderWidth2"
            },
            {
              type:"input",
              formtype:'number',
              name:"shoulderWidth3",
              changefunc:'chanegcal'
            },
            {
              type:"input",
              formtype:'number',
              name:"shoulderWidth4"
            },
            {
              type:"input",
              formtype:'number',
              name:"shoulderWidth5"
            }
          ],

          [
            {
              type:"title",
              name:"臀围",
            },
            {
              type:"input",
              formtype:'number',
              name:"hipline1"
            },
            {
              type:"input",
              formtype:'number',
              name:"hipline2"
            },
            {
              type:"input",
              formtype:'number',
              name:"hipline3"
            },
            {
              type:"input",
              formtype:'number',
              name:"hipline4"
            },
            {
              type:"input",
              formtype:'number',
              name:"hipline5"
            },
          ],
          [
            {
              type:"title",
              name:"横裆",
            },
            {
              type:"input",
              formtype:'number',
              name:"crosspiece1"
            },
            {
              type:"input",
              formtype:'number',
              name:"crosspiece2"
            },
            {
              type:"input",
              formtype:'number',
              name:"crosspiece3"
            },
            {
              type:"input",
              formtype:'number',
              name:"crosspiece4"
            },
            {
              type:"input",
              formtype:'number',
              name:"crosspiece5"
            },
          ],
          [
            {
              type:"title",
              name:"通裆",
            },
            {
              type:"input",
              formtype:'number',
              name:"crotchWidth1"
            },
            {
              type:"input",
              formtype:'number',
              name:"crotchWidth2"
            },
            {
              type:"input",
              formtype:'number',
              name:"crotchWidth3"
            },
            {
              type:"input",
              formtype:'number',
              name:"crotchWidth4"
            },
            {
              type:"input",
              formtype:'number',
              name:"crotchWidth5"
            },
          ],
          [
            {
              type:"title",
              name:"裤长",
            },
            {
              type:"input",
              formtype:'number',
              name:"outseam1"
            },
            {
              type:"input",
              formtype:'number',
              name:"outseam2"
            },
            {
              type:"input",
              formtype:'number',
              name:"outseam3"
            },
            {
              type:"input",
              formtype:'number',
              name:"outseam4"
            },
            {
              type:"input",
              formtype:'number',
              name:"outseam5"
            },
          ],
          [
            {
              type:"title",
              name:"内长",
            },
            {
              type:"input",
              formtype:'number',
              name:"insideLength1"
            },
            {
              type:"input",
              formtype:'number',
              name:"insideLength2"
            },
            {
              type:"input",
              formtype:'number',
              name:"insideLength3"
            },
            {
              type:"input",
              formtype:'number',
              name:"insideLength4"
            },
            {
              type:"input",
              formtype:'number',
              name:"insideLength5"
            },
          ]
          ,
          [
            {
              type:"title",
              name:"脚口",
            },
            {
              type:"input",
              formtype:'number',
              name:"panls1"
            },
            {
              type:"input",
              formtype:'number',
              name:"panls2"
            },
            {
              type:"input",
              formtype:'number',
              name:"panls3"
            },
            {
              type:"input",
              formtype:'number',
              name:"panls4"
            },
            {
              type:"input",
              formtype:'number',
              name:"panls5"
            },
          ],
        [
          {
            type:"title",
            name:"袖长",
          },
          {
            type:"input",
            formtype:'number',
            name:"sleeveLength1"
          },
          {
            type:"input",
            formtype:'number',
            name:"sleeveLength2"
          },
          {
            type:"input",
            formtype:'number',
            name:"sleeveLength3"
          },
          {
            type:"input",
            formtype:'number',
            name:"sleeveLength4"
          },
          {
            type:"input",
            formtype:'number',
            name:"sleeveLength5"
          },
        ],
        [
          {
            type:"title",
            name:"袖肥",
          },
          {
            type:"input",
            formtype:'number',
            name:"sleeveWidth1"
          },
          {
            type:"input",
            formtype:'number',
            name:"sleeveWidth2"
          },
          {
            type:"input",
            formtype:'number',
            name:"sleeveWidth3"
          },
          {
            type:"input",
            formtype:'number',
            name:"sleeveWidth4"
          },
          {
            type:"input",
            formtype:'number',
            name:"sleeveWidth5"
          },
        ],
        [
          {
            type:"title",
            name:"袖口",
          },
          {
            type:"input",
            formtype:'number',
            name:"cuff1"
          },
          {
            type:"input",
            formtype:'number',
            name:"cuff2"
          },
          {
            type:"input",
            formtype:'number',
            name:"cuff3"
          },
          {
            type:"input",
            formtype:'number',
            name:"cuff4"
          },
          {
            type:"input",
            formtype:'number',
            name:"cuff5"
          },
        ],
        [
          {
            type:"title",
            name:"领围",
          },
          {
            type:"input",
            formtype:'number',
            name:"neckGirth1"
          },
          {
            type:"input",
            formtype:'number',
            name:"neckGirth2"
          },
          {
            type:"input",
            formtype:'number',
            name:"neckGirth3"
          },
          {
            type:"input",
            formtype:'number',
            name:"neckGirth4"
          },
          {
            type:"input",
            formtype:'number',
            name:"neckGirth5"
          },
        ],
        [
          {
            type:"title",
            name:"肚围",
          },
          {
            type:"input",
            formtype:'number',
            name:"bellyGirth1"
          },
          {
            type:"input",
            formtype:'number',
            name:"bellyGirth2"
          },
          {
            type:"input",
            formtype:'number',
            name:"bellyGirth3"
          },
          {
            type:"input",
            formtype:'number',
            name:"bellyGirth4"
          },
          {
            type:"input",
            formtype:'number',
            name:"bellyGirth5"
          },
        ],
        [
          {
            type:"title",
            name:"下摆",
          },
          {
            type:"input",
            formtype:'number',
            name:"sweep1"
          },
          {
            type:"input",
            formtype:'number',
            name:"sweep2"
          },
          {
            type:"input",
            formtype:'number',
            name:"sweep3"
          },
          {
            type:"input",
            formtype:'number',
            name:"sweep4"
          },
          {
            type:"input",
            formtype:'number',
            name:"sweep5"
          },
        ],
        [
          {
            type:"title",
            name:"前衣长",
          },
          {
            type:"input",
            formtype:'number',
            name:"frontLength1"
          },
          {
            type:"input",
            formtype:'number',
            name:"frontLength2"
          },
          {
            type:"input",
            formtype:'number',
            name:"frontLength3"
          },
          {
            type:"input",
            formtype:'number',
            name:"frontLength4"
          },
          {
            type:"input",
            formtype:'number',
            name:"frontLength5"
          },
        ],
        [
          {
            type:"title",
            name:"后衣长",
          },
          {
            type:"input",
            formtype:'number',
            name:"backLength1"
          },
          {
            type:"input",
            formtype:'number',
            name:"backLength2"
          },
          {
            type:"input",
            formtype:'number',
            name:"backLength3"
          },
          {
            type:"input",
            formtype:'number',
            name:"backLength4"
          },
          {
            type:"input",
            formtype:'number',
            name:"backLength5"
          },
        ],
        [
          {
            type:"title",
            name:"腰围",
          },
          {
            type:"input",
            formtype:'text',
            name:"waist1"
          },
          {
            type:"input",
            formtype:'number',
            name:"waist2"
          },
          {
            type:"input",
            formtype:'number',
            name:"waist3"
          },
          {
            type:"input",
            formtype:'number',
            name:"waist4"
          },
          {
            type:"input",
            formtype:'number',
            name:"waist5"
          }
        ],
        [
          {
            type:"title",
            name:"臀围",
          },
          {
            type:"input",
            formtype:'number',
            name:"hipline1"
          },
          {
            type:"input",
            formtype:'number',
            name:"hipline2"
          },
          {
            type:"input",
            formtype:'number',
            name:"hipline3"
          },
          {
            type:"input",
            formtype:'number',
            name:"hipline4"
          },
          {
            type:"input",
            formtype:'number',
            name:"hipline5"
          },
        ],
        [
          {
            type:"title",
            name:"横裆",
          },
          {
            type:"input",
            formtype:'number',
            name:"crosspiece1"
          },
          {
            type:"input",
            formtype:'number',
            name:"crosspiece2"
          },
          {
            type:"input",
            formtype:'number',
            name:"crosspiece3"
          },
          {
            type:"input",
            formtype:'number',
            name:"crosspiece4"
          },
          {
            type:"input",
            formtype:'number',
            name:"crosspiece5"
          },
        ],
        [
          {
            type:"title",
            name:"通裆",
          },
          {
            type:"input",
            formtype:'number',
            name:"crotchWidth1"
          },
          {
            type:"input",
            formtype:'number',
            name:"crotchWidth2"
          },
          {
            type:"input",
            formtype:'number',
            name:"crotchWidth3"
          },
          {
            type:"input",
            formtype:'number',
            name:"crotchWidth4"
          },
          {
            type:"input",
            formtype:'number',
            name:"crotchWidth5"
          },
        ],
        [
          {
            type:"title",
            name:"裤长",
          },
          {
            type:"input",
            formtype:'number',
            name:"outseam1"
          },
          {
            type:"input",
            formtype:'number',
            name:"outseam2"
          },
          {
            type:"input",
            formtype:'number',
            name:"outseam3"
          },
          {
            type:"input",
            formtype:'number',
            name:"outseam4"
          },
          {
            type:"input",
            formtype:'number',
            name:"outseam5"
          },
        ],
        [
          {
            type:"title",
            name:"内长",
          },
          {
            type:"input",
            formtype:'number',
            name:"insideLength1"
          },
          {
            type:"input",
            formtype:'number',
            name:"insideLength2"
          },
          {
            type:"input",
            formtype:'number',
            name:"insideLength3"
          },
          {
            type:"input",
            formtype:'number',
            name:"insideLength4"
          },
          {
            type:"input",
            formtype:'number',
            name:"insideLength5"
          },
        ],
        [
          {
            type:"title",
            name:"脚口",
          },
          {
            type:"input",
            formtype:'number',
            name:"panls1"
          },
          {
            type:"input",
            formtype:'number',
            name:"panls2"
          },
          {
            type:"input",
            formtype:'number',
            name:"panls3"
          },
          {
            type:"input",
            formtype:'number',
            name:"panls4"
          },
          {
            type:"input",
            formtype:'number',
            name:"panls5"
          },
        ]
    ],

      fixupPart:[
          {
            item:[
              {
                type:'title',
                name:'后领窝下挖'
              },
              {
                type:"input",
                formtype:'text',
                name:"backCollarDig",
                index:"1",
                max:"1",
                min:"12"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:'1'
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'后腰节'
              },
              {
                type:"input",
                formtype:'text',
                name:"backWaistLength",
                index:"2"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"2"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'前腰节'
              },
              {
                type:"input",
                formtype:'text',
                name:"frontWaistLength",
                index:"3"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"3"
              }
            ]
          },{
            item:[
              {
                type:'title',
                name:'前搭门半边'
              },
              {
                type:"input",
                formtype:'text',
                name:"frontDoorHalfWay",
                index:"4"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"4"
              }
            ]
          },{
            item:[
              {
                type:'title',
                name:'正常大肚体'
              },
              {
                type:"input",
                formtype:'text',
                name:"normalPaunch",
                index:"5"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"5"
              }
            ]
          },{
            item:[
              {
                type:'title',
                name:'驼背大肚体'
              },
              {
                type:"input",
                formtype:'text',
                name:"humpbackPaunch",
                index:"6"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"6"
              }
            ]
          },{
            item:[
              {
                type:'title',
                name:'后背宽'
              },
              {
                type:"input",
                formtype:'text',
                name:"backWidth",
                index:"7"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"7"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'前胸宽'
              },
              {
                type:"input",
                formtype:'number',
                name:"chestWidth",
                index:"9"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"9"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'后中缝'
              },
              {
                type:"input",
                formtype:'number',
                name:"backCenterSeam",
                index:"10"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"10"

              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'后胸围'
              },
              {
                type:"input",
                formtype:'number',
                name:"backChestGirth",
                index:"11"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"11"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'后腰围'
              },
              {
                type:"input",
                formtype:'number',
                name:"backWaistline",
                index:"12"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"12"

              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'挺胸'
              },
              {
                type:"input",
                formtype:'number',
                name:"chestOut",
                index:"13"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"13"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'后下摆'
              },
              {
                type:"input",
                formtype:'number',
                name:"backSweep",
                index:"14"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"14"

              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'溜肩'
              },
              {
                type:"input",
                formtype:'number',
                name:"slipShoulder",
                index:"15"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"15"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'左溜肩'
              },
              {
                type:"input",
                formtype:'number',
                name:"leftSlipShoulder",
                index:"16"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"16"

              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'右溜肩'
              },
              {
                type:"input",
                formtype:'number',
                name:"rightSlipShoulder",
                index:"17"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"17"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'平肩'
              },
              {
                type:"input",
                formtype:'number',
                name:"flatShoulder",
                index:"18"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"18"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'左平肩'
              },
              {
                type:"input",
                formtype:'number',
                name:"leftFlatShoulder",
                index:"19"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"19"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'右平肩'
              },
              {
                type:"input",
                formtype:'number',
                name:"rightFlatShoulder",
                index:"20"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"20"

              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'驼背'
              },
              {
                type:"input",
                formtype:'number',
                name:"humpback",
                index:"21"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"21"

              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'横开领'
              },
              {
                type:"input",
                formtype:'number',
                name:"neckOpen",
                index:"22"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"22"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'手臂偏后'
              },
              {
                type:"input",
                formtype:'number',
                name:"armAfter",
                index:"23"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"23"

              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'手臂弯'
              },
              {
                type:"input",
                formtype:'number',
                name:"armBend",
                index:"24"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"24"

              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'手臂直'
              },
              {
                type:"input",
                formtype:'number',
                name:"armStraight",
                index:"25"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"25"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'袖笼深'
              },
              {
                type:"input",
                formtype:'number',
                name:"armholeDepth",
                index:"26"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"26"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'袖山高'
              },
              {
                type:"input",
                formtype:'number',
                name:"sleeveCrownHeight",
                index:"27"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"27"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'手臂偏后'
              },
              {
                type:"input",
                formtype:'number',
                name:"armAfter",
                index:"28"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"28"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'后臀围'
              },
              {
                type:"input",
                formtype:'number',
                name:"backHipline",
                index:"1",
                max:"1",
                min:"12"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:'1'
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'前臀围'
              },
              {
                type:"input",
                formtype:'number',
                name:"frontHipline",
                index:"2"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"2"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'前翘'
              },
              {
                type:"input",
                formtype:'number',
                name:"forntRaise",
                index:"3"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"3"
              }
            ]
          },{
            item:[
              {
                type:'title',
                name:'后翘'
              },
              {
                type:"input",
                formtype:'number',
                name:"backRaise",
                index:"4"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"4"
              }
            ]
          },{
            item:[
              {
                type:'title',
                name:'裆深上抬'
              },
              {
                type:"input",
                formtype:'number',
                name:"crotchDeepUp",
                index:"5"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"5"
              }
            ]
          },{
            item:[
              {
                type:'title',
                name:'裆深下挖'
              },
              {
                type:"input",
                formtype:'number',
                name:"crotchDeepDown",
                index:"6"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"6"
              }
            ]
          },{
            item:[
              {
                type:'title',
                name:'后裆深下挖'
              },
              {
                type:"input",
                formtype:'number',
                name:"backCrotchDeepDown",
                index:"7"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"7"
              }
            ]
          },{
            item:[
              {
                type:'title',
                name:'前裆深下挖'
              },
              {
                type:"input",
                formtype:'number',
                name:"frontCrotchDeepDown",
                index:"8"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"8"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'前浪'
              },
              {
                type:"input",
                formtype:'number',
                name:"frontRise",
                index:"9"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"9"
              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'后浪'
              },
              {
                type:"input",
                formtype:'number',
                name:"backRise",
                index:"10"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"10"

              }
            ]
          },
          {
            item:[
              {
                type:'title',
                name:'前腰围'
              },
              {
                type:"input",
                formtype:'number',
                name:"frontWaist",
                index:"11"
              },
              {
                type:"msg",
                name:"数值 1-7",
                index:"11"
              }
            ]
          }
        ],
      }
    },
    components: {
      BaseForm
    },
    mounted() {
      this.orderNo = this.getCache('orderNo');
      this.orderId= this.getCache('orderId');

      this.service = new OrderEditService();


      this.loadData();
    },
    methods: {
      change_cal1(e){
        if(this.goodsBody.data.patternId){
          this.calfinalcloth1();
        }else {
          this.calfinalcloth2();
        }
      },
      change_body_jt(param){
        let that=this
        let bodyDataNo=param.data.bodyDataNo;


        that.goodsBody.data.bodyDataNo=bodyDataNo;



        let arr = this.data_temp.jt_list;

        for(let i=0;i<arr.length;i++){
            let item =arr[i];
            if(item.id==bodyDataNo){

              Object.keys(item).forEach(function(key){
                that.goodsBody.data[key+'4']=item[key]
              });
            }
        }
      },
      receive_money_change(param){
        let v=param.data.customerPayment;
        this.receimoney.data.customerPayment=v;

        updateOrder({
          id:this.orderId,
          customerPayment:v
        }).then(res=>{

        })
      },
      go_pay(){
        let selectedArray =[this.orderone];


        if(selectedArray.length==0){
          this.showmsg('info','未选中任何项');
          return;
        }

        let col=[ {
          title: "客户",
          key: "customer"
        },
          {
            title: "金额",
            key: "amount"
          },
          {
            title: "订单编号",
            key: "orderNo"
          }];

        let temp=[];
        for(let i=0;i<selectedArray.length;i++){
          let item =selectedArray[i];
          temp.push(item.id)
        }

        var param={
          list:temp
        }


        for(let i=0;i<selectedArray.length;i++){
          let cus=   selectedArray[i].customer
          selectedArray[i].customer=cus.name;
        }


        //成本
        let amount=0;
        for(let i=0;i<selectedArray[0].orderGoodsList.length;i++){
            let item =selectedArray[0].orderGoodsList[i];
            amount+=item.costAmount;
        }
        selectedArray[0].amount=amount;


        this.setCache(PAYCONTANTS.PAYCOLUMN,JSON.stringify(col))
        this.setCache(PAYCONTANTS.PAYSELECTED,JSON.stringify(selectedArray))
        this.setCache(PAYCONTANTS.PAYPARAM,JSON.stringify(param))
        this.setCache(PAYCONTANTS.OPERTYPE,4)
        this.setCache(PAYCONTANTS.PAYTYPE,'1,2,3')

        this.nav({path:'/admin/pay'});
      },
      select_goods_item(params){
        let id =params.row.id;

        let arr=this.goods_tabledata;
        for(let i=0;i<arr.length;i++){
            let item =arr[i];
            if(item.id==id){
              this.$refs.table.$refs.tbody.objData[i]._isChecked = true;
            }else {
              this.$refs.table.$refs.tbody.objData[i]._isChecked = false;
            }
        }
      },


      saveOrderGoods(){

      },
      _goods_row_click(params){

        if(this.status.is_change_goods==1){
          this.saveOrder();
        }

        this.status.is_change_goods=0


        if(!this.getCache('customer_id')){
          this.showmsg('error','未选择客户');
          return;
        }

        this.choose_goods = params.row;
        this.goodsdetail.data=params.row;

        this.goodsBody.data={};
        this.addressEdit.data={};
        this.data1.selectedaddress={};

        this.orderId=this.getCache('orderId');
        this.orderNo=this.getCache('orderNo');
        this.selected.goods_select=params.row.id+'';

        //勾选选中项目
        this.select_goods_item(params);

        //获得面料列表
        this._getMaterialList();

        let goodsid=params.row.id;
        this.setCache('choose_goods',JSON.stringify(params.row))

        getComponentTree({
          categoryId:params.row.categoryId
        }).then(res=>{

          let list1=[res.data];
          for(let a=0;a<list1.length;a++){
            for(let b=0;b<list1[a].children.length;b++){
              for(let c=0;c<list1[a].children[b].children.length;c++){
                list1[a].children[b].children[c].children=list1[a].children[b].children[c].components
              }
            }
          }


          getOrderGoodsOne({
            id:params.row.id
          }).then(res=>{


             let orderGoodsList=res.data;


            //读取地址列表
            this._getCustomerAddressList();

            //设置地址
            let addr=orderGoodsList.customerLogisticInfo;

            if(addr!=null){
              this.addressEdit.data=addr
              this.addressEdit.data.pdc=[addr.province,addr.city,addr.area]
              this.data1.selectedaddress.address=addr.id;
            }

            //净体数据选中
            this.goodsBody.data.bodyDataNo=orderGoodsList.customerBodyData.id;


            //设置身体数据
            let measure=orderGoodsList.measure;


            //获得版型
            this._getPatternByCategory();

            if(measure){

              this.goodsBody.data.patternId=measure.patternId;
              this.goodsBody.data.patternStandardId=measure.patternStandardId;

              //获得tmy列表
              this._getTmyByCategoryId();


              let arrbatch =this.arrbatch;
              for(let i=0;i<arrbatch.length;i++){
                let item = arrbatch[i]+'Array';
                let origin_item=arrbatch[i];
                if(measure[item]){
                  let a= measure[item][0];
                  let b= measure[item][1];
                  let c= measure[item][2];
                  let d= measure[item][3];
                  let e= measure[item][4];
                  this.goodsBody.data[origin_item+'1']=a;
                  this.goodsBody.data[origin_item+'2']=b;
                  this.goodsBody.data[origin_item+'3']=c;
                  this.goodsBody.data[origin_item+'4']=d;
                  this.goodsBody.data[origin_item+'5']=e;
                }
              }

              this.goodsBody.data=Object.assign(measure,this.goodsBody.data);

            }

            //部件设置
            this.goodsinfo =orderGoodsList;
            let components=this.goodsinfo.orderGoodsDetailList;
            if(components==null || components==[])return;
            for(let m=0;m<components.length;m++){
              let componentId=components[m].componentId;

              for(let a=0;a<list1.length;a++){
                for(let b=0;b<list1[a].children.length;b++){
                  for(let c=0;c<list1[a].children[b].children.length;c++){
                    list1[a].children[b].children[c].children=list1[a].children[b].children[c].components
                    for(let d=0;d<list1[a].children[b].children[c].children.length;d++){
                      if(list1[a].children[b].children[c].children[d].id==componentId){
                        list1[a].children[b].children[c].children[d].checked=true;
                      }
                    }
                  }
                }
              }
            }

            this.treeData=list1;
          })


        })
      },
      goods_row_click(obj){


        this._goods_row_click({
          row:obj
        })

      },
      selectCategory(params){
          this.goodsdetail.data.categoryId=params.data.categoryId
          this._getMaterialList();
      },
      selectMaterial(param){

        this.goodsdetail.data.fabricId=param.data.fabricId;
        let arr= this.goodsdetail.form.formlist[0].fields[1].options.list;
        for(let i=0;i<arr.length;i++){
            let item =arr[i];
            if(item.id==param.data.fabricId){
                this.goodsdetail.data.price= item.price;
            }
        }

      },
      saveOrder(){


        let choose_goods= JSON.parse(this.getCache('choose_goods'));

        if(!choose_goods)return;

        let mynodes = this.$refs.componenttree.getCheckedNodes();
        let nodes=[];
        for(let i=0;i<mynodes.length;i++){
            if(mynodes[i].level==4){
              nodes.push(mynodes[i])
            }
        }

        if(!this.getCache('customer_id')){
          this.showmsg('error','未选择客户');
          return;
        }
        let customerId=this.getCache('customer_id');

        let o= this.service.dealSaveOrderData({
          choose_goods:choose_goods,
          nodes:nodes,
          addressId:this.addressId,
          orderId:this.orderId,
          channel:this.channel,
          customerId:customerId,
     //     bodyId:this.bodyId,
          body:this.goodsBody.data,
          allGoodsData:this.goods_tabledata
        })


        //客户支付方式
        o.customerPayment = this.receimoney.data.customerPayment || '0';

        updateOrder(o).then(res=>{
          console.log(res);
        })


      },
      bindAddress(){
        let ids= this.selected.goods_select;

        if(!this.getCache('customer_id')){
          this.showmsg('info','未设置用户');
          return;
        }




        let addr= this.service.dealAddressData({
          ids:ids,
          myaddress:this.addressEdit.data,
          customerId:this.getCache('customer_id')
        })

        const {temp,myaddress}=addr;




        if(myaddress.id){
          let addressId=myaddress.id;
          updateCustomerAddress(myaddress).then(res=>{

            batchBindAddress({
              logisticId:addressId,
              goodsIds:temp
            }).then(res=>{
              this.addressId = addressId;
              this.saveOrder();

            })
          })
        }else{

          addCustomerAddress(myaddress).then(res=>{
            this.addressId = res.data.id;
            this.saveOrder();
          })
        }
      },
      select_address(form){


        let idx= form.data.address;
        let list1 =this.data_temp.myaddress

        for(let i=0;i<list1.length;i++){
          if(list1[i].id==idx){
            this.addressEdit.data=list1[i]
            this.addressEdit.data.pdc=[list1[i].province,list1[i].city,list1[i].area];

            if(idx==-1){
               let arr =this.addressEdit.form.formlist[0].fields;
               for(let i=0;i<arr.length;i++){
                   this.$set(this.addressEdit.form.formlist[0].fields[i],'disabled',true);
               }
            }
            break;
          }else{
            let arr =this.addressEdit.form.formlist[0].fields;
            for(let i=0;i<arr.length;i++){
              this.$set(this.addressEdit.form.formlist[0].fields[i],'disabled',false);
            }
          }
        }

      },
      change_pattern(form){

        this._getTmyByCategoryId();

      },
      _getTmyByCategoryId(){

        getTmyByCategoryId({
          patternId:this.goodsBody.data.patternId
        }).then(res=>{
          let arr=[];
          let list1=res.data.list;
          for(let i=0;i<list1.length;i++){
            let obj={
              label:list1[i].name,
              value:list1[i].id
            }
            arr.push(obj);
          }
          this.data_temp.bodyformat=list1;
          this.goodsBody.form.formlist[0].fields[1].options.list=arr;
        })

      },
      change_tmy(form){
        let patternStandardId= form.data.patternStandardId;


        let list1= this.data_temp.bodyformat;

        //设置身体数据的tmyid和修改规格表
        for(let i=0;i<list1.length;i++){
          let item =list1[i];

          if(item.id==patternStandardId){
            this.goodsBody.data.patternStandardId=patternStandardId;
            let arr_3=this.arrbatch;

            for(let j=0;j<arr_3.length;j++){
              //this.goodsBody.data[arr_3[j]+'1']=item[arr_3[j]]

              this.$set(this.goodsBody.data,arr_3[j]+'1',item[arr_3[j]])
            }
          }
        }



      },
      goods_select(selection){
        this.selectedArray =selection;
        let ids='';
        for(let i=0;i<selection.length;i++){
          ids+=selection[i].id+','
        }
        if(ids.length>0){
          ids = ids.substr(0,ids.length-1);
        }
        this.selected.goods_select=ids;
      },
      select_customer(selection){
        this.selectedArray =selection;
        let ids='';
        for(let i=0;i<selection.length;i++){
          ids+=selection[i].id+','
        }
        if(ids.length>0){
          ids = ids.substr(0,ids.length-1);
        }
        this.selected.select_customer=ids;
      },

      confirmCustomerSearchResult(){

        if(!this.selected.select_customer){
          this.showmsg('info','未选择');
          return;
        }

        if(this.selected.select_customer.split(',').length>=2){
          this.showmsg('info','只能勾选一个');
          return;
        }


        bindCustomerWithOrder({
          orderNo:this.orderNo,
          customerId:this.selected.select_customer
        }).then(res=>{

          this.setCache('customer_id',this.selected.select_customer);

          if(this.getCache('orderId')==0){
            this.setCache('orderId',res.data.id)
            this.setCache('orderNo',res.data.orderNo)
          }

          this.reload();
        })
      },

      confirmAddGoods(){
        this.goodsdetail.data.channel=this.channel;


        let rule = this.switchRule(this.goodsdetail.form.rule);
        let ret = Validator.runwithobj(rule,this.goodsdetail.data)
        if(ret.result!='success'){
          this.showmsg('info',ret.msg);
          return;
        }

        if(this.goodsdetail.data.id){
            updateOrderGoods(this.goodsdetail.data).then(res=>{
              this.reload();
            })
        }else {
          addOrderGoods({
            list:[this.goodsdetail.data],
            orderNo:this.orderNo,
            channel:this.channel
          }).then(res=>{
            this.reload();
          })
        }


      },
      showAddGoodsModal(){

        if(!this.getCache('customer_id')){

          this.noCustomerInfoModal=true;
          return;
        }
        this.showmsg('info','请在第三步中输入商品详情');

        this.goodsdetail.data={};
        this.orderTabIndex='0';

        $('html, body').animate({scrollTop: 1000}, 200)

      },
      showSearchModal(){
        this.modal_seachResult=true;

        searchCustomer(this.data_searchcustomer).then(res=>{
          this.list_searchresult = res.data.list;

        })

      },
      showAddCustomerModal(){
        this.addcustomer_modal=true;
      },
      confirmAddCustomer(){
        this.addcustomer_data.birthDay =cntoymd(this.addcustomer_data.birthDay);

        addCustomer(this.addcustomer_data).then(res=>{
          let id =res.data.id;
          bindCustomerWithOrder({
            orderNo:this.orderNo ,
            customerId:id
          }).then(res=>{

            this.setCache('customer_id',id);

            if(this.getCache('orderId')==0){
              this.setCache('orderId',res.data.id);
              this.setCache('orderNo',res.data.orderNo);
            }
            this.reload();

          })
        })

      },
      change_order_tab(idx){

        this.orderTabIndex = idx;

        this.status.is_change_goods=1;

      },
      _getCustomerAddressList(){

        getCustomerAddressList({
          customerId:this.data1.customerinfo.id,
          needShopAddress:1
        }).then(res=>{
          let list1=res.data.list;
          let arr=[];
          for(let i=0;i<list1.length;i++){
            let obj={
              label:list1[i].consigneeName+"----"+list1[i].consigneeTelephoneNo+"----"+list1[i].province+list1[i].city+list1[i].area+list1[i].address,
              value:list1[i].id
            }
            arr.push(obj);
          }


          this.form_selected_address.formlist[0].fields[0].options.list=arr;
          this.data_temp.myaddress=list1;

        })
      },
      _getPatternByCategory(){
        getPatternByCategory({
          categoryId:this.choose_goods.categoryId
        }).then(res=>{
          let arr=[];
          let list1=res.data.list;
          for(let i=0;i<list1.length;i++){
            let obj={
              label:list1[i].name,
              value:list1[i].id
            }
            arr.push(obj);
          }

          this.goodsBody.form.formlist[0].fields[0].options.list=arr;
          this.data_temp.bodyPattern = arr;

        })
      },

      inputFocus(e){
        let index =e.target.dataset.index;
        this.fixIndex =index;
      },
      calfinalcloth1(){
        let d = this.data_bodyup;

        let list1= this.bodylist;
        for(let i=0;i<list1.length;i++){
          let item= this.bodylist[i]

          let a=this.resolveNumber(this.goodsBody.data[item[1].name]);
          let c=this.resolveNumber(this.goodsBody.data[item[3].name]);

          this.$set(this.goodsBody.data,item[2].name,parseFloat(a)+parseFloat(c))
        }

      },
      calfinalcloth2(){
        let d = this.data_bodyup;

        let list1= this.bodylist;
        for(let i=0;i<list1.length;i++){
          let item= this.bodylist[i]

          let d=this.resolveNumber(this.goodsBody.data[item[4].name]);
          let e=this.resolveNumber(this.goodsBody.data[item[5].name]);

          this.$set(this.goodsBody.data,item[2].name,parseFloat(d)+parseFloat(e))
        }
      },
      loadData(){

        if(this.orderNo=='0'|| this.orderId=='0' )return;


        //商品品类列表
        getCategoryList({search:{had:true}}).then(res=>{

          let list1=res.data.list

          if(list1.length==0)return;

          this.list1.categorylist=list1;
          let arr=[];
          for(let i=0;i<list1.length;i++){
            let obj={
              'label':list1[i].systemName,
              'value':list1[i].id
            }
            arr.push(obj);
          }
          this.goodsdetail.form.formlist[0].fields[0].options.list=arr;

        })



        //我的面料列表
        this._getMaterialList();



        //订单单个
        getOrderOne({
          id:this.orderId
        }).then(res=>{


          this.orderone=res.data;
          //商品
          let orderGoodsList=res.data.orderGoodsList
          if(orderGoodsList.length>0){
            this.goods_tabledata=orderGoodsList;
          }
          //客户
          let cus=res.data.customer
          if(cus.id){
            this.data1.customerinfo=cus;
            this.setCache('customer_id',cus.id);
          }


          //客户净体数据
          getBodyDataList({
            seach:{customerId:cus.id}
          }).then(res=>{
           // this.goodsBody.form.formlist[0].fields[2].options.list=res.data.list;
            let temp=[];
            let arr=res.data.list;
            for(let i=0;i<arr.length;i++){
                let item =arr[i];
                let o={
                  label:item.customerName+"----"+item.dataNo,
                  value:item.id
                }
                temp.push(o)
            }
            this.goodsBody.form.formlist[0].fields[2].options.list=temp

            this.data_temp.jt_list=arr;

          })

          //收款方式
          this.receimoney.data.customerPayment=res.data.customerPayment+''






        })
      },
      _getMaterialList(){

        getMyMaterialList({
          search:{categoryId:this.goodsdetail.data.categoryId, status:1}
        }).then(res=>{
          let list1=res.data.list
          if(list1.length==0)return;

          this.list1.fabricslist=list1;


          for(let i=0;i<list1.length;i++){
            if(!list1[i].photoUrl){
              list1[i].photoUrl=PIC.PLAHOLDER;
            }
          }

          this.$set(this.goodsdetail.form.formlist[0].fields[1].options,'list',list1)
          //this.goodsdetail.form.formlist[0].fields[1].options.list=arr;

        })
      },
      showBatchDeleteGoodsModal(){

        if(!this.selected.goods_select){
          this.showmsg('info','未选择');
          return;
        }

        this.$Modal.confirm({
          title: '删除',
          content: '您确定要删除吗?',
          onOk: () => {
            batchDeleteOrderGoods({
              ids:this.selected.goods_select
            }).then(res=>{
              this.loadData();
            })
          }
        });
      },
      getCustomer(){
        return    getCustomerList({
          pageNum:this.page,
          pageSize:this.pSize,
          search: this.data1
        }).then(res=>{
          return new Promise((resolve, rej) => {
            resolve('2');
          })
        })
      },
      searchCustomer() {

      }
    }
  }
</script>

<style scoped lang="less">
  .tabswrap{
    margin-top: 20px;
  }

  .order_base{
  }


  .bodytabwrap{
    display: flex;
    font-weight: bold;
    font-size: 20px ;
    margin-top: 20px;
    .item{
      width:100px;
      text-align: left;
    }

  }
  .right{
    .hd{
      font-size: 18px;
      font-weight: bold;
      margin-top: 20px;
      .tit{
        width: 100px;
      }
    }
  }
  .part_title{
    font-size: 16px;
    line-height: 40px;
    font-weight: bold;
    width: 100px;
  }


  .input_1{
    width: 80px;
  }
  .myinput{
    display: inline-block;
    width: 80px;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out,background .2s ease-in-out,-webkit-box-shadow .2s ease-in-out;
  }
  .ml10{
    margin-left: 10px;
  }
  .addresswrap{
    width: 400px;
  }

  /deep/ .ivu-tree .ivu-tree-children .ivu-tree-children .ivu-tree-children li{
    display: flex;
  }

  /deep/ .ivu-tree .ivu-tree-children .ivu-tree-children .ivu-tree-children li ul{
    margin-top: 20px;
  }
  /deep/ .ivu-tree .ivu-tree-children .ivu-tree-children .ivu-tree-children li ul:nth-child(4){
    margin-left: -80px;
  }

  /deep/ .ivu-tree  {
    font-size: 18px;
  }
  .title{
    font-size: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .savebtn{
    margin-bottom: 30px;
  }
  .savebtn button{
    width: 1000px;
  }
  .customerinfo{
    font-size: 16px;
    margin-bottom: 10px;
    display: flex;
    .item{
      display: flex;
      .tit{
        color: #999;
        display: block;
      }
      .cnt{
        color: #000;
        width: 100px;
        display: block;
        border-bottom: 1px solid  #000;
      }
    }
  }

  /deep/ .ivu-table .demo-table-info-row {
    color: red;
  }
  .goodstab{
    display: flex;
    .item{
      padding: 10px 20px;
      margin: 5px;
      border: 1px solid #ccc;
      font-size: 12px;
    }
    .active{
      border: 1px solid dodgerblue;
      color: dodgerblue;
    }
  }
</style>
