<template>
    <div class="ing">
        <div class="row">
            <div class="input-field col s6 m3">
                <input :id="`ing-${idx}-qty`" :name="`ing-${idx}-qty`" v-model="ingredients[idx].qty"
                    placeholder="qty?" type="text">
                <label :for="`ing-${idx}-qty`" class="sr-only sr-only-focusable">Quantity</label>
            </div>
            <div class="input-field col s6 m3">
                <input :id="`ing-${idx}-unit`" :name="`ing-${idx}-unit`" v-model="ingredients[idx].unit"
                    placeholder="Units?" type="text">
                <label :for="`ing-${idx}-unit`" class="sr-only sr-only-focusable">Units</label>
            </div>
            <div class="input-field col s6 m3 center-align">
                <input :id="`ing-${idx}-opt`" :name="`ing-${idx}-opt`" v-model="ingredients[idx].optional"
                    placeholder="optional?" type="checkbox">
                <label :for="`ing-${idx}-opt`">Optional?</label>
            </div>
            <div class="input-field col s6 m3 center-align">
                <button class="btn-flat btn-sm red-text" type="button" @click.stop="deleteIng">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </div>
        <div class="row">
            <div class="input-field col s12 m6">
                <input :id="`ing-${idx}-name`" :name="`ing-${idx}-name`" v-model="ingredients[idx].name"
                    placeholder="Name this Ingredient" type="text">
                <label :for="`ing-${idx}-name`" class="sr-only sr-only-focusable">Ingredient</label>
            </div>
            <div class="input-field col s12 m6">
                <input :id="`ing-${idx}-prep`" :name="`ing-${idx}-prep`" v-model="ingredients[idx].preparation"
                    placeholder="Preparation?" type="text">
                <label :for="`ing-${idx}-prep`" class="sr-only sr-only-focusable">Preparation</label>
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
export default {
  props: ['ingredient', 'idx', 'canDrag'],
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
        index: this.idx
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.ing {
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
