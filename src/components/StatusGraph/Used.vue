<!--  -->
<template>
  <div class="main">
    <div class="button-group">
      <el-button
        type="primary"
        :plain="graphActive!='history'"
        @click="handleBtn('history')"
      >研究趋势</el-button>
      <el-button
        type="primary"
        :plain="graphActive!='country'"
        @click="handleBtn('country')"
        v-if="type==='model'"
      >研究国家</el-button>
    </div>
    <div
      class="historyPanel"
      v-show="graphActive==='history'"
    >
      <div id="historyGraph"></div>
      <div
        class="orderPanel"
        v-if="researcherOrder.length > 0||agencyOrder > 0"
      >
        <h5>Researcher Order</h5>
        <ul>
          <li
            v-for="item of researcherOrder"
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
            v-for="item of agencyOrder"
            :key="item.id"
            :id="item.id"
          >
            <i class='fa fa-institution fa-fw'></i>
            {{item.name}}
          </li>
        </ul>
      </div>
    </div>

    <div
      id="countryGraph"
      v-show="graphActive==='country'"
    ></div>
  </div>
</template>

<script>
import worldData from "@/assets/world.json";
export default {
  name: "used-graph",
  props: ["type", "id"],
  data() {
    return {
      graphActive: "history",
      historyGraph: null,
      researcherOrder: [],
      agencyOrder: [],
      countryGraph: null,
      countryOder: [],
      yearRange: { min: 1900, max: 1900 }
    };
  },

  components: {},

  computed: {},

  mounted: function() {
    const that = this;
    let getYearRangeAxios = this.getYearRange();
    getYearRangeAxios.then(function(response) {
      if (response.status === 200) {
        that.yearRange = response.data;
        that.historyGraphShow();
      } else {
        alert("year range get error");
      }
    });
  },

  methods: {
    getYearRange() {
      var getYearRangeAxios = this.axios.get(
        "http://172.21.213.190:8080/Knowledge/GetGraphTimeRangeServlet"
      );
      return getYearRangeAxios;
    },
    handleBtn(active) {
      let that = this;
      this.graphActive = active;
      this.$nextTick(function() {
        if (that.graphActive === "history") {
          that.historyGraphShow();
        } else {
          that.countryGraphShow();
        }
      });
    },
    async historyGraphShow() {
      if (this.historyGraph) {
        this.historyGraph.dispose();
      }
      let that = this;
      switch (this.type) {
        case "model":
          let orderListPromise = new Promise(function(resolve, reject) {
            that.axios
              .get(
                "http://172.21.213.190:8080/Knowledge/GetOrderListByModelIdServlet",
                {
                  params: {
                    id: that.id
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
          that.researcherOrder = orderListData.researcher;
          that.agencyOrder = orderListData.agency;

          if (that.researcherOrder.length > 0 || that.agencyOrder > 0) {
            document.getElementById("historyGraph").style.width =
              "calc(100% - 260)!important";
          } else {
            document.getElementById("historyGraph").style.width =
              "100%!important";
          }
          break;
        default:
          that.researcherOrder = [];
          that.agencyOrder = [];
      }

      let min = this.yearRange.min * 1;
      let max = this.yearRange.max * 1;
      let xAxisData = [];
      let seriesData = [];
      for (let i = min; i <= max; i++) {
        let year = i + "";
        let data = await this.getUseCount(year, that.id, that.type);
        if (i === min) {
          this.historyGraph = this.$echarts.init(
            document.getElementById("historyGraph")
          );
          this.historyGraph.showLoading();
        }
        xAxisData.push(year);
        seriesData.push(data.count);
      }

      let option = {
        title: {
          text: "count by year",
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
          top: "60",
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
      //   that.historyGraph = that.$echarts.init(
      //     document.getElementById("historyGraph")
      //   );
      //   that.historyGraph.showLoading();
      //   that.historyGraph.hideLoading();
      //   that.historyGraph.setOption(option);
      // }, 500);

      this.historyGraph.hideLoading();
      this.historyGraph.setOption(option);
    },
    getUseCount(year, id, category) {
      let that = this;
      let promise = new Promise(function(resolve, reject) {
        that.axios
          .get(
            "http://172.21.213.190:8080/Knowledge/GetUseCountByYearAndIdServlet",
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
    async countryGraphShow() {
      this.$echarts.registerMap("world", worldData);
      let countryFeatures = worldData.features;
      let countries = [];
      for (let feature of countryFeatures) {
        let name = feature.properties.name;
        if (countries.indexOf(name) < 0) {
          countries.push(name);
        }
      }

      if (this.countryGraph) {
        this.countryGraph.dispose();
      }
      let min = this.yearRange.min * 1;
      let max = this.yearRange.max * 1;

      let timeLineData = [],
        allYearData = [];
      let promises = [];
      for (let i = min; i <= max; i++) {
        promises.push(this.getUseCountry(i, this.id, this.type));
      }
      this.countryGraph = this.$echarts.init(
        document.getElementById("countryGraph")
      );
      this.countryGraph.showLoading();
      Promise.all(promises).then(result => {
        let max = 0;
        for (let i = 0; i < result.length; i++) {
          let data = result[i];
          if (Object.keys(data).length > 0) {
            for (let key in data) {
              if (data[key] > max) {
                max = data[key];
              }
            }
          }
        }
        for (let i = 0; i < result.length; i++) {
          let data = result[i];
          if (Object.keys(data).length > 0) {
            let countryValue = [];
            for (let j = 0; j < countries.length; j++) {
              let country = countries[j];
              // if(country==="United States of America"){
              //   country = "United States"
              // }
              let obj = { name: country, value: 0 };
              if (data[country]) {
                obj = { name: country, value: data[country] };
              }
              countryValue.push(obj);
            }
            timeLineData.push({
              value: i + "",
              tooltip: {
                formatter: function(params) {
                  console.log(params)
                  return params.name;
                }
              },
              // symbol: "diamond",
              symbolSize: 18
            });
            let currentYearOption = {
              visualMap: {
                left: "right",
                min: 0,
                max: max,
                inRange: {
                  color: ["#eeeeee","#50a3ba", "#eac736", "#d94e5d"]
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
                value = value[0].replace(
                  /(\d{1,3})(?=(?:\d{3})+(?!\d))/g,
                  "$1,"
                );
                return params.seriesName + "<br/>" + params.name + ": " + value;
              }
            }
          },
          options: allYearData
        };

        this.countryGraph.hideLoading();
        this.countryGraph.setOption(option);
      });
    },
    getUseCountry(year, id, category) {
      let that = this;
      let promise = new Promise(function(resolve, reject) {
        that.axios
          .get(
            "http://172.21.213.190:8080/Knowledge/GetUseCountryCountByYearAndIdServlet",
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
    }
  }
};
</script>
<style scoped>
.main {
  position: relative;
  height: 100%;
}

.main .button-group {
  position: absolute;
  top: 0;
  left: 20px;
  z-index: 998;
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
</style>