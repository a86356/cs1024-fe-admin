<template>
  <div class="wrapper">

    <Form :model="formItem" :label-width="50" inline>
      <FormItem label="手机号">
        <Input v-model="formItem.phone" placeholder="请输入会员手机号"></Input>
      </FormItem>
      <FormItem label="用户名">
        <Input v-model="formItem.username" placeholder="请输入会员用户名"></Input>
      </FormItem>
      <FormItem label="邮箱">
        <Input v-model="formItem.email" placeholder="请输入会员邮箱"></Input>
      </FormItem>

      <FormItem>
        <Button type="primary" @click="search">搜索会员</Button>
        <Button type="info" style="margin-left: 8px" @click="showaddmodal">新增会员</Button>
      </FormItem>
    </Form>

    <Modal v-model="addmodal" width="360" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>新增会员</span>
      </p>
      <Form :model="data1" :label-width="50" inline>
        <FormItem label="手机号">
          <Input v-model="data1.phone" placeholder="请输入会员手机号"></Input>
        </FormItem>
        <FormItem label="用户名">
          <Input v-model="data1.username" placeholder="请输入会员用户名"></Input>
        </FormItem>
        <FormItem label="邮箱">
          <Input v-model="data1.email" placeholder="请输入会员邮箱"></Input>
        </FormItem>
        <FormItem label="密码">
          <Input v-model="data1.password" placeholder="请输入会员邮箱"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long  @click="adduser">新增</Button>
      </div>
    </Modal>


    <Modal v-model="pwdmodal" width="360" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="md-albums" />
        <span>修改密码</span>
      </p>
      <Form :model="data1" :label-width="50" inline>
        <FormItem label="新密码">
          <Input v-model="data1.password" placeholder="请输入密码"></Input>
        </FormItem>

      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long  @click="changepwd">新增</Button>
      </div>
    </Modal>

    <Modal v-model="updatemodal" width="360" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="md-albums" />
        <span>更新用户信息</span>
      </p>
      <Form :model="data1" :label-width="100" inline>
        <FormItem label="会员类型">
          <RadioGroup v-model="data1.viptype">
            <Radio label="1">
              <span>普通会员</span>
            </Radio>
            <Radio label="2">
              <span>vip</span>
            </Radio>
            <Radio label="3">
              <span>svip</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="会员过期时间">
          <DatePicker type="datetime" v-model="data1.expired_time" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择会员到期时间" style="width: 200px"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long  @click="updateuser">新增</Button>
      </div>
    </Modal>

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
                                            'max-width':"100%"
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
                        title: "积分",
                        key: "point",
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
                        title: "会员到期时间",
                        key: "expired_time",
                        render:(h,params)=>{
                            let timestamp4=  new Date( parseInt(params.row.expired_time+'000')).Format('yy-MM-dd hh:mm:ss')
                            return h('div',timestamp4);
                        },
                    },
                    {
                        title: "会员创建时间",
                        key: "create_time",
                        render:(h,params)=>{
                            let timestamp4=  new Date( parseInt(params.row.create_time+'000')).Format('yy-MM-dd hh:mm:ss')
                            return h('div',timestamp4);
                        },
                    },
                    {
                        title: "操作",
                        key: "action",
                        width: 200,
                        align: "center",
                        fixed:'right',
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
                                                this.pwdmodal=true;
                                                this.data1={id:params.row.id};
                                            }
                                        }
                                    },
                                    "修改密码"
                                ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "info",
                                            size: "small"
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                let {viptype,expired_time,id} =  params.row;

                                                this.updatemodal=true;
                                                this.data1={
                                                    viptype:viptype,
                                                    expired_time:formatTime(expired_time),
                                                    id:id
                                                }
                                            }
                                        }
                                    },
                                    "更新用户信息"
                                ),
                            ]);
                        }
                    }
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
                    table:'member_base',
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
