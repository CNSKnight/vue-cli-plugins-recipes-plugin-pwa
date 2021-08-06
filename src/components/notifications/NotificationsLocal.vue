<template>
  <div class="notifs local">
    <notifs-notif
      v-for="(notif, idx) in localNotifs"
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
  props: {
    actionContext: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['notifsByActionContext']),
    localNotifs() {
      return this.notifsByActionContext(this.actionContext);
    },
  },
};
</script>
