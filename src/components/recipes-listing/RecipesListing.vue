<template>
  <div>
    <p v-if="!recipes">No recipes provided</p>
    <li class="collection-item" :class="{active: recipes.selected && (recipes.selected.id === recipe.id)}"
      v-for="recipe in recipes" :key="recipe.acapID" @click="selectRecipe(recipe)">
      <span class="secondary-content left">
        <i class="material-icons amber-text" v-if="! recipe.published">visibility_off</i>
        <i class="material-icons green-text" v-if="recipe.published">visibility</i>
      </span>
      <span v-if="hasChanges(recipe.id)" class="modified">M</span>
      {{recipe.title}}
      <span class="secondary-content">
        <i class="material-icons">send</i>
      </span>
    </li>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  computed: { ...mapGetters(['recipes', 'hasChanges']) },
  created() {
    this.$store.dispatch('loadRecipes');
  },
  // st about modules needing to be namespaced to use mapState?
  // computed: mapState('recipesModule', ['recipes']),
  methods: {
    ...mapActions(['selectRecipe'])
  }
};
</script>

<style scoped>
li.active {
  background-color: gainsboro;
}
span.modified {
  font-weight: bold;
  color: rgb(130, 119, 23);
  border: 1px solid rgb(136, 27, 237);
  padding: 1px 5px;
  border-radius: 12px;
  margin-right: 0.3em;
  font-variant: small-caps;
}
</style>
