<template>
    <div>
        <div class="row" v-for="(group, idx) in methodGroups" :key="idx">
            <div v-if="group == lastGroup" class="col s12">
                <notifs-local />
            </div>
            <fieldset class="col s12">
                <legend v-text="group !== 'default' ? 'Method Group' : 'Method'" />
                <template v-if="group !== 'default'">
                    <div class="row group">
                        <div class="input-field col s12">
                            <input :id="'group-'+idx" :value="group == 'Unnamed' ? '' : group" @input="updateGroupName(idx, $event.target.value)"
                                :idx="idx" type="text" placeholder="Unnamed Group">
                            <label :for="'group-'+idx" class="sr-only sr-only-focusable">Group Name</label>
                        </div>
                    </div>
                </template>
                <group-method v-for="(step, idx) in methods" :key="idx" v-if="isInGroup(group, step.group)"
                    :idx="idx" :canDrag="!isModified && stepCountByGroup(group)>1" @onEvent="onEvent"
                    @updated="$emit('updated')" />
                <div v-if="group == 'default' && !stepCountByGroup(group)" class="tip-wrapper centered mb-lg">
                    <p class="tip">Here you can:<br>- Add a new "named" Method Group<br>- Add Steps
                        to this "default" Group</p>
                </div>
                <div class="row">
                    <div v-if="group == lastGroup" class="col s6 center-align">
                        <button class="btn btn-sm grey lighten-5" type="button" @click="onEvent('addItem', 'methods', 'group')"
                            title="Adds an Methods Group for Mult-Part Recipes">
                            <i class="material-icons left">add</i> Group
                        </button>
                    </div>
                    <template v-if="group == lastGroup">
                        <div class="col s6 center-align">
                            <button class="btn btn-sm grey lighten-5" type="button" @click="onEvent('addItem', 'methods')"
                                title="adds an Method to a group">
                                <i class="material-icons left">add</i> Method
                            </button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="col s12 center-align">
                            <button class="btn btn-sm grey lighten-5" type="button" @click="onEvent('addItem', 'methods', undefined, {group: group})"
                                title="adds an Method to a group">
                                <i class="material-icons">add</i>
                            </button>
                        </div>
                    </template>
                </div>
            </fieldset>
        </div>
    </div>
</template>

<script>
import NotificationsLocal from '@/components/notifications/NotificationsLocal';
import GroupMethod from './GroupMethod';
import { mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import { debounce, isEqual, isObject } from 'lodash';

const updateGroupName = function(idx, val) {
  const payload = {
    from: this.groupNames[idx],
    to: val || 'Unnamed'
  };
  this.$store.dispatch('updateMethodsGroup', payload);
};

export default {
  components: {
    'notifs-local': NotificationsLocal,
    'group-method': GroupMethod
  },
  data() {
    return {
      // the local mirror
      groupNames: [...this.$store.getters.methodGroups]
    };
  },
  computed: {
    ...mapGetters(['methodGroups', 'stepCountByGroup', 'isModified']),
    ...mapFields(['recipe.methods']),
    lastGroup({ methodGroups }) {
      return methodGroups[methodGroups.length - 1];
    }
  },
  created() {
    this.groupNames = [...this.methodGroups];
  },
  methods: {
    updateGroupName: debounce(updateGroupName, 700),
    isInGroup(group, test) {
      return test == group || (!test && group == 'default');
    },
    // Remember! the parent component must be listening for the 'event' via @event="parentHandler"
    // we also don't otherwise need to define that 'event' on our props
    onEvent(event, prop, attr, val) {
      const payload = isObject(prop) ? { ...prop } : { prop, attr, val };
      this.$el.id && (payload.context = this.$el.id);
      this.$emit(event, payload);
    }
  },
  watch: {
    // our locally mutable groupNames should mirror the methodGroups reactively
    methodGroups: function(val) {
      !isEqual(val, this.groupNames) && (this.groupNames = [...val]);
    }
  }
};
</script>
