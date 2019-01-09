<!--  -->
<template>
  <div>
    <knowledge-separator item="创建人物"></knowledge-separator>
    <div class="content-box">
      <el-upload class="avatar-uploader" action="http://172.21.213.190:8080/Knowledge/UploadPhotoServlet" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <div class="form-box">
        <el-form ref="characterForm" class="characterForm" :model="characterForm" :rules="rules" label-width="110px" label-position="right">
          <el-form-item label="人物名称" prop="name" required>
            <el-input v-model="characterForm.name"></el-input>
          </el-form-item>
          <el-form-item label="人物描述" prop="desc">
            <el-input type="textarea" v-model="characterForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="人物默认状态" prop="initStatusId">
            <el-select v-model="characterForm.initStatusId" filterable placeholder="请选择状态，可搜索">
              <el-option v-for="item in characterForm.status" :key="item.id" :label="item.id" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人物状态" prop="status">
            <el-table class="statusTable" :data="characterForm.status" border style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="status-table-expand" v-for="(item, index) in props.row.agencies" :key="index">
                    <el-form-item label="机构ID">
                      <span>{{ getAgencyNameById(item.agencyId) }}</span>
                    </el-form-item>
                    <el-form-item label="职称">
                      <span>{{ item.title }}</span>
                    </el-form-item>
                    <el-form-item label="开始时间">
                      <span>{{ item.startTime }}</span>
                    </el-form-item>
                    <el-form-item label="结束时间">
                      <span>{{ item.endTime }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="ID"></el-table-column>
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="desc" label="描述"></el-table-column>
              <!-- <el-table-column prop="agencies" label="机构"></el-table-column> -->
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
          <el-button type="primary" @click="addCharacter('characterForm');">保 存 人 物</el-button>
        </div>

        <label>添加人物状态</label>
        <div class="addStatusBox">
          <el-form ref="statusForm" class="statusForm" :model="statusForm" :rules="statusRules">
            <el-button type="warning" @click="openEventModal()">增加事件</el-button>
            <label>任务状态都需要以事件触发，所以首先要<b style="color:red">增加事件</b></label>
            <el-form-item label="人物事件" prop="events">
              <el-table class="eventTable" :data="statusForm.events" border style="width: 100%">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="type" label="类型" :formatter="formatEventTypeByType"></el-table-column>
                <el-table-column prop="detail" label="描述"></el-table-column>
                <el-table-column prop="fromStatus" label="起始状态"></el-table-column>
                <el-table-column prop="startTime" label="起始时间"></el-table-column>
                <el-table-column prop="endTime" label="结束时间"></el-table-column>
                <!-- <el-table-column prop="agencies" label="机构"></el-table-column> -->
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
            <template v-if="statusAgenciesFlag">
              <el-button type="warning" @click="addAgency()">增加机构</el-button>
              <label>如果所需机构不存在，可跳转<a href="/system/createAgency" target="_blank" style="text-decoration:none">创建</a>，如需更新机构选项，请点击<b @click="refreshAgenciesInfo()">刷新</b></label>
              <el-form-item v-for="(item, index) in statusForm.agencies" :label="'所在机构'+index" :key="index">
                <template>
                  <div style="clear:both"></div>
                  <div style="display:flex;justify-content: space-between;">
                    <el-form-item class="sub-form-item" label="机构" label-width="60px" :prop="'agencies.' + index + '.agencyId'" :rules="{
      required: true, message: '机构不能为空', trigger: 'blur'
    }">
                      <el-select v-model="item.agencyId" filterable placeholder="请选择机构，可搜索">
                        <el-option v-for="item in agenciesInfo" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="sub-form-item" label="职称" label-width="60px" :prop="'agencies.' + index + '.title'" :rules="{
      required: true, message: '职称不能为空', trigger: 'blur'
    }">
                      <el-input v-model="item.title" placeholder="请输入职称"></el-input>
                    </el-form-item>
                    <el-form-item class="sub-form-item" label="开始时间" label-width="90px" :prop="'agencies.' + index + '.startTime'" :rules="[{
      required: true, message: '开始时间不能为空', trigger: 'blur'
    },
    { min: 4, message: '长度不能低于4个字符', trigger: 'blur' }]">
                      <el-input v-model="item.startTime" placeholder="例：2000年"></el-input>
                    </el-form-item>
                    <el-form-item class="sub-form-item" label="结束时间" label-width="90px" :prop="'agencies.' + index + '.endTime'" :rules="{
      required: true, message: '结束时间不能为空', trigger: 'blur'
    }">
                      <el-input v-model="item.endTime" placeholder="若没有，填写至今"></el-input>
                    </el-form-item>
                    <el-button @click.prevent="removeAgency(item)"><i class="el-icon-delete"></i></el-button>
                  </div>
                </template>
              </el-form-item>
            </template>

          </el-form>
          <hr />
          <el-button type="primary" @click="addStatus('statusForm');">插入状态</el-button>
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
    <!--content-box-->
  </div>
</template>

<script>
import SystemSeparator from "@/components/System/SystemSeparator";

export default {
  name: "create-character",

  data() {
    return {
      imageUrl: "",
      characterForm: {
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
        events: [
          {
            required: true,

            message: "事件不能为空",

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
          key: "开始工作",
          value: "Create"
        },
        {
          key: "名称改变",
          value: "NameChange"
        },
        {
          key: "机构改变",
          value: "AgencyChange"
        },
        {
          key: "职称改变",
          value: "TitleChange"
        },
        {
          key: "研究方向改变",
          value: "ResearchChange"
        }
      ],
      agenciesInfo: [],
      statusNameFlag: false,
      statusDescFlag: false,
      statusAgenciesFlag: false
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
  },

  mounted: function() {
    const id = this.$route.params.id;
    var that = this;
    if (id) {
      console.log(id);
      this.axios
        .get("http://172.21.213.190:8080/Knowledge/GetResearcherByIdServlet", {
          params: {
            id: id
          }
        })
        .then(function(response) {
          console.log(response);
          if (response.status === 200) {
            that.characterForm = response.data;
            that.characterForm.id = id;
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

        this.characterForm.image = res.message;
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

    addStatus(formName) {
      var flag = this.checkForm(formName);
      if (flag) {
        var status = JSON.parse(JSON.stringify(this[formName]));
        var index = -1;
        for (var i = 0; i < this.characterForm.status.length; i++) {
          var item = this.characterForm.status[i];
          if (item.id === status.id) {
            index = i;
            break;
          }
        }
        if (index >= 0) {
          this.characterForm.status.splice(index + 1, 0, status);
          this.characterForm.status.splice(index, 1);
          this.resetForm(formName);
        } else {
          this.characterForm.status.push(status);
          this.resetForm(formName);
        }
        this.statusNameFlag = false;
        this.statusDescFlag = false;
        this.statusAgenciesFlag = false;
      }
    },
    editStatus(row) {
      this.statusForm = JSON.parse(JSON.stringify(row));
      this.eventToStautusFlag();
    },
    deleteStaus(row) {
      var index = this.characterForm.status.indexOf(row);
      if (index !== -1) {
        this.characterForm.status.splice(index, 1);
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
      if (this.characterForm.name && this.characterForm.desc) {
        this.generateUID(this.eventFrom);
        this.statusForm.name = this.characterForm.name;
        this.statusForm.desc = this.characterForm.desc;
        this.eventFrom.toStatus = this.statusForm.id;
        this.eventDialogVisible = true;
      } else {
        //提示
        this.$message({
          showClose: true,
          message: "请填写人物名称和人物描述",
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
      this.statusAgenciesFlag = false;
      for (var event of this.statusForm.events) {
        switch (event.type) {
          case "Create":
            this.statusAgenciesFlag = true;
            break;
          case "NameChange":
            this.statusNameFlag = true;
            break;
          case "AgencyChange":
            this.statusAgenciesFlag = true;
            break;
          case "TitleChange":
            this.statusAgenciesFlag = true;
            break;
          case "ResearchChange":
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

    addCharacter(formName) {
      var flag = this.checkForm(formName);
      var param = { jsonStr: JSON.stringify(this.characterForm) };
      if (flag) {
        var that = this;
        this.axios({
          method: "post",
          url: "http://172.21.213.190:8080/Knowledge/AddResearcherServlet",
          data: this.qs.stringify(param),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          }
        }).then(function(response) {
          if (response.status === 200) {
            that.$message({
              showClose: true,
              message: "恭喜你，这是一条成功消息",
              type: "success"
            });
            that.resetForm("characterForm");
          } else {
            that.$message({
              showClose: true,
              message: "人物创建失败！",
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
    getAvailableFromStatus(statusId) {
      var availableStatus = [];
      for (var i = 0; i < this.characterForm.status.length; i++) {
        var item = this.characterForm.status[i];
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
</style>
