<!--  -->
<template>
  <div>
    <knowledge-separator item="Character"></knowledge-separator>
    <div class="tool-panel">
      <el-button type="success" @click="$router.push('/system/createCharacter')">Create</el-button>
      <el-input placeholder="Please enter search text" prefix-icon="el-icon-search" v-model="searchText" @keyup.enter.native="searchEnterFun">
      </el-input>
    </div>
    <div class="card-box-content">
      <el-card v-for="(item, index) in cards" :key="index" class="box-card">
        <div slot="header" class="clearfix">
          <span style="float:left">{{item.name}}</span>
          <!-- <el-button-group style="float: right;">
            <el-button class="card-button" type="warning" icon="el-icon-edit"></el-button>
            <el-button class="card-button" type="danger" icon="el-icon-delete"></el-button>            
          </el-button-group> -->
          <div style="float: right;">
            <el-button class="card-button" type="warning" icon="el-icon-edit"  @click="$router.push('/system/editCharacter/'+item.id)"></el-button>
            <el-popover placement="top" width="160" v-model="item.deleteVisible">
              <p>Are you sure you want to delete the Character entry?</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="item.deleteVisible = false">Cancel</el-button>
                <el-button type="primary" size="mini" @click="item.deleteVisible = false;deleteCard(item.id)">Ok</el-button>
              </div>
              <el-button class="card-button" type="danger" icon="el-icon-delete" slot="reference"></el-button>
            </el-popover>
          </div>

        </div>
        <div>
          {{item.desc}}
        </div>
      </el-card>
    </div>
    <knowledge-pagination :total="total" v-on:changPage="changePage" style="padding-bottom:25px"></knowledge-pagination>
  </div>
</template>

<script>
import SystemSeparator from "@/components/System/SystemSeparator";
import SystemPagination from "@/components/System/SystemPagination";
export default {
  name: "character",
  data() {
    return {
      searchText: "",
      cards: [],
      total: 0
    };
  },

  components: {
    "knowledge-separator": SystemSeparator,
    "knowledge-pagination": SystemPagination
  },

  //   computed: {},

  beforeMount: function() {
    this.getCards(1);
  },

  methods: {
    getSearchText: function(searchText) {
      this.searchText = searchText;
    },
    getCards: function(page) {
      var that = this;
      this.axios
        .get(
          "http://172.21.213.33:8080//Knowledge/GetResearchersByPageServlet",
          {
            params: {
              page: page
            }
          }
        )
        .then(function(response) {
          that.cards = response.data.result;
          that.total = response.data.count;
        });
    },
    changePage: function(page) {
      this.getCards(page);
    },
    deleteCard: function(itemId) {
      var that = this;
      this.axios
        .get("http://172.21.213.33:8080//Knowledge/DeleteResearcherServlet", {
          params: {
            id: itemId
          }
        })
        .then(function(response) {
          if (response.status === 200) {
            that.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        });
    },
    searchEnterFun: function(e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        // console.log(this.searchText);
        var that = this;
        this.axios
          .get(
            "http://172.21.213.33:8080//Knowledge/SearchResearcherServlet",
            {
              params: {
                text:this.searchText,
                page: 1
              }
            }
          )
          .then(function(response) {
            that.cards = response.data.result;
            that.total = response.data.count;
          });
      }
    }
  }
};
</script>
<style scoped>
.card-box-content {
  padding: 11px 15px;
  text-align: left;
}
.box-card {
  margin-bottom: 10px;
}
.clearfix {
  overflow: hidden;
  line-height: 32px;
}

.card-button {
  padding: 8px 20px;
}
.tool-panel {
  padding: 7px 15px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
}
.tool-panel .el-input {
  width: 50%;
}
</style>