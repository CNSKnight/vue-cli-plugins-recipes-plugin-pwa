import axios from 'axios';
import recipeTemplate from '../models/recipeTemplate';
import helpers from './actionHelpers';
import {
  assignWith,
  cloneDeep,
  isArray,
  isEmpty, // must be object|collection|map|set
  isNaN,
  isNil,
  isUndefined
} from 'lodash/fp';

const apiBase = process.env.VUE_APP_RECIPES_APIBASE;
const preAuthUrl = apiBase + '/preAuth/';
const contUnitsMgr = parent.acap?.ADMIN_TAPPADS?.contUnitsMgr;

const fetchRecipe = async ({ commit, dispatch, getters, state }, recipe) => {
  // set the stage w/the requested acapID
  // try modifieds then api, where we may or may not get back an existing
  const service = 'recipe:fetch';
  if (!recipe || isNaN(recipe.acapID)) {
    return dispatch('handleError', {
      service,
      severity: 'warn',
      error: "I didn't receive an acapID"
    });
  }
  dispatch('clearNotifs');

  const resp = await axios({
    url: apiBase + '/findOne?filter={"where":{"acapID":' + recipe.acapID + '}}'
  }).catch(err => {
    dispatch('clearNotif', { service });
    if (err.response && err.response.status === 404) {
      dispatch('handleError', {
        service,
        severity: 'success',
        error: `Congratulations! You're now ready to begin building your new recipe details.<br>
            Note that we will save your details data on this device/computer between <strong>SAVE</strong>'s, but it's
            still a good idea for you to <strong>SAVE</strong> from time to time.<br>
            <strong>RESET</strong> will take you back to the last <strong>SAVE</strong>.<br>
            <strong>PREVIEW</strong> will show how your <strong>SAVE</strong>d details will display when Published.`
      });
      return commit('stage', Object.assign(cloneDeep(recipeTemplate), recipe));
    } else {
      err && err.message && (err.message += ` ${helpers.getDateStamp()}`);
      commit('stage', {});
      commit('setSelected', {});
      return dispatch('handleError', {
        service,
        severity: 'fatal',
        error: err.message || 'Recipe details not be fetched.'
      });
    }
  });
  if (!resp || resp.status !== 200 || !resp.data || resp.data.id == undefined) {
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
    isEmpty(recipe.methods) &&
    (recipe.methods = recipe.method) &&
    delete recipe.method;
  // covers any newly added properties not present in existing data
  recipe = assignWith(
    (cloneVal, recVal) => {
      if (isNil(recVal) && !isNil(cloneVal)) {
        return cloneVal;
      } else if (isArray(cloneVal) && cloneVal[0].group !== undefined) {
        // make up for legacy ingredients|methods which have no group
        recVal.forEach(val => {
          val.group = val.group || '';
        });
        return recVal;
      } else {
        return undefined;
      }
    },
    cloneDeep(recipeTemplate),
    recipe
  );
  commit('stage', recipe);
};

const postRecipe = async ({ commit, dispatch }, recipe, actionContext) => {
  const service = 'recipe:save:post';
  dispatch('clearNotifs');
  delete recipe.id;
  const actionStatus = 'cont-units:recipes:add';
  const resp = await axios
    .post(preAuthUrl, {
      recipe,
      actionStatus
    })
    .catch(err => err.response || err.message);
  if (resp && resp.status === 200) {
    resp.data && resp.data.method && delete resp.data.method;
    resp.data && commit('update', resp.data);
    dispatch('handleError', {
      service,
      severity: 'success',
      error: `Saved recipe with id #${recipe.acapID}.`,
      actionContext
    });
  } else {
    helpers.processPreAuthErrors(
      actionContext,
      resp,
      service,
      dispatch,
      'Recipe not saved'
    );
  }
};

const putRecipe = async ({ commit, dispatch }, recipe, actionContext) => {
  const service = 'recipe:save:put';
  dispatch('clearNotifs');
  const url = preAuthUrl + recipe.id || '';
  delete recipe.id;
  const actionStatus = 'cont-units:recipes:update';
  const resp = await axios
    .put(url, {
      recipe,
      actionStatus
    })
    .catch(err => err.response || err.message);
  if (resp && resp.status === 200) {
    resp.data && resp.data.method && delete resp.data.method;
    resp.data && commit('update', resp.data);
    dispatch('handleError', {
      service,
      severity: 'success',
      error: `Saved recipe with id #${recipe.acapID}.`,
      actionContext
    });
  } else {
    return helpers.processPreAuthErrors(
      actionContext,
      resp,
      service,
      dispatch,
      'Recipe not saved'
    );
  }
};

export default {
  // used outside of listing context to load a single
  loadRecipe(context, rInfo) {
    const service = 'recipe:load';
    const { commit, dispatch } = context;
    let acapID = rInfo && rInfo.acapID;
    if (acapID == undefined) {
      // pull from the contUnitsMgr
      rInfo = contUnitsMgr && contUnitsMgr.getInfo();
      acapID = rInfo && rInfo.ad_unit_id;
    }

    // we MUST have an acapID
    // we may NOT YET have an id:ObjectID
    if (acapID == undefined) {
      return dispatch('handleError', {
        service,
        severity: 'warn',
        error: "Weird! I didn't get an acapID?"
      });
    }

    const recipe = cloneDeep(recipeTemplate);
    recipe.acapID = acapID;
    recipe.title = rInfo.title || rInfo.ad_unit_name;
    commit('stage', recipe);
    fetchRecipe(context, recipe);
  },

  save(context, actionContext) {
    const { state, commit, dispatch } = context;
    if (!state.recipe.acapID) {
      return dispatch('handleError', {
        service: 'recipe:save',
        error: 'Recipe has no ID? ' + JSON.stringify(recipe)
      });
    }
    const recipe = cloneDeep(state.recipe);
    helpers.filterRecipe(recipe);
    const valid = helpers.finalValidations(recipe, dispatch, actionContext);
    commit('detailsFormValid', valid);
    if (valid) {
      (isUndefined(recipe.id) && postRecipe(context, recipe, actionContext)) ||
        putRecipe(context, recipe, actionContext);
    }
  }
};
