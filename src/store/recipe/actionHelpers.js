import { chain, forOwn, isEmpty, isObject, map, negate, trim } from 'lodash';

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
    recipe.methods = this.filterStrAry(recipe.methods);
    recipe.variations = this.filterStrAry(recipe.variations);
    recipe.creator = trim(recipe.creator);
    recipe.originalUrl = trim(recipe.originalUrl);
    recipe.description = trim(recipe.description);
    recipe.subTitle = trim(recipe.subTitle);
    recipe.notes = trim(recipe.notes);
  },

  filterIngredients(ingredients) {
    if (!ingredients || !ingredients.length) {
      return [];
    }

    const valids = chain(ingredients)
      .reject(ing => isEmpty(ing))
      .map(ing => {
        forOwn(ing, (val, idx, ing) => ing[idx] = trim(val));
        return ing;
      })
      .filter(ing => ing.name.length)
      .value();
    return valids;
  },

  filterStrAry(ary, check = 'text') {
    if (!ary || !ary.length) {
      return [];
    }

    const valids = chain(ary)
      .reject(item => isEmpty(item))
      .map(item => {
        if (isObject(item)) {
          item[check] = trim(item[check]);
        } else {
          item = trim(item);
        }
        return item;
      })
      .filter(item => isObject(item)
        ? (item[check] && item[check].length)
        : item.length)
      .value();
    return valids;
  }
};
