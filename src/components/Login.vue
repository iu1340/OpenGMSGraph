<!--  -->
<template>
  <div class="container loginContainer">
    <div class="form-horizontal form-container">
      <div class="form-title">
        LOGIN
      </div>
      <div class="form-horizontal">
        <el-form
          label-position="left"
          label-width="80px"
          :model="formLabelAlign"
        >
          <el-form-item label="UserName">
            <el-input v-model="formLabelAlign.username"></el-input>
          </el-form-item>
          <el-form-item label="Password">
            <el-input
              v-model="formLabelAlign.password"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary" style="width:100%"
            >Submit</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      contetHeight: 900,
      formLabelAlign: {
        username: "",
        password: ""
      }
    };
  },

  components: {},

  beforeMount: function() {
    let clientH = document.body.clientHeight;
    this.contetHeight = clientH - 61;
    // this.loadingModelGraphHeight = clientH - 61;
    // let date = new Date();
  },

  //   computed: {},

  mounted: function() {
    window.onresize = function temp() {
      let clientH = document.body.clientHeight;
      let navbar = document.getElementById("knowledgeMenu");
      let navbarH = navbar.clientHeight;
      that.contetHeight = clientH - navbarH - 1;
    };
  }

  //   methods: {}
};
</script>
<style>
body{
    background: #eaeef6
}
.loginContainer {
  position: absolute;
  top: calc(50% - 135px);
  left: calc(50% - 270px);
  width: 540px !important;
}
.form-horizontal {
  background: #00c1de;
  border-radius: 5px;
}

.form-horizontal .form-title {
  color: #fff;
  text-align: center;
  font-size: 22px;
  height: 50px;
  vertical-align: middle;
  line-height: 50px;
}
.form-horizontal .form-horizontal {
  padding: 10px 55px;
  background: #ffffff;
  border-radius: 0px;
}

.form-horizontal .form-group label {
  padding-left: 0px;
  color: #666666;
}
#btnSubmit {
  background: #00c1de;
  opacity: 0.8;
  color: #ffffff;
}

.form-horizontal .checkbox {
  margin-left: -15px;
}

label {
  font-size: 12px;
  cursor: pointer;
}
label i {
  font-size: 12px;
  font-style: normal;
  display: inline-block;
  width: 12px;
  height: 12px;
  text-align: center;
  line-height: 12px;
  color: #fff;
  vertical-align: middle;
  margin: -2px 2px 1px 0px;
  border: #00c1de 1px solid;
}
input[type="checkbox"],
input[type="radio"] {
  display: none;
}
input[type="radio"] + i {
  border-radius: 7px;
}
input[type="checkbox"]:checked + i,
input[type="radio"]:checked + i {
  background: #00c1de;
}
input[type="checkbox"]:disabled + i,
input[type="radio"]:disabled + i {
  border-color: #ccc;
}
input[type="checkbox"]:checked:disabled + i,
input[type="radio"]:checked:disabled + i {
  background: #ccc;
}
</style>