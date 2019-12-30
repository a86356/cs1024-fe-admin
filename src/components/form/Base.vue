<template>
  <Form :ref="form.ref" :model="data" :inline="form.inline" :rules="form.rule" :label-width="form.MylabelWidth">
    <div v-for="(item,index) in form.formlist" :key="index">
      <h1>{{item.title}}</h1>
      <FormItem :label="item1.label" :prop="item1.name" v-for="(item1,index1) in item.fields" :key="index1" :style="item1.style" >

        <div v-if="item1.type=='text'">
          <Input type="text" :style="item1.style" :disabled="item1.disabled"  :value="data[item1.name]" v-model="data[item1.name]" :placeholder="item1.placeholder" >
          </Input>
        </div>

        <div v-if="item1.type=='textarea'">
          <Input type="textarea" :style="item1.style" :disabled="item1.disabled"  :value="data[item1.name]" v-model="data[item1.name]" :placeholder="item1.placeholder" >
          </Input>
        </div>


        <div  v-if="item1.type=='password'">
          <Input type="password" :style="item1.style" v-model="data[item1.name]" :placeholder="item1.placeholder">
          </Input>
        </div>

        <div v-if="item1.type=='select'">
          <i-select @on-change="dealEvent(item1.func)"  :disabled="item1.disabled"   :placeholder="item1.placeholder" v-model="data[item1.name]" v-if="item1.type=='select'" :style="item1.style">
            <i-option   v-for="(item2,index2) in item1.options.list" :value="item2.value" :key="item2.index2">{{ item2.label }}</i-option>
          </i-select>
        </div>

        <Button :type="item1.color" @click="dealEvent(item1.func)" :style="item1.style"  v-if="item1.type=='button'">{{item1.name}}</Button>
        <div v-if="item1.type=='div'">{{item1.name}}</div>
        <div :class="item1.className" @click="dealEvent(item1.func)" v-if="item1.type=='a'">{{item1.name}}</div>

        <div class="df" v-if="item1.type=='msgcode'" :style="item1.style">
          <Input type="text" v-model="data.msgCode" placeholder="请输入验证码" >
          </Input>
          <Button type="primary" @click="dealEvent(item1.func)" style="width: 150px">{{mycodemsg}}</Button>
        </div>
        <div v-if="item1.type=='pdc'" >
          <Cascader :data="city" :disabled="item1.disabled"  v-model="data[item1.name]" :placeholder="item1.placeholder"></Cascader>
        </div>
        <div v-if="item1.type=='datepicker'" >
          <DatePicker v-model="data[item1.name]"   type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
        </div>
        <div v-if="item1.type=='datetime'" >
          <DatePicker v-model="data[item1.name]" @on-change="data[item1.name]=$event"  type="datetime"  :format="item1.format" :placeholder="item1.placeholder" style="width: 250px"></DatePicker>
        </div>
        <div v-if="item1.type=='image'" >
          <img :src="data[item1.name]" :style="item1.style" alt="">
        </div>

        <div v-if="item1.type=='checkbox'">
            <Checkbox v-model="data[item1.name]" ></Checkbox>
        </div>

        <div v-if="item1.type=='masteriallist'">
          <div class="materiallistwrap">
            <div v-for="(item,index) in item1.options.list" class="item">
              <div>
                <div class="imgwrap" >
                  <img :src="item.photoUrl" style="width: 100px;height: 100px" alt="">
                  <div class="cost">成本:{{item.cost}}元</div>
                </div>
                <div class="tit">

                  <RadioGroup v-model="data.fabricId" @on-change="dealEvent(item1.func)" >
                    <Radio :label="item.id">{{item.name}}</Radio>
                  </RadioGroup>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="item1.type=='switch'" >
          <i-switch size="large" v-model="data[item1.name]">
            <span slot="open">{{item1.open}}</span>
            <span slot="close">{{item1.close}}</span>
          </i-switch>
        </div>

        <div v-if="item1.type=='upload'" v-show="item1.show?true:false">
          <input type="file" @change="upload($event)">
        </div>

      </FormItem>
    </div>


  </Form>
</template>

<script>
    export default {
        props:{
          form:{
            type:Object
          },
          data:{
            type:Object
          },
          mycodemsg:{
            type:String,
            default:""
          },
          city:{
            type:Array,
            default:function () {
              return [];
            }
          }

        },
        name: "",
        data() {
            return {
              inlin1e:false,
              c:"1",
              go:true
            }
        },
        components: {},
        mounted() {

        },
        methods: {
          dealEvent(func){

            this.$emit(func,{ref:this.$refs[this.form.ref],data:this.data})
          },

          upload(e){
            this.$emit('upload',{ref:this.$refs[this.form.ref],data:e})
          }
        }
    }
</script>

<style scoped lang="less">
  .materiallistwrap{
    display: flex;
    width: 1200px;
    flex-wrap:wrap;
    .item{
      margin-right: 20px;
      .imgwrap{
        position: relative;
        width: 100px;
        height: 100px;
        .cost{
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 25px;
          line-height: 25px;
          background: #fff;
          color: #000;
          z-index: 999;
          opacity: 0.7;
          text-align: center;
          font-size: 14px;
        }
      }
    }
  }
</style>
