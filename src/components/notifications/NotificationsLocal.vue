<template>
  <div class="notifs-local">
    <p
      v-for="(notif, idx) in localNotifs"
      :key="idx"
      :class="[
        notif.severity || 'info',
        'acap_' + (notif.severity ? notif.severity : 'info')
      ]"
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
  props: {
    actionContext: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      infoIcon: '<i class="material-icons left">info</i>'
    };
  },
  computed: {
    ...mapGetters(['notifsByActionContext']),
    localNotifs() {
      return this.notifsByActionContext(this.actionContext);
    }
  },
  methods: {}
};
</script>
