<template>
  <div>
    <p v-if="!recipes">No recipes provided</p>
    <li class="collection-item" :class="{active: selectedId === recipe.id}" v-for="recipe in recipes"
      :key="recipe.acapID" @click="selectRecipe(recipe)">
      <span class="secondary-content left">
        <i class="material-icons amber-text text-lighten-2" v-text="recipe.published ? 'visibility' : 'visibility_off'"></i>
      </span>
      <i v-if="hasChanges(recipe.id)" class="modified"></i>
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
  computed: { ...mapGetters(['selectedId', 'recipes', 'hasChanges']) },
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
.secondary-content.left {
  margin-right: 0.5em;
}
</style>
