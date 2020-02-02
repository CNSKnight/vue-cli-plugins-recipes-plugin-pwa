<!--
  sample _globals component
  https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_base-button.vue
-->
<template>
  <button :class="$style.button" v-on="$listeners">
    <slot />
  </button>
</template>

<style lang="scss" module>
@import '@design';
.button {
  @extend %typography-small;
  padding: $size-button-padding;
  color: $color-button-text;
  cursor: pointer;
  background: $color-button-bg;
  border: none;
  &:disabled {
    cursor: not-allowed;
    background: $color-button-disabled-bg;
  }
}
</style>
