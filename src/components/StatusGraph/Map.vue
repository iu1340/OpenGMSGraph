<!-- Map -->
<template>
  <div class="main">
    <div class="button-group">
      <el-button
        type="primary"
        :plain="mapActive!=='d3'"
        @click="mapActiveHandle('d3')"
      >3D Map</el-button>
      <el-button
        type="primary"
        :plain="mapActive!=='leaflet'"
        @click="mapActiveHandle('leaflet')"
      >2D Map</el-button>
    </div>
    <div
      id="d3-content"
      v-show="mapActive==='d3'"
    >
      <canvas id="content"></canvas>
    </div>
    <div
      id="vue-leaflet"
      v-show="mapActive==='leaflet'"
    >
    </div>
  </div>
</template>

<script>
var GJV = require("geojson-validation");
import { Loading } from "element-ui";
import * as d3 from "d3v4";
// import worldData from "@/assets/world.json";
import landGeojson from "@/assets/ne_json/ne_50m_admin_0_countries.json";
// import lakesGeojson from "@/assets/ne_json/ne_10m_lakes.json";
// import playasGeojson from "@/assets/ne_json/ne_10m_playas.json";
// import portsGeojson from "@/assets/ne_json/ne_10m_ports.json";
// import riversGeojson from "@/assets/ne_json/ne_10m_rivers_lake_centerlines.json";

import "leaflet/dist/leaflet.css";
import { L } from "vue2-leaflet";

import versor from "versor";

export default {
  name: "map-graph",
  props: ["type", "id"],
  data() {
    return {
      mapActive: "d3",
      locationOfModel: [],
      locationGeojson: [],
      kclass: [],
      map: null,
      zoom: 2,
      center: L.latLng(0, 0),
      // color: [ "#6DCE9E", "#60B58B","#FF7F24","#FF4500" ]
      color: [ "#60B58B", "#FF7F24","#FF4500","#FF4500" ]
    };
  },

  components: {
    L
  },

  computed: {},

  mounted: function() {
    this.getLocationInfo();
  },

  methods: {
    getLocationInfo() {
      let loadingInstance = Loading.service({
        target: document.querySelector(".main"),
        spinner: "el-icon-loading"
      });
      let that = this;
      this.axios
        .get(
          "http://172.21.213.242:8080//Knowledge/GetGeoJsonOfModelIdServlet",
          {
            params: {
              id: this.id
            }
          }
        )
        .then(function(response) {
          if (response.status === 200) {
            that.locationOfModel = response.data;
            if (that.locationOfModel.length > 0) {
              let countArray = that.locationOfModel.map(function(item) {
                return item.count;
              });
              let classNum = 5;
              if (countArray.length < 5) {
                classNum = countArray.length;
              }
              that.kclass = that.getJenksBreaks(countArray, classNum);
              let promises = [];
              for (let obj of that.locationOfModel) {
                let promise = that.getLocationGeojson(obj.id);
                promises.push(promise);
              }

              Promise.all(promises).then(result => {
                loadingInstance.close();
                that.locationGeojson = result;
                if (that.mapActive === "d3") {
                  that.$nextTick(function() {
                    if (that.map) {
                      that.map.remove();
                      that.map = null;
                    }
                    that.createD3Map();
                  });
                } else {
                  that.$nextTick(function() {
                    if (that.map) {
                      that.map.remove();
                      that.map = null;
                    }
                    that.createLeafletMap();
                  });
                }
              });
            } else {
              that.$message.error("没有结果");
            }
          } else {
            that.$message.error("没有结果");
          }
        });
    },
    createLeafletMap() {
      let that = this;
      this.map = L.map("vue-leaflet").setView([0, 0], 2);
      // L.tileLayer(this.url).addTo(this.map);
      // L.tileLayer(
      //   "http://t{s}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}",
      //   {
      //     subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"]
      //   }
      // ).addTo(this.map);
      L.geoJSON(landGeojson, {
        style: {
          color: "#999",
          weight: 0.3
        }
      }).addTo(this.map);
      var geojsonMarkerOptions = {
        radius: 2,
        fillColor: "#66b1ff",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      // console.log(JSON.stringify(this.locationGeojson))
      console.log(JSON.stringify(this.locationOfModel))
      for (let obj of this.locationGeojson) {
        if (GJV.valid(obj.geojson)) {
          let weight = 0.3;
          let currentColor = that.color[0];
          for (let i = 0; i < this.locationOfModel.length; i++) {
            let location = this.locationOfModel[i];
            if (location.id === obj.id) {
              let weight = this.getWeight(location.count);

              currentColor = that.color[weight-3];
              weight = weight / 10;
              break;
            }
          }
          L.geoJSON(obj.geojson, {
            style: {
              color: currentColor,
              weight: weight
            },
            pointToLayer: function(feature, latlng) {
              geojsonMarkerOptions.radius = weight * 10;
              geojsonMarkerOptions.fillColor = currentColor;
              return L.circleMarker(latlng, geojsonMarkerOptions);
            }
          }).addTo(this.map).bindPopup(obj.name);
        }
      }
    },
    createD3Map() {
      var that = this;
      var width = $("#d3-content").width();
      var height = $("#d3-content").height();
      var size = d3.min([width, height]);

      var rotationDelay = 3000;
      var angles = { x: -20, y: 40, z: 0 };
      var v0; // Mouse position in Cartesian coordinates at start of drag gesture.
      var r0; // Projection rotation as Euler angles at start.
      var q0; // Projection rotation as versor at start.

      var context = document.getElementById("content").getContext("2d");

      d3.select("#content")
        .attr("width", width + "px")
        .attr("height", height + "px")
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
          // .on("end", dragended)
        );

      var projection = d3
        .geoOrthographic()
        .scale(0.45 * size)
        .translate([0.5 * width, 0.5 * height]);

      var geoGenerator = d3
        .geoPath()
        .projection(projection)
        .context(context)
        .pointRadius(0.1);

      function drawFeatures(features, fill) {
        context.beginPath();
        geoGenerator({ type: "FeatureCollection", features: features });
        if (fill) {
          context.fill();
        }
        context.stroke();
      }

      function drawLocationGeoJson(obj, fill) {
        if (GJV.valid(obj.geojson)) {
          context.beginPath();
          let currentColor = that.color[0];
          for (let i = 0; i < that.locationOfModel.length; i++) {
            let location = that.locationOfModel[i];
            if (location.id === obj.id) {
              let weight = that.getWeight(location.count);
              currentColor = that.color[weight-3];
              context.lineWidth = weight / 10;
              break;
            }
          }
          context.strokeStyle = currentColor;
          context.fillStyle = currentColor;

          // console.log(obj);
          geoGenerator({
            type: "FeatureCollection",
            features: [{ type: "Feature", geometry: obj.geojson }]
          });

          context.stroke();
          // if (obj.geojson.type==="Polygon") {
          //   context.fill();
          // }
        }
      }

      function update(r) {
        context.clearRect(0, 0, width, height);

        projection.rotate(r);

        context.lineWidth = 0.3;
        context.strokeStyle = "#999";
        context.fillStyle = "#d0d0d0";
        drawFeatures(landGeojson.features, true);

        for (let obj of that.locationGeojson) {
          drawLocationGeoJson(obj, false);
          context.strokeStyle = "#999";
          context.fillStyle = "#d0d0d0";
        }
      }

      function dragstarted() {
        timer.stop();
        v0 = versor.cartesian(projection.invert(d3.mouse(this)));
        r0 = projection.rotate();
        q0 = versor(r0);
        // stopRotation();
      }

      function dragged() {
        var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)));
        var q1 = versor.multiply(q0, versor.delta(v0, v1));
        var r1 = versor.rotation(q1);
        // projection.rotate(r1);
        update(r1);
      }

      function dragended() {
        time = new Date();
        setTimeout(
          timer.restart(function() {
            var dt = Date.now() - time;
            let r1 = -dt / 1000 - 40;
            update([r1]);
          }),
          1500
        );
      }

      function setAngles() {
        var rotation = projection.rotate();
        rotation[0] = angles.y;
        rotation[1] = angles.x;
        rotation[2] = angles.z;
        update([-40]);
      }

      var time = Date.now();
      var timer = d3.timer(function() {
        var dt = Date.now() - time;
        let r1 = -dt / 1000 - 40;
        update([r1]);
      });

      setAngles();
    },
    getLocationGeojson(id) {
      let that = this;
      let promise = new Promise(function(resolve, reject) {
        that.axios
          .get("http://172.21.213.242:8080//Knowledge/GetLocationByIdServlet", {
            params: {
              id: id
            }
          })
          .then(function(response) {
            if (response.status === 200) {
              let data = response.data;
              resolve(data);
            }
          });
      });
      return promise;
    },
    getJenksBreaks(data, numclass) {
      function sortNumber(a, b) {
        //在javascript里，Array的sort方法，必须用这个函数，否则不是按数字大小排序
        return a - b;
      }
      // int numclass;
      var numdata = data.length;
      if (numdata <= 0) {
        return [];
      }
      data.sort(sortNumber); //先排序

      var mat1 = new Array();
      var mat2 = new Array();
      var st = new Array();

      for (var j = 0; j <= numdata; j++) {
        mat1[j] = new Array();
        mat2[j] = new Array();
        st[j] = 0;
        for (var i = 0; i <= numclass; i++) {
          mat1[j][i] = 0;
          mat2[j][i] = 0;
        }
      }

      for (var i = 1; i <= numclass; i++) {
        mat1[1][i] = 1;
        mat2[1][i] = 0;
        for (var j = 2; j <= numdata; j++) {
          mat2[j][i] = Number.MAX_VALUE;
        }
      }
      var v = 0;

      for (var l = 2; l <= numdata; l++) {
        var s1 = 0;
        var s2 = 0;
        var w = 0;
        var i3 = 0;
        for (var m = 1; m <= l; m++) {
          i3 = l - m + 1;

          var val = parseInt(data[i3 - 1]);

          s2 += val * val;
          s1 += val;

          w++;
          v = s2 - (s1 * s1) / w;
          var i4 = i3 - 1;
          if (i4 != 0) {
            for (var j = 2; j <= numclass; j++) {
              if (mat2[l][j] >= v + mat2[i4][j - 1]) {
                mat1[l][j] = i3;
                mat2[l][j] = v + mat2[i4][j - 1];

                if (l == 200 && j == 5)
                  console.log(
                    "l=" +
                      200 +
                      ",j=" +
                      5 +
                      ";mat2[200][5]=" +
                      mat1[l][j] +
                      "i3=" +
                      i3
                  );
              }
            }
          }
        }

        mat1[l][1] = 1;
        mat2[l][1] = v;
      }

      var k = numdata;
      var kclass = new Array();

      /* int[] kclass = new int[numclass]; */
      kclass[numclass - 1] = parseInt(data[data.length - 1]);
      /* kclass[numclass - 1] = (Integer) data.get(data.size() - 1); */

      for (var j = numclass; j >= 2; j--) {
        var id = parseInt(mat1[k][j]) - 2;
        kclass[j - 2] = parseInt(data[id]);
        k = parseInt(mat1[k][j] - 1);
      }

      return kclass;
    },
    getWeight(count) {
      let len = this.kclass.length;
      if (len === 1) {
        return 3;
      } else {
        for (let i = 1; i < len; i++) {
          if (count <= this.kclass[i]) {
            return 3 + (i - 1) * 1;
          }
        }
      }
    },
    mapActiveHandle(active) {
      this.mapActive = active;
      let that = this;
      if (this.mapActive === "d3") {
        that.$nextTick(function() {
          if (that.map) {
            that.map.remove();
            that.map = null;
          }
          that.createD3Map();
        });
      } else {
        that.$nextTick(function() {
          if (that.map) {
            that.map.remove();
            that.map = null;
          }
          that.createLeafletMap();
        });
      }
    }
  }
};
</script>
<style scoped>
.main {
  height: 100%;
  width: 100%;
  position: relative;
}
#d3-content,
#vue-leaflet {
  height: 100%;
  width: 100%;
  position: relative;
  background: #ffffff
}
.button-group {
  position: absolute;
  top: 12px;
  left: 50px;
  z-index: 998;
}
</style>
<style>
.el-icon-loading {
  font-size: 30px;
}
.leaflet-control-container {
  display: none;
}
</style>
