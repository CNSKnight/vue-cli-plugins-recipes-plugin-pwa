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
  created() {
    this.preview = false;
  },
  mounted() {
    this.onFormUpdated();
  },
  updated() {
    this.onFormUpdated();
  },
  watch: {
    $route(to, from) {
      console.log(to, '|', from);
    }
  },
  // RecipeDetails does not concern itself with sourcing it's data
  // ie whatever employs RecipeDetails should init data used here
  methods: {
    onFormUpdated() {
      window &&
        window.Materialize &&
        window.Materialize.updateTextFields &&
        this.$nextTick(() => window.Materialize.updateTextFields());
    },
    ...mapActions(['save', 'cancel', 'reset', 'addTo']),
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
      window && window.scrollTo({ top: 0 });
      this.preview = true;
    },
    closePreview() {
      this.preview = false;
    }
  }
};
</script>

<style>
.formview.fade.in {
  opacity: 1;
}
.formview.fade.out {
  opacity: 0;
}
.formview.fade {
  transition: opacity 0.8s;
}
/* --------------------------------- */
.preview {
  position: absolute;
  top: 0;
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
  transition: transform 1s, opacity 0.8s;
}
</style>
