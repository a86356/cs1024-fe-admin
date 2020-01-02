<template>
  <div class="wrapper">

    <Form :model="formItem" :label-width="60" inline>
      <FormItem label="课程大课">
        <Select @on-change="search" v-model="formItem.class_name" style="width:200px">
          <Option v-for="(item,index) in allclasses" :value="item.classesname" :key="index">{{ item.classesname}}</Option>
        </Select>
      </FormItem>
      <FormItem label="课程小课">
        <Input v-model="formItem.seg_name" placeholder="请输入小课名称"></Input>
      </FormItem>
      <FormItem label="上下架">
        <Select @on-change="search" v-model="formItem.status" style="width:200px">
          <Option value="1">上架</Option>
          <Option value="2">下架</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="search">搜索小课</Button>
        <Button type="info" style="margin-left: 8px" @click="showaddmodal">新增小课</Button>
      </FormItem>
    </Form>

    <Modal v-model="addmodal" width="960" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>新增小课程</span>
      </p>
      <Form :model="data1" :label-width="90" >
        <FormItem label="大课名">
<!--          <Select  v-model="data1.class_name" style="width:200px">-->
<!--            <Option v-for="(item,index) in allclasses" :value="item.classesname" :key="index">{{ item.classesname}}</Option>-->
<!--          </Select>-->

          <RadioGroup v-model="data1.class_name" @on-change="selectClass">
            <Radio @on-change="search" v-for="(item,index) in allclasses" :label="item.classesname" :key="index"></Radio>
          </RadioGroup>

        </FormItem>
        <FormItem label="小课选择">
          <Transfer
            :data="allvideios"
            :target-keys="targevideos"
            filterable
            :filter-method="filterMethod"
            @on-change="handleChange2"></Transfer>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long  @click="addform">新增</Button>
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
                allclasses:[],

                allvideios:[],
                targevideos:[],
                columns1: [
                    {
                        title: "编号",
                        key: "id"
                    },
                    {
                        title: "大课id",
                        key: "class_id",
                    },
                    {
                        title: "大课名",
                        key: "class_name"
                    },
                    {
                        title: "小课id",
                        key: "seg_id"
                    },
                    {
                        title: "小课名",
                        key: "seg_name"
                    },
                    {
                        title: "上下架",
                        key: "status",
                        render:(h,params)=>{
                            let {status}  =params.row;
                            let color='green';
                            let msg='';
                            switch (status) {
                                case '1':
                                    color='green'
                                    msg='上架';
                                    break;
                                case '2':
                                    color='red'
                                    msg='下架';
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
                        title: "时长",
                        key: "duration",
                    },
                    {
                        title: "创建时间",
                        key: "create_time",
                        render:(h,params)=>{
                            let timestamp4=  new Date( parseInt(params.row.create_time+'000')).Format('yy-MM-dd hh:mm:ss')
                            return h('div',timestamp4);
                        },
                    },
                    {
                        title: "视频地址",
                        key: "segurl",
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
                                                let {id,status}=params.row;
                                                let s=status==1?2:1

                                                commonapi({
                                                    service:'classes.updateseg',
                                                    status:s,
                                                    id:id
                                                }).then(res=>{
                                                    this.showNoticeSuccess('更新成功');
                                                    this.reload();
                                                })
                                            }
                                        }
                                    },
                                    "上/下架"
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

                commonapi({
                    service:"admin.getall",
                    table:"classes_base"
                }).then(res=>{
                    this.allclasses = res.list;

                })


                commonapi({
                    service:"admin.getall",
                    table:"video_base"
                }).then(res=>{

                    let {list} =res;

                    let mockData = [];
                    for (let i = 0; i <list.length; i++) {
                        let item = list[i]
                        mockData.push({
                            key: item.id,
                            label: item.name,
                            description: item.id,
                            disabled: false
                        });
                    }

                    this.allvideios =mockData;

                })



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
                    table:'classes_segments',
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
            },

            handleChange2 (newTargetKeys) {
                this.targevideos = newTargetKeys;
            },
            filterMethod (data, query) {
               if(query==''){
                   return data;
               }else{
                   return data.label.indexOf(query) > -1;
               }

            },
            addform(){
                let all = this.allvideios;
                let target = this.targevideos;

                if(target.length==0){
                    this.showmsg('info','没有选择数据');
                    return;
                }
                let t=[];
                for (let i=0;i<target.length;i++){
                    let key = target[i];

                    for(let j=0;j<all.length;j++){
                        if(key==all[j].key){
                            t.push(all[j])
                        }
                    }
                }
                let classname =this.data1.class_name
                if(!classname){
                    this.showmsg('info','请先选择大课程');
                    return;
                }
                commonapi({
                    service:"classes.addseg",
                    classesname:classname,
                    list:t
                }).then(res=>{
                    this.showNoticeSuccess('添加成功');
                    this.reload();
                })
            },
            selectClass(val){

            }

        }
    }
</script>

<style scoped lang="less">
  /deep/.ivu-transfer-list{
    width: 350px;
  }
</style>
