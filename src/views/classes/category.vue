<template>
  <div class="wrapper">

    <Form :model="formItem" :label-width="50" inline>

      <FormItem>
        <Button type="info" style="margin-left: 8px" @click="showaddmodal">新增分类</Button>
      </FormItem>
    </Form>

    <Modal v-model="addmodal" width="360" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>新增分类</span>
      </p>
      <Form :model="data1" :label-width="150" inline>
        <FormItem label="技术分类名称">
          <Input v-model="data1.name" placeholder="请输入分类名称"></Input>
        </FormItem>
        <FormItem label="排序">
          <Input v-model="data1.sort" placeholder="请输入数字，数字越大，排序越靠前"></Input>
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
                        title: "分类名",
                        key: "name",
                    },
                    {
                        title: "排序",
                        key: "sort",
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
                                    "修改"
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
                                                let {id} =  params.row;
                                                this.$Modal.confirm({
                                                    title: '删除',
                                                    content: '您确定要删除吗?',
                                                    onOk: () => {
                                                        commonapi({
                                                            service:"admin.deleteids",
                                                            table:'classes_category',
                                                            ids:id
                                                        }).then(res=>{
                                                            this.showsuccessmsg('删除成功');
                                                            this.reload()
                                                        })

                                                    }
                                                });
                                            }
                                        }
                                    },
                                    "删除分类"
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
                    service:"classescategory.add",
                    ...this.data1
                }).then(res=>{
                    this.showmsg('success','新增成功');
                    this.data1={}
                })
            },
            loadData_table(){

                getlist({
                    page:this.page,
                    table:'classes_category',
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
