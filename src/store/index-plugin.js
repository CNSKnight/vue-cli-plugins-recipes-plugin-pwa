import { createStore, createLogger } from 'vuex';
// import Mongoose from 'mongoose'
import appModule from './app/';
import recipeModule from './recipe/';
import { forOwn } from 'lodash/fp';

// Mongoose.Promise = global.Promise

const DEBUG = process.env.NODE_ENV !== 'production';

const modules = {
  appModule,
  recipeModule,
};
let plugins = DEBUG ? [createLogger()] : [];
forOwn((module) => {
  if (module.plugins) {
    plugins = plugins.concat(module.plugins);
    delete module.plugins;
  }
})(modules);

export default createStore({
  modules,
  strict: DEBUG,
  plugins,
});
