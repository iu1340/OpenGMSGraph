<!--  -->
<template>
    <div class="content-box" :style="{ minHeight: contetHeight + 'px' }">
        <div class="menu">
            <sub-menu></sub-menu>
        </div>
        <div class="content">
            <router-view/>
        </div>
    </div>  
</template>

<script>
import subMenu from "@/components/System/SubMenu";
export default {
  name: "system",
  data() {
    return {
      contetHeight: 0
    };
  },

  components: {
    "sub-menu": subMenu
  },

  computed: {},

  mounted: function() {
    let clientH = document.body.clientHeight;
    let navbar = document.getElementById("knowledgeMenu");
    let navbarH = navbar.clientHeight;
    this.contetHeight = clientH - navbarH - 2;
    const that = this;
    window.onresize = function temp() {
      let clientH = document.body.clientHeight;
      let navbar = document.getElementById("knowledgeMenu");
      let navbarH = navbar.clientHeight;
      that.contetHeight = clientH - navbarH - 2;
    };
  }

  //   methods: {}
};
</script>
<style scoped>
.content-box {
  display: flex;
  align-items: stretch;
  height: 100%;
}
.content-box .menu {
  width: 260px;
  z-index: 810;
}
.content{
  align-self:flex-start;
  flex: 1
}
</style>