<template>
  <div class="row recipes">
    <div class="col s12 m5 stack">
      <template v-if="!hasRecipes">
        <p v-if="!hasRecipes">No recipes were provided</p>
      </template>
      <template v-else>
        <ul class="listing collection with-header">
          <li class="collection-header">
            <h4 class="action-bar">
              Recipes
              <button class="btn btn-flat right" @click="toggle('showCards')">
                <i
                  class="material-icons medium orange-text text-lighten-2"
                  v-text="showCards ? 'view_list' : 'view_agenda'"
                ></i>
              </button>
            </h4>
          </li>
          <recipes-listing v-if="!showCards">
            <div idkyet>{{ 'Recipes Loading' }}...</div>
          </recipes-listing>
          <recipes-cards v-if="showCards" v-bind="{ transformMarkdown }">
          </recipes-cards>
        </ul>
        <blockquote v-if="isPreAuth">
          @note Posts and Puts won't work with preAuth from a non-same-origin.
        </blockquote>
        <div class="backwall"></div>
      </template>
    </div>
    <div class="col s12 m7">
      <div class="container">
        <recipe-details v-bind="{ transformMarkdown }"></recipe-details>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import RecipesListing from '@/components/recipes-listing/RecipesListing';
import RecipesCards from '@/components/recipes-cards/RecipesCards';
import RecipeDetails from '@/components/recipe-details/RecipeDetails';
import * as MarkdownIt from 'markdown-it';
const md = MarkdownIt({
  html: true,
  linkify: false,
  html_inline: true,
  escape: false
});

export default {
  components: {
    'recipes-listing': RecipesListing,
    'recipes-cards': RecipesCards,
    'recipe-details': RecipeDetails
  },
  data: () => {
    return { showCards: false, isPreAuth: null };
  },
  // computed: {...mapGetters(['recipes'])},
  computed: {
    hasRecipes() {
      return this.$store.getters.recipes.length;
    }
  },
  created() {
    this.$store.dispatch('loadRecipes');
  },
  methods: {
    toggle(what) {
      Object.prototype.hasOwnProperty.call(this, what) &&
        (this[what] = !this[what]);
    },
    ...mapActions([]),
    transformMarkdown(markdown) {
      return markdown && md.render(markdown);
    }
  }
};
</script>

<style scoped>
/* these all specific to transitions setup */
.stack {
  position: relative;
}
.listing {
  z-index: 2;
}
.preview {
  z-index: 3;
}
.backwall {
  position: absolute;
  background-color: white;
  height: 99vh;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
/* cards, listing rules */

.listing.collection .collection-item,
.listing.collection .card {
  border-left: 5px solid transparent;
  /*padding-left: 25px*/
  cursor: pointer;
}

.listing.collection .collection-item.active,
.listing.collection .card.active {
  border-left-color: rgb(158, 157, 36);
}

.listing.collection .collection-item.active {
  background: inherit;
}

.listing.collection .collection-item.active,
.listing.collection .collection-item.active .secondary-content {
  color: rgb(158, 157, 36);
}
</style>
