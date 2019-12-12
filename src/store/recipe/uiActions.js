import recipeTemplate from '../models/recipeTemplate';
import {
  assign,
  cloneDeep,
  find,
  findIndex,
  findLastIndex,
  isObject,
  map,
  upperFirst
} from 'lodash';

// for collections
const addToStack = (
  prop,
  { state, commit, dispatch },
  { attr, val, actionContext }
) => {
  const item = cloneDeep(recipeTemplate[prop][0]);
  const stack = state.recipe[prop];
  let index;
  if (isObject(val)) {
    assign(item, val);
    if (item.group) {
      // append to end of existing group
      index = findLastIndex(stack, ['group', item.group]);
      if (index == -1) {
        // or prepend to any existing ''/'default' group
        index = findIndex(stack, ['group', '']);
        if (index == -1) {
          index = undefined;
        }
      } else {
        index++;
      }
    }
  } else if (attr === 'group') {
    if (find(stack, ['group', 'Unnamed'])) {
      const Prop = upperFirst(prop);
      return dispatch('handleError', {
        service: `add${Prop}`,
        severity: 'warning',
        error: `Please first name the Unnamed ${Prop} Group.`,
        actionContext,
        timeout: 5000
      });
    }
    item.group = 'Unnamed';
    // prepend to an existing ''/default group
    index = findIndex(stack, item => item.group == '');
    if (index == -1) {
      index = undefined;
    }
  }
  commit('addTo', {
    prop,
    item,
    index
  });
};
const updateGroup = (prop, { state, commit }, { from, to }) => {
  if (!state.recipe[prop].length) return;
  const stack = map(state.recipe[prop], prop => {
    const item = cloneDeep(prop);
    item.group == from && (item.group = to);
    return item;
  });
  commit('updateField', { path: `recipe.${prop}`, value: stack });
};
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

  addIngredient(context, payload) {
    addToStack('ingredients', context, payload);
  },
  addMethod(context, payload) {
    addToStack('methods', context, payload);
  },
  // anything beyond a rote clone of the prop requested, use another action
  addItem({ commit, dispatch }, payload) {
    const prop = payload.prop;
    if (recipeTemplate[prop]) {
      switch (prop) {
        case 'ingredients':
          return dispatch('addIngredient', payload);
        case 'methods':
          return dispatch('addMethod', payload);
        default:
      }

      let item = cloneDeep(recipeTemplate[prop][0]);
      switch (prop) {
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
  updateIngredientsGroup(context, payload) {
    updateGroup('ingredients', context, payload);
  },
  updateMethodsGroup(context, payload) {
    updateGroup('methods', context, payload);
  },

  // @todo order({ state, commit }, { prop, index }) {},

  onChangeRate(value) {
    // Set the value of the selectUA recipe's rating to the
    // value passed up from the `rating` sub-component
    this.recipe.rating = value;
  }
};
