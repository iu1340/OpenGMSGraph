<!-- location -->
<template>
  <div>
    <knowledge-separator item="创建地点"></knowledge-separator>
    <div class="content-box">
      <el-upload class="avatar-uploader" action="http://172.21.213.190:8080/Knowledge/UploadPhotoServlet" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div class="form-box">
        <el-form ref="locationForm" class="locationForm" :model="locationForm" :rules="rules" label-width="110px" label-position="right">
          <el-form-item label="地点名称" prop="name" required>
            <el-input v-model="locationForm.name"></el-input>
          </el-form-item>
          <el-form-item label="地点类型" prop="type" required>
            <el-select v-model="locationForm.type" filterable placeholder="请选择状态，可搜索">
              <el-option label="文本" value="Text"></el-option>
              <el-option label="坐标" value="Geometry"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地点值" prop="value" required>
            <el-input v-model="locationForm.value"></el-input>
          </el-form-item>
        </el-form>

        <div style="text-align:right">
          <!-- <el-button @click="createDialogVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="addLocation('locationForm');">保 存 地 点</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import SystemSeparator from "@/components/System/SystemSeparator";
export default {
  name: "create-location",
  data() {
    return {
      imageUrl: "",
      locationForm: {
        name: "",
        type: "",
        value: "",
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
        value: [
          {
            required: true,

            message: "值不能为空",

            trigger: "blur"
          }
        ]
      }
    };
  },

  components: {
    "knowledge-separator": SystemSeparator
  },

  computed: {},

  mounted: function() {
    const id = this.$route.params.id;
    var that = this;
    if (id) {
      console.log(id);
      this.axios
        .get("http://172.21.213.190:8080/Knowledge/GetLocationByIdServlet", {
          params: {
            id: id
          }
        })
        .then(function(response) {
          console.log(response);
          if (response.status === 200) {
            that.locationForm = response.data;
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

        this.locationForm.image = res.message;
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
      var param = { jsonStr: JSON.stringify(this.locationForm) };
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
              message: "地点创建成功！",
              type: "success"
            });
            that.resetForm("locationForm");
          } else {
            that.$message({
              showClose: true,
              message: "地点创建失败！",
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

.form-box .locationForm {
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
