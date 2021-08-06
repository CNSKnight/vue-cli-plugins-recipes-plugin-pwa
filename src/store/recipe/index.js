// actions commit mutations
// actions can cantain arbitrary asynchronous operations
import uiActions from './uiActions';
import asyncActions from './asyncActions';
import recipeTemplate from '../models/recipeTemplate';
import { getField, updateField } from 'vuex-map-fields';
import {
  cloneDeep,
  // compose,
  filter,
  isEqual,
  isFinite,
  keys,
  set,
} from 'lodash/fp';
import VuexPersistence from 'vuex-persist';
import Vue from 'vue';

const state = {
  // staged is sync of db service and never mutated here
  staged: cloneDeep(recipeTemplate),
  // recipe starts as db service sync and mutates via ui actions while syncing to local storage
  recipe: cloneDeep(recipeTemplate),
  // the syncModifiedsPlugin maintains non-db service-synced mutations until the next service sync cycle
  modifieds: {},
  detailsFormValid: true,
  preview: 'closed',
};

/**
 * takes a collection (ingredients|methods) with a group property.
 * assumes pre-sorted (as should already be stored in recipe)
 */
const groupedKeys = (collection) => {
  const grouped = {};
  collection.forEach((item, modelIdx) => {
    const group = item.group || 'default';
    (grouped[group] = grouped[group] || []).push(modelIdx);
  });
  // should always be last in .keys()
  grouped.default = grouped.default || [];
  return grouped;
};

const getters = {
  // straight single-field getters
  recipe: ({ recipe }) => recipe,
  staged: ({ staged }) => staged,
  recipeId: ({ recipe: { acapID } }) => acapID,
  detailsFormValid: ({ detailsFormValid }) => detailsFormValid,
  // custom map-fields getters
  getIngredientsField: (state) => getField(state.recipe.ingredients),
  getMethodsField: (state) => getField(state.recipe.methods),

  // custom grouping and filter getters
  groupedIngredients: ({ recipe: { ingredients = [] } }) =>
    groupedKeys(ingredients),
  ingredientGroups: (...[, { groupedIngredients: grouped }]) => keys(grouped),
  ingCountByGroup:
    (...[, { groupedIngredients: grouped }]) =>
    (group) =>
      grouped[group] && grouped[group].length,
  groupedMethods: ({ recipe: { methods = [] } }) => groupedKeys(methods),
  methodGroups: (...[, { groupedMethods: grouped }]) => keys(grouped),
  // takes a group (name) and returns the methods steps count for that group
  stepCountByGroup:
    (...[, { groupedMethods: grouped }]) =>
    (group) =>
      grouped[group] && grouped[group].length,
  filteredVariations: ({ recipe: { variations = [] } }) =>
    filter((variation) => variation.text)(variations),
  filteredTags: ({ recipe: { tags = [] } }) => filter((tag) => tag.text)(tags),
  // statistical getters
  isModified: (state) => !isEqual(state.recipe, state.staged),
  hasChanges: (state) => (id) => state.modifieds[id] !== undefined,
  getModified: (state) => (id) => state.modifieds[id],

  // Logistical getters
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
  getField,
  preview: ({ preview }) => preview,
};

const actions = {
  ...asyncActions,
  ...uiActions,
};

// In Vuex, mutations are synchronous transactions
const mutations = {
  stage(state, recipe) {
    state.staged = cloneDeep(recipe);
    state.recipe = cloneDeep(recipe);
    recipe.id && Vue.delete(state.modifieds, recipe.id);
  },
  cancel: (state) => {
    state.recipe = null;
    state.staged = null;
  },
  reset: (state) => {
    state.recipe = cloneDeep(state.staged);
    Vue.delete(state.modifieds, state.recipe.id);
  },
  updateIngredientsField: (state, field) =>
    updateField(state.recipe.ingredients, field),
  updateMethodsField: (state, field) =>
    updateField(state.recipe.methods, field),
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
  // with set, prop may be a path[to].subProp
  replaceProperty: (state, { prop, val }) => {
    if (prop) {
      state.recipe = set(prop, val)(state.recipe);
    }
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
    // pass off to stage mutation
    this.commit('stage', recipe);
  },
  detailsFormValid: (state, val) => {
    state.detailsFormValid = !!val;
  },
  setPreview: (state, val) => {
    state.preview = val;
  },
};

// called after every mutation.
// The mutation comes in the format of `{ type, payload }`.
const syncModifiedsPlugin = (store) => {
  // called when the store is initialized
  store.subscribe((mutation, state) => {
    if (['updateField', 'replaceProperty'].indexOf(mutation.type) !== -1) {
      store.commit('setModified', {
        key: state.recipeModule.recipe.id,
        val: cloneDeep(state.recipeModule.recipe),
      });
    }
  });
};
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: 'recipe',
  reducer: (state) => ({ modifieds: state.recipeModule.modifieds }),
});

// recipeModule
export default {
  state,
  getters,
  actions,
  mutations,
  plugins: [syncModifiedsPlugin, vuexLocal.plugin],
};
