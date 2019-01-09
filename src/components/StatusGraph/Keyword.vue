<!-- Relation -->
<template>
  <svg
    id="relationSvg"
    :width="width"
    :height="height"
    @mousemove='listener($event)'
  >
    <a
      v-for='tag in tags'
      :key="tag.text"
    >
      <text
        :x='tag.x'
        :y='tag.y'
        :font-size='20 * (600/(600-tag.z))'
        :fill-opacity='((400+tag.z)/600)'
        :stroke='tag.color'
      >{{tag.text}}</text>
    </a>
  </svg>
</template>

<script>
import * as d3 from "d3v4";
export default {
  name: "keyword",
  props: ["type", "id"],
  data() {
    return {
      width: 298,
      height: 260,
      nodes: [],
      links: [],
      tagsNum: 10,
      RADIUS: 100,
      speedX: Math.PI / 360,
      speedY: Math.PI / 360,
      tags: []
    };
  },

  components: {},

  computed: {
    CX() {
      return this.width / 4;
    },
    CY() {
      return this.height / 2;
    }
  },
  //   beforeMount: function() {
  //       this.width = $("#relationSvg").parent().width();
  //       this.height = $("#relationSvg").parent().height()
  //   },

  mounted: function() {
    this.getNodesAndLinks();
    setInterval(() => {
      this.rotateX(this.speedX);
      this.rotateY(this.speedY);
    }, 40);
  },

  methods: {
    getNodesAndLinks: function() {
      var that = this;
      switch (this.type) {
        case "model":
          this.getModelType();
          break;
        case "agency":
          this.getAgencyType();
          break;
        case "researcher":
          this.getResearcherType();
          break;
      }
    },
    getModelType() {
      let that = this;
      this.axios
        .get(
          "http://172.21.212.183:8080/Knowledge/GetModelKeywordsRelationByIdServlet",
          {
            params: {
              id: this.id
            }
          }
        )
        .then(function(response) {
          if (response.status === 200) {
            that.nodes = response.data.nodes;
            that.displayRelationGraph();
          }
        });
    },
    getAgencyType() {
      let that = this;
      this.axios
        .get(
          "http://172.21.212.183:8080/Knowledge/GetAgencyKeywordsRelationByIdServlet",
          {
            params: {
              id: this.id
            }
          }
        )
        .then(function(response) {
          if (response.status === 200) {
            that.nodes = response.data.nodes;
            that.displayRelationGraph();
          }
        });
    },
    getResearcherType() {
      let that = this;
      this.axios
        .get(
          "http://172.21.212.183:8080/Knowledge/GetResearcherKeywordsRelationByIdServlet",
          {
            params: {
              id: this.id
            }
          }
        )
        .then(function(response) {
          if (response.status === 200) {
            that.nodes = response.data.nodes;
            that.displayRelationGraph();
          }
        });
    },
    displayRelationGraph() {
      var color = ["#32d3eb", "#60acfc", "#c23531"];

      var values = [];
      for (let node of this.nodes) {
        if (node.value) {
          values.push(node.value);
        }
      }

      let kclass = this.getJenksBreaks(values,3);
      console.log(kclass);

      for (let i = 0; i < this.nodes.length; i++) {
        let node = this.nodes[i];
        if (node.value) {
          let tag = {};
          if (node.value <= kclass[0]) {
            tag.color = color[0];
          } else if (node.value <= kclass[1]) {
            tag.color = color[1];
          } else {
            tag.color = color[2];
          }

          let k = -1 + (2 * (i + 1) - 1) / this.tagsNum;
          let a = Math.acos(k);
          let b = a * Math.sqrt(this.tagsNum * Math.PI);
          tag.text = node.name;
          tag.x = this.CX + this.RADIUS * Math.sin(a) * Math.cos(b);
          tag.y = this.CY + this.RADIUS * Math.sin(a) * Math.sin(b);
          tag.z = this.RADIUS * Math.cos(a);
          this.tags.push(tag);
        }
      }
    },
    rotateX(speedX) {
      var cos = Math.cos(speedX);
      var sin = Math.sin(speedX);
      for (let tag of this.tags) {
        var y1 = (tag.y - this.CY) * cos - tag.z * sin + this.CY;
        var z1 = tag.z * cos + (tag.y - this.CY) * sin;
        tag.y = y1;
        tag.z = z1;
      }
    },
    rotateY(speedY) {
      var cos = Math.cos(speedY);
      var sin = Math.sin(speedY);
      for (let tag of this.tags) {
        var x1 = (tag.x - this.CX) * cos - tag.z * sin + this.CX;
        var z1 = tag.z * cos + (tag.x - this.CX) * sin;
        tag.x = x1;
        tag.z = z1;
      }
    },
    listener(event) {
      if (event.target.tagName === "text") {
        this.speedX = 0;
        this.speedY = 0;
      } else {
        this.speedX = Math.PI / 360;
        this.speedY = Math.PI / 360;
      }

      //   //响应鼠标移动
      //   var x = event.clientX - this.CX;
      //   var y = event.clientY - this.CY;
      //   this.speedX =
      //     x * 0.0001 > 0
      //       ? Math.min(this.RADIUS * 0.00002, x * 0.0001)
      //       : Math.max(-this.RADIUS * 0.00002, x * 0.0001);
      //   this.speedY =
      //     y * 0.0001 > 0
      //       ? Math.min(this.RADIUS * 0.00002, y * 0.0001)
      //       : Math.max(-this.RADIUS * 0.00002, y * 0.0001);
    },
    getJenksBreaks(data, numclass) {
      function sortNumber(a, b) {
        //在javascript里，Array的sort方法，必须用这个函数，否则不是按数字大小排序
        return a - b;
      }
      // int numclass;
      var numdata = data.length;
      if(numdata<=0){
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
    }
  }
};
</script>
<style scoped>
#relationSvg {
  width: 100%;
  height: 100%;
  background: #ffffff;
}
</style>
<style>
#relationSvg text:hover {
  cursor: pointer;
  stroke: #feb64d !important;
}
</style>
