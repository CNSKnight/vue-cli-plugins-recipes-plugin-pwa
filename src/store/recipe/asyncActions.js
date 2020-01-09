import axios from 'axios';
import recipeTemplate from '../models/recipeTemplate';
import helpers from './actionHelpers';
import { cloneDeep, isEmpty, isUndefined } from 'lodash';

const apiBase = process.env.VUE_APP_RECIPES_APIBASE;
const preAuthUrl = apiBase + '/preAuth/';
// const acap = {
//   ADMIN_TAPPADS: {
//     contUnitsMgr: {
//       getInfo() {
//         return {
//           ad_unit_id: 27,
//           ad_unit_name: '_Nu_Testr_'
//         };
//       },
//       setMessages(msg) {
//         // eslint-disable-next-line no-console
//         console.log(msg);
//       }
//     }
//   }
// };
const contUnitsMgr = parent.acap?.ADMIN_TAPPADS?.contUnitsMgr;

const fetchRecipe = async ({ commit, dispatch, getters, state }, recipe) => {
  // set the stage w/the requested acapID
  // try modifieds then api, where we may or may not get back an existing
  const resp = await axios({
    url: apiBase + '/findOne?filter={"where":{"acapID":' + recipe.acapID + '}}'
  }).catch(err => {
    if (err.response) {
      if (err.response.status === 404) {
        dispatch('handleError', {
          service: 'recipe:load',
          severity: 'success',
          error: `Congratulations! You're now ready to begin building your new recipe details.<br>
            Note that we will save your details data on this device/computer between <strong>SAVE</strong>'s, but it's
            still a good idea for you to <strong>SAVE</strong> from time to time.<br>
            <strong>RESET</strong> will take you back to the last <strong>SAVE</strong>.<br>
            <strong>PREVIEW</strong> will show how your <strong>SAVE</strong>d details will display when Published.`
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
  commit('stage', Object.assign(cloneDeep(recipeTemplate), recipe));
};

const postRecipe = async ({ commit, dispatch }, recipe) => {
  // rInfo = contUnitsMgr && contUnitsMgr.getInfo();
  // if (!rInfo) {
  //   return contUnitsMgr.setMessages("<p>Save failed! I didn't get acapF cont-unit info?</p>");
  // }
  // recipe.acapID = info.ad_unit_id;
  // recipe.title = info.ad_unit_name;
  // above should have been assigned in loadRecipe
  delete recipe.id;
  const actionStatus = 'cont-units:recipes:add';
  const resp = await axios
    .post(preAuthUrl, {
      recipe,
      actionStatus
    })
    .catch(err => {
      dispatch('handleError', {
        service: 'post:recipe',
        severity: (err.response && 'error') || 'fatal',
        error:
          (err.response &&
            `Error ${err.response.status}: ${err.response.statusText}`) ||
          err
      });
    });
  if (resp && resp.status === 200) {
    resp.data && resp.data.method && delete resp.data.method;
    resp.data && commit('update', resp.data);
  } else {
    dispatch('handleError', {
      service: 'put:recipe',
      severity: 'error',
      error:
        (resp && `Error ${resp.status}: ${resp.statusText}`) || 'No Response'
    });
  }
};

const putRecipe = async ({ commit, dispatch }, recipe) => {
  const url = preAuthUrl + recipe.id || '';
  delete recipe.id;
  const actionStatus = 'cont-units:recipes:update';
  const resp = await axios
    .put(url, {
      recipe,
      actionStatus
    })
    .catch(err => {
      dispatch('handleError', {
        service: 'put:recipe',
        severity: (err.response && 'error') || 'fatal',
        error:
          (err.response &&
            `Error ${err.response.status}: ${err.response.statusText}`) ||
          err
      });
    });
  if (resp && resp.status === 200) {
    resp.data && resp.data.method && delete resp.data.method;
    resp.data && commit('update', resp.data);
  } else {
    dispatch('handleError', {
      service: 'put:recipe',
      severity: 'error',
      error:
        (resp && `Error ${resp.status}: ${resp.statusText}`) || 'No Response'
    });
  }
};

export default {
  // used outside of listing context to load a single
  loadRecipe(context, rInfo) {
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
        service: 'loadRecipe',
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
    const { state, dispatch } = context;
    if (!state.recipe.acapID) {
      return dispatch('handleError', {
        service: 'save',
        error: 'Recipe has no ID? ' + JSON.stringify(recipe)
      });
    }
    const recipe = cloneDeep(state.recipe);
    helpers.filterRecipe(recipe);
    if (helpers.finalValidations(recipe, dispatch, actionContext)) {
      (isUndefined(recipe.id) && postRecipe(context, recipe)) ||
        putRecipe(context, recipe);
    }
  }
};
