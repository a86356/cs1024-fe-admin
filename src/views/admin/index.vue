<template>
  <div >
    <Layout style="height:100%">
      <div >
        <HeaderNav></HeaderNav>
        <div style="clear:both;height:60px"></div>
        <Layout>
          <Sider hide-trigger  style="position:fixed;height:100%">
            <LeftNav style="height:100%;overflow:auto" :title="title" :menus="menus" :idx="idx" :started="started" ></LeftNav>
          </Sider>
          <Content style="padding:24px;padding-left:240px;width:100%">
            <router-view/>
          </Content>
        </Layout>
        <Footer></Footer>
      </div>
    </Layout>
  </div>
</template>

<script>
  import HeaderNav from '@/components/HeaderNav'
  import LeftNav from '@/components/LeftNav'
  export default {
    name: "",
    data() {
      return {
        idx:'',
        started:'',
        menus:[],
        title:''
      }
    },
    components: {
      LeftNav,
      HeaderNav
    },
    mounted() {


    },
    methods: {}
  }
</script>

<style scoped lang="less">

</style>
