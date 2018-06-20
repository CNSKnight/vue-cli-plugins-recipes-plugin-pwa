import recipeTemplate from '../models/recipeTemplate';
import { compose, filter, isEmpty, map, reject, trim } from 'lodash/fp';
import { isObject, isString, transform } from 'lodash';

const ingredient = recipeTemplate.ingredients[0];
const method = recipeTemplate.methods[0];
export default {
  /*
  * @todo remove empty or blacklisted tags or blacklisted chars
  */
  filterRecipe(recipe) {
    // final filters return empty []'s rather than null|undefined,
    // in order to re-init property in document. ie not passing eg tags: [],
    // will just set tags: [{}] in collection document
    recipe.tools = this.filterStrAry(recipe.tools, 'name');
    recipe.tags = this.filterStrAry(recipe.tags);
    recipe.ingredients = this.filterIngredients(recipe.ingredients);
    delete recipe.method;
    recipe.methods = this.filterMethods(recipe.methods);
    recipe.variations = this.filterStrAry(recipe.variations);
    recipe.creator = trim(recipe.creator);
    recipe.originalUrl = trim(recipe.originalUrl);
    recipe.description = trim(recipe.description);
    recipe.subTitle = trim(recipe.subTitle);
    recipe.notes = trim(recipe.notes);
  },

  trimObjStrings: (obj, val, key) => {
    if (!key) return obj;
    obj[key] = isString(val) ? trim(val) : val;
    return obj;
  },

  filterIngredients(ingredients) {
    if (!ingredients || !ingredients.length) {
      return [];
    }

    const valids = compose(
      filter(ing => ing.name.length),
      map(ing => transform(ing, this.trimObjStrings, { ...ingredient })),
      reject(isEmpty)
    )(ingredients);
    return valids;
  },

  filterMethods(methods) {
    if (!methods || !methods.length) {
      return [];
    }

    const valids = compose(
      filter(met => met.text.length),
      map(ing => transform(ing, this.trimObjStrings, { ...method })),
      reject(isEmpty)
    )(methods);
    return valids;
  },

  filterStrAry(ary, check = 'text') {
    if (!ary || !ary.length) {
      return [];
    }

    const valids = compose(
      filter(
        item =>
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
  }
};
