<!--  -->
<template>
  <div class="container loginContainer">
    <div class="form-horizontal form-container">
      <div class="form-title">
        REGISTER
      </div>
      <div class="form-horizontal">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="UserName"
            prop="username"
          >
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item
            label="Email"
            prop="email"
          >
            <el-input v-model="ruleForm.email" type="email"></el-input>
          </el-form-item>
          <el-form-item
            label="Password"
            prop="password"
          >
           <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item
            label="Password Again"
            prop="repassword"
          >
            <el-input v-model="ruleForm.repassword" type="password"></el-input>
          </el-form-item>
          <el-form-item
            label="Name"
            prop="name"
          >
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item
            label="Gender"
            prop="gender"
          >
            <el-radio-group v-model="ruleForm.gender">
              <el-radio label="Male"></el-radio>
              <el-radio label="Female"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="Affiliation"
            prop="affiliation"
          >
            <el-input
              v-model="ruleForm.affiliation"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="Country"
            prop="desc"
          >
            <el-input
              v-model="ruleForm.desc"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
            >Sign Up</el-button>
            <el-button @click="resetForm('ruleForm')">Resetting</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      contetHeight: 900,
      ruleForm: {
        username: "",
        email: "",
        password: "",
        repassword: "",
        name: "",
        gender: "",
        affiliation: "",
        desc: ""
      },
      rules: {
        username: [
          { required: true, message: "please enter user name", trigger: "blur" },
          { min: 4, max: 10, message: "length between 4 - 10", trigger: "blur" }
        ],
        email: [
          { required: true, message: "please enter email", trigger: "blur" }
        ],
        password: [
          { required: true, message: "please enter password", trigger: "blur" }
        ],
        repassword: [
          { required: true, message: "please enter password", trigger: "blur" }
        ],
        name: [
          {
            required: true,
            message: "please enter name",
            trigger: "blur"
          }
        ],
        gender: [
          { required: true, message: "please select gender", trigger: "change" }
        ],
        affiliation: [{ required: true, message: "please enter affiliation", trigger: "blur" }]
      }
    };
  },

  beforeMount: function() {
    let clientH = document.body.clientHeight;
    this.contetHeight = clientH - 61;
    // this.loadingModelGraphHeight = clientH - 61;
    // let date = new Date();
  },
  components: {},

  computed: {},

  mounted: function() {
    window.onresize = function temp() {
      let clientH = document.body.clientHeight;
      let navbar = document.getElementById("knowledgeMenu");
      let navbarH = navbar.clientHeight;
      that.contetHeight = clientH - navbarH - 1;
    };
  }

  //methods: {}
};
</script>
<style>
body {
  background: #eaeef6;
}
.loginContainer {
  position: absolute;
  top: 13%;
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