<!--  -->
<template>
  <el-menu :default-active="active" class="knowledge-menu" mode="horizontal" 
  background-color="#101010" text-color="#fff" active-text-color="#ffd04b" id="knowledgeMenu">
    <img src="@/assets/logo.png" width="156" class="logo">
    <el-menu-item v-for="item in navbarList" :index="item.index" :key="item.index" v-if="!item.child" style="float:right" @select="handleSelect" 
    @click="$router.push(item.path)">
        {{item.name}}
    </el-menu-item>      
  </el-menu>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {
      navbarList: [
        {
          index: "1",
          name: "图谱",
          path: "/"
        },
        {
          index: "2",
          name: "管理系统",
          path: "/system"
        },
        // {
        //   index: "3",
        //   name: "登录",
        //   path: "/login"
        // }
      ],
      active: "1"
    };
  },

  components: {},

  beforeMount:function(){
      let href = window.location.href;
      if(href.indexOf("system")>=0){
          this.active = "2";
      }else if(href.indexOf("login")>=0){
          this.active = "3";
      }else{
          this.active = "1";
      }
      this.navbarList = this.navbarList.reverse();
  },

  //   computed: {},

  //   mounted: {},

  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.active = key;
    }
  }
};
</script>
<style scoped>
.knowledge-menu{
    padding: 0 15px
}
.logo {
  float: left;
  margin: 5px 15px 0 5px;
}
.knowledge-menu a {
  text-decoration: none;
}
</style>