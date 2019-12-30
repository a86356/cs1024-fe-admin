<template>
<Menu mode="horizontal" theme="primary"    style="position:fixed;width:100%">
    <div class="layout-logo"><a @click="go_home">无极淘客系统</a></div>

    <div class="menu_tabs">
      <div class="item" @click="change_tab(item)" :class="item.selected?'active':''" v-for="(item,index) in breadcrumb" :key="index">
        <div class="title">
          {{item.title}}
        </div>
        <div class="close"></div>
      </div>
      <div class="item" @click="clearAllBreadCrumb" :class="breadcrumb.length>0?'':'hide'">
        清除全部
      </div>
    </div>

    <div class="layout-nav" :style="{width:120*(list.length+1) + 'px'}">
        <Submenu name="my">
            <template slot="title">
                <Icon type="stats-bars"></Icon>
                我的设置
            </template>
            <MenuGroup title="我的设置" >

                <MenuItem name="exit" >
                    <a  @click="exit">退出</a>
                </MenuItem>
            </MenuGroup>
        </Submenu>
    </div>


</Menu>
</template>

<script>
  import {logout} from '@/api/apis';
  import { mapState,mapGetters,mapMutations,mapActions} from 'vuex'
  import {clearCacheData} from "@/utils/cache";
  import BaseConfig from '@/config/config'

  export default {
    name:"HeaderNav",
    data(){
        return{
            list:[{}],
            selected:'',
            modalSelf:false,
            modalPassword:false,
            moduleName: "ERP_Account",
            actionList: "Account",
            accountEntity:{},
            selfAccount:{},
            refresh : false
        }
    },
    mounted(){

    },
    computed:{
      ...mapGetters('breadcrumb',{
        breadcrumb:'getBreadCrumb'
      }),
    } ,
    methods:{
        ...mapMutations('breadcrumb',{
          clearAllBreadCrumb: 'clearAllBreadCrumb' ,
          changeBreacCrumb:'changeBreacCrumb'
        }),
        go_home(){
          this.nav({path:BaseConfig.HOME_PATH})
        },
        change_tab(item){
          this.nav({path:item.path})
          this.changeBreacCrumb({
            type:'changeBreadCrumb',
            value:item
          });
        },
        exit(){
            this.$Modal.confirm({
                title: '提醒',
                content: '<p>您确定要退出系统？</p>',
                onOk: () => {
                  // logout().then(res=>{
                  //   clearCacheData([BaseConfig.TOKEN_KEY]);
                  //   this.nav({path:BaseConfig.LOGIN_PATH})
                  // })

                  clearCacheData([BaseConfig.TOKEN_KEY]);
                  this.nav({path:BaseConfig.LOGIN_PATH})

                }
            });

        },

    }
}
</script>

<style lang="less">
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.menu_tabs{
  display: flex;
  float: left;
}
.menu_tabs .item{
  margin-right: 20px;
  color: white;
  cursor: pointer;
  display: flex;
  position: relative;

}
.menu_tabs .item .close{
  margin-left: 10px;
  font-size: 16px;
}
.menu_tabs .item:hover{
  color: red;
}
.menu_tabs .active{
  color:red
}
.layout-logo{
    width: 300px;
    height: 30px;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
    color:#fff;
    font-size:30px;
    line-height:30px
}

.layout-logo a{color:#fff}
.layout-logo a:hover{color:#ddd}
.layout-nav{
    margin: 0 auto;
    margin-right: 20px;
    float:right;
}
.layout-footer-center{
    text-align: center;
}
</style>
