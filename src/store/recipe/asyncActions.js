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
        // eslint-disable-next-line no-console
        console.log(msg);
      }
    }
  }
};
const contUnitsMgr = acap.ADMIN_TAPPADS && acap.ADMIN_TAPPADS.contUnitsMgr;

const fetchRecipe = async ({ commit, dispatch, getters, state }, recipe) => {
  // set the stage w/the requested acapID
  // try modifieds then api, where we may or
  // may not get back an existing
  const resp = await axios({
    url: apiBase + '/findOne?filter={"where":{"acapID":' + recipe.acapID + '}}'
  }).catch(err => {
    if (err.response) {
      if (err.response.status === 404) {
        dispatch('handleError', {
          service: 'recipe:load',
          severity: 'success',
          error: `Congratulations! You're now ready to begin building your new recipe details.<br>
            Note that we will hang on to your details data on this device/computer between SAVE's,
            but it's still a good idea to SAVE from time to time.<br>
            RESET will take you back to the last SAVE.<br>
            PREVIEW will show how your SAVEd details will display when Published.`
        });
        commit('stage', Object.assign(cloneDeep(recipeTemplate), recipe));
      } else {
        dispatch('handleError', {
          service: 'fetch:recipe',
          severity: 'error',
          error: `Error ${err.response.status}: ${err.response.statusText}`
        });
      }
    } else {
      // this will eg if the endpoint fails
      dispatch('handleError', {
        service: 'fetch:recipe',
        severity: 'fatal',
        error: err
      });
    }
  });
  if (!resp || resp.status !== 200 || !resp.data || !resp.data.id) {
    return;
  }
  const cached = getters.getModified(resp.id);
  if (cached) {
    if (resp.data.updatedDate <= cached.updatedDate) {
      return commit('stage', cached);
    } else {
      // dump our local in-progress cache
      dispatch('setModified', {
        key: state.recipeModule.recipe.id,
        val: undefined
      });
    }
  }
  recipe = resp.data;
  // covers the renamed method > methods
  recipe.method &&
    !recipe.methods &&
    (recipe.methods = recipe.method) &&
    delete recipe.method;
  // covers any newly added properties not present in existing data
  commit('stage', Object.assign(cloneDeep(recipeTemplate), recipe));
};

const putRecipe = async ({ commit, dispatch }, recipe) => {
  let url = apiBase;
  url += isProd ? '/preAuth/' : '/';
  url += recipe.id;

  delete recipe.id;
  let params = isProd
    ? {
        recipe,
        actionStatus: 'cont-units:recipes:update'
      }
    : recipe;
  const resp = await axios.put(url, params).catch(err => {
    if (err.response) {
      dispatch('handleError', {
        service: 'put:recipe',
        severity: 'error',
        error: `Error ${err.response.status}: ${err.response.statusText}`
      });
    } else {
      dispatch('handleError', {
        service: 'put:recipe',
        severity: 'fatal',
        error: err
      });
    }
  });
  if (!resp || resp.status === 200) {
    recipe = resp.data;
    recipe.method && delete recipe.method;
    resp.data && commit('update', resp.data);
  } else {
    dispatch('handleError', {
      service: 'put:recipe',
      severity: 'error',
      error: `Error ${resp.status}: ${resp.statusText}`
    });
  }
};

export default {
  // used outside of listing context to load a single
  loadRecipe(context, rInfo) {
    const { commit, dispatch } = context;
    let acapID = rInfo && rInfo.acapID;
    if (acapID === undefined) {
      // pull from the contUnitsMgr
      rInfo = contUnitsMgr && contUnitsMgr.getInfo();
      acapID = rInfo && rInfo.ad_unit_id;
    }

    // we MUST have an acapID
    // we MAY not yet have an id:ObjectID
    if (acapID === undefined) {
      return dispatch('handleError', {
        service: 'loadRecipe',
        severity: 'warning',
        error: "Weird! I didn't get an acapID?"
      });
    }

    const recipe = cloneDeep(recipeTemplate);
    recipe.acapID = acapID;
    recipe.title = rInfo.title || rInfo.ad_unit_name;
    commit('stage', recipe);
    fetchRecipe(context, recipe);
  },

  save(context) {
    const { state, dispatch } = context;
    if (!state.recipe.acapID) {
      return dispatch('handleError', {
        service: 'save',
        error: 'Recipe has no ID? ' + JSON.stringify(recipe)
      });
    }
    let recipe = cloneDeep(state.recipe);
    helpers.filterRecipe(recipe);
    putRecipe(context, recipe);
  }
};
