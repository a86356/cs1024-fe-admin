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
import MemberList from '@/views/member/list.vue';
import CheckinList from '@/views/member/checkinlist.vue';
import VideoList from '@/views/video/list.vue';
import ClassesCategory from '@/views/classes/category.vue';
import ClassesList from '@/views/classes/list.vue';
import SegList from '@/views/classes/seglist.vue';
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
    path: '/admin', component: AdminIndex, title:"课程管理", icon:"ios-paper", menu:true, name:"classesmanage",
    children:[
      { path: 'classeslist', component: ClassesList,title:"课程大课",icon:"",menu:true,name:'classeslist'},
      { path: 'seglist', component: SegList,title:"课程小课",icon:"",menu:true,name:'seglist'},
      { path: 'classescategory', component: ClassesCategory,title:"课程分类",icon:"",menu:true,name:'classcategory'},
    ]
  },
  {
    path: '/admin', component: AdminIndex, title:"视频管理", icon:"md-cube", menu:true, name:"videomanage",
    children:[
      { path: 'videolist', component: VideoList,title:"上传视频",icon:"",menu:true,name:'videolist'},
    ]
  },
  {
    path: '/admin', component: AdminIndex, title:"会员管理", icon:"ios-calendar-outline", menu:true, name:"basemanage",
    children:[
      { path: 'memberlist', component: MemberList,title:"会员列表",icon:"",menu:true,name:'memberlist'},
      { path: 'checkinlist', component: CheckinList,title:"签到列表",icon:"",menu:true,name:'checkinlist'},
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

