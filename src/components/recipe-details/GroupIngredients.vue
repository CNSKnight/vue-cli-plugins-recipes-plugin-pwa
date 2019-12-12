<template>
  <div class="ing">
    <div class="row">
      <div class="input-field col s6 m3">
        <input
          :id="`ing-${modelIdx}-qty`"
          v-model="ingredients[modelIdx].qty"
          :name="`ing-${modelIdx}-qty`"
          placeholder="qty?"
          type="text"
        />
        <label :for="`ing-${modelIdx}-qty`" class="sr-only sr-only-focusable"
          >Quantity</label
        >
      </div>
      <div class="input-field col s6 m3">
        <input
          :id="`ing-${modelIdx}-unit`"
          v-model="ingredients[modelIdx].unit"
          :name="`ing-${modelIdx}-unit`"
          placeholder="Units?"
          type="text"
        />
        <label :for="`ing-${modelIdx}-unit`" class="sr-only sr-only-focusable"
          >Units</label
        >
      </div>
      <div class="input-field col s6 m3 center-align">
        <input
          :id="`ing-${modelIdx}-opt`"
          v-model="ingredients[modelIdx].optional"
          :name="`ing-${modelIdx}-opt`"
          placeholder="optional?"
          type="checkbox"
        />
        <label :for="`ing-${modelIdx}-opt`">Optional?</label>
      </div>
      <div class="input-field col s6 m3 center-align">
        <button
          class="btn-flat btn-sm red-text"
          type="button"
          @click.stop="deleteIng"
        >
          <i class="material-icons">delete</i>
        </button>
      </div>
    </div>
    <div class="row">
      <div class="input-field col s12 m6">
        <input
          :id="`ing-${modelIdx}-name`"
          v-model="ingredients[modelIdx].name"
          :name="`ing-${modelIdx}-name`"
          placeholder="Name this Ingredient"
          type="text"
          required
        />
        <label :for="`ing-${modelIdx}-name`" class="sr-only sr-only-focusable"
          >Ingredient</label
        >
      </div>
      <div class="input-field col s12 m6">
        <input
          :id="`ing-${modelIdx}-prep`"
          v-model="ingredients[modelIdx].preparation"
          :name="`ing-${modelIdx}-prep`"
          placeholder="Preparation?"
          type="text"
        />
        <label :for="`ing-${modelIdx}-prep`" class="sr-only sr-only-focusable"
          >Preparation</label
        >
      </div>
    </div>
    <div
      v-if="canDrag"
      class="dragWrapper"
      title="Drag-to-Reorder (coming soon)"
    >
      <i class=" material-icons ">
        drag_indicator
      </i>
    </div>
  </div>
</template>
<script>
import { mapMultiRowFields } from 'vuex-map-fields';
export default {
  props: {
    // ingredients: { type: Array, required: true },
    modelIdx: { type: Number, required: true },
    canDrag: Boolean
  },
  computed: {
    ...mapMultiRowFields(['recipe.ingredients'])
  },
  updated() {
    this.$emit('updated');
  },
  methods: {
    deleteIng() {
      this.$emit('onEvent', 'deleteItem', {
        prop: 'ingredients',
        index: this.modelIdx
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.ing {
  position: relative;
  .row {
    margin-bottom: 5px;
  }
  .dragWrapper {
    display: none;
    position: absolute;
    top: 50%;
    right: -0.75rem;
    transform: translateY(-50%);
    border: 1px solid lightgrey;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border-right-width: 0;
    padding-left: 1px;
    color: lightgrey;
    i {
      vertical-align: middle;
    }
  }
  &:hover .dragWrapper {
    display: block;
    &:hover {
      cursor: move;
    }
  }
  & + .ing {
    border-top: 3px dashed rgba(158, 157, 36, 0.4);
  }
}
</style>
