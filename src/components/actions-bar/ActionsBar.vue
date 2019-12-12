<template>
  <div class="row">
    <div class="col s12 actions-bar">
      <button
        v-if="canCancel"
        class="btn-flat red-text"
        type="button"
        @click="$emit('cancel')"
      >
        <i class="material-icons left">cancel</i> Cancel
      </button>
      <button
        v-if="canReset"
        class="btn-flat red-text"
        type="button"
        title="Removes all changes since last save."
        @click="$emit('reset')"
      >
        <i class="material-icons left">restore</i> Reset
      </button>
      <button
        v-if="canPreview"
        type="button"
        class="btn-flat lime-text text-darken-3"
        @click="$emit('preview')"
      >
        <i class="material-icons left">remove_red_eye</i> Preview
      </button>
      <button
        v-if="canSave"
        :disabled="!valid"
        class="btn waves-effect waves-light grey lighten-5"
        type="submit"
      >
        <i v-if="isModified" class="modified left"></i>
        <i v-else class="material-icons left">save</i>
        Save
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    canCancel: Boolean,
    canReset: Boolean,
    canPreview: Boolean,
    canSave: Boolean,
    isModified: Boolean,
    valid: Boolean
  }
};
</script>
