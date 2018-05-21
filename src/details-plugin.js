// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import store from './store';
import '@/components/_globals';
import DetailsPluginApp from './DetailsPluginApp';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  store,
  render: h => h(DetailsPluginApp)
}).$mount('#plugin');
