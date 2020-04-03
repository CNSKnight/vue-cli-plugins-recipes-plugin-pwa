// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import store from './store/index-plugin';
import '@/components/_globals';
import DetailsPluginApp from './DetailsPluginApp';

Vue.config.productionTip = false;

// @see ../ADMIN_CLIENT/ADMIN_TAPPADS/templates/contunits/js/vegrds-recipe-details.source.js
// - attach the details-plugin VueModel
// (we may be plugging in along with, or embedding via iframe, depending on the target document)
// TAMYACCT/ta-content-units-manager
// ADMIN_TAPPADS/ta-content-units-manager
const parent =
  (window.acap && window) || (window.parent?.acap && window.parent);
const contUnitsMgr = parent.acap?.ADMIN_TAPPADS?.contUnitsMgr;

// details plugin Vue module
// will be mounted from contUnitsMgr.onPanelFocus > mountDpVm()
export const dpVm = new Vue({
  store,
  // custOpt:
  // destroyed() was not useful in iframe context - prob never triggered
  render: h => h(DetailsPluginApp)
});

contUnitsMgr && (contUnitsMgr.dpVm = dpVm);
