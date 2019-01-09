<!-- location -->
<template>
    <div>
        <knowledge-separator item="创建场景"></knowledge-separator>
        <div class="content-box">
            <el-upload class="avatar-uploader" action="http://172.21.213.190:8080/Knowledge/UploadPhotoServlet" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="form-box">
                <el-form ref="sceneForm" class="sceneForm" :model="sceneForm" :rules="rules" label-width="110px" label-position="right">
                    <el-form-item label="场景名称" prop="name" required>
                        <el-input v-model="sceneForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="场景类型" prop="type" required>
                        <el-select v-model="sceneForm.type" filterable placeholder="请选择状态，可搜索">
                            <el-option label="应用" value="应用"></el-option>
                        </el-select>
                    </el-form-item>

                    <label style="margin-left:60px">如果所需机构不存在，可跳转<a href="/system/createAgency" target="_blank" style="text-decoration:none">创建</a>，如需更新机构选项，请点击<b @click="refreshAgenciesInfo()">刷新</b></label>
                    <el-form-item label="机构" prop="agencies" required>
                        <el-select v-model="sceneForm.agencies" multiple filterable placeholder="请选择机构，可搜索">
                            <el-option v-for="item in agenciesInfo" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <label style="margin-left:60px">如果所需研究者不存在，可跳转<a href="/system/createCharacter" target="_blank" style="text-decoration:none">创建</a>，如需更新研究者选项，请点击<b @click="refreshCharacterInfo()">刷新</b></label>
                    <el-form-item label="研究者" prop="researchers">
                        <el-select v-model="sceneForm.researchers" multiple placeholder="请选择人物，可搜索">
                            <el-option v-for="item in characterInfo" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <label style="margin-left:60px">如果所需模型不存在，可跳转<a href="/system/createModel" target="_blank" style="text-decoration:none">创建</a>，如需更新模型选项，请点击<b @click="refreshCharacterInfo()">刷新</b></label>
                    <el-form-item label="模型" prop="models" required>
                        <el-select v-model="sceneForm.models" multiple placeholder="请选择模型，可搜索">
                            <el-option v-for="item in modelInfo" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <label style="margin-left:60px">如果所需位置不存在，可跳转<a href="/system/createLocation" target="_blank" style="text-decoration:none">创建</a>，如需更新位置选项，请点击<b @click="refreshLocationInfo()">刷新</b></label>
                    <el-form-item label="位置" prop="location" required>
                        <el-select v-model="sceneForm.location" filterable placeholder="请选择位置，可搜索">
                            <el-option v-for="item in locationInfo" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startTime" required>
                        <el-input v-model="sceneForm.startTime"></el-input>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime" required>
                        <el-input v-model="sceneForm.endTime"></el-input>
                    </el-form-item>
                </el-form>

                <div style="text-align:right">
                    <!-- <el-button @click="createDialogVisible = false">取 消</el-button> -->
                    <el-button type="primary" @click="addScene('sceneForm');">保 存 地 点</el-button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import SystemSeparator from "@/components/System/SystemSeparator";
export default {
  name: "create-scene",
  data() {
    return {
      imageUrl: "",
      sceneForm: {
        name: "",
        type: "",
        agencies: [],
        researchers: [],
        models: [],
        location: "",
        startTime: "",
        endTime: "",
        image: ""
      },
      rules: {
        name: [
          {
            required: true,

            message: "名称不能为空",

            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,

            message: "类型不能为空",

            trigger: "blur"
          }
        ],
        agencies: [
          {
            required: true,

            message: "机构不能为空",

            trigger: "blur"
          }
        ],
        models: [
          {
            required: true,

            message: "模型不能为空",

            trigger: "blur"
          }
        ],
        location: [
          {
            required: true,

            message: "位置不能为空",

            trigger: "blur"
          }
        ],
        startTime: [
          {
            required: true,

            message: "开始时间不能为空",

            trigger: "blur"
          },
          { min: 4, message: "长度不能低于4个字符", trigger: "blur" }
        ],
        endTime: [
          {
            required: true,

            message: "结束时间不能为空",

            trigger: "blur"
          }
        ]
      },
      agenciesInfo: [],
      characterInfo: [],
      locationInfo: [],
      modelInfo: []
    };
  },

  components: {
    "knowledge-separator": SystemSeparator
  },

  computed: {},

  beforeMount:function(){
      this.getAllAgenciesInfo();
      this.getAllLocationInfo();
      this.getAllCharacterInfo();
      this.getAllModelInfo();
  },

mounted: function() {
    const id = this.$route.params.id;
    var that = this;
    if (id) {
      console.log(id);
      this.axios
        .get("http://172.21.213.190:8080/Knowledge/GetSceneByIdServlet", {
          params: {
            id: id
          }
        })
        .then(function(response) {
          console.log(response);
          if (response.status === 200) {
            that.sceneForm = response.data;
            that.imageUrl = response.data.image;
          } else {
            that.$message.error("找不到条目");
          }
        });
    }
  },

  methods: {
    handleAvatarSuccess(res, file) {
      if (res.status === "suc") {
        this.imageUrl = URL.createObjectURL(file.raw);

        this.sceneForm.image = res.message;
      } else {
        this.$message.error(res.message);
      }
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }

      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      return isJPG && isLt2M;
    },

    checkForm(formName) {
      var flag = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          flag = true;
        }
      });
      return flag;
    },

    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
        this[formName].id = this.generateUID(this[formName]);
      }
    },

    addLocation(formName) {
      var flag = this.checkForm(formName);
      var param = { jsonStr: JSON.stringify(this.sceneForm) };
      if (flag) {
        var that = this;
        this.axios({
          method: "post",
          url: "http://172.21.213.190:8080/Knowledge/AddLocationServlet",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: this.qs.stringify(param)
        }).then(function(response) {
          if (response.status === 200) {
            that.$message({
              showClose: true,
              message: "场景创建成功！",
              type: "success"
            });
            that.resetForm("agencyForm");
          } else {
            that.$message({
              showClose: true,
              message: "场景创建失败！",
              type: "error"
            });
          }
        });
      }
    },

    refreshAgenciesInfo() {
      this.getAllAgenciesInfo();
    },

    getAllAgenciesInfo() {
      var that = this;
      this.axios
        .get("http://172.21.213.190:8080/Knowledge/GetAllAgencyServlet")
        .then(function(response) {
          that.agenciesInfo = response.data.agency;
        });
    },

    refreshLocationInfo() {
      this.getAllLocationInfo();
    },

    getAllLocationInfo() {
      var that = this;
      this.axios
        .get("http://172.21.213.190:8080/Knowledge/GetAllLocationServlet")
        .then(function(response) {
          that.locationInfo = response.data.location;
        });
    },

    refreshCharacterInfo() {
      this.getAllCharacterInfo();
    },

    getAllCharacterInfo() {
      var that = this;
      this.axios
        .get("http://172.21.213.190:8080/Knowledge/GetAllResearcherServlet")
        .then(function(response) {
          that.characterInfo = response.data.researcher;
        });
    },
    
    refreshModelInfo() {
      this.getAllModelInfo();
    },

    getAllModelInfo() {
      var that = this;
      this.axios
        .get("http://172.21.213.190:8080/Knowledge/GetAllModelServlet")
        .then(function(response) {
          that.modelInfo = response.data.model;
        });
    },

    addScene(formName) {
      var flag = this.checkForm(formName);
      var param = { jsonStr: JSON.stringify(this.sceneForm) };
      if (flag) {
        var that = this;
        this.axios({
          method: "post",
          url: "http://172.21.213.190:8080/Knowledge/AddSceneServlet",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: this.qs.stringify(param)
        }).then(function(response) {
          if (response.status === 200) {
            that.$message({
              showClose: true,
              message: "模型创建成功！",
              type: "success"
            });
            that.resetForm("sceneForm");
          } else {
            that.$message({
              showClose: true,
              message: "模型创建失败！",
              type: "error"
            });
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.content-box {
  display: flex;
  padding: 15px;
  text-align: left;
}

.avatar-uploader-icon {
  font-size: 28px;

  color: #8c939d;

  width: 178px;

  height: 178px;

  line-height: 178px;

  text-align: center;
}

.avatar {
  width: 178px;

  height: 178px;

  display: block;
}

.form-box {
  flex: 1;

  padding: 0 15px;
}

.form-box .sceneForm {
  text-align: left;
}

.el-select {
  display: block;
}

.statusTable,
.eventTable {
  line-height: 0 !important;
}

.addStatusBox {
  border: 1px solid #cccccc;
  padding: 10px;
  margin: 10px 0px;
}

.sub-form-item {
  display: flex;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #cccccc;

  border-radius: 6px;

  cursor: pointer;

  position: relative;

  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.sub-form-item > div {
  margin: 0 !important;
}

.status-table-expand {
  font-size: 0;
}
.status-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.status-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
