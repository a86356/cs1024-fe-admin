<template>
  <div class="wrapper">




    <div class="directly-upload" >
      <div class="multiple">
        <div class="directly-upload" style="display: flex">
          <input
            ref="upload"
            @change="handleChange"
            type="file"
            name="file"
            accept="*/*"
            multiple>
          <div style="display: flex">
            <Button type="success" style="margin-right: 20px;" @click="handleUpload">确定上传</Button>
            <Button type="info"  @click="converttoseg">视频分片</Button>
          </div>
      </div>
      </div>
    </div>

    <div v-for="(item,index) in imageList" :key="index" class="uploaditem">
      <div class="item">
        <div class="l">{{item.key}}</div>
        <div class="r">
          <div class="percent" :style="{'width':item.percent+'%'}" v-show="item.percent>0">{{item.percent | keeptwo}}%</div>
        </div>
      </div>
    </div>


    <Table stripe @on-selection-change="selectChange"  :loading="loading1"  border :columns="columns1" :data="list1"></Table>
    <div class="pageWrap">
      <Page :page-size="pSize"  :total="counts" @on-change='change_page'></Page>
    </div>
  </div>
</template>

<script>
    import {getlist,commonapi} from '@/api/apis'
    import * as qiniu from 'qiniu-js'

    export default {
        name: "",
        inject:['reload'],
        data() {
            return {
                formItem:{

                },
                keyList: [], // 存放上传的名字
                imageList: [], // 存放上传信息
                qiniuToken:"",
                addmodal:false,
                pwdmodal:false,
                updatemodal:false,
                columns1: [
                    {
                        title: "编号",
                        key: "id"
                    },
                    {
                        title: "视频名称",
                        key: "name",
                    },
                    {
                        title: "时长",
                        key: "duration"
                    },
                    {
                        title: "mp4地址",
                        key: "video_mp4_url"
                    },
                    {
                        title: "分片地址",
                        key: "video_segment_url"
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
                        title: "哈希值",
                        key: "hash",
                    },
                ],
            }
        },
        components: {
        },
        mounted() {
            this.getUploadToken().then(res=>{
                this.qiniuToken = res.token;
            })
            this.loadData()
          //  this.converttoseg();
        },


        methods: {
            //视频分片
            converttoseg(){
                commonapi({
                    service: 'admin.dealqiniuvideo'
                }).then(res=>{
                    this.$Notice.success({
                        title: '视频分片成功！',
                        desc: "成功咯",
                    });
                    this.reload();
                })
            },
            handleChange(e) { // 选择文件后将文件交给handleBeforeUpload进行处理
                const { files } = e.target;
                if (!files) {
                    return;
                }
                Array.from(files).forEach((file) => {
                    this.handleBeforeUpload(file);
                });
            },
            handleBeforeUpload(file) { // 将文件名变成：前缀/时间戳_原文件名.后缀
                const suffixList = file.name.split('.');
                const baseName = suffixList[0];
                const suffix = suffixList[1];
                const fileType = file.type;
                const key = `${baseName}.${suffix}`;
                const newFile = new File([file], key, { type: fileType });
                const postItem = {
                    file: newFile,
                    key: key,
                    token: this.qiniuToken,
                    percent:0,
                };
                this.imageList.push(postItem);


                return false;
            },
            async handleUpload() {  // 执行真正的上传逻辑
                if (this.imageList.length === 0) {
                    this.$Notice.warning({
                        title: '当前没有可上传的文件！',
                    });
                    return;
                }

                // 遍历，执行上传
                this.imageList.forEach((item,idx) => {
                    this.fileUpload(item,idx);
                });
            },

            loadData(){

                this.loadData_table();
            },

            loadData_table(){

                getlist({
                    page:this.page,
                    table:'video_base',
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


            // 上传文件

            /* const postItem = {
                file: newFile,
                key: newName,
                token: this.qiniuToken,
            };
            * */
            fileUpload(item,index){


                let file = item.file

                let putExtra={}
                let config={
                    useCdnDomain: false,
                    region: null
                }



                const that =this;
                var observable = qiniu.upload(file, item.key, item.token, putExtra, config)

                observable.subscribe(next=>{

                    const {percent} =  next.total;
                    that.imageList[index].percent=percent;
                },error=>{
                    console.log(error)
                },complete=>{
                    const {hash,key} =complete;
                    const fileLink = `${that.baseURL}${key}`;
                    let o={
                        service:"video.add",
                        hash:hash,
                        mp4url:fileLink,
                        name:key
                    }


                    commonapi(o).then(res=>{
                        this.$Notice.success({
                            title: '已经成功插入数据库！',
                            desc: fileLink,
                        });

                        //入库之后调用下分片接口
                        this.converttoseg();

                    })
                    this.$Notice.success({
                        title: '上传成功！',
                        desc: fileLink,
                    });


                })

            },

            handleSuccess(res){
                console.log(res)
            }
        }
    }
</script>

<style scoped lang="less">
  .directly-upload{
    margin: 20px 0;
    width: 400px;
  }
  .uploaditem{
    margin: 20px 0;
    .l{
      width: 300px;
      overflow: hidden;
      font-weight: bold;
      font-size: 16px;
      color: #00a0e9;
    }
    .item{
      display: flex;
      line-height: 40px;
      height: 40px;
      .r{
        width: 500px;
        height: 40px;
        text-align: center;
        margin-left: 20px;
      }
      .percent{
        height: 100%;
        background: lightseagreen;
        font-size: 16px;
        color: #fff;
        font-weight: bold;
      }
    }
  }
</style>
