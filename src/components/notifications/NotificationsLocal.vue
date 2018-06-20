<template>
  <div v-if="localNotifs.length" class="notifs">
    <p v-for="(notif, idx) in localNotifs" :key="idx" v-html="infoIcon+' '+notif.error"
      :class="[notif.severity || 'info', 'acap_'+(notif.severity ? notif.severity : 'info')]"
      :title="notif.service">
      {{notif}}
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      infoIcon: '<i class="material-icons">info</i>'
    };
  },
  computed: {
    ...mapGetters(['notifsByActionContext']),
    localNotifs() {
      return this.$parent.$el
        ? this.notifsByActionContext(this.$parent.$el.id)
        : [];
    }
  },
  methods: {}
};
</script>
