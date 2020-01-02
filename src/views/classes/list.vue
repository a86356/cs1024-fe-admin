<template>
  <div class="wrapper">

    <Form :model="formItem" :label-width="70" inline>
      <FormItem label="课程名">
        <Input v-model="formItem.classesname" placeholder="请输入会员手机号"></Input>
      </FormItem>
      <FormItem label="课程分类">
        <Select v-model="formItem.classescategory" style="width:200px">
          <Option v-for="(item,index) in categoryList" :value="item.name" :key="index">{{ item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="search">搜索课程</Button>
        <Button type="info" style="margin-left: 8px" @click="showaddmodal">新增课程</Button>
      </FormItem>
    </Form>

    <Modal v-model="addmodal" width="360" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>新增课程</span>
      </p>
      <Form :model="data1" :label-width="100" inline>
        <FormItem label="课程名称">
          <Input v-model="data1.classesname" placeholder="请输入课程名称"></Input>
        </FormItem>
        <FormItem label="课程分类名">
          <RadioGroup v-model="data1.classescategory">
            <Radio :label="item.name"  v-for="(item,index) in categoryList" :key="index" >{{item.name}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="课程图片">
          <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            multiple
            type="drag"
            name="file"
            :action="qiniuUploadUrl"
            :data="{token: uploadToken}"
            style="display: inline-block;width:58px;"
            >
            <div style="width: 58px;height:58px;line-height: 58px;">
              上传图片
              <Icon type="camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <div>
          <img :src="data1.pic" style="width: 200px;height: 100px" alt="">
        </div>

        <FormItem label="课程状态">

          <RadioGroup v-model="data1.status">
            <Radio label="1">未更新</Radio>
            <Radio label="2">更新中</Radio>
            <Radio label="3">已完结</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否收费">
          <RadioGroup v-model="data1.viptype">
            <Radio label="1">收费</Radio>
            <Radio label="2">免费</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long  @click="addnew">新增</Button>
      </div>
    </Modal>

    <Modal mask-closable="false" v-model="introductionmodal" width="1280" height="800px" :mask-closable="false">
      <!--欢迎发表评论哦~~(支持markdown语法,支持图片拖拽上传,图片复制后粘贴上传,点击上方按钮插入代码)-->
      <!--https://www.cnblogs.com/rich23/p/9877576.html-->
      <mavon-editor
        style="height: 500px"
        placeholder="请输入内容"
        :toolbars="toolbars"

        v-model="data1.introduction_md"
      />

      <div slot="footer">
        <Button type="info" size="large"   @click="cancelintroductionmodal">取消</Button>
        <Button type="primary" size="large"   @click="updateintroduction">确定</Button>
      </div>
    </Modal>

    <Modal v-model="updatemodal" width="360" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>更新课程</span>
      </p>
      <Form :model="data1" :label-width="100" inline>
        <FormItem label="课程名称">
          <Input v-model="data1.classesname" placeholder="请输入课程名称"></Input>
        </FormItem>
        <FormItem label="排序">
          <Input v-model="data1.sort" placeholder="请输入排序数字"></Input>
        </FormItem>
        <FormItem label="课程节数">
          <Input v-model="data1.number" placeholder="请输入课程节数"></Input>
        </FormItem>
        <FormItem label="课程分类名">
          <RadioGroup v-model="data1.classescategory">
            <Radio :label="item.name"  v-for="(item,index) in categoryList" :key="index" >{{item.name}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="课程图片">
          <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            multiple
            type="drag"
            name="file"
            :action="qiniuUploadUrl"
            :data="{token: uploadToken}"
            style="display: inline-block;width:58px;"
          >
            <div style="width: 58px;height:58px;line-height: 58px;">
              上传图片
              <Icon type="camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <div>
          <img :src="data1.pic" style="width: 200px;height: 100px" alt="">
        </div>

        <FormItem label="课程状态">

          <RadioGroup v-model="data1.status">
            <Radio label="1">未更新</Radio>
            <Radio label="2">更新中</Radio>
            <Radio label="3">已完结</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否收费">
          <RadioGroup v-model="data1.viptype">
            <Radio label="1">收费</Radio>
            <Radio label="2">免费</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="参考文档">
          <Input v-model="data1.reference" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="请输入参考内容"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long  @click="updateform">新增</Button>
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
                toolbars: {

                    code: true, // code

                    preview: true, // 预览
                },
                categoryList:[],
                addmodal:false,
                pwdmodal:false,
                updatemodal:false,
                introductionmodal:false,
                columns1: [
                    {
                        title: "编号",
                        key: "id"
                    },
                    {
                        title: "课程封面",
                        key: "pic",
                        render: (h, params) => {

                            return h('div',[
                                    h('img',{
                                        attrs: {
                                            src: params.row.pic,
                                        },
                                        style:{
                                            'max-width':"100%",
                                            'width':"100px"
                                        }
                                    })
                                ],
                            )
                        }
                    },
                    {
                        title: "课程名",
                        key: "classesname"
                    },
                    {
                        title: "课程类别",
                        key: "classescategory"
                    },
                    {
                        title: "课程状态",
                        key: "status",
                        render:(h,params)=>{
                            let {status}  =params.row;
                            let color='green';
                            let msg='';
                            switch (status) {
                                case '1':
                                    color='green'
                                    msg='未更新';
                                    break;
                                case '2':
                                    color='red'
                                    msg='更新中';
                                    break;
                                case '3':
                                    color='cyan'
                                    msg='已完结';
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
                        title: "课程类型",
                        key: "viptype",
                        render:(h,params)=>{
                            let {viptype}  =params.row;
                            let color='green';
                            let msg='';
                            switch (viptype) {
                                case '1':
                                    color='red'
                                    msg='vip';
                                    break;
                                case '2':
                                    color='green'
                                    msg='免费';
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
                        title: "课程介绍",
                        key: "introduction_md",
                        render: (h, params) => {

                            return h('div',{
                                    attrs: {
                                        src: params.row.introduction_md,
                                    },
                                    style:{
                                        'max-width':"100%",
                                        'height':"100px",
                                        'overflow':'hide'
                                    }
                                },params.row.introduction_md
                            )
                        }
                    },
                    {
                        title: "参考资料",
                        key: "reference",
                    },
                    {
                        title: "发布时间",
                        key: "create_time",
                        render:(h,params)=>{
                            let timestamp4=  new Date( parseInt(params.row.create_time+'000')).Format('yy-MM-dd hh:mm:ss')
                            return h('div',timestamp4);
                        },
                    },

                    {
                        title: "课程节数",
                        key: "number"
                    },
                    {
                        title: "排序",
                        key: "sort",
                    },
                    {
                        title: "评论数",
                        key: "commentnum",
                    },
                    {
                        title: "喜欢数",
                        key: "lovenum",
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
                                                this.updatemodal=true;
                                                this.data1={...params.row};
                                            }
                                        }
                                    },
                                    "更新"
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
                                              this.introductionmodal=true;
                                              this.data1.introduction_md=params.row.introduction_md;
                                              this.data1.id=params.row.id;

                                            }
                                        }
                                    },
                                    "简介"
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
                                                            table:'classes_base',
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
                                    "删除"
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


            commonapi({
                service:"admin.getall",
                table:"classes_category"
            }).then(res=>{

              this.categoryList =res.list
            })


            this.getUploadToken().then(res=>{
                this.uploadToken = res.token;
            })
        },

        methods: {
            loadData(){

                this.loadData_table();
            },
            addnew(){


                commonapi({
                    service:"classes.add",
                    ...this.data1
                }).then(res=>{
                    this.showNoticeSuccess('新增课程成功');
                })
            },
            updateintroduction(){

                commonapi({
                    service:"classes.updateintroduction",
                    md:this.data1.introduction_md,
                    id:this.data1.id
                }).then(res=>{
                    this.showNoticeSuccess('更新成功')
                    this.reload()
                })

            },
            loadData_table(){

                getlist({
                    page:this.page,
                    table:'classes_base',
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
            updateform(){

                delete this.data1._index;
                delete this.data1._rowKey;

                commonapi({
                    service:'classes.update',
                    data: {...this.data1},
                    table: 'classes_base',
                    id:this.data1.id
                }).then(res=>{
                    this.showsuccessmsg('修改修改成功');
                    this.data1={}
                    this.updatemodal=false;
                    this.reload();
                })
            },
            handleSuccess(res){
              let {key} =res;
              this.$set(this.data1,'pic',this.baseURL+key)
            },
            cancelintroductionmodal(){
                this.introductionmodal=false;
                this.reload()
            }
        }
    }
</script>

<style scoped lang="less">

</style>
