<!-- SystemSeparator -->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="knowledge-separator">
            <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
            <el-breadcrumb-item>HomePage</el-breadcrumb-item>
            <el-breadcrumb-item>{{item}}</el-breadcrumb-item>
        </el-breadcrumb>        
    </div>
</template>

<script>
export default {
  props: ["item"],
  name: "system-separator",
  data() {
    return {
      searchText: ""
    };
  },

  components: {},

  //   computed: {},

  //   mounted: {},

  // methods: {
    
  // }
};
</script>
<style scoped>
.knowledge-separator {
  padding: 11px 15px;
  background: #fefefe;
  border-bottom: 1px solid #e8e8e8;
}
</style>