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
  addIngredient({ state, commit }, { attr, val, context }) {
    let ing = cloneDeep(recipeTemplate.ingredients[0]);
    let idx;
    if (isObject(val)) {
      assign(ing, val);
      if (ing.group) {
        idx = findLastIndex(state.recipe.ingredients, ['group', ing.group]);
      }
    } else if (attr === 'group') {
      if (find(state.recipe.ingredients, ['group', 'Unnamed'])) {
        return commit('notify', {
          service: undefined,
          severity: 'warn',
          error: 'Please first name the Unnamed group.',
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

  // anything beyond a rote clone of the prop requested, use another action
  addItem({ commit, dispatch }, payload) {
    const prop = payload.prop;
    if (recipeTemplate[prop]) {
      let item = cloneDeep(recipeTemplate[prop][0]);

      switch (prop) {
        case 'ingredients':
          return dispatch('addIngredient', payload);
        case 'method':
          item.step = recipeTemplate[prop].length + 1;
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
  // @todo order({ state, commit }, { prop, index }) {},

  onChangeRate(value) {
    // Set the value of the selectUA recipe's rating to the
    // value passed up from the `rating` sub-component
    this.recipe.rating = value;
  }
};
