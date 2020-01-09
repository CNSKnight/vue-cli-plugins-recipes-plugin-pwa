<template>
  <div class="notifs">
    <p
      v-for="(notif, idx) in notifications"
      :key="idx"
      :class="[notif.severity || 'info', 'acap_' + (notif.severity || 'info')]"
      :title="notif.service"
      v-html="infoIcon + ' ' + notif.error"
    >
      {{ notif }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      infoIcon: '<i class="material-icons left">info</i>'
    };
  },
  computed: mapGetters(['notifications'])
};
</script>
