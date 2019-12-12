// actions commit mutations
// actions can cantain arbitrary asynchronous operations
import uiActions from './uiActions';
import asyncActions from './asyncActions';
import recipeTemplate from '../models/recipeTemplate';
import { getField, updateField } from 'vuex-map-fields';
import { compose, isEqual, isFinite, cloneDeep, filter, keys } from 'lodash/fp';
import VuexPersistence from 'vuex-persist';
import Vue from 'vue';

const state = {
  staged: cloneDeep(recipeTemplate),
  recipe: cloneDeep(recipeTemplate),
  modifieds: {}
};
const groupedKeys = collection => {
  const grouped = {};
  collection.forEach((item, modelIdx) => {
    const target = (grouped[item.group || 'default'] =
      grouped[item.group || 'default'] || []);
    target.push(modelIdx);
  });
  // should always be last in .keys()
  grouped.default = grouped.default || [];
  return grouped;
};

const getters = {
  recipe: state => state.recipe,
  staged: state => state.staged,
  recipeId: state => state.recipe.acapID,
  groupedIngredients: ({ recipe: { ingredients = [] } }) =>
    groupedKeys(ingredients),
  ingredientGroups: (...[, { groupedIngredients: grouped }]) => keys(grouped),
  ingCountByGroup: (...[, { groupedIngredients: grouped }]) => group =>
    grouped[group] && grouped[group].length,
  groupedMethods: ({ recipe: { methods = [] } }) => groupedKeys(methods),
  methodGroups: (...[, { groupedMethods: grouped }]) => keys(grouped),
  // function that returns a function that takes a group (name) and returns it's method count
  stepCountByGroup: (...[, { groupedMethods: grouped }]) => group =>
    grouped[group] && grouped[group].length,
  filteredVariations: ({ recipe: { variations = [] } }) =>
    compose(filter(variation => variation.text))(variations),
  filteredTags: ({ recipe: { tags = [] } }) =>
    compose(filter(tag => tag.text))(tags),
  isModified: state => !isEqual(state.recipe, state.staged),
  hasChanges: state => id => state.modifieds[id] !== undefined,
  getModified: state => id => state.modifieds[id],
  // return the updated if beyond 3 days of published/creation dates
  updatedDate(state) {
    let recipe = state.recipe;
    let pd =
      (recipe.publishedDate || recipe.creationDate) &&
      new Date(recipe.publishedDate || recipe.creationDate);
    let ud = pd && recipe.updatedDate && new Date(recipe.updatedDate);
    if (
      ud &&
      ud > new Date(pd.getFullYear(), pd.getMonth(), pd.getDate() + 3)
    ) {
      return ud;
    }
  },
  getField
};

const actions = { ...asyncActions, ...uiActions };

// In Vuex, mutations are synchronous transactions
const mutations = {
  stage(state, recipe) {
    state.staged = cloneDeep(recipe);
    state.recipe = cloneDeep(recipe);
    recipe.id && Vue.delete(state.modifieds, recipe.id);
  },
  cancel: state => {
    state.recipe = null;
    state.staged = null;
  },
  reset: state => {
    state.recipe = cloneDeep(state.staged);
    Vue.delete(state.modifieds, state.recipe.id);
  },
  updateField,
  // implies augmenting arrays
  addTo(state, { prop, item, index }) {
    if (!prop) return;
    if (state.recipe[prop]) {
      if (isFinite(index)) {
        state.recipe[prop].splice(index, 0, item);
      } else {
        state.recipe[prop].push(item);
      }
    } else {
      state.recipe[prop] = item;
    }
  },
  replaceProperty: (state, { prop, val }) => {
    prop && (state.recipe[prop] = val);
  },
  setModified: (state, { key, val }) => {
    if (key) {
      if (val) {
        Vue.set(state.modifieds, key, val);
      } else {
        Vue.delete(state.modifieds, key);
      }
    }
  },
  update(state, recipe) {
    this.commit('stage', recipe);
  }
};

// called after every mutation.
// The mutation comes in the format of `{ type, payload }`.
const syncModifiedsPlugin = store => {
  // called when the store is initialized
  store.subscribe((mutation, state) => {
    if (['updateField', 'replaceProperty'].indexOf(mutation.type) !== -1) {
      store.commit('setModified', {
        key: state.recipeModule.recipe.id,
        val: cloneDeep(state.recipeModule.recipe)
      });
    }
  });
};
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: 'recipe',
  reducer: state => ({ modifieds: state.recipeModule.modifieds })
});

// recipeModule
export default {
  state,
  getters,
  actions,
  mutations,
  plugins: [syncModifiedsPlugin, vuexLocal.plugin]
};
