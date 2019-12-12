<template>
  <div>
    <li
      v-for="recipe in recipes"
      :key="recipe.acapID"
      class="card"
      :class="{ active: selectedId === recipe.id }"
      style="overflow: hidden;"
    >
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="images/office.jpg" />
      </div>
      <div class="card-content">
        <span class="card-title activator grey-text text-darken-4">
          <span class="secondary-content left">
            <i
              class="material-icons amber-text text-lighten-2"
              v-text="recipe.published ? 'visibility' : 'visibility_off'"
            ></i>
          </span>
          <span class="title" @click="selectRecipe(recipe)">{{
            recipe.title
          }}</span>
          <i class="material-icons right">more_vert</i>
        </span>
      </div>
      <div class="card-action">
        <a href="#">This is a link</a>
        <a href="#" @click.stop="$emit('delete', 'recipe', recipe)">
          <i class="material-icons">delete_forever</i>
        </a>
      </div>
      <div
        class="card-reveal"
        style="display: none; transform: translateY(0px);"
      >
        <span class="card-title grey-text text-darken-4"
          ><span @click="selectRecipe(recipe)">{{ recipe.title }}</span>
          <i class="material-icons right">close</i>
        </span>
        <!--div>
            <rating-comp [interactive]="false" [rate]="recipe.rating"></rating-comp>
            {{recipe.rating}}
        </div-->
        <p>
          <span v-for="(tag, idx) in recipe.tags" :key="idx" class="chip"
            >#{{ tag.text }}</span
          >
        </p>
        <div>Created by: {{ recipe.creator }}</div>
        <div v-html="transformMarkdown(recipe.description)"></div>
      </div>
    </li>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  props: {
    transformMarkdown: {
      type: Function,
      required: true
    }
  },
  computed: { ...mapGetters(['selectedId', 'recipes', 'hasChanges']) },
  // st about modules needing to be namespaced to use mapState?
  // computed: mapState('recipesModule', ['recipes']),
  methods: {
    ...mapActions(['selectRecipe'])
  }
};
</script>

<style scoped>
.secondary-content.left {
  margin-right: 0.5em;
}
.card.active .title {
  color: rgb(136, 27, 237);
}
</style>
