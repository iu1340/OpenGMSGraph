<!-- Relation -->
<template>
  <div class="main">
    <template v-if="type==='agency'">
      <div class="button-group">
        <el-button
          type="primary"
          :plain="graphActive!='cooperation'"
          @click="handleBtn('cooperation')"
        >Cooperative Organization</el-button>
        <el-button
          type="primary"
          :plain="graphActive!='subjection'"
          @click="handleBtn('subjection')"
        >Research Members</el-button>
      </div>
    </template>

    <template v-if="type==='researcher'">
      <div class="button-group">
        <el-button
          type="primary"
          :plain="graphActive!='cooperation'"
          @click="handleBtn('cooperation')"
        >Cooperative Researcher</el-button>
      </div>
    </template>

    <div id="d3Relation"></div>
  </div>
</template>

<script>
import * as d3 from "d3v4";
import { _debounce, _throttle } from "@/assets/debounceAndthrottle";
export default {
  name: "relation",
  props: ["type", "id"],
  data() {
    return {
      graphActive: "cooperation",
      graphData: {},
      kclass: [],
      color: [ "#6DCE9E", "#60B58B","#FF7F24","#D90404", "#8C0303", ]
    };
  },

  components: {},

  computed: {},

  mounted: function() {
    switch (this.type) {
      case "agency":
        if (this.graphActive === "cooperation") {
          this.getAgencyCooperation();
        } else {
          this.getAgencyResearcher();
        }
        break;
      case "researcher":
        if (this.graphActive === "cooperation") {
          this.getResearcherCooperation();
        }
        break;
    }
  },

  methods: {
    handleBtn(active) {
      this.graphActive = active;
      switch (this.type) {
        case "agency":
          if (this.graphActive === "cooperation") {
            this.getAgencyCooperation();
          } else {
            this.getAgencyResearcher();
          }
          break;
        case "researcher":
          if (this.graphActive === "cooperation") {
            this.getAgencyCooperation();
          } else {
            this.getAgencyResearcher();
          }
          break;
      }
    },
    createGraph() {
      let that = this;
      let graph = this.graphData;

      if (!graph.nodes) {
        return false;
      }
      
      let countArray = graph.links.map(function(item) {
        if(item.source===that.id||item.target===that.id){
          return item.value;
        }else{
          return 1;
        }        
      });
      let classNum = 4;
      if (countArray.length < 4) {
        classNum = countArray.length;
      }

      this.kclass = this.getJenksBreaks(countArray, classNum);
      // console.log(countArray,this.kclass);

      $("#d3Relation").empty();
      $(".tooltip").remove();

      let tooltip = d3
        .select("#d3Relation")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      let height = $("#d3Relation").height();
      let width = $("#d3Relation").width();
      let svg = d3
        .select("#d3Relation")
        .append("svg:svg")
        .attr("width", width + "px")
        .attr("height", height + "px");

      var g = svg.append("g").attr("class", "everything");

      var color = d3.scaleOrdinal(d3.schemeCategory20);

      for (var i = 0; i < graph.nodes.length; i++) {
        let nd = graph.nodes[i];
        // let names = nd.name.split(" ");
        // // console.log(names);
        // let width = 0,
        //   height = 12 * names.length;
        // for (let name of names) {
        //   let w = name.length * 2;
        //   if (w > width) {
        //     width = w;
        //   }
        // }

        // let r = width > height ? width / 2 : height / 2;
        // nd.r = r;
        // nd.rx = nd.name.length * 4.5;
        nd.rx = 45;
        nd.ry = 16;
      }

      // var simulation = d3
      //   .forceSimulation()
      //   .force(
      //     "link",
      //     d3.forceLink().id(function(d) {
      //       return d.id;
      //     })
      //   )
      //   .force("collide", d3.ellipseForce(6, 0.5, 5))
      //   .force("center", d3.forceCenter(width / 2, height / 2));
      let force = -3000;
      if(graph.links.length*5>3000){
        force = -(graph.links.length)
      }
      let simulation = d3
        .forceSimulation()
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("charge", d3.forceManyBody().strength(force*3))
        .force(
          "link",
          d3
            .forceLink()
            .strength(0.5)
            .distance(40)
            .id(function(d) {
              return d.id;
            })
            
        );

      var link = g
        .append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", function(d) {
          let weight = that.getWeight(d.value);
          return Math.sqrt(weight);
        })
        .style("stroke", function(d) {
          let weight = that.getWeight(d.value);
          let index = weight / 3;
          return that.color[index];
        });

      var node = g
        .append("g")
        .attr("class", "node")
        .selectAll("ellipse")
        .data(graph.nodes)
        .enter()
        .append("ellipse")
        .attr("rx", function(d) {
          return 45;
        })
        .attr("ry", function(d) {
          return 16;
        })
        .attr("fill", function(d) {
          if (d.id === that.id) {
            return "#8C0303";
          } else {
            let weight = that.getWeight(d.value);
            // console.log(weight);
            let index = weight / 3;
            return that.color[index];
          }
        })
        .on("mouseover", function(d) {
          if (d.id !== that.id) {
            tooltip
              .html(" name: " + d.name + "<br/>" + " count: " + d.value)
              .style("left", d3.event.layerX + "px")
              .style("top", d3.event.layerY + 20 + "px")
              .style("opacity", 1.0);
          } else {
            tooltip
              .html(" name: " + d.name)
              .style("left", d3.event.layerX + "px")
              .style("top", d3.event.layerY + 20 + "px")
              .style("opacity", 1.0);
          }
        })
        .on("mouseout", function(d) {
          tooltip.style("opacity", 0.0);
        })
        .each(function(d) {
          d.node = this;
        })
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      var zoom_handler = d3.zoom().on("zoom", zoom_actions);

      zoom_handler(svg);

      var text = g
        .append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter()
        .append("text")
        .attr("dy", 2)
        .attr("text-anchor", "middle")
        .on("mouseover", function(d) {
          if (d.id !== that.id) {
            tooltip
              .html(" name: " + d.name + "<br/>" + " count: " + d.value)
              .style("left", d3.event.layerX + "px")
              .style("top", d3.event.layerY + 20 + "px")
              .style("opacity", 1.0);
          } else {
            tooltip
              .html(" name: " + d.name)
              .style("left", d3.event.layerX + "px")
              .style("top", d3.event.layerY + 20 + "px")
              .style("opacity", 1.0);
          }
        })
        .on("mouseout", function(d) {
          tooltip.style("opacity", 0.0);
        })
        .text(function(d) {
          let names = d.name.split(" ");
          let nameStr = "";
          for (let name of names) {
            let c = name.charAt(0);
            if (c >= "A" && c <= "Z") {
              nameStr += c + " ";
            }
          }
          nameStr = nameStr.trim();
          if (nameStr.length > 7) {
            nameStr = nameStr.substring(0, 7) + "...";
          }
          return nameStr.trim();
        })
        .attr("title", function(d) {
          return d.name;
        })
        .attr("fill", "white");

      simulation.nodes(graph.nodes).on("tick", ticked);

      simulation.force("link").links(graph.links);

      function ticked() {
        link
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });

        node
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });
        text
          .attr("x", function(d) {
            return d.x;
          })
          .attr("y", function(d) {
            return d.y;
          });
      }

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      function zoom_actions() {
        g.attr("transform", d3.event.transform);
      }
    },
    draw_curve(Ax, Ay, Bx, By, M, context) {
      var dx = Bx - Ax,
        dy = By - Ay,
        dr = Math.sqrt(dx * dx + dy * dy);

      // side is either 1 or -1 depending on which side you want the curve to be on.
      // Find midpoint J
      var Jx = Ax + (Bx - Ax) / 2;
      var Jy = Ay + (By - Ay) / 2;

      // We need a and b to find theta, and we need to know the sign of each to make sure that the orientation is correct.
      var a = Bx - Ax;
      var asign = a < 0 ? -1 : 1;
      var b = By - Ay;
      var bsign = b < 0 ? -1 : 1;
      var theta = Math.atan(b / a);

      // Find the point that's perpendicular to J on side
      var costheta = asign * Math.cos(theta);
      var sintheta = asign * Math.sin(theta);

      // Find c and d
      var c = M * sintheta;
      var d = M * costheta;

      // Use c and d to find Kx and Ky
      var Kx = Jx - c;
      var Ky = Jy + d;
      // context.bezierCurveTo(Kx, Ky,Bx,By, Ax, Ax);
      context.quadraticCurveTo(Kx, Ky, Bx, By);

      // draw the ending arrowhead
      // var endRadians = Math.atan(dx / dy);
      // context.stroke();

      // drawArrowhead(context, Bx, By, endRadians);
      // context.arc(Jx, Jy, dr, dr, 2 * Math.PI, true);

      /*
    return "M" + Ax + "," + Ay +
           "Q" + Kx + "," + Ky +
           " " + Bx + "," + By
   */
    },
    getAgencyCooperation() {
      let that = this;
      this.axios
        .get(
          "http://172.21.213.242:8080//Knowledge/GetAgencyCooperationByIdServlet",
          {
            params: {
              id: this.id
            }
          }
        )
        .then(function(response) {
          if (response.status === 200) {
            that.graphData = response.data;
            that.createGraph();
          }
        });
    },
    getAgencyResearcher() {
      let that = this;
      this.axios
        .get(
          "http://172.21.213.242:8080//Knowledge/GetAgencyResearchersByIdServlet",
          {
            params: {
              id: this.id
            }
          }
        )
        .then(function(response) {
          if (response.status === 200) {
            that.graphData = response.data;
            that.createGraph();
          }
        });
    },
    getResearcherCooperation() {
      let that = this;
      this.axios
        .get(
          "http://172.21.213.242:8080//Knowledge/GetResearcherCooperationByIdServlet",
          {
            params: {
              id: this.id
            }
          }
        )
        .then(function(response) {
          if (response.status === 200) {
            that.graphData = response.data;
            that.createGraph();
          }
        });
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
            return 3 + (i - 1) * 3;
          }
        }
      }
    }
  }
};
</script>
<style scoped>
.main {
  position: relative;
  width: 100%;
  height: 100%;
}

.main .button-group {
  position: absolute;
  top: 0;
  left: 20px;
  z-index: 998;
}

#d3Relation {
  width: 100%;
  height: 100%;
}
</style>
<style>
.node {
  cursor: pointer;
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
</style>
