<!--  -->
<template>
  <transition name="el-fade-in">
      <div class="page-component-up" @click="scrollToTop" v-show="toTopShow">
          <i class="el-icon-caret-top"></i>
      </div>
  </transition>
</template>

<script>
export default {
 name:'asd',
  data () {
    return {
        toTopShow:false,
        scrollTop:0
    };
  },

  components: {},

  computed: {},

  mounted() {
      this.$nextTick(function(){
          let targetScroll = document.getElementsByClassName("scenePanel")[0];
          targetScroll.addEventListener("scroll",this.handleScroll);
      })
  },

  methods: {
      handleScroll(){
          this.scrollTop = document.getElementsByClassName("scenePanel")[0].scrollTop;
          if(this.scrollTop>300){
              this.toTopShow = true;
          }else{
              this.toTopShow = false;
          }
      },
      scrollToTop(){
        //   let timer = null,that = this;
        //   cancelAnimationFrame(timer);
        //   timer = requestAnimationFrame(function fn(){
        //       if(that.scrollTop>0){
        //           let height = document.getElementsByClassName("scenePanel")[0].scrollHeight;
        //           console.log(height)
        //           that.scrollTop -= 100;
        //           if(that.scrollTop<0){
        //               that.scrollTop= 0;
        //           }
        //           document.getElementsByClassName("scenePanel")[0].scrollTop = that.scrollTop;
        //           timer = requestAnimationFrame(fn);
        //       }else{
        //           cancelAnimationFrame(timer);
        //           that.toTopShow = false;
        //       }
        //   })
        document.getElementsByClassName("scenePanel")[0].scrollTop = 0;
      }
  }
}

</script>
<style scoped>
    .page-component-up{
        background: #409eff;
        position: fixed;
        right: 50px;
        bottom: 100px;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        cursor: pointer;
        transition: 0.3s;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
        z-index: 100
    }
    .page-component-up .el-icon-caret-top{
        color: #fff;
        display: block;
        line-height: 40px;
        text-align: center;
        font-size: 18px;
    }
    .page-component-up:hover{
        opacity: 0.8;
    }
</style>