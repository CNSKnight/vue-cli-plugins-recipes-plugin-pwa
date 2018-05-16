<template src="./details.html"></template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mapFields, mapMultiRowFields } from 'vuex-map-fields';
import ActionsBar from '@/components/actions-bar/ActionsBar';
import IngredientGroups from './IngredientGroups';
import RecipePreview from '@/components/recipe-preview/RecipePreview';
import { padStart } from 'lodash';
export default {
  components: {
    'actions-bar': ActionsBar,
    'ingredient-groups': IngredientGroups,
    'recipe-preview': RecipePreview
  },
  props: {
    transformMarkdown: Function
  },
  data() {
    return { preview: false };
  },
  computed: {
    ...mapGetters(['isModified', 'ingredientsGrouped']),
    ...mapFields([
      'recipe.id',
      'recipe.acapID',
      'recipe.published',
      'recipe.subTitle',
      'recipe.creator',
      'recipe.originalUrl',
      'recipe.description',
      'recipe.notes'
    ]),
    ...mapMultiRowFields(['recipe.method', 'recipe.tags', 'recipe.variations']),
    valid() {
      return true;
    }
  },
  watch: {
    // data(newValue, oldValue) {}
  },
  updated() {
    this.$nextTick(() => window && window.Materialize.updateTextFields());
  },

  methods: {
    ...mapActions(['loadRecipe', 'save', 'cancel', 'reset', 'addTo']),
    // get textarea label
    getTALabel(idx) {
      return 'Step #'.concat(padStart((idx + 1).toString(), 2, '0'));
    },
    // get textarea ID
    getTAID(id, idx) {
      let label = id !== undefined ? id : 'newID';
      let count = idx + 1;
      return label.toString().concat('-rTA-', count.toString());
    },
    addItem(payload) {
      debugger;
      this.$store.dispatch('addItem', payload);
    },
    deleteItem(payload) {
      this.$store.dispatch('deleteItem', payload);
    },
    onReset() {
      this.$store.dispatch('reset');
    },
    onCancel() {},
    onSubmit() {
      this.$store.dispatch('save');
    },
    openPreview() {
      this.preview = true;
    },
    closePreview() {
      this.preview = false;
    }
  }
};
</script>

<style>
.preview {
  overflow: hidden;
}
.preview-enter,
.preview-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.preview-enter-to {
  transform: translateX(0%);
  opacity: 1;
}
.preview-enter-active,
.preview-leave-active {
  transition: transform 1s, opacity 2s;
}
</style>
