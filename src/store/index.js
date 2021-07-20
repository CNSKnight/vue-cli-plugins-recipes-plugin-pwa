import { createStore, createLogger } from 'vuex';
// import Mongoose from 'mongoose'
import appModule from './app/';
import recipeModule from './recipe/';
import recipesModule from './recipes/';
import { forOwn } from 'lodash/fp';

const debug = process.env.NODE_ENV !== 'production';

const modules = {
  appModule,
  recipeModule,
  recipesModule
};
let plugins = debug ? [createLogger()] : [];
forOwn(module => {
  if (module.plugins) {
    plugins = plugins.concat(module.plugins);
    delete module.plugins;
  }
})(modules);

export default createStore({
  modules,
  strict: debug,
  plugins
});
