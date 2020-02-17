import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import store from './store';
import './plugins/mask';
import VueTheMask from 'vue-the-mask';
Vue.use(VueTheMask);

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app');
