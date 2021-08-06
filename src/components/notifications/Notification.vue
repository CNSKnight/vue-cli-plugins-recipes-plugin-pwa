<template>
  <p>
    <BaseInfoIcon :severity="notif.severity" :title="notif.service" />
    <span v-html="notif.message" />
  </p>
</template>

<script>
export default {
  props: {
    notif: {
      type: Object,
      default: () => ({
        severity: String,
        service: String,
        message: String,
      }),
      required: true,
    },
  },
};
</script>

<style lang="scss">
.notifs {
  p {
    line-height: 1.9;
    margin: 0 0 1rem;

    > i {
      margin-right: 0.3em;

      &.info {
        color: #bdbdbd;
      }

      &.warn {
        color: #ffab00;
      }

      &.error {
        color: #e57373;
      }

      &.fatal {
        color: #b71c1c;
      }
    }
  }
}
</style>
