import Vue from 'vue'
import Router from 'vue-router'

import {clearCacheData, getCacheData} from '@/utils/cache'

import Login from '@/views/entry/login.vue';
import GZH from '@/views/account/gzh.vue';
import TKCONFIG from '@/views/account/tk.vue';
import FANLIRAET from '@/views/account/fanlirate.vue';
import CHECKINLIST from '@/views/customer/checkinlist.vue';
import WITHDRAWLIST from '@/views/customer/withdrawlist.vue';
import AdminIndex from '@/views/admin/index.vue';
import AccountIndex from '@/views/account/index.vue';
import OrderList from '@/views/order/list.vue';
import CustomerBaseList from '@/views/customer/list.vue';
import MoneyLogList from '@/views/moneylog/list.vue';
import MsgList from '@/views/customer/msglist.vue';
import BaseConfig from '@/config/config'


Vue.use(Router)

var menu =[
  {
    path: '/', component: Login, title:"登录", icon:"ios-calendar-outline", name:"login",
  },
  {
    path: '/login', component: Login, title:"登录", icon:"ios-calendar-outline", name:"login",
  },
  {
    path: '/admin', component: AdminIndex, title:"基础管理", icon:"ios-calendar-outline", menu:true, name:"basemanage",
    children:[
      { path: 'accountmanage', component: AccountIndex,title:"账号管理",icon:"",menu:true,name:'accountmanage'},
      { path: 'gzh', component: GZH,title:"公众号设置",icon:"",menu:true,name:'gzh'},
      { path: 'tkconfig', component: TKCONFIG,title:"阿里妈妈设置",icon:"",menu:true,name:'tkconfig'},
      { path: 'fanlirate', component: FANLIRAET,title:"返利比设置",icon:"",menu:true,name:'fanlirate'},
    ]
  },
  {
    path: '/admin', component: AdminIndex, title:"客户管理", icon:"md-cube", menu:true, name:"customermanage",
    children:[
      { path: 'customerbaselist', component: CustomerBaseList,title:"客户列表",icon:"",menu:true,name:'customerbaselist'},
      { path: 'moneyloglist', component: MoneyLogList,title:"金额日志",icon:"",menu:false,name:'MoneyLogList'},
      { path: 'checkinlist', component: CHECKINLIST,title:"客户签到列表",icon:"",menu:true,name:'checkinlist'},
      { path: 'withdrawlist', component: WITHDRAWLIST,title:"客户提现列表",icon:"",menu:true,name:'withdrawlist'},
      { path: 'msglist', component: MsgList,title:"客服消息列表",icon:"",menu:true,name:'msglist'},
    ]
  },
  {
    path: '/admin', component: AdminIndex, title:"订单管理", icon:"ios-paper", menu:true, name:"ordermanage",
    children:[
      { path: 'orderlist', component: OrderList,title:"订单列表",icon:"",menu:true,name:'orderlist'},
    ]
  },
];
var router =new Router({
  mode: 'history',
  routes: menu
})
router.beforeEach((to, from, next) => {
  let token_key =BaseConfig.TOKEN_KEY;
  if (to.path === '/login') {
    clearCacheData([token_key])
  }
  const LOGIN = getCacheData(token_key);

  if (!LOGIN && to.path !== '/login') {

    next({ path: '/login' })
  } else {
    next()
  }
  //next()
})

export  {
  router,
  menu
}

