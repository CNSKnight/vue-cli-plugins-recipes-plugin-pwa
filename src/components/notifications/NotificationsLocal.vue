<template>
  <div class="notifs-local">
    <p v-for="(notif, idx) in localNotifs" :key="idx">
      <BaseInfoIcon :severity="notif.severity" :title="notif.service" />
      {{ notif.error }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    actionContext: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(['notifsByActionContext']),
    localNotifs() {
      return this.notifsByActionContext(this.actionContext);
    }
  },
  methods: {
    getIcon: title =>
      `<i class="material-icons left" title="${title}">info</i> `
  }
};
</script>
