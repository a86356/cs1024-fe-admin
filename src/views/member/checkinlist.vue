<template>
  <div class="wrapper">



    <Table stripe @on-selection-change="selectChange"  :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :page-size="pSize"  :total="counts" @on-change='change_page'></Page>
    </div>
  </div>
</template>

<script>
    import {getlist,commonapi} from '@/api/apis'
    import {cnto10time,formatTime} from '@/utils/date'

    export default {
        name: "",
        inject:['reload'],
        data() {
            return {
                formItem:{

                },
                addmodal:false,
                pwdmodal:false,
                updatemodal:false,
                columns1: [
                    {
                        title: "编号",
                        key: "id"
                    },
                    {
                        title: "头像",
                        key: "avatar_url",
                        render: (h, params) => {

                            return h('div',[
                                    h('img',{
                                        attrs: {
                                            src: params.row.avatar_url,
                                        },
                                        style:{
                                            'max-width':"100%",
                                            'width':'60px'
                                        }
                                    })
                                ],
                            )
                        }
                    },
                    {
                        title: "用户名",
                        key: "username"
                    },
                    {
                        title: "邮箱",
                        key: "email"
                    },
                    {
                        title: "手机号",
                        key: "phone"
                    },

                    {
                        title: "会员类型",
                        key: "viptype",
                        render:(h,params)=>{
                            let {viptype}  =params.row;
                            let color='green';
                            let msg='';
                            switch (viptype) {
                                case '1':
                                    color='green'
                                    msg='普通会员';
                                    break;
                                case '2':
                                    color='red'
                                    msg='vip会员';
                                    break;
                                case '3':
                                    color='cyan'
                                    msg='svip会员';
                                    break;
                            }

                            return h("div", [
                                h(
                                    "Tag",
                                    {
                                        props: {
                                            color:color
                                        }
                                    },
                                    msg
                                )
                            ]);
                        },
                    },
                    {
                        title: "签到内容",
                        key: "cnt",
                    },

                ],
            }
        },
        components: {
        },
        mounted() {
            this.loadData();
        },

        methods: {
            loadData(){

                this.loadData_table();
            },
            adduser(){

                commonapi({
                    service:"member.add",
                    ...this.data1
                }).then(res=>{
                    this.showmsg('success','新增成功');
                    this.addmodal=false;
                    this.data1={}
                })
            },
            loadData_table(){

                getlist({
                    page:this.page,
                    table:'member_checkin',
                    search:this.searchdata
                }).then(res=>{

                    this.list1=res.list;
                    this.counts=res.count;

                })
            },
            search(){

                this.page=1;
                this.searchdata=this.formItem

                this.loadData_table();
            },
            showaddmodal(){
                this.addmodal=true;
                this.data1={};

            },
            changepwd(){

                commonapi({
                    service: "member.changepwd",
                    ...this.data1
                }).then(res=>{
                    this.showsuccessmsg('修改成功');
                    this.pwdmodal=false;
                    this.data1={}
                    this.reload();
                })
            },
            updateuser(){
                let timestamp = cnto10time(this.data1.expired_time);
                let {viptype,id} = this.data1;
                commonapi({
                    service:'member.updatemember',
                    expired_time: timestamp,
                    viptype: viptype,
                    id:id
                }).then(res=>{
                    this.showsuccessmsg('修改修改成功');
                    this.data1={}
                    this.updatemodal=false;
                    this.reload();

                })
            }
        }
    }
</script>

<style scoped lang="less">

</style>
