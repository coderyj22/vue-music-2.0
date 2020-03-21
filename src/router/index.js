import Vue from 'vue';
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Recommend from "../views/recommend/Recommend";
import Singer from "../views/singer/Singer";
import Rank from "../views/rank/Rank";
import Search from "../views/search/Search";

const routes = [
  {
    path: "/recommend",
    component: Recommend
  },
  {
    path: "/singer",
    component: Singer
  },
  {
    path: "/rank",
    component: Rank
  },
  {
    path: "/search",
    component: Search
  },
];

export default new VueRouter({
  routes,
  mode: 'history'
})
