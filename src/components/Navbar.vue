<!--  -->
<template>
  <el-menu
    :default-active="active"
    class="knowledge-menu"
    mode="horizontal"
    background-color="#101010"
    text-color="#fff"
    active-text-color="#ffd04b"
    id="knowledgeMenu"
  >
    <img
      src="@/assets/logo.png"
      width="156"
      class="logo"
      @click="toHome"
    >
    <el-menu-item
      v-for="item in navbarList"
      :index="item.index"
      :key="item.index"
      v-if="flag"
      style="float:right"
      @select="handleSelect"
      @click="handleClick(item)"
    >
      {{item.name}}
    </el-menu-item>
    <el-menu-item
      v-for="item in navbarList2"
      :index="item.index"
      :key="item.index"
      v-if="!flag"
      style="float:right"
      @select="handleSelect"
      @click="handleClick(item)"
    >
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
          name: "Graph",
          path: "/"
        },
        {
          index: "2",
          name: "System",
          path: "/system"
        },
        {
          index: "3",
          name: "Login",
          path: "/login"
        }
      ],
      navbarList2: [
        {
          index: "3",
          name: "Login",
          path: "/login"
        },
        {
          index: "4",
          name: "Register",
          path: "/register"
        }
      ],
      active: "1",
      flag: true
    };
  },

  components: {},

  beforeMount: function() {
    let href = window.location.href;
    this.flag = true;
    if (href.indexOf("system") >= 0) {
      this.active = "2";
    } else if (href.indexOf("login") >= 0) {
      this.flag = false;
      this.active = "3";
    } else {
      this.active = "1";
    }
    this.navbarList = this.navbarList.reverse();
    this.navbarList2 = this.navbarList2.reverse();
  },

  //   computed: {},

  //   mounted: {},

  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.active = key;
    },
    handleClick(item) {
      if(item.name==="Login"){
        this.flag = false;
      }
      this.$router.push(item.path);
    },
    toHome(){
      this.flag=true;
      window.location.href="/"
    }
  }
};
</script>
<style scoped>
.knowledge-menu {
  padding: 0 15px;
}
.logo {
  float: left;
  margin: 5px 15px 0 5px;
}
.knowledge-menu a {
  text-decoration: none;
}
</style>