<template>
  <div class="met">
    <div class="row">
      <input
        v-model="methods[modelIdx].step"
        :name="`step-${modelIdx}`"
        hidden
      />
      <div class="input-field col s12 m10">
        <textarea
          :id="`step-${modelIdx}-text`"
          v-model="methods[modelIdx].text"
          class="materialize-textarea"
          :name="`step-${modelIdx}-text`"
          placeholder="Step Directions"
        />
        <label :for="`step-${modelIdx}-text`" v-text="getStepLabel()" />
        <md-icon v-if="methods[modelIdx].step == 1" />
      </div>
      <div class="input-field col s12 m2 center-align">
        <button
          class="btn-flat btn-sm red-text"
          type="button"
          @click.stop="deleteStep"
        >
          <i class="material-icons">delete</i>
        </button>
      </div>
    </div>
    <div
      v-if="canDrag"
      class="dragWrapper"
      title="Drag-to-Reorder (coming soon)"
    >
      <i class="material-icons"> drag_indicator </i>
    </div>
  </div>
</template>
<script>
import { mapMultiRowFields } from 'vuex-map-fields';
import { padCharsStart } from 'lodash/fp';
export default {
  props: {
    // methods: { type: Array, required: true },
    modelIdx: { type: Number, required: true },
    canDrag: Boolean,
  },
  emits: ['updated', 'onEvent'],
  computed: {
    ...mapMultiRowFields(['recipe.methods']),
  },
  updated() {
    this.$emit('updated');
  },
  methods: {
    // get textarea label
    getStepLabel() {
      return 'Step #'.concat(
        padCharsStart('0')(2)(this.methods[this.modelIdx].step.toString())
      );
    },
    deleteStep() {
      this.$emit('onEvent', 'deleteItem', {
        prop: 'methods',
        index: this.modelIdx,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.ing,
.met {
  position: relative;
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
}
</style>
