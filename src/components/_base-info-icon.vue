<template>
  <i :class="`material-icons left ${severity} acap_${severity}`" :title="title">
    info
  </i>
</template>

<script>
export default {
  name: 'InfoIcon',
  props: {
    severity: { type: String, default: 'info' },
    title: { type: String, default: '' }
  }
};
</script>
