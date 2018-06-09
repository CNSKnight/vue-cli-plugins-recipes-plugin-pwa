// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import store from './store/index-plugin';
import '@/components/_globals';
import DetailsPluginApp from './DetailsPluginApp';

Vue.config.productionTip = false;

/* eslint-disable no-new */
const dpVm = new Vue({
  store,
  render: h => h(DetailsPluginApp)
});
if (window.acap && window.acap.ADMIN_TAPPADS && window.acap.ADMIN_TAPPADS.contUnitsMgr) {
  window.acap.ADMIN_TAPPADS.contUnitsMgr.dpVm = dpVm;
} else {
  dpVm.$mount('#detailsPlugin');
}
