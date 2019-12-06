import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
// import Mongoose from 'mongoose'
import appModule from './app/';
import recipeModule from './recipe/';
import recipesModule from './recipes/';
import {forOwn} from 'lodash';

Vue.use(Vuex);
// Mongoose.Promise = global.Promise

const debug = process.env.NODE_ENV !== 'production';

const modules = {
  appModule,
  recipeModule,
  recipesModule,
};
let plugins = debug ? [createLogger()] : [];
forOwn(modules, module => {
  if (module.plugins) {
    plugins = plugins.concat(module.plugins);
    delete module.plugins;
  }
});

export default new Vuex.Store({
  modules: modules,
  strict: debug,
  plugins: plugins,
});
