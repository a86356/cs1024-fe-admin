<template>
    <div>
      <router-view v-if="isRouterAlive"/>
    </div>
</template>

<script>

    export default {
        name: "h",
        provide(){
          return {
            reload:this.reload
          }
        },
        data() {
            return {
              isRouterAlive:true
            }
        },
        components: {},
        mounted() {
        },
        methods: {
          reload(){
            this.isRouterAlive=false;
            this.$nextTick(()=>{
              this.isRouterAlive=true;
            })
          }
        }
    }
</script>

<style scoped lang="less">

</style>
