<!-- create model -->
<template>
  <div>
    <knowledge-separator item="创建模型"></knowledge-separator>
    <div class="content-box">
      <el-upload class="avatar-uploader" action="http://172.21.213.190:8080/Knowledge/UploadPhotoServlet" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <div class="form-box">
        <el-form ref="modelForm" class="modelForm" :model="modelForm" :rules="rules" label-width="110px" label-position="right">
          <el-form-item label="模型名称" prop="name" required>
            <el-input v-model="modelForm.name"></el-input>
          </el-form-item>
          <el-form-item label="模型描述" prop="desc">
            <el-input type="textarea" v-model="modelForm.desc"></el-input>
          </el-form-item>

          <el-form-item label="模型默认状态" prop="initStatusId">
            <el-select v-model="modelForm.initStatusId" filterable placeholder="请选择状态，可搜索">
              <el-option v-for="item in modelForm.status" :key="item.id" :label="item.id" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模型状态" prop="status">
            <el-table class="statusTable" :data="modelForm.status" border style="width: 100%">
              <el-table-column prop="id" label="ID"></el-table-column>
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="desc" label="描述"></el-table-column>
              <el-table-column prop="version" label="版本"></el-table-column>
              <!-- <el-table-column prop="agencies" label="模型"></el-table-column> -->
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button @click="editStatus(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button @click="deleteStaus(scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

        </el-form>

        <div style="text-align:right">
          <!-- <el-button @click="createDialogVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="addModel('modelForm');">保 存 机 构</el-button>
        </div>

        <label>添加模型状态</label>
        <div class="addStatusBox">
          <el-form ref="statusForm" class="statusForm" :model="statusForm" :rules="statusRules">
            <el-button type="warning" @click="openEventModal()">增加事件</el-button>
            <label>任务状态都需要以事件触发，所以首先要<b style="color:red">增加事件</b></label>
            <el-form-item label="模型事件" prop="events">
              <el-table class="eventTable" :data="statusForm.events" border style="width: 100%">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="type" label="类型" :formatter="formatEventTypeByType"></el-table-column>
                <el-table-column prop="detail" label="描述"></el-table-column>
                <el-table-column prop="fromStatus" label="起始状态"></el-table-column>
                <el-table-column prop="startTime" label="起始时间"></el-table-column>
                <el-table-column prop="endTime" label="结束时间"></el-table-column>
                <!-- <el-table-column prop="agencies" label="模型"></el-table-column> -->
                <el-table-column fixed="right" label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button @click="editEvent(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteEvent(scope.row)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>

            <el-form-item label="状态ID" prop="id" required>
              <el-input v-model="statusForm.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="状态名称" prop="name" v-if="statusNameFlag">
              <el-input v-model="statusForm.name"></el-input>
            </el-form-item>
            <el-form-item label="状态描述" prop="desc" v-if="statusDescFlag">
              <el-input v-model="statusForm.desc"></el-input>
            </el-form-item>
            <el-form-item label="状态版本" prop="version">
              <el-input v-model="statusForm.version"></el-input>
            </el-form-item>

            <label v-if="statusAgencyFlag">如果所需机构不存在，可跳转<a href="/system/createAgency" target="_blank" style="text-decoration:none">创建</a>，如需更新机构选项，请点击<b @click="refreshAgenciesInfo()">刷新</b></label>
            <el-form-item label="所属机构" prop="agencies" v-if="statusAgencyFlag">
              <el-select v-model="statusForm.agencies" multiple filterable placeholder="请选择机构，可搜索">
                <el-option v-for="item in agenciesInfo" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <label v-if="statusAgencyFlag">如果所需人物不存在，可跳转<a href="/system/createCharacter" target="_blank" style="text-decoration:none">创建</a>，如需更新人物选项，请点击<b @click="refreshCharacterInfo()">刷新</b></label>
            <el-form-item label="创建人物" prop="researchers" v-if="statusAgencyFlag">
              <el-select v-model="statusForm.researchers" multiple filterable placeholder="请选择人物，可搜索">
                <el-option v-for="item in characterInfo" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态开始时间" prop="startTime">
              <el-input v-model="statusForm.startTime"></el-input>
            </el-form-item>
            <el-form-item label="状态结束时间" prop="endTime">
              <el-input v-model="statusForm.endTime"></el-input>
            </el-form-item>
          </el-form>
          <hr />
          <el-button type="primary" @click="addStatus('statusForm');">插入状态</el-button>
        </div>
      </div>
    </div>

    <el-dialog title="事件管理" width="40%" :visible.sync="eventDialogVisible" :close-on-click-modal=false>
      <el-form ref="eventFrom" class="eventFrom" :model="eventFrom" :rules="eventRules" label-width="100px" size="mini">
        <el-form-item label="事件名称" prop="name">
          <el-input v-model="eventFrom.name" placeholder="请输入事件名称"></el-input>
        </el-form-item>
        <el-form-item label="事件类型" prop="type">
          <el-select v-model="eventFrom.type" filterable placeholder="请选择事件类型，可搜索">
            <el-option v-for="item in eventType" :key="item.key" :label="item.key" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件描述" prop="detail">
          <el-input type="textarea" v-model="eventFrom.detail" placeholder="请输入事件详细描述"></el-input>
        </el-form-item>
        <el-form-item label="起始状态" prop="fromStatus">
          <el-select v-model="eventFrom.fromStatus" filterable placeholder="请选择起始状态，可搜索">
            <el-option label="Null" value="null"></el-option>
            <el-option v-for="item in getAvailableFromStatus(statusForm.id)" :key="item.id" :label="item.id" :value="item.id" v-if="item.id!=eventFrom.toStatus">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间" prop="startTime">
          <el-input v-model="eventFrom.startTime" placeholder="例：2000年"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-input v-model="eventFrom.endTime" placeholder="若没有，填写至今"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eventDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEvent('eventFrom')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SystemSeparator from "@/components/System/SystemSeparator";
export default {
  name: "create-model",
  data() {
    return {
      imageUrl: "",
      modelForm: {
        id:"",
        name: "",
        desc: "",
        image: "",
        initStatusId: "",
        status: []
      },
      statusForm: {
        id: "",
        name: "",
        version: "",
        desc: "",
        keywords: [],
        agencies: [],
        researchers: [],
        models: [],
        startTime: "",
        endTime: "",
        events: []
      },
      eventFrom: {
        id: "",
        name: "",
        type: "",
        detail: "",
        fromStatus: "",
        toStatus: "",
        startTime: "",
        endTime: ""
      },
      rules: {
        name: [
          {
            required: true,

            message: "名称不能为空",

            trigger: "blur"
          }
        ],
        desc: [
          {
            required: true,

            message: "描述不能为空",

            trigger: "blur"
          }
        ],
        initStatusId: [
          {
            required: true,

            message: "默认状态不能为空",

            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,

            message: "状态不能为空",

            trigger: "blur"
          }
        ]
      },
      statusRules: {
        id: [
          {
            required: true,

            message: "ID不能为空",

            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,

            message: "名称不能为空",

            trigger: "blur"
          }
        ],
        desc: [
          {
            required: true,

            message: "描述不能为空",

            trigger: "blur"
          }
        ],
        agencies: [
          {
            required: true,

            message: "模型不能为空",

            trigger: "blur"
          }
        ],
        events: [
          {
            required: true,

            message: "事件不能为空",

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
      eventRules: {
        id: [
          {
            required: true,

            message: "ID不能为空",

            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,

            message: "事件名称不能为空",

            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,

            message: "事件类型不能为空",

            trigger: "blur"
          }
        ],
        detail: [
          {
            required: true,

            message: "事件详细不能为空",

            trigger: "blur"
          }
        ],
        fromStatus: [
          {
            required: true,

            message: "开始状态不能为空",

            trigger: "blur"
          }
        ],
        toStatus: [
          {
            required: true,

            message: "开始状态不能为空",

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
      eventDialogVisible: false,
      eventType: [
        {
          key: "创建",
          value: "Create"
        },
        {
          key: "名称改变",
          value: "NameChange"
        },
        {
          key: "研究机构改变",
          value: "AgencyChange"
        },
        {
          key: "合并",
          value: "Merge"
        },
        {
          key: "拆分",
          value: "Split"
        },
        {
          key: "功能改进",
          value: "Improve"
        }
      ],
      agenciesInfo: [],
      characterInfo: [],
      statusNameFlag: false,
      statusDescFlag: false,
      statusAgencyFlag: false
    };
  },

  components: {
    "knowledge-separator": SystemSeparator
  },

  computed: {},

  beforeMount: function() {
    this.generateUID(this.statusForm);
    this.eventFrom.toStatus = this.statusForm.id;
    this.getAllAgenciesInfo();
    this.getAllCharacterInfo();
  },

  mounted: function() {
    const id = this.$route.params.id;
    var that = this;
    if (id) {
      console.log(id);
      this.axios
        .get("http://172.21.213.190:8080/Knowledge/GetModelByIdServlet", {
          params: {
            id: id
          }
        })
        .then(function(response) {
          console.log(response);
          if (response.status === 200) {            
            that.modelForm = response.data;
            that.modelForm.id = id
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

        this.modelForm.image = res.message;
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

    generateUID(item) {
      this.axios
        .get("http://172.21.213.190:8080/Knowledge/GenerateUIDServlet")
        .then(function(response) {
          item.id = response.data;
        });
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

    addStatus(formName) {
      var flag = this.checkForm(formName);
      if (flag) {
        var status = JSON.parse(JSON.stringify(this[formName]));
        var index = -1;
        for (var i = 0; i < this.modelForm.status.length; i++) {
          var item = this.modelForm.status[i];
          if (item.id === status.id) {
            index = i;
            break;
          }
        }
        if (index >= 0) {
          if(!this.statusAgencyFlag&&(index-1)>=0){            
            status.researchers = this.modelForm.status[index-1].researchers;
            status.agencies = this.modelForm.status[index-1].agencies;
          }
          this.modelForm.status.splice(index + 1, 0, status);
          this.modelForm.status.splice(index, 1);
          this.resetForm(formName);
        } else {
          this.modelForm.status.push(status);
          this.resetForm(formName);
        }
        this.statusNameFlag = false;
        this.statusDescFlag = false;
        this.statusAgencyFlag = false;
      }
    },
    editStatus(row) {
      this.statusForm = JSON.parse(JSON.stringify(row));
      this.eventToStautusFlag();
    },
    deleteStaus(row) {
      var index = this.modelForm.status.indexOf(row);
      if (index !== -1) {
        this.modelForm.status.splice(index, 1);
        this.statusForm = {
          id: "",
          name: "",
          desc: "",
          agencies: [
            {
              agencyId: "",
              title: "",
              startTime: "",
              endTime: ""
            }
          ],
          events: []
        };
        this.generateUID(this.statusForm);
        this.eventToStautusFlag();
      }
    },

    openEventModal() {
      if (this.modelForm.name && this.modelForm.desc) {
        this.generateUID(this.eventFrom);
        this.statusForm.name = this.modelForm.name;
        this.statusForm.desc = this.modelForm.desc;
        this.eventFrom.toStatus = this.statusForm.id;
        this.eventDialogVisible = true;
      } else {
        //提示
        this.$message({
          showClose: true,
          message: "请填写模型名称和模型描述",
          type: "error"
        });
      }
    },

    addEvent(formName) {
      var flag = this.checkForm(formName);
      if (flag) {
        var event = JSON.parse(JSON.stringify(this[formName]));
        var index = -1;
        for (var i = 0; i < this.statusForm.events.length; i++) {
          var item = this.statusForm.events[i];
          if (item.id === event.id) {
            index = i;
            break;
          }
        }
        if (index >= 0) {
          this.statusForm.events.splice(index + 1, 0, event);
          this.statusForm.events.splice(index, 1);
          this.resetForm(formName);
        } else {
          this.statusForm.events.push(event);
          this.resetForm(formName);
        }
        this.eventToStautusFlag();
        this.eventDialogVisible = false;
      }
    },
    editEvent(row) {
      // console.log(row);
      this.eventFrom = JSON.parse(JSON.stringify(row));
      this.eventDialogVisible = true;
    },
    deleteEvent(row) {
      // console.log(row);
      var index = this.statusForm.events.indexOf(row);
      if (index !== -1) {
        this.statusForm.events.splice(index, 1);
      }
    },

    eventToStautusFlag() {
      this.statusNameFlag = false;
      this.statusDescFlag = false;
      this.statusAgencyFlag = false;
      for (var event of this.statusForm.events) {
        switch (event.type) {
          case "Create":
            this.statusNameFlag = true;
            this.statusDescFlag = true;
            this.statusAgencyFlag = true;
            break;
          case "NameChange":
            this.statusNameFlag = true;
            break;
          case "AgencyChange":
            this.statusAgencyFlag = true;
            break;
          case "Merge":
            this.statusDescFlag = true;
            break;
          case "Split":
            this.statusDescFlag = true;
            break;
          case "Improve":
            this.statusDescFlag = true;
            break;
        }
      }
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

    addModel(formName) {
      var flag = this.checkForm(formName);
      var param = { jsonStr: JSON.stringify(this.modelForm) };
      if (flag) {
        var that = this;
        this.axios({
          method: "post",
          url: "http://172.21.213.190:8080/Knowledge/AddModelServlet",
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
            that.resetForm("modelForm");
          } else {
            that.$message({
              showClose: true,
              message: "模型创建失败！",
              type: "error"
            });
          }
        });
      }
    },

    addAgency() {
      this.statusForm.agencies.push({
        agencyId: "",
        title: "",
        startTime: "",
        endTime: ""
      });
    },
    removeAgency(item) {
      var index = this.statusForm.agencies.indexOf(item);
      if (index !== -1) {
        this.statusForm.agencies.splice(index, 1);
      }
    },
    getAgencyNameById: function(id) {
      for (var item of this.agenciesInfo) {
        if (item.id === id) {
          return item.name;
        }
      }
    },
    formatEventTypeByType: function(row, column) {
      for (var item of this.eventType) {
        if (item.value === row.type) {
          return item.key;
        }
      }
    },
    formatLocationNameById: function(row, column) {
      console.log(row.location);
      for (var item of this.characterInfo) {
        if (item.id === row.location) {
          return item.name;
        }
      }
    },
    getAvailableFromStatus(statusId) {
      var availableStatus = [];
      for (var i = 0; i < this.modelForm.status.length; i++) {
        var item = this.modelForm.status[i];
        if (item.id !== statusId) {
          availableStatus.push(item);
        }
      }
      return availableStatus;
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

.form-box .characterForm {
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
.el-select .el-input__inner {
  height: 40px !important;
}
.el-select__tags {
  top: 75% !important;
}
</style>
