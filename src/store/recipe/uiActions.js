import recipeTemplate from '../models/recipeTemplate';
import {
  assign,
  cloneDeep,
  filter,
  find,
  findIndex,
  findLastIndex,
  upperFirst
} from 'lodash/fp';

const contUnitsMgr = parent.acap?.ADMIN_TAPPADS?.contUnitsMgr;

// for collections
const addToStack = (
  prop,
  { state, commit, dispatch },
  { attr, val = {}, actionContext }
) => {
  const stack = state.recipe[prop];
  const item = assign(cloneDeep(recipeTemplate[prop][0]), val);
  let index;
  if (attr === 'group') {
    if (find(['group', 'Unnamed'])(stack)) {
      const Prop = upperFirst(prop);
      return dispatch('handleError', {
        service: `recipe:add${Prop}`,
        severity: 'warn',
        error: `Please first name the <strong class="legend">Unnamed ${Prop} (group)</strong>.`,
        actionContext
        // timeout: 5000
      });
    }
    item.group = 'Unnamed';
    // prepend to an existing ''/default group
    index = findIndex(['group', ''], stack);
    if (index == -1) {
      index = undefined;
    }
  } else {
    index = findLastIndex(['group', item.group], stack);
    if (index > -1) {
      item.step && index >= -1 && (item.step = stack[index].step + 1);
      // append to end of existing group
      index++;
    } else if (item.group == '') {
      // or prepend to any existing '' (ie default) group
      index = findIndex(['group', ''], stack);
      if (index == -1) {
        index = undefined;
      }
    }
  }
  commit('addTo', {
    prop,
    item,
    index
  });
};
const updateGroup = (
  prop,
  { state, commit, dispatch },
  { grpMbrIndexes, toGroup, actionContext }
) => {
  const items = state.recipe[prop];
  if (!items.length) return;
  const Prop = upperFirst(prop);
  dispatch('clearNotif', { actionContext });
  if (filter(item => item.group == toGroup, items).length) {
    return dispatch('handleError', {
      service: `recipe:update${Prop}Group`,
      severity: 'error',
      error: `Please ensure <strong class=".legend">${Prop} (group)</strong> names are unique.
      [<span class="materialize-red-text">${toGroup}</span>]`,
      actionContext
    });
  }
  const stack = state.recipe[prop].map((item, idx) => {
    const cloned = cloneDeep(item);
    grpMbrIndexes.includes(idx) && (cloned.group = toGroup);
    return cloned;
  });
  commit('replaceProperty', { prop, val: stack });
};
const qtyRegex = /(\w)-(\w)/;
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
    if (!payload.val) {
      payload.val = { group: '' };
    }
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
  updateIngredientsGroup(
    context,
    { ingIndexes: grpMbrIndexes, toGroup, actionContext }
  ) {
    updateGroup('ingredients', context, {
      grpMbrIndexes,
      toGroup,
      actionContext
    });
  },
  updateMethodsGroup(
    context,
    { stepIndexes: grpMbrIndexes, toGroup, actionContext }
  ) {
    updateGroup('methods', context, { grpMbrIndexes, toGroup, actionContext });
  },
  updateIngredientQty({ commit }, { idx, val }) {
    const payload = {
      prop: `ingredients[${idx}].qty`,
      val: val.replace(qtyRegex, '$1‑$2')
    };
    commit('replaceProperty', payload);
  },
  openPreview({ commit }) {
    commit('setPreview', 'open');
    contUnitsMgr &&
      contUnitsMgr.disableModalClose &&
      contUnitsMgr.disableModalClose('preview', 'Close Preview');
  },
  closePreview({ commit }) {
    commit('setPreview', 'closed');
    contUnitsMgr &&
      contUnitsMgr.enableModalClose &&
      contUnitsMgr.enableModalClose('preview');
  }

  // @todo's
  // order({ state, commit }, { prop, index }) {},
  // onChangeRate(value) {
  //   // Set the value of the selectUA recipe's rating to the
  //   // value passed up from the `rating` sub-component
  //   this.recipe.rating = value;
  // }
};
