<template>
  <div class="met">
    <div class="row">
      <input :name="`step-${idx}`" v-model="methods[idx].step" hidden>
      <div class="input-field col s12 m10">
        <textarea :id="`step-${idx}-text`" class="materialize-textarea" name="`step-${idx}-text`"
          v-model="methods[idx].text" placeholder="Step Content" />
        <label :for="`step-${idx}-text`" v-text="getStepLabel()" />
      </div>
      <div class="input-field col s12 m2 center-align">
        <button class="btn-flat btn-sm red-text" type="button" @click.stop="deleteStep">
          <i class="material-icons">delete</i>
        </button>
      </div>
    </div>
    <div v-if="canDrag" class="dragWrapper" title="Drag-to-Reorder (coming soon)">
      <i class=" material-icons ">
        drag_indicator
      </i>
    </div>
  </div>
</template>
<script>
import { mapMultiRowFields } from 'vuex-map-fields';
import { padStart } from 'lodash';
export default {
  props: ['idx', 'canDrag'],
  computed: {
    ...mapMultiRowFields(['recipe.methods'])
  },
  updated() {
    this.$emit('updated');
  },
  methods: {
    // get textarea label
    getStepLabel() {
      return 'Step #'.concat(
        padStart(this.methods[this.idx].step.toString(), 2, '0')
      );
    },
    deleteStep() {
      this.$emit('onEvent', 'deleteItem', {
        prop: 'methods',
        index: this.idx
      });
    }
  }
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
