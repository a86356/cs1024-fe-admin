<template>
    <div>
        <h2 style="padding-bottom:15px">{{name}} <label></label></h2>
        <div class="ks-grid">
            <div class="ks-grid-item" style="width:25%" v-for="item in moduleList" @click="openNav(item)">
                <div class="box bg-white">
                    <h3>{{item.Name}}</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"module",
    props:{
        modules:{
            type:Array,
            default(){
                return new Array()
            }
        }
    },
    data(){
        return{
            name:'快速导航',
            moduleList:[]
        }
    },
    created(){
        this.bus.$on('nav-modules',(_val)=>{
            this.name = _val.Name;
            this.moduleList = _val.Data;
        })     
    },
    methods:{
        openNav(_item){
            //this.selected = this.idx + '-' + _idx;
            this.$router.push({path:'/'+_item.TableName+"__"+_item.Page});
        }
    }
}
</script>

<style>
.ks-grid{display:flex}
.ks-grid .ks-grid-item{padding-right:20px}
.ks-grid .box{padding:30px 40px;color:#fff;font-size:30px;margin-bottom:16px;}
.ks-grid .box h3{font-size:20px;text-align:left;}
.ks-grid .box label{font-size:16px;margin-left:8px;}
.bg-primay{background:#b2d6fa}
.bg-white{background:#515a6e;cursor:pointer}
.bg-white:hover{background:#808695}
.bg-error{background:#ed3f14}
</style>
