<template>
  <div class="notifs">
    <notifs-notif
      v-for="(notif, idx) in notifications"
      :key="idx"
      :notif="notif"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Notification from './Notification.vue';
export default {
  components: {
    'notifs-notif': Notification,
  },
  computed: mapGetters(['notifications']),
};
</script>
