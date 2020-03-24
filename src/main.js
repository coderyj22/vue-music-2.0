import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastClick from 'fastclick'
import VueLazyload from "vue-lazyload";

import './assets/stylus/index.styl'

Vue.use(VueLazyload, {
  // error: 'dist/error.png',
  loading: require('assets/images/default.png'),
  // attempt: 1
})

Vue.config.productionTip = false;

fastClick.attach(document.body);

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app');
