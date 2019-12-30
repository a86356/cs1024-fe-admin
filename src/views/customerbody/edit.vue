<template>
    <div class="wrapper">
      <div>
        <Button type="primary"  class="ml10" @click="submit"> 保存身体数据</Button>
      </div>

      <div class="upbody" >

        <div class="df cnt">
          <div class="left">
            <div class="df hd">
              <div class="bodytabwrap">
                <div v-for="(item1) in bodyuptabs" class="item">
                  <div>{{item1.title}}</div>
                </div>
              </div>
            </div>
            <div v-for="(item1,index1) in bodyuplist">
              <div class="df">
                <div v-for="(item2,index2) in item1.item">
                  <div v-if="item2.type=='title'" class="part_title">
                    <span>{{item2.name}}</span>
                  </div>
                  <div v-if="item2.type=='input'" class="part_title">
                    <Input  :disabled="item1.disabled" :type="item2.formtype" class="input_1"   v-model="data1[item2.name]">
                    </Input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>


    </div>
</template>

<script>

  import {getBodyData,addBodyData,updateBodyData} from '@/api/apis'
  
  export default {
        name: "",
        data(){
            return {
              data2:{},
              data3:{},
              q:"1",
              fixIndex:1,
              index:0,
              tabs1:[],
              bodyId:"",
              customerId:'',
              bodyuptabs:[
                {
                  title:"净体",
                  type:"title"
                }
              ],
              bodyuplist:[
                {
                  item:[
                    {
                      type:"title",
                      name:"客户编号",
                    },
                    {
                      type:"input",
                      formtype:'text',
                      name:"dataNo"
                    },
                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"肩宽",
                    },
                    {
                      type:"input",
                      formtype:'text',
                      name:"shoulderWidth"
                    },
                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"袖长",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"sleeveLength"
                    }
                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"袖肥",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"sleeveWidth"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"袖口",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"cuff"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"领围",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"neckGirth"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"肚围",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"bellyGirth"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"下摆",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"sweep"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"前衣长",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"frontLength"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"后衣长",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"backLength"
                    }
                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"腰围",
                    },
                    {
                      type:"input",
                      formtype:'text',
                      name:"waist"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"臀围",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"hipline"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"横裆",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"crosspiece"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"通裆",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"crotchWidth"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"裤长",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"outseam"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"裤长",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"outseam"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"内长",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"insideLength"
                    },

                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"脚口",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"panls"
                    },
                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"体重",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"weight"
                    },
                  ]
                },
                {
                  item:[
                    {
                      type:"title",
                      name:"身高",
                    },
                    {
                      type:"input",
                      formtype:'number',
                      name:"height"
                    },
                  ]
                },
              ],
              bodydowntabs:[],
              bodydownlist:[],
            }
        },
        created(){
          var param = this.$route.query;
          this.bodyId =param.bodyId;
          this.customerId =param.customerId;
        },
        components: {},
        mounted() {

          if(this.bodyId==0)return;

          getBodyData({id:this.bodyId}).then(res=>{
            this.data1=res.data;
          })
        },

      methods: {

          submit(){

            let d =this.data1;
            d.customerId=this.customerId;


            if(this.bodyId>0){
              d.id=this.bodyId
              updateBodyData(d).then(res=>{

              })
            }else{
              addBodyData(d).then(res=>{
                this.pop();
              })
            }


          },

      }
    }
</script>

<style scoped lang="less">
.ml20{
  margin-left: 20px;
}
.ml10{
  margin-left: 10px;
}

.bodytabwrap{
  display: flex;
  font-weight: bold;
  font-size: 20px ;
  margin-top: 20px;
  .item{
    width:100px;
    text-align: left;
  }

}
.right{
  .hd{
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
    .tit{
      width: 100px;
    }
  }
}
.part_title{
  font-size: 16px;
  line-height: 40px;
  font-weight: bold;
  width: 100px;
}


.input_1{
  width: 80px;
}
  .myinput{
    display: inline-block;
    width: 80px;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out,background .2s ease-in-out,-webkit-box-shadow .2s ease-in-out;
  }
</style>
