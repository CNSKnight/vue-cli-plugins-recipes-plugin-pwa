<template>
  <div class="metGroups">
    <div
      v-for="(stepIndexes, group, idx) in groupedMethods"
      :key="group"
      class="row"
    >
      <fieldset class="col s12">
        <legend
          v-text="
            group !== 'default' ? 'Method Group' : 'Method (Default Group)'
          "
        />
        <template v-if="group !== 'default'">
          <div class="row">
            <div class="col s12 notifs">
              <notifs-local :action-context="actionContext + 'Grp' + idx" />
            </div>
          </div>
          <div class="row group">
            <div class="input-field col s12">
              <input
                :id="'group-' + idx"
                :idx="group"
                type="text"
                :value="group == 'Unnamed' ? '' : group"
                placeholder="Unnamed Group"
                @change="
                  updateGroupName(
                    actionContext + 'Grp' + idx,
                    [...stepIndexes],
                    $event.target.value
                  )
                "
              />
              <label :for="'group-' + group" class="sr-only sr-only-focusable"
                >Group Name</label
              >
            </div>
          </div>
        </template>
        <group-method
          v-for="modelIdx in stepIndexes"
          :key="modelIdx"
          :model-idx="modelIdx"
          :can-drag="!isModified && stepCountByGroup(group) > 1"
          @onEvent="onEvent"
          @updated="$emit('updated')"
        />
        <div
          v-if="group == 'default' && !stepCountByGroup(group)"
          class="tip-wrapper centered mb-md"
        >
          <p class="tip">
            Here you can: <br />&bull; Add a new "named" Method Group
            <br />&bull; Add steps to this "default" Group
          </p>
        </div>
        <div v-if="group == lastGroup" class="row">
          <div class="col s12 notifs">
            <notifs-local :action-context="actionContext + '-grp-def'" />
          </div>
        </div>
        <div class="row">
          <div v-if="group == lastGroup" class="col s6 center-align">
            <button
              class="btn btn-sm grey lighten-5"
              type="button"
              title="Adds an Methods Group for Mult-Part Recipes"
              @click="
                onEvent('addItem', {
                  prop: 'methods',
                  attr: 'group',
                  actionContext: actionContext + '-grp-def'
                })
              "
            >
              <i class="material-icons left">add</i> Group
            </button>
          </div>
          <template v-if="group == lastGroup">
            <div class="col s6 center-align">
              <button
                class="btn btn-sm grey lighten-5"
                type="button"
                title="adds an Method to a group"
                @click="onEvent('addItem', 'methods')"
              >
                <i class="material-icons left">add</i> Step
              </button>
            </div>
          </template>
          <template v-else>
            <div class="col s12 center-align">
              <button
                class="btn btn-sm grey lighten-5"
                type="button"
                title="adds an Method to a group"
                @click="onEvent('addItem', 'methods', undefined, { group })"
              >
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
// import { mapFields } from 'vuex-map-fields';
import { isEqual, isObject, keys } from 'lodash';

export default {
  components: {
    'group-method': GroupMethod,
    'notifs-local': NotificationsLocal
  },
  data() {
    return {
      // the local mirror
      groupNames: [...this.$store.getters.methodGroups],
      actionContext: 'met-groups'
    };
  },
  computed: {
    ...mapGetters([
      'stepCountByGroup',
      'isModified',
      'groupedMethods',
      'methodGroups'
    ]),
    lastGroup: ({ methodGroups }) => [...methodGroups].pop()
  },
  watch: {
    // our locally mutable groupNames should mirror the methodGroups reactively
    methodGroups: function(val) {
      !isEqual(val, this.groupNames) && (this.groupNames = [...val]);
    }
  },
  created() {
    this.groupNames = keys(this.groupedMethods);
  },
  methods: {
    isInGroup(group, test) {
      return test == group || (!test && group == 'default');
    },
    // Remember! the parent component must be listening for the 'event' via @event="parentHandler"
    // we also don't otherwise need to define that 'event' on our props
    onEvent(event, prop, attr, val, actionContext) {
      const payload = isObject(prop)
        ? { ...prop }
        : { prop, attr, val, actionContext };
      this.$emit(event, payload);
    },
    updateGroupName(actionContext, stepIndexes, val) {
      return this.$store.dispatch('updateMethodsGroup', {
        stepIndexes,
        toGroup: val || 'Unnamed',
        actionContext
      });
    }
  }
};
</script>
