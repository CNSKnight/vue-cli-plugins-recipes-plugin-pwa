<template>
  <recipe-details v-if="hasRecipe" v-bind="{transformMarkdown}"></recipe-details>
</template>

<script>
import { mapActions } from 'vuex';
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
    'recipe-details': RecipeDetails
  },
  data: () => {
    return { isPreAuth: null };
  },
  // computed: {...mapGetters(['recipes'])},
  computed: {
    hasRecipe() {
      return this.$store.getters.recipeId;
    }
  },
  methods: {
    toggle(what) {
      this.hasOwnProperty(what) && (this[what] = !this[what]);
    },
    ...mapActions([]),
    transformMarkdown(markdown) {
      return markdown && md.render(markdown);
    }
  },
  created() {
    this.$store.dispatch('loadRecipe');
  }
};
</script>

<style scoped>
.stack {
  position: relative;
}
.recipes {
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
</style>
