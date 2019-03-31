import Vue from "vue";
import Router from "vue-router";
import ElementUI from "element-ui";
import axios from "axios";
import Qs from "qs";
import "element-ui/lib/theme-chalk/index.css";
import "font-awesome/css/font-awesome.min.css";
import KnowledgeGraph from "@/components/Graph";
import Status from "@/components/Status";
import System from "@/components/System";
import Login from "@/components/Login";
import Register from "@/components/Register";
import Characters from "@/components/System/Characters";
import Models from "@/components/System/Models";
import Locations from "@/components/System/Location";
import Scene from "@/components/System/Scene";
import ModelFuntion from "@/components/System/ModelFunction";
import Agency from "@/components/System/Agency";
import CreateCharacter from "@/components/System/Create/CreateCharacter";
import CreateAgency from "@/components/System/Create/CreateAgency";
import CreateModel from "@/components/System/Create/CreateModel";
import CreateLocation from "@/components/System/Create/CreateLocation";
import CreateScene from "@/components/System/Create/CreateScene";
import echarts from 'echarts'

Vue.use(Router);
Vue.use(ElementUI);

Vue.prototype.axios = axios;
Vue.prototype.qs = Qs;
Vue.prototype.$echarts = echarts 

export default new Router({
  mode: "history", //hash路由带#
  routes: [
    {
      path: "/",
      name: "Graph",
      component: KnowledgeGraph
    },
    {
      path: "/status/:category/:id",
      name: "Status",
      component: Status
    },
    {
      path: "/map/:modelId",
      name: "Map",
      component: Map
    },
    {
      path: "/system",
      name: "System",
      component: System,
      children: [
        { path: "/", name: "人物", component: Characters },
        { path: "agency", name: "机构", component: Agency },
        { path: "model", name: "模型", component: Models },
        { path: "location", name: "位置", component: Locations },
        { path: "scene", name: "场景", component: Scene },
        { path: "function", name: "方法", component: ModelFuntion },
        {
          path: "createCharacter",
          name: "创建人物",
          component: CreateCharacter
        },
        {
          path: "editCharacter/:id",
          name: "创建人物",
          component: CreateCharacter
        },
        { path: "createAgency", name: "创建机构", component: CreateAgency },
        { path: "editAgency/:id", name: "修改机构", component: CreateAgency },
        { path: "createModel", name: "创建模型", component: CreateModel },
        { path: "editModel/:id", name: "修改模型", component: CreateModel },
        { path: "createLocation", name: "创建地点", component: CreateLocation },
        {
          path: "editLocation/:id",
          name: "修改人物",
          component: CreateLocation
        },
        { path: "createScene", name: "创建场景", component: CreateScene },
        { path: "editScene/:id", name: "修改场景", component: CreateScene }
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    }
  ]
});
