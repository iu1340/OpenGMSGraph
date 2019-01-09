<!--  -->
<template>
  <el-pagination
    class="know-pagination"
    background
    layout="prev, pager, next"
    :total="total"
    @current-change="handleCurrentChange">
    </el-pagination>
</template>

<script>
export default {
  name: "system-pagination",
  props: ["total"],
  data() {
    return {};
  },

  components: {},

  //   computed: {},

  //   mounted: {},

  methods: {
    handleCurrentChange: function(val) {
      this.$emit("changPage", val);
    }
  }
};
</script>
<style scoped>
/* .know-pagination {
  padding-bottom: 25px;
} */
</style>
<style>
.know-pagination button,
.know-pagination li {
  height: 32px !important;
  line-height: 32px;
}
</style>
