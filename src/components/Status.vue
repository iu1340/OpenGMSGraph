<!--  -->
<template>
  <div>
    <el-container
      style="border: 1px solid #eee"
      :style="{ height: contetHeight + 'px' }"
    >
      <el-aside
        width="300px"
        style="background-color: rgb(238, 241, 246);"
        class="scrollbar"
      >
        <div class="info">
          <div>
            <i
              id="infoLogo"
              :class="basicInfo.class"
              :style="{color:basicInfo.color}"
            ></i>
          </div>
          <div>
            <h4 class="title">{{basicInfo.title}}</h4>
            <p class="subtype">CATEGORY:{{basicInfo.category}}</p>
          </div>
          <div>
            <el-tag
              size="mini"
              v-for="keyword in basicInfo.keywords"
              :key="keyword"
              style="margin:0 5px;cursor:pointer"
            >{{keyword}}</el-tag>
          </div>
          <div>
            <div class="desc scrollbar">{{basicInfo.desc}}</div>
          </div>
        </div>
        <div>
          <el-menu
            default-active="1"
            class="el-menu-vertical"
          >
            <el-menu-item
              index="1"
              class="el-menu-item"
              @click="handleMenuClick('status')"
            >
              <i class="fa fa-table fa-fw"></i>
              <span slot="title">Status</span>
            </el-menu-item>
            <el-menu-item
              index="2"
              class="el-menu-item"
              @click="handleMenuClick('used')"
            >
              <i class="fa fa-history fa-fw"></i>
              <span slot="title">History</span>
            </el-menu-item>
            <el-menu-item
              index="3"
              class="el-menu-item"
              @click="handleMenuClick('map')"
              v-if="type==='model'"
            >
              <i class="fa fa-map-o fa-fw"></i>
              <span slot="title">Map</span>
            </el-menu-item>
            <el-menu-item
              index="3"
              class="el-menu-item"
              @click="handleMenuClick('relation')"
              v-if="type!=='model'"
            >
              <i class="fa fa-first-order fa-fw"></i>
              <span slot="title">Relation</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="relation">
          <status-keyword
            :id="id"
            :type="type"
          ></status-keyword>
        </div>
      </el-aside>
      <el-main class="scrollbar">
        <template v-if="graphActive==='status'">
          <div
            id="rightPanel"
            class="scrollbar"
          >
            <div class="closePanel">
              <a
                class="el-icon-close"
                @click="handleCloseRightPanel"
              >
              </a>
            </div>
            <template v-if="infoPanelType=='status'">
              <div class="info">
                <div>
                  <i
                    id="infoLogo"
                    :class="currentStatus.class"
                    :style="{color:currentStatus.color}"
                  ></i>
                </div>
                <div>
                  <h4 class="title">{{currentStatus.name}}</h4>
                  <p class="subtype">Version:{{currentStatus.version}}</p>
                  <p class="subtype">CreateTime:{{currentStatus.startTime}}</p>
                </div>
              </div>
              <div class="desc">
                <b>DESC:</b>{{currentStatus.desc}}
              </div>

              <div
                class="connected"
                v-if="currentStatus.researchersInfo&&currentStatus.researchersInfo.length>0"
              >
                <h5>Researchers</h5>
                <el-table
                  v-if="currentStatus.researchersInfo&&currentStatus.researchersInfo.length>0"
                  :data="currentStatus.researchersInfo.slice((currentStatus.researcherPage-1)*infoPanelPageSize,currentStatus.researcherPage*infoPanelPageSize)"
                  style="width: 100%"
                >
                  <el-table-column
                    label="NAME"
                    prop="name"
                  >
                  </el-table-column>
                </el-table>
                <el-pagination
                  v-if="currentStatus.researchersInfo&&currentStatus.researchersInfo.length>0"
                  background
                  layout="prev, pager, next"
                  :total="currentStatus.researchers.length"
                  :current-page="currentStatus.researcherPage"
                  @current-change="handleInfoPanelPage($event,currentStatus.researcherPage)"
                  :pager-count="5"
                  style="margin-top:10px;text-align:center"
                >
                </el-pagination>
              </div>

              <div
                class="connected"
                v-if="currentStatus.agenciesInfo&&currentStatus.agenciesInfo.length>0"
              >
                <h5>Agencies</h5>
                <el-table
                  v-if="currentStatus.agenciesInfo&&currentStatus.agenciesInfo.length>0"
                  :data="currentStatus.agenciesInfo.slice((currentStatus.agencyPage-1)*infoPanelPageSize,currentStatus.agencyPage*infoPanelPageSize)"
                  style="width: 100%"
                >
                  <el-table-column
                    label="NAME"
                    prop="name"
                  >
                  </el-table-column>
                </el-table>
                <el-pagination
                  v-if="currentStatus.agenciesInfo&&currentStatus.agenciesInfo.length>0"
                  background
                  layout="prev, pager, next"
                  :total="currentStatus.researchers.length"
                  :current-page="currentStatus.agencyPage"
                  @current-change="handleInfoPanelPage($event,currentStatus.agencyPage)"
                  :pager-count="5"
                  style="margin-top:10px;text-align:center"
                >
                </el-pagination>
              </div>
            </template>
            <template v-if="infoPanelType=='event'">
              <div class="info">
                <div>
                  <i
                    id="infoLogo"
                    :class="currentEvent.class"
                    :style="{color:currentEvent.color}"
                  ></i>
                </div>
                <div>
                  <h4 class="title">{{currentEvent.name}}</h4>
                  <p class="subtype">Type:{{currentEvent.type}}</p>
                  <p class="subtype">Time:{{currentEvent.startTime}}</p>
                </div>
              </div>
              <div class="desc">
                <b>DESC:</b>{{currentEvent.desc}}
              </div>

              <div
                v-if="currentEvent.fromStatusInfo!=null"
                style="margin-top:10px"
              >
                <b>From Status:</b>
                <span v-if="currentEvent.fromStatusInfo.version">{{currentEvent.fromStatusInfo.name+ " "+ currentEvent.fromStatusInfo.version}}</span>
                <span v-if="!currentEvent.fromStatusInfo.version">{{currentEvent.fromStatusInfo.name}}</span>
              </div>

              <div
                v-if="currentEvent.toStatusInfo!=null"
                style="margin-top:10px"
              >
                <b>To Status:</b>
                <span v-if="currentEvent.toStatusInfo.version">{{currentEvent.toStatusInfo.name+ " "+ currentEvent.toStatusInfo.version}}</span>
                <span v-if="!currentEvent.toStatusInfo.version">{{currentEvent.toStatusInfo.name}}</span>
              </div>
            </template>
          </div>
          <div
            id="status-flow-chart"
            v-if="showPanel==='status'"
            style="width:100%;height:100%"
          >
            <div class="button-group">
              <el-button
                type="primary"
                :plain="btnActive!='packing'"
                @click="graphDirectionHandle('packing')" style="width:140px"
              >Graph View</el-button>
              <el-button
                type="primary"
                :plain="btnActive!='vertical'"
                @click="graphDirectionHandle('vertical')" style="width:140px"
              >Vertical View</el-button>
              <el-button
                type="primary"
                :plain="btnActive!='horizontal'"
                @click="graphDirectionHandle('horizontal')" style="width:140px"
              >Horizontal View</el-button>
            </div>
          </div>
        </template>
        <template v-if="graphActive==='used'">
          <status-used
            :id="id"
            :type="type"
          ></status-used>
        </template>
        <template v-if="type!=='location' && graphActive==='map'">
          <status-map
            :id="id"
            :type="type"
          ></status-map>
        </template>
        <template v-if="(type!=='location'||type!=='model') && graphActive==='relation'">
          <status-relation
            :id="id"
            :type="type"
          ></status-relation>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Used from "@/components/StatusGraph/Used";
import LMap from "@/components/StatusGraph/Map";
import Keyword from "@/components/StatusGraph/Keyword";
import Relation from "@/components/StatusGraph/Relation";
import * as d3 from "d3v4";
import * as dagreD3 from "dagre-d3";
import { _debounce, _throttle } from "@/assets/debounceAndthrottle";
export default {
  name: "status",
  data() {
    return {
      id: "",
      type: "",
      contetHeight: 0,
      graphActive: "status",
      btnActive: "packing",
      basicInfo: {
        class: "fa fa-globe fa-3x",
        color: "#98df8a",
        title: "",
        category: "",
        desc: "",
        keywords: []
      },
      status: [],
      defaultCategory: {
        model: { class: "fa fa-globe fa-3x", color: "#98df8a" },
        agency: { class: "fa fa-institution fa-3x", color: "#d62728" },
        location: { class: "fa fa-map-marker fa-3x", color: "#ff9896" },
        researcher: { class: "fa fa-user-circle-o fa-3x", color: "#9467bd" }
      },
      showPanel: "status",
      currentStatus: {},
      currentEvent: {},
      infoPanelPageSize: 10,
      infoPanelType: "status"
    };
  },

  components: {
    "status-used": Used,
    "status-map": LMap,
    "status-keyword": Keyword,
    "status-relation": Relation
  },

  computed: {},

  beforeMount: function() {
    let clientH = document.body.clientHeight;
    this.contetHeight = clientH - 61;
    this.id = this.$route.params.id;
    this.type = this.$route.params.category;
  },

  mounted() {
    const that = this;
    let category = this.$route.params.category;
    let id = this.$route.params.id;
    this.getStatusInfo(category, id);
    window.onresize = function temp() {
      let clientH = document.body.clientHeight;
      let navbar = document.getElementById("knowledgeMenu");
      let navbarH = navbar.clientHeight;
      that.contetHeight = clientH - navbarH - 1;
    };
  },

  methods: {
    getStatusInfo(category, id) {
      let url = "";
      switch (category) {
        case "model":
          url = "http://172.21.213.242:8080//Knowledge/GetModelByIdServlet";
          this.basicInfo.class = "fa fa-globe fa-3x";
          this.basicInfo.color = "#98df8a";
          break;
        case "researcher":
          url =
            "http://172.21.213.242:8080//Knowledge/GetResearcherByIdServlet";
          this.basicInfo.class = "fa fa-user-circle-o fa-3x";
          this.basicInfo.color = "#9467bd";
          break;
        case "agency":
          url = "http://172.21.213.242:8080//Knowledge/GetAgencyByIdServlet";
          this.basicInfo.class = "fa fa-institution fa-3x";
          this.basicInfo.color = "#d62728";
          break;
        case "location":
          url = "http://172.21.213.242:8080//Knowledge/GetLocationByIdServlet";
          this.basicInfo.class = "fa fa-map-marker fa-3x";
          this.basicInfo.color = "#ff9896";
          break;
      }
      if (url.length > 0) {
        let that = this;
        this.axios
          .get(url, {
            params: {
              id: id
            }
          })
          .then(function(response) {
            // console.log(response);
            if (response.status === 200) {
              console.log(response.data);
              that.basicInfo.title = response.data.name;
              that.basicInfo.category = category.toUpperCase();
              that.status = response.data.status;
              that.basicInfo.desc = response.data.desc;
              let keywords = [];
              for (let i = 0; i < that.status.length; i++) {
                let status = that.status[i];
                if (status.keywords) {
                  for (let j = 0; j < status.keywords.length; j++) {
                    let keyword = status.keywords[j];
                    if (keywords.indexOf(keyword) < 0) {
                      keywords.push(keyword);
                    }
                  }
                }
              }
              that.basicInfo.keywords = keywords;

              //that.createFlowchart();
              that.createStatusChart();
            } else {
              that.$message.error("找不到条目");
            }
          });
      } else {
        that.$message({
          showClose: true,
          message: "No Data",
          type: "error"
        });
      }
    },
    createFlowchart() {
      let that = this;
      $("#status-flow-chart svg").remove();
      let width = $("#status-flow-chart").width();
      let height = $("#status-flow-chart").height();
      const svg = d3
        .select("#status-flow-chart")
        .append("svg")
        .attr("oncontextmenu", "return false;")
        .attr("width", width)
        .attr("height", height);
      svg.append("g");

      let rankdir = "TB";
      if (this.btnActive === "horizontal") {
        rankdir = "LR";
      }
      // Create a new directed graph
      var g = new dagreD3.graphlib.Graph()
        .setGraph({
          rankdir: rankdir
        })
        .setDefaultEdgeLabel(function() {
          return {};
        });

      let events = [];
      for (let i = 0; i < this.status.length; i++) {
        let status = this.status[i];
        let label = status.name;
        if (status.version) {
          label = label + " " + status.version;
        }
        g.setNode(status.id, {
          labelType: "html",
          label: "<p>" + label + "</p>",
          class: "status"
        });
        let currentEvents = status.events;
        events = events.concat(currentEvents);
      }

      for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let className = event.type;
        className = className.toLowerCase();
        className = className.replace(/\s+/g, "_");
        console.log(event);
        g.setNode(event.id, {
          shape: "ellipse",
          labelType: "html",
          label: "<p>" + event.name + "(" + event.startTime + ")" + "</p>",
          class: className
        });
      }

      g.nodes().forEach(function(v) {
        var node = g.node(v);
        node.rx = node.ry = 5;
      });

      for (let i = 0; i < events.length; i++) {
        let event = events[i];
        if (event.fromStatus.indexOf("null") < 0) {
          g.setEdge(event.fromStatus, event.id);
          g.setEdge(event.id, event.toStatus);
        } else {
          g.setEdge(event.id, event.toStatus);
        }
      }

      let inner = svg.select("g");

      var zoom = d3.zoom().on("zoom", function() {
        inner.attr("transform", d3.event.transform);
      });
      svg.call(zoom);

      // Create the renderer
      var render = new dagreD3.render();

      render(inner, g);

      inner.selectAll("g.node").on("click", function(v) {
        let node = g.node(v);
        if (node.class === "status") {
          // for (let i = 0; i < that.status.length; i++) {
          //   that.infoPanelType = "status";
          //   that.showStatusPanel(v);
          // }
          that.infoPanelType = "status";
          that.showStatusPanel(v);
        } else {
          that.infoPanelType = "event";
          that.showEventPanel(v, events);
        }
      });

      // Center the graph
      var initialScale = 1.5;
      svg.call(
        zoom.transform,
        d3.zoomIdentity
          .translate(
            (svg.attr("width") - g.graph().width * initialScale) / 2,
            20
          )
          .scale(initialScale)
      );

      // svg.attr("height", g.graph().height * initialScale + 40);
    },
    graphDirectionHandle(direction) {
      this.btnActive = direction;
      this.handleCloseRightPanel();
      if (direction === "packing") {
        this.createStatusChart();
      } else {
        this.createFlowchart();
      }
    },
    createStatusChart() {
      let that = this;
      $("#status-flow-chart svg").remove();
      let width = $("#status-flow-chart").width();
      let height = $("#status-flow-chart").height();
      const svg = d3
        .select("#status-flow-chart")
        .append("svg")
        .attr("oncontextmenu", "return false;")
        .attr("width", width)
        .attr("height", height);
      svg.append("g");
      let g = svg.select("g");

      let statusArray = [];
      for (let i = 0; i < this.status.length; i++) {
        let status = this.status[i];
        let obj = {
          id: status.id,
          name: status.name,
          version: status.version,
          value: 1
        };
        statusArray.push(obj);
      }

      let vLayout = d3
        .pack()
        .size([width, height])
        .padding(3);
      let root = { children: statusArray };

      var vRoot = d3.hierarchy(root).sum(function(d) {
        return 10;
      });
      var vNodes = vRoot.descendants();
      vLayout(vRoot);
      var vSlices = g
        .selectAll("circle")
        .data(vNodes)
        .enter()
        .append("g")
        .each(function(d) {
          d.node = this;
        })
        .on("mouseover", hovered(true))
        .on("mouseout", hovered(false));

      var vCircles = vSlices
        .append("circle")
        .attr("class", "status")
        .attr("id", function(d) {
          return "status-" + d.data.id;
        });

      // Draw on screen
      vCircles
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        })
        .attr("r", function(d) {
          return d.r;
        });

      var leaf = vSlices.filter(function(d) {
        return !d.children;
      });

      leaf.on("click", function(d) {
        that.infoPanelType = "status";
        $("#status-flow-chart svg g").removeClass("node--active");
        let nodeId = d.data.id;
        let depth = d.depth;
        d3.selectAll(
          d.ancestors().map(function(d) {
            if (d.depth === depth) {
              return d.node;
            }
          })
        ).classed("node--active", true);

        that.showStatusPanel(nodeId);
      });

      var vText = leaf
        .append("text")
        .attr("class", "name")
        .style("font-size", function(d) {
          if (d.data.name) {
            let nameArray = d.data.name.split(/(?=[A-Z][^A-Z])/g);
            let size = nameArray.length;
            if (size < 4) {
              size = 4;
            }
            let h = d.r / size;
            return h + "px";
          }
        });

      // vText
      //   .append("tspan")
      //   .attr("x", function(d) {
      //     return d.x;
      //   })
      //   .attr("y", function(d) {
      //     return d.y;
      //   })
      //   .text(function(d) {
      //     return d.data.name;
      //   });

      // vText
      //   .append("tspan")
      //   .attr("x", function(d) {
      //     return d.x;
      //   })
      //   .attr("y", function(d) {
      //     return d.y + d.r / 3.5;
      //   })
      //   .text(function(d) {
      //     return d.data.version;
      //   });

      vText
        .attr("clip-path", d => d.data.id)
        .selectAll("tspan")
        .data(function(d) {
          if (d.data.name) {
            let nameArray = d.data.name.split(/(?=[A-Z][^A-Z])/g);
            let size = nameArray.length;
            if (size < 4) {
              size = 4;
            }
            let array = [];
            for (let i = 0; i < nameArray.length; i++) {
              let name = nameArray[i];
              var obj = {
                name: name,
                x: d.x,
                y: d.y + (d.r / size) * (i - 1)
              };
              array.push(obj);
            }

            return array;
          } else {
            return [];
          }
        })
        .enter()
        .append("tspan")
        .attr("x", function(d, i, nodes) {
          console.log(d, i, nodes);
          return d.x;
        })
        .attr("y", function(d) {
          return d.y;
        })
        .text(d => d.name);

      vText
        .append("tspan")
        .attr("x", function(d) {
          return d.x;
        })
        .attr("y", function(d) {
          return d.y + d.r / 3.5;
        })
        .text(function(d) {
          return d.data.version;
        });

      function hovered(hover) {
        return function(d) {
          let depth = d.depth;
          d3.selectAll(
            d.ancestors().map(function(d) {
              if (d.depth === depth) {
                return d.node;
              }
            })
          ).classed("node--hover", hover);
        };
      }
    },
    handleCloseRightPanel() {
      $("#status-flow-chart svg g").removeClass("node--active");
      $("#rightPanel")
        .css("transform", "translate(400px,0)")
        .css("transition", "transform 0.5s ease-in-out");
    },
    handleInfoPanelPage(currentPage) {
      this.currentStatus.page = currentPage;
    },
    formatterResearcher(row) {
      let that = this;
      let promise = new Promise(function(resolve, reject) {
        that.axios
          .get(
            "http://172.21.213.242:8080//Knowledge/GetResearcherByIdServlet",
            {
              params: {
                id: row
              }
            }
          )
          .then(function(response) {
            resolve(response.data.name);
          });
      });
      return promise;
    },
    formatterAgency(row) {
      let that = this;
      let promise = new Promise(function(resolve, reject) {
        that.axios
          .get("http://172.21.213.242:8080//Knowledge/GetAgencyByIdServlet", {
            params: {
              id: row
            }
          })
          .then(function(response) {
            resolve(response.data.name);
          });
      });
      return promise;
    },
    async showStatusPanel(nodeId) {
      let currentStatus = {};
      for (let obj of this.status) {
        if (obj.id === nodeId) {
          currentStatus = obj;
          break;
        }
      }

      currentStatus.class = "fa fa-circle-o-notch fa-3x";
      currentStatus.agencyPage = 1;
      currentStatus.researcherPage = 1;
      let researchers = [];
      if (currentStatus.researchers) {
        for (let i = 0; i < currentStatus.researchers.length; i++) {
          let researcherId = currentStatus.researchers[i];
          let name = await this.formatterResearcher(researcherId);
          if (name !== "") {
            let obj = {
              id: researcherId,
              name: name
            };
            researchers.push(obj);
          }
        }
        currentStatus.researchersInfo = researchers;
      }

      let agencies = [];
      if (currentStatus.agencies) {
        for (let i = 0; i < currentStatus.agencies.length; i++) {
          let agencyId = currentStatus.agencies[i];
          let name = await this.formatterAgency(agencyId);
          if (name !== "") {
            let obj = {
              id: agencyId,
              name: name
            };
            agencies.push(obj);
          }
        }
      }

      currentStatus.agenciesInfo = agencies;

      this.currentStatus = currentStatus;

      $("#rightPanel")
        .css("transform", "translate(0,0)")
        .css("transition", "transform 0.5s ease-in-out");
      $("#rightPanel").scrollTop(0);
    },
    async showEventPanel(eventId, events) {
      for (let i = 0; i < events.length; i++) {
        let event = events[i];
        if (event.id === eventId) {
          let currentEvent = event;
          currentEvent.class = "fa fa-calendar-check-o  fa-3x";

          for (let j = 0; j < this.status.length; j++) {
            let status = this.status[j];
            if (status.id === currentEvent.fromStatus) {
              if (status.id.indexOf("null") >= 0) {
                currentEvent.fromStatusInfo = null;
              } else {
                currentEvent.fromStatusInfo = status;
              }
            }

            if (status.id === currentEvent.toStatus) {
              currentEvent.toStatusInfo = status;
            }
          }

          this.currentEvent = currentEvent;
          $("#rightPanel")
            .css("transform", "translate(0,0)")
            .css("transition", "transform 0.5s ease-in-out");
          $("#rightPanel").scrollTop(0);
          break;
        }
      }
    },
    handleMenuClick(active) {
      this.graphActive = active;
      let that = this;
      switch (active) {
        case "status":
          this.$nextTick(function() {
            this.btnActive = "packing";
            that.createStatusChart();
          });
          break;
        case "used":
          console.log(1);
          break;
        case "map":
          console.log(2);
          break;
      }
    }
  }
};
</script>
<style scoped>
.info > div {
  padding: 10px 10px 5px 10px;
  /* text-align: left */
}
.info .title {
  margin-top: 0;
  margin-bottom: 5px;
}

.info .subtype {
  margin: 0;
}
.info .desc {
  background: transparent;
  text-align: left;
  max-height: 100px;
  overflow-y: auto;
  margin: 0 -10px;
  padding: 10px;
  /* text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical; */
}

.el-aside .relation {
  margin-top: 5px;
  height: 260px;
  padding: 1px;
}

.el-menu-vertical {
  background: transparent;
  text-align: left;
}
.el-menu-vertical .el-menu-item {
  padding-left: 23% !important;
}
.time-line {
  margin: 20px auto;
  position: relative;
}
.time-line .left-btn {
  left: 0;
  top: 50%;
  position: absolute;
  margin-top: -15px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  line-height: 33px;
  border: 1px solid #dddddd;
  border-radius: 50%;
}
.time-line .right-btn {
  right: 0;
  top: 50%;
  position: absolute;
  margin-top: -15px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  line-height: 33px;
  border: 1px solid #dddddd;
  border-radius: 50%;
}

.time-line .left-btn:hover,
.time-line .right-btn:hover {
  color: #1b96ff;
}

.time-line .left-btn > i,
.time-line .right-btn > i {
  font-size: 20px;
}

.time-line .time-box {
  width: 95%;
  margin: 0 auto;
  overflow: hidden;
}

.time-line .time-box > ul {
  overflow: hidden;
  position: relative;
}

.time-line .time-box ul:after {
  content: "";
  background: #d2d2d2;
  height: 1px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 50%;
}

.time-line .time-box li {
  width: 240px;
  float: left;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #d2d2d2;
  position: relative;
  cursor: pointer;
  list-style: none;
}
/* .time-line .time-box li:nth-child(2n) {
  margin-top: 266px;
} */
.time-line .time-box li:hover,
.time-line .time-box li.active {
  background: #1b96ff;
  color: #fff;
  border-color: #1b96ff;
}
.time-line .time-box li:before {
  content: "";
  border-left: 1px solid #d2d2d2;
  border-bottom: 1px solid #d2d2d2;
  position: absolute;
  width: 16px;
  height: 16px;
  background: #fff;
  bottom: -9px;
  transform: rotate(-45deg);
  left: 50%;
  margin-left: -8px;
}
.time-line .time-box li:nth-child(2n):before {
  bottom: auto;
  top: -10px;
  transform: rotate(-225deg);
}
.time-line .time-box li:nth-child(2n):after {
  bottom: auto;
  top: -46px;
}

.time-line .time-box li:hover:before,
.time-line .time-box li.active:before {
  border-color: #1b96ff;
  background: #1b96ff;
}

.time-line .time-box li:hover,
.time-line .time-box li.active {
  background: #1b96ff;
  color: #fff;
  border-color: #1b96ff;
}

.time-line .time-box li:after {
  content: "";
  width: 12px;
  height: 12px;
  /* background: url(img/point.png) no-repeat; */
  background: #dddddd;
  position: absolute;
  left: 50%;
  margin-left: -7px;
  bottom: 0;
  bottom: -50px;
  z-index: 1;
  border-radius: 50%;
  border: 1px solid #333;
}
.time-line .time-box li:hover:after,
.time-line .time-box li.active:after {
  /* background: url(img/point-hover.png) no-repeat; */
  background: #1b96ff;
}

.time-line .time-box .info {
  height: 200px;
  overflow: auto;
  margin: -10px;
  padding: 10px;
}

#status-flow-chart {
  position: relative;
  overflow: hidden;
}

#status-flow-chart .button-group {
  position: absolute;
  top: 0;
  left: 20px;
}

#status-flow-chart .button-group button {
  display: block;
  margin: 10px 0;
}

#rightPanel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 350px;
  background: #f9fafc;
  border-left: 2px solid #aaaaaa;
  padding: 10px;
  transform: translate(400px, 0);
  overflow-y: auto;
  overflow-x: hidden;
  /* transform: translate(0,0); */
  transition: transform 0.5s ease-in-out;
  z-index: 900;
  text-align: left;
}

#rightPanel .closePanel {
  text-align: right;
  /* background: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%; */
  height: 25px;
  line-height: 25px;
  border-bottom: 1px solid #999;
}

#rightPanel .closePanel a {
  cursor: pointer;
}

#rightPanel .info {
  display: flex;
  justify-self: center;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 30px;
}
#rightPanel .info > div {
  padding: 0 10px;
}
#rightPanel .info .title {
  margin-top: 0;
}

#rightPanel .info .subtype {
  margin: 0;
}

#rightPanel .connected {
  margin-bottom: 20px;
}

#rightPanel .connected h5 {
  font-weight: 600;
}

#rightPanel .table {
  color: #333333;
}

#rightPanel .desc {
  /* text-indent: 1rem */
  text-align: left;
}
</style>
<style>
g.type-current > rect {
  fill: #1e9fff;
}
g.type-success > rect {
  fill: green;
}
g.type-fail > rect {
  fill: red;
}
text {
  font-weight: 300;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serf;
  font-size: 14px;
}
.node {
  fill: #fff;
}
.node rect {
  stroke: #999;
  stroke-width: 1.5px;
}
.edgePath path {
  stroke: #333;
  stroke-width: 1.5px;
}
.node rect,
.node circle,
.node ellipse,
.node polygon {
  stroke: #333;
  /* fill: #fff; */
  stroke-width: 1.5px;
}

.nodes .create,
.nodes .started {
  fill: #96dd7b;
}

.nodes .improve,
.nodes .agencychange {
  fill: #15d1ec;
}

.nodes .namechange,
.nodes .titlechange {
  fill: #ffe35d;
}

.nodes .merge {
  fill: #375a7d;
}

.nodes .upgrade {
  fill: #ff6138;
}

.nodes .locationchange {
  fill: #fab496;
}

.nodes .status {
  fill: #d1ed47;
}

.nodes .node {
  cursor: pointer;
}

.nodes .node:hover {
  fill: #ff7c7c;
}

circle.status {
  stroke: white;
  fill: #05668d;
  opacity: 0.3;
  stroke-width: 2px;
  cursor: pointer;
}

text.name {
  /* font: 14px sans-serif; */
  text-anchor: middle;
  cursor: pointer;
}

.node--hover circle {
  fill: #fcfdbf;
  stroke: #000;
  stroke-width: 2px;
}

.node--active circle {
  fill: #fcfdbf;
  stroke: #000;
  stroke-width: 2px;
}

.el-main {
  overflow: hidden;
  position: relative;
}
</style>