<template class="tester" src="./details.html"></template>

<script>
import { mapGetters, mapActions, defineAsyncComponent } from 'vuex';
import { mapFields, mapMultiRowFields } from 'vuex-map-fields';
import ActionsBar from '@/components/actions-bar/ActionsBar.vue';
import IngredientGroups from './IngredientGroups.vue';
import MethodStepGroups from './MethodStepGroups.vue';
import NotificationsLocal from '@/components/notifications/NotificationsLocal.vue';

export default {
  components: {
    'actions-bar': ActionsBar,
    'ingredient-groups': IngredientGroups,
    'method-step-groups': MethodStepGroups,
    'recipe-preview': defineAsyncComponent({
      loader: () => import('@/components/recipe-preview/RecipePreview')
    }),
    'notifs-local': NotificationsLocal
  },
  props: {
    transformMarkdown: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      actionContext: 'details',
      // test may change if full-app ever developed
      isNotPlugin: process.env.NODE_ENV !== 'production'
    };
  },
  computed: {
    ...mapGetters(['isModified', 'detailsFormValid', 'preview']),
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
    ...mapMultiRowFields([
      'recipe.tools',
      'recipe.methods',
      'recipe.tags',
      'recipe.variations'
    ])
  },
  mounted() {
    this.onFormUpdated();
  },
  updated() {
    this.onFormUpdated();
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
    ...mapActions({
      // same as this.$store.dispatch('whatever'[, payload])
      onSubmit: 'save',
      onCancel: 'cancel',
      onReset: 'reset',
      addItem: 'addItem',
      deleteItem: 'deleteItem'
    }),
    // get textarea ID
    getTAID(id, idx) {
      let label = id !== undefined ? id : 'newID';
      let count = idx + 1;
      return label.toString().concat('-rTA-', count.toString());
    },
    onOpenPreview() {
      this.$store.dispatch('openPreview');
      const toScroll =
        (window && window.$$ && window.$$('.modal-content')) || window;
      toScroll && toScroll.scrollTo && toScroll.scrollTo({ top: 0 });
    },
    onClosePreview() {
      this.$store.dispatch('closePreview');
    }
  }
};
</script>

<style lang="scss">
/* all specific to the transitions */
.recipes .container,
.modal-content .container {
  width: auto;
}
.formview {
  &.fade {
    transition: opacity 0.8s;
    &.in {
      opacity: 1;
    }
    &.out {
      opacity: 0;
    }
  }
  fieldset.col {
    padding-top: 1em;
  }
  fieldset > .row,
  fieldset .met .row,
  fieldset .ing .row {
    margin-bottom: 10px;
  }
  .vars textarea {
    padding-bottom: 0;
  }
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
