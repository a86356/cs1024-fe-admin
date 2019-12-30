<template>
    <div>
        <h2 style="padding-bottom:15px">数据统计 <label>{{CurrentDate}}</label></h2>
        <div class="ks-grid">
            <div class="ks-grid-item" style="width:25%">
                <div class="box bg-primay">
                    <h3>总营业额</h3>
                    <div>{{counts.TotalAmount}}<label>元</label></div>
                </div>
            </div>
            <div class="ks-grid-item" style="width:25%" >
                <div class="box bg-primay">
                    <h3>总订单量</h3>
                    <div>{{counts.Orders}}<label>个</label></div>
                </div>
            </div>
            <div class="ks-grid-item" style="width:25%">
                <div class="box bg-primay">
                    <h3>总面料数</h3>
                    <div>{{counts.Materials}}<label>种</label></div>
                </div>
            </div>
            <div class="ks-grid-item" style="width:25%">
                <div class="box bg-error">
                    <h3>今日营业额</h3>
                    <div>{{counts.TodayAmount}}<label>元</label></div>
                </div>
            </div>
        </div>
        <h2 style="padding-top:15px">近期订单汇总</h2>
        <div>
            <Order />
        </div>
    </div>
</template>

<script>
import Order from '@/views/ERP_Order/list.vue';
export default {
    name:"dashboard",
    components:{
        Order
    },
    data(){
        return{
            counts:{
                TotalAmount:0,
                Orders:0,
                Materials:0,
                TodayAmount:0,
                CurrentDate:""
            },
            formInline:{}
        }
    },
    created(){

        var dt = new Date();

        this.CurrentDate = dt.getFullYear()+"年"+ (dt.getMonth() +1) +"月"+dt.getDate()+"日 "+dt.getHours()+":"+dt.getMinutes()

        this.service("Dashboard").get({t:'Counts'}).then((_list)=>{
            this.counts = _list.data
        });
    },
    methods:{
        
    }
}
</script>

<style>
.ks-grid{display:flex}
.ks-grid .ks-grid-item{padding-right:20px}
.ks-grid .box{padding:30px 40px;color:#fff;font-size:30px}
.ks-grid .box h3{font-size:20px;text-align:left;}
.ks-grid .box label{font-size:16px;margin-left:8px;}
.bg-primay{background:#5cadff}
.bg-error{background:#ed3f14}
</style>
