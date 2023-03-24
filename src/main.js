import Vue from 'vue'
import Vuex from 'vuex';
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store';


Vue.use(ElementUI);
Vue.use(Vuex);

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
