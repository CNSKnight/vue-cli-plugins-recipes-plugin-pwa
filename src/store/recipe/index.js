// actions commit mutations
// actions can cantain arbitrary asynchronous operations
import uiActions from './uiActions';
import asyncActions from './asyncActions';
import recipeTemplate from '../models/recipeTemplate';
import { getField, updateField } from 'vuex-map-fields';
import { reduce, isEqual, isFinite, cloneDeep, countBy, groupBy } from 'lodash';
import VuexPersistence from 'vuex-persist';
import Vue from 'vue';

const state = {
  staged: cloneDeep(recipeTemplate),
  recipe: cloneDeep(recipeTemplate),
  modifieds: {}
};

const getters = {
  recipe: state => state.recipe,
  staged: state => state.staged,
  recipeId: state => state.recipe.acapID,
  ingredientGroups(state) {
    const groups = reduce(
      state.recipe.ingredients,
      (accum, ing) => {
        ing.group && !accum.includes(ing.group) && accum.push(ing.group);
        return accum;
      },
      ['default']
    );
    if (groups.length > 1 && groups[groups.length - 1] !== 'default') {
      const def = groups.splice(groups.indexOf('default'), 1);
      groups.push(def[0]);
    }
    return groups;
  },
  ingCountByGroup: ({ recipe }) => group => {
    const counts = countBy(recipe.ingredients, [
      'group',
      group == 'default' ? '' : group
    ]);
    return counts.true;
  },
  methodGroups(state) {
    const groups = reduce(
      state.recipe.methods,
      (accum, ing) => {
        ing.group && !accum.includes(ing.group) && accum.push(ing.group);
        return accum;
      },
      ['default']
    );
    if (groups.length > 1 && groups[groups.length - 1] !== 'default') {
      const def = groups.splice(groups.indexOf('default'), 1);
      groups.push(def[0]);
    }
    return groups;
  },
  groupedMethods: ({ recipe: { methods } }) => groupBy(methods, method => method.group || 'default'),
  stepCountByGroup: ({ recipe }) => group => {
    const counts = countBy(recipe.methods, [
      'group',
      group == 'default' ? '' : group
    ]);
    return counts.true;
  },
  isModified(state) {
    return !isEqual(state.recipe, state.staged);
  },
  hasChanges: state => id => {
    return state.modifieds[id] !== undefined;
  },
  getModified: state => id => {
    return state.modifieds[id];
  },
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
