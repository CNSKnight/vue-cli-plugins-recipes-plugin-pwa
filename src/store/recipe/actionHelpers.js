import { isEmpty, isObject } from 'lodash';

export default {
  /*
  * @todo remove empty or blacklisted tags or blacklisted chars
  */
  filterRecipe(recipe) {
    // final filters return empty []'s rather than null|undefined,
    // in order to re-init property in document. ie not passing eg tags: [],
    // will just set tags: [{}] in collection document
    recipe.tags = this.filterStrAry(recipe.tags);
    recipe.ingredients = this.filterIngredients(recipe.ingredients);
    recipe.method = this.filterStrAry(recipe.method);
    recipe.variations = this.filterStrAry(recipe.variations);
    recipe.notes = recipe.notes && recipe.notes.trim();
    return recipe;
  },

  filterIngredients(ingredients) {
    if (!ingredients || !ingredients.length) {
      return [];
    }

    let valids = ingredients.filter(ing => {
      if (isEmpty(ing)) {
        return false;
      }
      return (
        ing.group.trim().length ||
        ing.qty.trim().length ||
        ing.unit.trim().length ||
        ing.name.trim().length
      );
    });
    return valids;
  },

  filterStrAry(ary) {
    if (!ary || !ary.length) {
      return [];
    }

    let valids = ary.filter(item => {
      if (isEmpty(item)) {
        return false;
      }
      if (isObject(item)) {
        return item.text.trim().length;
      } else {
        return item.trim().length;
      }
    });
    return valids;
  },

  groupIngredients(ingredients) {
    return ingredients;
  }
};
