import recipeTemplate from '../models/recipeTemplate';
import {
  compose,
  get,
  filter,
  isArray,
  isEmpty,
  isObject,
  isString,
  map,
  reject,
  toLower,
  trim,
  uniq
} from 'lodash/fp';
// eslint-disable-next-line lodash-fp/use-fp
import { transform } from 'lodash';

const ingredient = recipeTemplate.ingredients[0];
const method = recipeTemplate.methods[0];
const errDateFormat = '[%A, %I:%M.%S %p]';
const pickErrors = resp =>
  get('data.error.messages', resp) ||
  get('data.error', resp) ||
  get('data', resp) ||
  resp;

const filterStrAry = (ary, check = 'text') => {
  if (!ary || !ary.length) {
    return [];
  }

  const valids = compose(
    filter(item =>
      isObject(item) ? item[check] && item[check].length : item.length
    ),
    map(item => {
      if (isObject(item)) {
        item[check] = trim(item[check]);
      } else {
        item = trim(item);
      }
      return item;
    }),
    reject(isEmpty)
  )(ary);
  return valids;
};

const filterIngredients = ingredients => {
  if (!ingredients || !ingredients.length) {
    return [];
  }

  const valids = compose(
    filter(ing => ing.name.length),
    map(ing => transform(ing, trimObjStrings, { ...ingredient })),
    reject(isEmpty)
  )(ingredients);
  return valids;
};

const filterMethods = methods => {
  if (!methods || !methods.length) {
    return [];
  }

  const valids = compose(
    filter(met => met.text.length),
    map(met => transform(met, trimObjStrings, { ...method })),
    reject(isEmpty)
  )(methods);
  return valids;
};

const trimObjStrings = (obj, val, key) => {
  if (!key) return obj;
  obj[key] = isString(val) ? trim(val) : val;
  return obj;
};

const checkDups = (ary, prop) => {
  if (!ary || ary.length < 2) {
    return 0;
  }
  const vals = ary.map(item => {
    return toLower(item[prop]);
  });
  const uniqs = uniq(vals);
  return vals.length - uniqs.length;
};

export default {
  getDateStamp: () => {
    const errDate = new Date();
    return (
      (errDate.format && errDate.format(errDateFormat)) ||
      '[no Date.format here]'
    );
  },
  processPreAuthErrors: (actionContext, resp, service, dispatch, fallback) => {
    const errs = pickErrors(resp);
    if (isArray(errs)) {
      errs.forEach(mssgObj =>
        dispatch('handleError', {
          service,
          severity: (mssgObj.code < 7 && 'error') || 'fatal',
          error: mssgObj.msg || fallback || 'Server error',
          actionContext
        })
      );
    } else {
      dispatch('handleError', {
        service,
        severity: 'fatal',
        error: errs.message || fallback || 'Not reported.',
        actionContext
      });
    }
  },
  /*
   * @todo remove empty or blacklisted tags or blacklisted chars
   */
  filterRecipe: recipe => {
    // final filters return empty []'s rather than null|undefined,
    // in order to re-init property in document. ie not passing eg tags: [],
    // will just set tags: [{}] in collection document
    recipe.tools = filterStrAry(recipe.tools, 'name');
    recipe.tags = filterStrAry(recipe.tags);
    recipe.ingredients = filterIngredients(recipe.ingredients);
    delete recipe.method;
    recipe.methods = filterMethods(recipe.methods);
    recipe.variations = filterStrAry(recipe.variations);
    recipe.creator = trim(recipe.creator);
    recipe.originalUrl = trim(recipe.originalUrl);
    recipe.description = trim(recipe.description);
    recipe.subTitle = trim(recipe.subTitle);
    recipe.notes = trim(recipe.notes);
  },

  finalValidations: (recipe, dispatch, actionContext) => {
    actionContext && dispatch('clearNotif', { actionContext });
    const errorTmpl = {
      service: 'recipe:finalValidations',
      severity: 'warn',
      error: null,
      actionContext
    };
    let valid = true;
    let count;
    if ((count = filter(['group', 'Unnamed'], recipe.ingredients).length)) {
      valid = false;
      errorTmpl.message = `You have ${count} <em>Unnamed</em> Ingredient Groups.`;
      dispatch('handleError', errorTmpl);
    }
    if ((count = filter(['group', 'Unnamed'], recipe.methods).length)) {
      valid = false;
      errorTmpl.message = `You have ${count} <em>Unnamed</em> Method Groups.`;
      dispatch('handleError', errorTmpl);
    }
    if ((count = checkDups(recipe.tools, 'name'))) {
      valid = false;
      errorTmpl.message = `You have ${count} <em>Duplicate</em> Tools.`;
      dispatch('handleError', errorTmpl);
    }
    if ((count = checkDups(recipe.tags, 'text'))) {
      valid = false;
      errorTmpl.message = `You have ${count} <em>Duplicate</em> Tags.`;
      dispatch('handleError', errorTmpl);
    }
    return valid;
  }
};
