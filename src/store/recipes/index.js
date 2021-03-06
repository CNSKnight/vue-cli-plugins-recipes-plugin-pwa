import axios from 'axios';
import { findIndex } from 'lodash/fp';

const apiBase = process.env.VUE_APP_RECIPES_APIBASE;

const state = {
  selected: undefined,
  recipes: []
};

const getters = {
  selectedId: state => state.selected && state.selected.id,
  recipes: state => state.recipes
};

const actions = {
  // used only w/in listing context to load all
  async loadRecipes({ commit, dispatch }) {
    try {
      const resp = await axios({
        url: apiBase
        // transformResponse: []
      });
      if (resp && resp.status === 200) {
        commit('setCollection', { recipes: resp.data });
        dispatch('handleError', {
          service: 'recipes:load',
          severity: 'success',
          error: `Loaded ${resp.data.length} recipes.`
        });
      }
    } catch (err) {
      return err;
    }
  },
  selectRecipe({ commit }, recipe) {
    commit('setSelected', { ...recipe });
  }
};

const mutations = {
  setCollection(state, payload) {
    state.recipes = payload.recipes;
  },
  setSelected(state, payload) {
    state.selected = payload;
  },
  update(state, payload) {
    this.commit('updateListingItem', payload);
  },
  updateListingItem(state, payload) {
    if (payload.id) {
      const idx = findIndex(recipe => {
        return recipe.id === payload.id;
      })(state.recipes);
      if (idx >= 0) {
        state.recipes.splice(idx, 1, { ...payload });
      }
    }
  }
};

// recipesModule
export default {
  state,
  getters,
  actions,
  mutations
};
