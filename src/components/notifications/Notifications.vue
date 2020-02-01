<template>
  <div class="notifs">
    <p v-for="(notif, idx) in notifications" :key="idx">
      <BaseInfoIcon :severity="notif.severity" :title="notif.service" />
      {{ notif.error }}
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
