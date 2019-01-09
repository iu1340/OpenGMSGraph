<!--  -->
<template>
<el-menu :default-active="active" class="knowledge-sub-menu" background-color="#f9fafc">
    <p class="header">菜单栏</p>
     <el-menu-item v-for="item in subMenuList" :index="item.index" :key="item.path" v-if="!item.child"
    @click="$router.push(item.path)">
       <i :class="item.icon"></i> {{item.name}}
    </el-menu-item>   
    </el-menu>
</template>

<script>

export default {
  name: "subMenu",
  data() {
    return {
      subMenuList: [
        {
          index: "1",
          name: "人物",
          path: "/system",
          icon: "fa fa-user fa-fw"
        },{
          index: "2",
          name: "机构",
          path: "/system/agency",
          icon: "fa fa-user fa-fw"
        },
        {
          index: "3",
          name: "模型",
          path: "/system/model",
          icon: "fa fa-cube fa-fw"
        },
        {
          index: "4",
          name: "地点",
          path: "/system/location",
          icon: "fa fa-map-marker fa-fw"
        },
        {
          index: "5",
          name: "场景",
          path: "/system/scene",
          icon: "fa fa-picture-o fa-fw"
        },
        // {
        //   index: "6",
        //   name: "方法",
        //   path: "/system/function",
        //   icon: "fa fa-meanpath fa-fw"
        // }
      ],
      active: "1"
    };
  },

  components: {},

  beforeMount: function() {
    let href = window.location.href;
    if (href.indexOf("agency") >= 0||href.indexOf("Agency") >= 0) {
      this.active = "2";
    } else if (href.indexOf("model") >= 0||href.indexOf("Model") >= 0) {
      this.active = "3";
    }else if (href.indexOf("location") >= 0||href.indexOf("Location") >= 0) {
      this.active = "4";
    } else if (href.indexOf("scene") >= 0||href.indexOf("Scene") >= 0) {
      this.active = "5";
    } else if (href.indexOf("function") >= 0) {
      this.active = "6";
    } else {
      this.active = "1";
    }
  }
};
</script>
<style scoped>
.knowledge-sub-menu {
  height: 100%;
}

.knowledge-sub-menu i {
  color: #333;
}

.knowledge-sub-menu li.is-active {
  color: #000 !important;
  background: #f4f4f5 !important;
  font-weight: 600;
}

.knowledge-sub-menu li:hover {
  background: #f4f4f5 !important;
}

.knowledge-sub-menu>p.header {
    color: #848484;
    padding: 10px 25px 10px 15px;
    font-size: 12px;
    margin: 0;
}
</style>