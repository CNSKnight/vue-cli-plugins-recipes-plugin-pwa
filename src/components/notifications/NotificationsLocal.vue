<template>
  <div class="notifs-local">
    <p
      v-for="(notif, idx) in localNotifs"
      :key="idx"
      :class="[notif.severity || 'info', 'acap_' + (notif.severity || 'info')]"
      :title="notif.service"
      v-html="getIcon(notif.service) + notif.error"
    >
      {{ notif }}
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
