import axios from 'axios';
import recipeTemplate from '../models/recipeTemplate';
import helpers from './actionHelpers';
import { cloneDeep } from 'lodash';

const isProd = process.env.NODE_ENV === 'production';
const apiBase = process.env.VUE_APP_RECIPES_APIBASE;
const acap = (isProd && parent.acap) || {
  ADMIN_TAPPADS: {
    contUnitsMgr: {
      getInfo() {
        return {
          ad_unit_id: 27,
          ad_unit_name: '_Nu_Testr_'
        };
      },
      setMessages(msg) {
        console.log(msg);
      }
    }
  }
};
const contUnitsMgr = acap.ADMIN_TAPPADS && acap.ADMIN_TAPPADS.contUnitsMgr;

export default {
  // used outside of listing context to load a single
  async loadRecipe({ state, getters, commit, dispatch }, recipe) {
    let acapID = recipe && recipe.acapID;
    if (acapID === undefined) {
      // pull from the contUnitsMgr
      const info = contUnitsMgr && contUnitsMgr.getInfo();
      acapID = info && info.ad_unit_id;
      if (acapID) {
        const recipe = cloneDeep(recipeTemplate);
        recipe.acapID = info.ad_unit_id;
        recipe.title = info.ad_unit_name;
        commit('stage', recipe);
      }
    }

    // we MUST have an acapID
    // we MAY not yet have an id:ObjectID
    if (acapID) {
      // set the stage w/the requested acapID
      // try modifieds then api, where we may or
      // may not get back an existing
      try {
        const resp = await axios({
          url: apiBase + '/findOne?filter={"where":{"acapID":' + acapID + '}}'
        });
        if (resp.status === 200 && resp.data && resp.data.id) {
          const cached = getters.getModified(resp.id);
          if (cached) {
            if (resp.data.updatedDate <= cached.updatedDate) {
              return commit('stage', cached);
            } else {
              dispatch('setModified', {
                key: state.recipeModule.recipe.id,
                val: undefined
              });
            }
          }
          const recipe = resp.data;
          // covers the renamed method > methods
          recipe.method && !recipe.methods && (recipe.methods = recipe.method) && delete (recipe.method);
          // covers any newly added properties not present in existing data
          commit('stage', Object.assign(cloneDeep(recipeTemplate), recipe));
        } else {
          dispatch('handleError', {
            service: 'recipe:load',
            severity: 'error',
            error: `Error ${resp.status}: ${resp.statusText}`,
            context: contUnitsMgr
          });
        }
      } catch (err) {
        dispatch('handleError', {
          service: 'loadRecipe',
          severity: 'fatal',
          error: err,
          context: contUnitsMgr
        });
      }
    }
  },
  async save({ state, commit, dispatch }) {
    let recipe = { ...state.recipe };
    if (!recipe.id) {
      return dispatch('handleError', {
        service: 'save',
        err: 'Recipe has no ID? ' + JSON.stringify(recipe),
        context: contUnitsMgr
      });
    }
    let url = apiBase;
    url += isProd ? '/preAuth/' : '/';
    url += recipe.id;

    delete recipe.id;
    recipe = helpers.filterRecipe(recipe);
    let params = isProd
      ? {
        recipe,
        actionStatus: 'cont-units:recipes:update'
      }
      : recipe;

    try {
      const resp = await axios.put(url, params);
      if (resp.status === 200) {
        resp.data && commit('update', resp.data);
      } else {
        dispatch('handleError', {
          service: 'recipes:update',
          severity: 'error',
          error: `Error ${resp.status}: ${resp.statusText}`,
          context: contUnitsMgr
        });
      }
    } catch (err) {
      dispatch('handleError', {
        service: 'recipes:update',
        severity: 'fatal',
        error: err,
        context: contUnitsMgr
      });
    }
  }
};
