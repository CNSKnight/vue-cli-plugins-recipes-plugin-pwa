import recipeTemplate from '../models/recipeTemplate';
import { assign, cloneDeep, find, findLastIndex, isObject, map } from 'lodash';
export default {
  selectRecipe({ dispatch }, recipe) {
    dispatch('loadRecipe', recipe);
  },

  // needed?
  // stage({ commit }, recipe) {
  //   commit('stage', { ...recipe })
  // },

  cancel({ commit }) {
    commit('cancel');
  },

  reset({ commit }) {
    commit('reset');
  },

  // for collections
  addIngredient({ state, commit, dispatch }, { attr, val, context }) {
    let ing = cloneDeep(recipeTemplate.ingredients[0]);
    let idx;
    if (isObject(val)) {
      assign(ing, val);
      if (ing.group) {
        idx = findLastIndex(state.recipe.ingredients, ['group', ing.group]);
      }
    } else if (attr === 'group') {
      if (find(state.recipe.ingredients, ['group', 'Unnamed'])) {
        return dispatch('handleError', {
          service: 'addIngredient',
          severity: 'warn',
          error: 'Please first name the Unnamed Ingredients Group.',
          context: context
        });
      }
      ing.group = 'Unnamed';
    }
    commit('addTo', {
      prop: 'ingredients',
      item: ing,
      index: idx >= -1 ? idx + 1 : undefined
    });
  },
  addMethod({ state, commit, dispatch }, { attr, val, context }) {
    let met = cloneDeep(recipeTemplate.methods[0]);
    let idx;
    if (isObject(val)) {
      assign(met, val);
      if (met.group) {
        idx = findLastIndex(state.recipe.methods, ['group', met.group]);
      }
    } else if (attr === 'group') {
      if (find(state.recipe.methods, ['group', 'Unnamed'])) {
        return dispatch('handleError', {
          service: 'addMethod',
          severity: 'warn',
          error: 'Please first name the Unnamed Methods group.',
          context: context
        });
      }
      met.group = 'Unnamed';
    }
    commit('addTo', {
      prop: 'methods',
      item: met,
      index: idx >= -1 ? idx + 1 : undefined
    });
  },

  // anything beyond a rote clone of the prop requested, use another action
  addItem({ commit, dispatch }, payload) {
    const prop = payload.prop;
    if (recipeTemplate[prop]) {
      let item = cloneDeep(recipeTemplate[prop][0]);

      switch (prop) {
        case 'ingredients':
          return dispatch('addIngredient', payload);
        case 'methods':
          return dispatch('addMethod', payload);
          break;
        case 'tag':
          item.priority = item.length + 1;
          break;
        default:
      }
      commit('addTo', { prop: prop, item: item });
    }
  },

  deleteItem({ state, commit }, { prop, index }) {
    if (
      recipeTemplate[prop] &&
      state.recipe[prop] &&
      state.recipe[prop][index]
    ) {
      let val = cloneDeep(state.recipe[prop]);
      val.splice(index, 1);
      switch (prop) {
        case 'method':
          val.forEach((item, idx) => {
            item.step = idx + 1;
          });
          break;
        default:
      }
      commit('replaceProperty', { prop: prop, val: val });
    }
  },

  updateIngredientsGroup({ state, commit }, { from, to }) {
    if (!state.recipe.ingredients.length) return;
    const ingredients = map(state.recipe.ingredients, ingredient => {
      const ing = cloneDeep(ingredient);
      ing.group == from && (ing.group = to);
      return ing;
    });
    commit('updateField', { path: 'recipe.ingredients', value: ingredients });
  },
  updateMethodsGroup({ state, commit }, { from, to }) {
    if (!state.recipe.methods.length) return;
    const methods = map(state.recipe.methods, method => {
      const met = cloneDeep(method);
      met.group == from && (met.group = to);
      return met;
    });
    commit('updateField', { path: 'recipe.methods', value: methods });
  },
  // @todo order({ state, commit }, { prop, index }) {},

  onChangeRate(value) {
    // Set the value of the selectUA recipe's rating to the
    // value passed up from the `rating` sub-component
    this.recipe.rating = value;
  }
};
