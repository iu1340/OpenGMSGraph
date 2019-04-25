<!--  -->
<template>
  <div
    class="content-box"
    :style="{ height: contetHeight + 'px' }"
  >
    <div
      class="load-box"
      v-show="loadFlag"
    >
      <div class="loader"></div>
    </div>

    <div
      class="toolPanel"
      v-show="loadFlag==false"
    >
      <div>
        <el-input
          placeholder="Please enter query"
          v-model="searchText"
          class="input-with-select"
          @keyup.enter.native="handleSearch"
        >
          <el-select
            v-model="searchType"
            slot="prepend"
            placeholder="Select Type"
          >
            <el-option
              label="M"
              value="Model"
            >
              <span style="float: left">M</span>
              <span style="float: right; color: #8492a6; font-size: 13px;margin-left: 10px;">Model</span>
            </el-option>
            <el-option
              label="A"
              value="Agency"
            >
              <span style="float: left">A</span>
              <span style="float: right; color: #8492a6; font-size: 13px;margin-left: 10px;">Agency</span>
            </el-option>
            <el-option
              label="R"
              value="Researcher"
            >
              <span style="float: left">R</span>
              <span style="float: right; color: #8492a6; font-size: 13px;margin-left: 10px;">Researcher</span>
            </el-option>
            <el-option
              label="L"
              value="Location"
            >
              <span style="float: left">L</span>
              <span style="float: right; color: #8492a6; font-size: 13px;margin-left: 10px;">Location</span>
            </el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearch"
          ></el-button>
        </el-input>
      </div>
      <div>
        <!-- <el-date-picker
          v-model="startYear"
          type="year"
          placeholder="Select Start Year"
          style="width:48%;float:left"
          :picker-options="pickerOptions"
          value-format="yyyy"
        >
        </el-date-picker>
        <div style="float:left;height:20px;width:2%;border-bottom:1px soild #000;margin:0 1%"></div>
        <el-date-picker
          v-model="endYear"
          type="year"
          placeholder="Select End Year"
          style="width:48%;float:left"
          :picker-options="pickerOptions2"
          @change="changeYear"
          value-format="yyyy"
        >
        </el-date-picker> -->
        <date-picker
          v-model="selectYearRange"
          lang="en"
          type="year"
          format="YYYY"
          range
          @confirm="changeYear"
          style="width:100%"
          :shortcuts="false"
          :not-before="yearRange.min"
          :not-after="yearRange.max"
          :confirm="true"
          :clearable="false"
        ></date-picker>
      </div>
    </div>

    <div
      class="legendPanel"
      v-show="loadFlag==false"
    >
      <h4>Legend</h4>
      <el-checkbox-group
        v-model="checkedLegend"
        @change="handleCheckedLegendChange"
        style="text-align:left"
      >
        <el-checkbox
          v-for="item in legend"
          :label="item.key"
          :key="item.color"
          style="margin-left:25px;"
          size="medium"
        >
          <i
            :class="item.class"
            :style="{color:item.color}"
          ></i>
          {{item.key}}</el-checkbox>
      </el-checkbox-group>
    </div>

    <!-- <svg id="d3Svg" :style="{ height: contetHeight + 'px' }"></svg> -->
    <div id="d3Canvas"></div>
    <div
      id="rightPanel"
      class="scrollbar"
    >
      <div class="closePanel">
      </div>
      <div class="info">
        <div>
          <i
            id="infoLogo"
            :class="infoPanel.class"
            :style="{color:infoPanel.color}"
          ></i>
        </div>
        <div>
          <h4 class="title">{{infoPanel.title}}</h4>
          <p class="subtype">CATEGORY:{{infoPanel.subType}}</p>
        </div>
      </div>
      <div class="connected">
        <h5>Connected Nodes</h5>
        <el-table
          :data="infoPanel.connectedData.slice((infoPanelCurrentPage-1)*infoPanelPageSize,infoPanelCurrentPage*infoPanelPageSize)"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="NAME"
          >
          </el-table-column>
          <el-table-column
            prop="category"
            label="CATEGORY"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="infoPanel.connectedData.length"
          :current-page="infoPanelCurrentPage"
          @current-change="handleInfoPanelPage"
          :pager-count="5"
          style="margin-top:10px;text-align:center"
        >
        </el-pagination>
      </div>
      <div class="viewExtend">
        <p>View Status.<a
            id="viewStatus"
            @click="statusPanelShow(infoPanel.id,infoPanel.subType)"
          >
            Go!</a></p>
        <p>
          View Related Scene.<a
            id="viewScene"
            @click="scenePanelShow(infoPanel)"
          >Go!</a>
        </p>
        <!-- <p>
          View Used History.<a
            id="viewHistory"
            @click="historyPanelShow(infoPanel)"
          >Go!</a>
        </p> -->
      </div>
    </div>
    <transition name="el-zoom-in-bottom">
      <div
        id="loadingModelGraph"
        :style="{height:loadingModelGraphHeight+'px'}"
        v-show="loadingModelGraphShow"
      ></div>
    </transition>
    <el-button
      type="primary"
      icon="el-icon-caret-top"
      class="loadingModelGraphShow"
      v-show="!loadingModelGraphShow"
      @click="loadingModelGraphShow=true"
      circle
    ></el-button>
    <el-dialog
      title="History Panel"
      :visible.sync="historyPanelVisible"
      :fullscreen="true"
    >
      <el-tabs
        v-model="historyPanelActiveName"
        @tab-click="handleHistoryPanelActive($event,infoPanel)"
        tab-position="left"
      >
        <el-tab-pane
          label="History"
          name="history"
          :style="{height:contetHeight-55+'px'}"
        >
          <div class="historyPanel">
            <div id="historyGraph"></div>
            <div
              class="orderPanel"
              v-if="historyPanelInfo.researcherOrder.length > 0||historyPanelInfo.agencyOrder > 0"
            >
              <h5>Researcher Order</h5>
              <ul>
                <li
                  v-for="item of historyPanelInfo.researcherOrder"
                  :key="item.id"
                  :id="item.id"
                >
                  <i class='fa fa-user-circle fa-fw'></i>
                  {{item.name}}
                </li>
              </ul>
              <h5>Agency Order</h5>
              <ul>
                <li
                  v-for="item of historyPanelInfo.agencyOrder"
                  :key="item.id"
                  :id="item.id"
                >
                  <i class='fa fa-institution fa-fw'></i>
                  {{item.name}}
                </li>
              </ul>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="Country"
          name="country"
          :style="{height:contetHeight-55+'px'}"
        >
          <div class="historyPanel">
            <div id="countryGraph"></div>
            <!-- <div class="orderPanel">
              <h5>Country Order</h5>
              <ul></ul>
            </div> -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      :title="scenePanelTitle"
      :visible.sync="scenePanelVisible"
      :fullscreen="true"
      custom-class="scrollbar scenePanel"
    >
      <div class="main-timeline">
        <div
          class="timeline"
          v-for="(item) in scenePanelInfo.scenePanelData"
          :key="item.id"
        >
          <div class="timeline-content">
            <div class="circle"><span><i class="fa fa-globe"></i></span></div>
            <div class="content">
              <span class="year">{{item.date}}</span>
              <h4 class="title">{{item.title}}</h4>
              <div
                class="research"
                v-if="item.researcher.length>0"
              >
                <span>Researcher:</span>
                <div>
                  <el-tag
                    size="mini"
                    v-for="researcher in item.researcher"
                    :key="researcher.id"
                    style="margin:5px;cursor:pointer"
                    :title="researcher.name"
                  >{{researcher.name}}</el-tag>
                </div>
              </div>
              <div
                class="agency"
                v-if="item.agency.length>0"
              >
                <span>Agency:</span>
                <div>
                  <el-tag
                    size="mini"
                    type="success"
                    v-for="agency in item.agency"
                    :key="agency.id"
                    style="margin:5px;cursor:pointer"
                    :title="agency.name"
                  >{{agency.name}}</el-tag>
                </div>
              </div>
              <div
                class="model"
                v-if="item.model.length>0"
              >
                <span>Model:</span>
                <div>
                  <el-tag
                    size="mini"
                    type="info"
                    v-for="model in item.model"
                    :key="model.id"
                    style="margin:5px;cursor:pointer"
                    :title="model.name"
                  >{{model.name}}</el-tag>
                </div>
              </div>
              <div
                class="location"
                v-if="item.location.length>0"
              >
                <span>Location:</span>
                <div>
                  <el-tag
                    size="mini"
                    type="warning"
                    v-for="location in item.location"
                    :key="location.id"
                    style="margin:5px;cursor:pointer"
                    :title="location.name"
                  >{{location.name}}</el-tag>
                </div>
              </div>
              <p class="description">
                {{item.desc}}
              </p>
              <div class="icon"><span></span></div>
            </div>
          </div>
        </div>
      </div>
      <el-button
        type="info"
        style="margin-top:10px"
        round
        @click="handleTimeLinePage"
        v-show="scenePanelInfo.page<
        (Math.ceil(scenePanelInfo.count/20))"
      >More</el-button>
      <knwoledge-top></knwoledge-top>
    </el-dialog>
  </div>
</template>

<script>
import * as d3 from "d3v4";
import toTop from "./toTop";
import worldData from "@/assets/world.json";
import { Loading } from "element-ui";
import "@/assets/timeline.css";
import { _debounce, _throttle } from "@/assets/debounceAndthrottle";
import DatePicker from "vue2-datepicker";
export default {
  name: "Graph",
  data() {
    let that = this;
    return {
      contetHeight: 900,
      loadingModelGraphHeight: 300,
      searchType: "Model",
      searchText: "",
      startYear: new Date().getFullYear().toString(),
      endYear: new Date().getFullYear().toString(),
      selectYearRange: [new Date(), new Date()],
      yearRange: { min: 1900, max: 1900 },
      legend: [
        { class: "fa fa-circle fa-fw", color: "#dd6b66", key: "model" },
        { class: "fa fa-circle fa-fw", color: "#759aa0", key: "agency" },
        { class: "fa fa-circle fa-fw", color: "#e69d87", key: "location" },
        { class: "fa fa-circle fa-fw", color: "#8dc1a9", key: "researcher" },
        { class: "fa fa-minus fa-fw", color: "#ea7e53", key: "locate" },
        { class: "fa fa-minus fa-fw", color: "#eedd78", key: "create" },
        // { class: "fa fa-minus fa-fw", color: "#ffbb78", key: "used" },
        { class: "fa fa-minus fa-fw", color: "#73a373", key: "belong" },
        { class: "fa fa-minus fa-fw", color: "#73b9bc", key: "use" }
      ],
      checkedLegend: [
        "model",
        "agency",
        "location",
        "researcher",
        "locate",
        "create",
        "used",
        "belong",
        "use"
      ],
      loadingGraph: null,
      loadingModelGraphShow: true,
      loadFlag: true,
      yearFlag: false,
      knowledgeGraphInfo: { nodes: [], links: [] },
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getFullYear() < that.yearRange.min * 1 ||
            time.getFullYear > that.yearRange.max * 1
          );
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return (
            time.getFullYear() < that.startYear * 1 ||
            time.getFullYear > that.yearRange.max * 1
          );
        }
      },
      infoPanel: {
        id: "",
        class: "fa fa-globe fa-3x",
        color: "#333",
        title: "",
        subType: "",
        connectedData: []
      },
      infoPanelCurrentPage: 1,
      infoPanelPageSize: 10,
      historyPanelVisible: false,
      historyPanelActiveName: "history",
      historyPanelInfo: {
        historyGraph: null,
        researcherOrder: [],
        agencyOrder: [],
        countryGraph: null,
        countryOder: []
      },
      scenePanelTitle: "",
      scenePanelVisible: false,
      scenePanelInfo: {
        currentId: "",
        scenePanelData: [],
        count: 0,
        page: 1
      },
      color: [
        "#dd6b66",
        "#759aa0",
        "#e69d87",
        "#8dc1a9",
        "#ea7e53",
        "#eedd78",
        "#73a373",
        "#73b9bc",
        "#7289ab",
        "#91ca8c",
        "#f49f42"
      ]
    };
  },

  components: {
    "knwoledge-top": toTop,
    "date-picker": DatePicker
  },

  computed: {},

  beforeMount: function() {
    let clientH = document.body.clientHeight;
    this.contetHeight = clientH - 61;
    // this.loadingModelGraphHeight = clientH - 61;
    // let date = new Date();
  },

  mounted: function() {
    console.log(this.selectYearRange);
    // Loading.service({ fullscreen: true,target:document.querySelector(".load-box")});
    const that = this;
    let getYearRangeAxios = this.getYearRange();
    getYearRangeAxios.then(function(response) {
      if (response.status === 200) {
        that.yearRange = response.data;
        that.createLoadingGraph();
        that.getKnowledgeGraphInfo4Year(that.startYear, that.endYear);
      } else {
        alert("year range get error");
      }
    });

    window.onresize = function temp() {
      let clientH = document.body.clientHeight;
      let navbar = document.getElementById("knowledgeMenu");
      let navbarH = navbar.clientHeight;
      that.contetHeight = clientH - navbarH - 1;
      $("#d3Canvas>canvas").attr("height", that.contetHeight - 1 + "px");
      that.loadingGraph.resize();
      // if (that.loadingModelGraphHeight !== 300) {
      //   that.loadingModelGraphHeight = clientH - navbarH - 1;
      // }
    };
  },

  methods: {
    getYearRange() {
      var getYearRangeAxios = this.axios.get(
        "http://172.21.213.242:8080/Knowledge/GetGraphYearRangeServlet"
      );
      return getYearRangeAxios;
    },
    createLoadingGraph() {
      let that = this;
      this.loadingGraph = this.$echarts.init(
        document.getElementById("loadingModelGraph")
      );
      let iclose = document.createElement("i");
      iclose.className = "el-icon-caret-bottom";
      iclose.onclick = function() {
        that.loadingModelGraphShow = false;
      };
      document.getElementById("loadingModelGraph").appendChild(iclose);

      let xAxisData = [];
      let min = this.yearRange.min * 1;
      let max = this.yearRange.max * 1;
      for (let i = min; i <= max; i++) {
        xAxisData.push(i);
      }
      let loadingModelGraphOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          textStyle:{
            color:"#fff"
          },
          data: []
        },
        grid: {
          left: "200px",
          right: "200px",
          bottom: "3%",
          top: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false
          }
        },
        series: []
      };
      this.loadingGraph.setOption(loadingModelGraphOption);
      this.getLoadingGraphOfYear(min, max);
    },
    getLoadingGraphOfYear: async function(min, max) {
      let option = this.loadingGraph.getOption();
      let legend = new Set();
      let series = option.series;
      this.loadingGraph.setOption(option);
      let that = this;
      let dataArray = [];
      for (let i = min; i <= max; i++) {
        let data = await this.getModelUse4Year(i);
        dataArray.push(data);
        for (let j = 0; j < data.length; j++) {
          let obj = data[j];
          legend.add(obj.name);
        }
      }

      let legendArray = Array.from(legend);
      for (let i = 0; i < legendArray.length; i++) {
        let name = legendArray[i];
        let array = new Array(max - min);
        array.fill(0);
        let seriesObj = {
          name: name,
          type: "bar",
          stack: "Models",
          data: array
        };
        series.push(seriesObj);
      }

      for (let i = 0; i < dataArray.length; i++) {
        let data = dataArray[i];
        for (let j = 0; j < data.length; j++) {
          let obj = data[j];
          for (let k = 0; k < series.length; k++) {
            let seriesObj = series[k];
            if (seriesObj.name === obj.name) {
              seriesObj.data[i] = obj.count;
              break;
            }
          }
        }
      }
      option.legend[0].data = legendArray;
      that.loadingGraph.setOption(option);
    },
    getModelUse4Year(year) {
      let that = this;
      let promise = new Promise(function(resolve, reject) {
        that.axios
          .get(
            "http://172.21.213.242:8080//Knowledge/GetModelGraphByYearServlet",
            {
              params: {
                year: year
              }
            }
          )
          .then(function(response) {
            resolve(response.data);
          });
      });
      return promise;
    },
    changeYear(val) {
      this.startYear = this.selectYearRange[0].getFullYear();
      this.endYear = this.selectYearRange[1].getFullYear();
      if (this.searchText === "") {
        this.getKnowledgeGraphInfo4Year(this.startYear, this.endYear);
      } else {
        this.loadFlag = true;
        let that = this;
        this.axios
          .get(
            "http://172.21.213.242:8080//Knowledge/GetModelGraphBySearchTextServlet",
            {
              params: {
                type: this.searchType,
                text: this.searchText,
                sTime: this.startYear,
                eTime: this.endYear
              }
            }
          )
          .then(function(response) {
            that.checkedLegend = [
              "model",
              "agency",
              "location",
              "researcher",
              "locate",
              "create",
              "used",
              "belong",
              "use"
            ];
            that.knowledgeGraphInfo = response.data;
            let nodes = that.knowledgeGraphInfo.nodes;
            let links = that.knowledgeGraphInfo.links;
            that.createKnowlegedGraph4YearD3(nodes, links);
          });
      }
    },
    // changeYear:_debounce(function(){
    //   console.log(this.endYear)
    //   // this.getKnowledgeGraphInfo4Year(this.startYear,this.endYear);
    // },1000),
    handleSearch: _debounce(function() {
      if (this.searchText === "") {
        this.getKnowledgeGraphInfo4Year(this.startYear, this.endYear);
      } else {
        this.loadFlag = true;
        let that = this;
        this.axios
          .get(
            "http://172.21.213.242:8080//Knowledge/GetModelGraphBySearchTextServlet",
            {
              params: {
                type: this.searchType,
                text: this.searchText,
                sTime: this.startYear,
                eTime: this.endYear
              }
            }
          )
          .then(function(response) {
            that.checkedLegend = [
              "model",
              "agency",
              "location",
              "researcher",
              "locate",
              "create",
              "used",
              "belong",
              "use"
            ];
            that.knowledgeGraphInfo = response.data;
            let nodes = that.knowledgeGraphInfo.nodes;
            let links = that.knowledgeGraphInfo.links;
            that.createKnowlegedGraph4YearD3(nodes, links);
          });
      }
    }, 500),
    getKnowledgeGraphInfo4Year(startYear, endYear) {
      let that = this;
      this.loadFlag = true;
      this.axios
        .get("http://172.21.213.242:8080//Knowledge/GetGraphByYearServlet", {
          params: {
            sTime: startYear,
            eTime: endYear
          }
        })
        .then(function(response) {
          that.knowledgeGraphInfo = response.data;
          let nodes = that.knowledgeGraphInfo.nodes;
          let links = that.knowledgeGraphInfo.links;
          that.checkedLegend = [
            "model",
            "agency",
            "location",
            "researcher",
            "locate",
            "create",
            "used",
            "belong",
            "use"
          ];
          that.createKnowlegedGraph4YearD3(nodes, links);
        });
    },
    createKnowlegedGraph4YearD3(nodes, links) {
      let max = 1,
        min = 1;
      for (let node of nodes) {
        if (node.value > max) {
          max = node.value;
        }
        if (node.value < min) {
          min = node.value;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let value = node.value;
        let norm = ((value - min) * 4) / (max - min);
        if (norm < 1) {
          norm = 1;
        }
        node.radius = 4 * norm;
      }

      this.loadFlag = false;
      $("#d3Canvas").empty();
      $(".tooltip").remove();
      $(".closePanel").empty();
      let that = this;
      let height = that.contetHeight - 1;
      let width = window.innerWidth;
      let graphCanvas = d3
        .select("#d3Canvas")
        .append("canvas")
        .attr("width", width + "px")
        .attr("height", height + "px")
        .node();

      // window.addEventListener("resize", () => {simulationUpdate()});

      let radius = 5;
      let selectedNode = null;
      let selectedLink = null;
      let connected = { connectedNodes: [], connectedLinks: [] };
      let lockFlag = false;
      let timeout = null;

      let context = graphCanvas.getContext("2d");

      let color = function(key) {
        let flag = false;
        for (let i = 0; i < that.legend.length; i++) {
          let d = that.legend[i];
          if (d.key === key) {
            return d.color;
          }
        }
        if (flag) {
          return "#e4e5e5";
        }
      };

      let tooltip = d3
        .select(".content-box")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      let close = d3
        .select(".closePanel")
        .append("a")
        .attr("class", "el-icon-close")
        .on("click", function() {
          lockFlag = false;
          $("#rightPanel")
            .css("transform", "translate(400px,0)")
            .css("transition", "transform 0.5s ease-in-out");
          simulationUpdate();
        });

      // let strength = links.length - nodes.length;
      // if (strength < 0) {
      //   strength = -strength;
      // }
      console.log(nodes.length / 2);
      let simulation = d3
        .forceSimulation()
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1))
        .force("charge", d3.forceManyBody().strength(-nodes.length))
        .force(
          "link",
          d3
            .forceLink()
            .strength(2)
            .id(function(d) {
              return d.id;
            })
          // .distance(60)
        )
        .alphaTarget(0)
        .alphaDecay(0.05);

      // let simulation = d3
      //   .forceSimulation()
      //   .force("center", d3.forceCenter(width / 2, height / 2))
      //   .force("charge", d3.forceManyBody().strength(-(50)))
      //   .force(
      //       "link",
      //       d3
      //           .forceLink()
      //           .iterations(8)
      //           .id(function(d) {
      //               return d.id;
      //           })
      //   )
      //   .force("x", d3.forceX())
      //   .force("y", d3.forceY());

      // let nodesByCategory = d3
      //   .nest()
      //   .key(function(d) {
      //     return d.category;
      //   })
      //   .entries(nodes);

      // let linksByType = d3
      //   .nest()
      //   .key(function(d) {
      //     return d.type;
      //   })
      //   .entries(links);

      // color.domain(
      //   nodesByCategory.map(function(d) {
      //     return d.key;
      //   })
      // );

      // color.domain(
      //   linksByType.map(function(d) {
      //     return d.key;
      //   })
      // );
      // that.legend = [];
      // that.checkedLegend = [];
      // nodesByCategory.map(function(d) {
      //   let item = {
      //     class: "fa fa-circle fa-fw",
      //     color: color(d.key),
      //     key: d.key
      //   };
      //   that.legend.push(item);
      //   that.checkedLegend.push(item.key);
      // });

      // linksByType.map(function(d) {
      //   let item = {
      //     class: "fa fa-minus fa-fw",
      //     color: color(d.key),
      //     key: d.key
      //   };
      //   that.legend.push(item);
      //   that.checkedLegend.push(item.key);
      // });
      // console.log(JSON.stringify(that.legend));
      // console.log(JSON.stringify(that.checkedLegend));

      let transform = d3.zoomIdentity;

      function zoomed() {
        console.log("zooming");
        transform = d3.event.transform;
        simulationUpdate();
      }

      d3.select(graphCanvas)
        .call(
          d3
            .drag()
            .subject(dragsubject)
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        )
        .call(
          d3
            .zoom()
            .scaleExtent([1 / 10, 8])
            .on("zoom", zoomed)
        )
        .on("mousemove", mouseMove);

      function dragsubject() {
        console.log("dragsubject start");
        var i,
          x = transform.invertX(d3.event.x),
          y = transform.invertY(d3.event.y),
          dx,
          dy;
        for (i = nodes.length - 1; i >= 0; --i) {
          let node = (node = nodes[i]);
          dx = x - node.x;
          dy = y - node.y;
          let lastX = node.x,
            lastY = node.y;
          if (dx * dx + dy * dy < radius * radius) {
            node.x = transform.applyX(node.x);
            node.y = transform.applyY(node.y);
            return node;
          }
        }

        console.log("dragsubject start +");
      }

      function dragstarted() {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d3.event.subject["lastFx"] = d3.event.subject.fx;
        d3.event.subject["lastFy"] = d3.event.subject.fy;
        d3.event.subject.fx = transform.invertX(d3.event.x);
        d3.event.subject.fy = transform.invertY(d3.event.y);
      }

      function dragged() {
        d3.event.subject.fx = transform.invertX(d3.event.x);
        d3.event.subject.fy = transform.invertY(d3.event.y);
      }

      function dragended() {
        if (!d3.event.active) simulation.alphaTarget(0);
        let currentNode = d3.event.subject;
        if (
          d3.event.subject.lastFx === d3.event.subject.fx &&
          d3.event.subject.lastFy === d3.event.subject.fy
        ) {
          setTimeout(function() {
            console.log(currentNode, "click");
            if (currentNode) {
              lockFlag = true;
              that.infoPanel.id = currentNode.id;
              that.infoPanel.title = currentNode.name;
              that.infoPanel.subType = currentNode.category.toUpperCase();
              that.infoPanel.color = color(currentNode.category);
              switch (currentNode.category.toUpperCase()) {
                case "MODEL":
                  that.infoPanel.class = "fa fa-globe fa-3x";
                  break;
                case "RESEARCHER":
                  that.infoPanel.class = "fa fa-user-circle-o fa-3x";
                  break;
                case "AGENCY":
                  that.infoPanel.class = "fa fa-institution fa-3x";
                  break;
                case "LOCATION":
                  that.infoPanel.class = "fa fa-map-marker fa-3x";
                  break;
              }
              that.infoPanel.connectedData = [];
              for (let i = 0; i < links.length; i++) {
                let link = links[i];
                if (link.source.id === currentNode.id) {
                  that.infoPanel.connectedData.push(link.target);
                } else if (link.target.id === currentNode.id) {
                  that.infoPanel.connectedData.push(link.source);
                }
              }
              $("#rightPanel")
                .css("transform", "translate(0,0)")
                .css("transition", "transform 0.5s ease-in-out");
              $("#rightPanel").scrollTop(0);
            }
          }, 200);
        }
        //d3.event.subject.fx = null;
        //d3.event.subject.fy = null;
      }

      simulation.nodes(nodes).on("tick", simulationUpdate);

      simulation.force("link").links(links);

      // simulation.on("end", settled);

      function settled() {
        nodes.forEach(function(d) {
          d.fx = d.x;
          d.fy = d.y;
        });
      }

      function simulationUpdate() {
        if (lockFlag) {
          return;
        }
        context.save();

        context.clearRect(0, 0, width, height);
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);

        // links.forEach(function(d) {
        //   context.beginPath();
        //   context.moveTo(d.source.x, d.source.y);
        //   context.lineTo(d.target.x, d.target.y);
        //   context.strokeStyle = color(d.type);
        //   context.stroke();
        // });
        for (let i = 0; i < links.length; i++) {
          let d = links[i];
          context.beginPath();
          context.moveTo(d.source.x, d.source.y);
          context.lineTo(d.target.x, d.target.y);
          if (
            connected.connectedLinks.length > 0 &&
            connected.connectedLinks.indexOf(d.index) < 0
          ) {
            context.strokeStyle = "rgba(0,0,0,0.1)"; //ColorToRgba(color(d.type), 0.1)
          } else {
            context.strokeStyle = color(d.label);
          }

          context.stroke();
        }

        // Draw the nodes
        // nodes.forEach(function(d, i) {
        //   context.beginPath();
        //   // context.arc(d.x, d.y, radius, 0, 3 * Math.PI, true);
        //   // context.moveTo(d.x , d.y);
        //   context.arc(d.x, d.y, radius, 0, 2 * Math.PI, true);
        //   context.fillStyle = color(d.category);
        //   context.fill();
        //   context.strokeStyle = "#fff";
        //   context.stroke();
        // });
        for (let i = 0; i < nodes.length; i++) {
          let d = nodes[i];
          // console.log(d)
          // let myvalue = d.value;
          context.beginPath();
          // console.log(myvalue);
          // context.arc(d.x, d.y, radius, 0, 3 * Math.PI, true);
          // // context.moveTo(d.x , d.y);
          // let norm = (myvalue-min)*4/(max-min);
          // if(norm<1){
          //   norm = 1;
          // }

          context.arc(d.x, d.y, d.radius, 0, 2 * Math.PI, true);
          if (
            connected.connectedNodes.length > 0 &&
            connected.connectedNodes.indexOf(d.id) < 0
          ) {
            context.fillStyle = "#e4e5e5";
          } else {
            context.fillStyle = color(d.category);
          }

          context.fill();
          context.strokeStyle = "#fff";
          context.stroke();
        }
        context.restore();
      }

      function mouseMove() {
        let point = d3.mouse(this);
        if (timeout) {
          clearTimeout(timeout);
        }

        if (selectedNode) {
          let dx = selectedNode.x * transform.k + transform.x - point[0];
          let dy = selectedNode.y * transform.k + transform.y - point[1];
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > radius * transform.k) {
            tooltip
              .transition()
              .duration(100)
              .style("opacity", 0);
            selectedNode = null;
            selectedLink = null;
            connected = { connectedNodes: [], connectedLinks: [] };
            simulationUpdate();
          }
        } else {
          tooltip
            .transition()
            .duration(100)
            .style("opacity", 0);
        }

        timeout = setTimeout(function() {
          let minDistance = Infinity;

          for (let i = 0; i < nodes.length; i++) {
            let d = nodes[i];
            let dx = d.x * transform.k + transform.x - point[0];
            let dy = d.y * transform.k + transform.y - point[1];
            let distance = Math.sqrt(dx * dx + dy * dy);
            // console.log(d,point,dx,dy,distance,transform)

            if (distance < minDistance && distance <= radius * transform.k) {
              minDistance = distance;
              selectedNode = d;
            }
          }

          if (selectedNode) {
            connected = getConnected(selectedNode);
            // console.log(connected);
            simulationUpdate();
            tooltip
              .transition()
              .duration(100)
              .style("opacity", 0.8);
            tooltip
              .html(
                "Name:" +
                  selectedNode.name +
                  "<p/>category:" +
                  selectedNode.category
              )
              .style(
                "left",
                selectedNode.x * transform.k +
                  transform.x +
                  radius * transform.k +
                  "px"
              )
              .style("top", selectedNode.y * transform.k + transform.y + "px");
          }
        }, 100);
      }

      function judgePointInLine(point, link) {
        let target = link.target;
        let source = link.source;
        point[0] = point[0] * transform.k - transform.x;
        point[1] = point[1] * transform.k - transform.y;
        if (
          (point[0] - target.x) * (target.y - source.y) ==
            (target.x - source.x) * (point[1] - target.y) &&
          (point[0] >= Math.min(target.x, source.x) &&
            point[0] <= Math.max(target.x, source.x)) &&
          (point[1] >= Math.min(target.y, source.y) &&
            point[1] <= Math.max(target.y, source.y))
        )
          return true;
        return false;
      }

      function ColorToRgba(hex, fade) {
        var rgb = []; // 定义rgb数组
        if (/^\#[0-9A-F]{3}$/i.test(hex)) {
          //判断传入是否为#三位十六进制数
          let sixHex = "#";
          hex.replace(/[0-9A-F]/gi, function(kw) {
            sixHex += kw + kw; //把三位16进制数转化为六位
          });
          hex = sixHex; //保存回hex
        }
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
          //判断传入是否为#六位十六进制数
          hex.replace(/[0-9A-F]{2}/gi, function(kw) {
            rgb.push(eval("0x" + kw)); //十六进制转化为十进制并存如数组
          });
          rgb.push(fade);
          return `rgba(${rgb.join(",")})`; //输出RGB格式颜色
        } else {
          console.log(`Input ${hex} is wrong!`);
          return "rgba(0,0,0,0.8)";
        }
      }

      function getConnected(node) {
        let connectedNodes = [node.id],
          connectedLinks = [];
        for (let i = 0; i < links.length; i++) {
          let link = links[i];
          if (link.source.id === node.id) {
            connectedNodes.push(link.target.id);
            connectedLinks.push(link.index);
          } else if (link.target.id === node.id) {
            connectedNodes.push(link.source.id);
            connectedLinks.push(link.index);
          }
        }

        return { connectedNodes, connectedLinks };
      }
    },
    handleInfoPanelPage(currentPage) {
      this.infoPanelCurrentPage = currentPage;
    },
    handleHistoryPanelActive(tab, info) {
      let tabName = tab.name;
      if (tabName === "history") {
        // this.historyGraphShow(info);
      } else {
        if (!tab.infoId || tab.infoId !== info.id) {
          this.countryGraphShow(info);
          tab.infoId = info.id;
        }
      }
    },
    historyPanelShow(info) {
      this.historyPanelActiveName = "history";
      this.historyPanelVisible = true;
      this.historyGraphShow(info);
    },
    async historyGraphShow(info) {
      this.historyPanelVisible = true;
      if (this.historyPanelInfo.historyGraph) {
        this.historyPanelInfo.historyGraph.dispose();
      }
      let that = this;
      switch (info.subType) {
        case "MODEL":
          let orderListPromise = new Promise(function(resolve, reject) {
            that.axios
              .get(
                "http://172.21.213.242:8080//Knowledge/GetOrderListByModelIdServlet",
                {
                  params: {
                    id: info.id
                  }
                }
              )
              .then(function(response) {
                if (response.status === 200) {
                  resolve(response.data);
                }
              });
          });
          let orderListData = await orderListPromise;
          that.historyPanelInfo.researcherOrder = orderListData.researcher;
          that.historyPanelInfo.agencyOrder = orderListData.agency;

          if (
            that.historyPanelInfo.researcherOrder.length > 0 ||
            that.historyPanelInfo.agencyOrder > 0
          ) {
            document.getElementById("historyGraph").style.width =
              "calc(100% - 260)!important";
          } else {
            document.getElementById("historyGraph").style.width =
              "100%!important";
          }
          break;
        default:
          that.historyPanelInfo.researcherOrder = [];
          that.historyPanelInfo.agencyOrder = [];
      }

      let min = this.yearRange.min * 1;
      let max = this.yearRange.max * 1;
      let xAxisData = [];
      let seriesData = [];
      for (let i = min; i <= max; i++) {
        let year = i + "";
        let data = await this.getUseCount(year, info.id, info.subType);
        if (i === min) {
          this.historyPanelInfo.historyGraph = this.$echarts.init(
            document.getElementById("historyGraph")
          );
          this.historyPanelInfo.historyGraph.showLoading();
        }
        xAxisData.push(year);
        seriesData.push(data.count);
      }

      let option = {
        title: {
          text: info.title,
          subtext: "count by year",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#ccc",
              borderColor: "#aaa",
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              textStyle: {
                color: "#222"
              }
            }
          },
          formatter: function(params) {
            return params[0].name + "<br />" + params[0].value;
          }
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "1%",
          top: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: xAxisData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: seriesData,
            type: "line",
            smooth: true
          }
        ]
      };

      // setTimeout(function() {
      //   that.historyPanelInfo.historyGraph = that.$echarts.init(
      //     document.getElementById("historyGraph")
      //   );
      //   that.historyPanelInfo.historyGraph.showLoading();
      //   that.historyPanelInfo.historyGraph.hideLoading();
      //   that.historyPanelInfo.historyGraph.setOption(option);
      // }, 500);

      this.historyPanelInfo.historyGraph.hideLoading();
      this.historyPanelInfo.historyGraph.setOption(option);
    },
    getUseCount(year, id, category) {
      let that = this;
      let promise = new Promise(function(resolve, reject) {
        that.axios
          .get(
            "http://172.21.213.242:8080//Knowledge/GetUseCountByYearAndIdServlet",
            {
              params: { year: year, id: id, category: category }
            }
          )
          .then(function(response) {
            if (response.status === 200) {
              resolve(response.data);
            }
          });
      });
      return promise;
    },
    async countryGraphShow(info) {
      this.$echarts.registerMap("world", worldData);
      let countryFeatures = worldData.features;
      let countries = [];
      for (let feature of countryFeatures) {
        let name = feature.properties.name;
        if (countries.indexOf(name) < 0) {
          countries.push(name);
        }
      }

      if (this.historyPanelInfo.countryGraph) {
        this.historyPanelInfo.countryGraph.dispose();
      }
      let min = this.yearRange.min * 1;
      let max = this.yearRange.max * 1;

      let timeLineData = [],
        allYearData = [];
      for (let i = min; i <= max; i++) {
        let data = await this.getUseCountry(i, info.id, info.subType);
        if (i === min) {
          this.historyPanelInfo.countryGraph = this.$echarts.init(
            document.getElementById("countryGraph")
          );
          this.historyPanelInfo.countryGraph.showLoading();
        }

        if (Object.keys(data).length > 0) {
          let countryValue = [];
          let max = 0;
          for (let j = 0; j < countries.length; j++) {
            let country = countries[j];
            // if(country==="United States of America"){
            //   country = "United States"
            // }
            let obj = { name: country, value: 0 };
            if (data[country]) {
              if (data[country] > max) {
                max = data[country];
              }
              obj = { name: country, value: data[country] };
            }
            countryValue.push(obj);
          }
          timeLineData.push({
            value: i + "",
            tooltip: {
              formatter: function(params) {
                return params.name;
              }
            },
            // symbol: "diamond",
            symbolSize: 18
          });
          let currentYearOption = {
            title: { text: i + " " + info.title },
            visualMap: {
              left: "right",
              min: 0,
              max: max,
              inRange: {
                color: ["lightskyblue", "yellow", "orangered"]
              },
              text: ["High", "Low"], // 文本，默认为数值文本
              calculable: true
            },
            series: [
              {
                name: "world",
                type: "map",
                roam: true,
                map: "world",
                itemStyle: {
                  emphasis: { label: { show: true } }
                },
                // 文本位置修正
                textFixed: {
                  Alaska: [20, -20]
                },
                data: countryValue
              }
            ]
          };
          allYearData.push(currentYearOption);
        }
      }

      let option = {
        baseOption: {
          title: {
            subtext: "count by year",
            left: "center"
          },
          timeline: {
            axisType: "category",
            autoPlay: true,
            playInterval: 2000,
            data: timeLineData
          },
          tooltip: {
            trigger: "item",
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function(params) {
              var value = (params.value + "").split(".");
              value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,");
              return params.seriesName + "<br/>" + params.name + ": " + value;
            }
          }
        },
        options: allYearData
      };

      this.historyPanelInfo.countryGraph.hideLoading();
      this.historyPanelInfo.countryGraph.setOption(option);
    },
    getUseCountry(year, id, category) {
      let that = this;
      let promise = new Promise(function(resolve, reject) {
        that.axios
          .get(
            "http://172.21.213.242:8080//Knowledge/GetUseCountryCountByYearAndIdServlet",
            {
              params: { year: year, id: id, category: category }
            }
          )
          .then(function(response) {
            if (response.status === 200) {
              resolve(response.data);
            }
          });
      });
      return promise;
    },
    scenePanelShow(info) {
      this.scenePanelTitle = "Scenes of " + info.title;
      this.scenePanelVisible = true;
      if (this.scenePanelInfo.currentId !== info.id) {
        this.scenePanelInfo.page = 1;
        this.scenePanelInfo.scenePanelData = [];
        this.scenePanelInfo.count = 0;
        this.sceneTimeLineShow(info);
      }
    },
    sceneTimeLineShow(info) {
      let that = this;
      let loadingInstance = Loading.service({
        fullscreen: true,
        target: document.querySelector(".scenePanel")
      });
      this.axios
        .get(
          "http://172.21.213.33:8080//Knowledge/GetSceneByTypeAndIdServlet",
          {
            params: {
              type: info.subType,
              id: info.id,
              page: this.scenePanelInfo.page
            }
          }
        )
        .then(function(response) {
          if (response.status === 200) {
            loadingInstance.close();
            that.scenePanelInfo.currentId = info.id;
            that.scenePanelInfo.count = response.data.count;
            that.scenePanelInfo.scenePanelData = that.scenePanelInfo.scenePanelData.concat(
              response.data.scene
            );
            if (that.scenePanelInfo.scenePanelData.length === 0) {
              that.$message({
                showClose: true,
                message: "No Scene Data",
                type: "error"
              });
            }
          }
        });
    },
    handleTimeLinePage() {
      this.scenePanelInfo.page = this.scenePanelInfo.page + 1;
      this.sceneTimeLineShow(this.infoPanel);
    },
    handleCheckedLegendChange: _debounce(function(value) {
      console.log(value);
      this.check2EditGraphInfo(value);
    }, 500),
    check2EditGraphInfo(checkedList) {
      let currentNodes = [],
        currentLinks = [];
      let nodes = this.knowledgeGraphInfo.nodes;
      let links = this.knowledgeGraphInfo.links;
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let category = node.category;
        if (checkedList.indexOf(category) >= 0) {
          currentNodes.push(node);
        }
      }

      for (let i = 0; i < links.length; i++) {
        let link = links[i];
        let type = link.type;
        let targetCategory = link.target.category;
        let sourceCategory = link.source.category;

        if (
          checkedList.indexOf(type) >= 0 &&
          checkedList.indexOf(targetCategory) >= 0 &&
          checkedList.indexOf(sourceCategory) >= 0
        ) {
          console.log(type, targetCategory, sourceCategory);
          currentLinks.push(link);
        }
      }
      this.createKnowlegedGraph4YearD3(currentNodes, currentLinks);
    },
    statusPanelShow(id, category) {
      let url = "/status/" + category.toLowerCase() + "/" + id;
      window.open(url);
    }
  }
};
</script>
<style scoped>
.content-box {
  position: relative;
  overflow: hidden;
}
.toolPanel {
  position: absolute;
  width: 300px;
  /* background: #f9fafc; */
  background: transparent;
  left: 20px;
  top: 20px;
  padding: 10px;
  font-size: 14px;
  border: 1px dashed #999;
}
.toolPanel > div {
  margin-bottom: 10px;
}

#loadingModelGraph {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  /* background: rgba(0, 0, 0, 0.3); */
  background: transparent;
  padding-top: 10px;
  border-top: 1px solid #ffffff;
  z-index: 899;
  transition: height 2.5s;
}

#d3Svg {
  width: 100%;
}

#d3Canvas {
  width: 100%;
  background: #333333;
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
.load-box {
  position: absolute;
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -100px;
  z-index: 999;
}

.loader {
  width: 30px;
  height: 30px;
  border: 15px solid transparent;
  border-left-color: #98df89;
  border-right-color: #98df89;
  border-radius: 50%;
  margin: 0 auto;
  -webkit-animation: 1.5s loader linear infinite;
  animation: 1.5s loader linear infinite;
}
@-webkit-keyframes loader {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes loader {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.viewExtend > p > a {
  color: deepskyblue;
  cursor: pointer;
}

.legendPanel {
  position: absolute;
  top: 160px;
  left: 20px;
  width: 150px;
  padding: 10px;
  font-size: 14px;
  border: 1px dashed #999;
  /* background: #f9fafc; */
  background: transparent;
  z-index: 901;
  color: #999;
}

.legendPanel .legend {
  list-style: none;
  text-align: left;
}

.legendPanel .legend > li {
  padding: 5px 0;
  margin-left: -10px;
}
.historyPanel {
  display: flex;
  width: 100%;
  height: 100%;
}
#historyGraph,
#countryGraph {
  width: 100%;
  height: 100%;
}
.orderPanel {
  width: 260px;
  align-self: flex-end;
}
.orderPanel > ul {
  list-style: none;
}

.orderPanel > ul > li {
  font-size: 16px;
  margin-bottom: 5px;
  border-bottom: 1px solid #aaaaaa;
  padding: 5px;
  text-align: left;
}

.orderPanel li span {
  background: #0a628f;
  color: #ffffff;
  font-size: 13px;
  padding: 1px;
}
.loadingModelGraphShow {
  position: absolute;
  bottom: 10px;
  right: 75px;
  z-index: 799;
}
</style>
<style>
.el-tag {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.links {
  stroke: #c1c1c1;
  stroke-width: 2px;
  pointer-events: all;
}

.node circle {
  pointer-events: all;
  stroke: #777;
  stroke-width: 1px;
}

div.tooltip {
  position: absolute;
  background-color: white;
  text-align: left;
  max-width: 300px;
  height: auto;
  padding: 1px;
  border-style: solid;
  border-radius: 4px;
  border-width: 1px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}
#rightPanel .closePanel > a {
  cursor: pointer;
  color: #444;
}
#rightPanel .closePanel > a:hover {
  color: #409eff;
}
.el-select .el-input {
  width: 60px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
#loadingModelGraph > .el-icon-caret-bottom {
  position: absolute;
  top: 10px;
  right: 100px;
  color: #fff;
}
#loadingModelGraph > .el-icon-caret-bottom:hover {
  cursor: pointer;
  color: #409eff;
}
</style>
