
<template>
    <div class="row">
        <div v-if="!id" class="col s4 center-align">
            <button class="btn-flat red-text" type="button" @click="$emit('cancel')">
                <i class="material-icons left">cancel</i> Cancel
            </button>
        </div>
        <div class="col s4 center-align">
            <button v-if="isModified" class="btn-flat red-text" type="button" @click="$emit('reset')"
                title="Removes all changes since last save.">
                <i class="material-icons left">restore</i> Reset
            </button>
        </div>
        <div class="col s4 center-align">
            <button v-if="id" type="button" class="btn-flat lime-text text-darken-3 modal-trigger"
                data-target="#rPrevModal" @click="$emit('preview')">
                <i class="material-icons left">remove_red_eye</i> Preview
            </button>
        </div>
        <div class="col s4 center-align">
            <button :disabled="! valid" class="btn waves-effect waves-light grey lighten-5"
                type="submit">
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
    id: String,
    isModified: Boolean,
    valid: Boolean,
    hasChanges: Function
  }
};
</script>
