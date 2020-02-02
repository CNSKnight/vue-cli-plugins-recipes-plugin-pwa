<template>
  <div class="ingGroups">
    <div
      v-for="(ingIndexes, group, idx) in groupedIngredients"
      :key="group"
      class="row"
    >
      <fieldset class="col s12">
        <legend
          v-text="
            group !== 'default'
              ? (group && `${group} (group) Ingredients`) ||
                `Unnamed Ingredients Group ${idx}`
              : 'Ingredients (Default Group)'
          "
        />
        <template v-if="group !== 'default'">
          <div class="row">
            <div class="col s12 notifs">
              <notifs-local :action-context="actionContext + 'Grp' + idx" />
            </div>
          </div>
          <div class="row group">
            <!-- v-model="ingredients[ingIndexes[0]].group || 'Unnamed'", -->
            <div class="input-field col s12">
              <input
                :id="'group-' + idx"
                :ref="'group-' + idx"
                type="text"
                :idx="group"
                :value="group == 'Unnamed' ? '' : group"
                placeholder="Unnamed Group"
                @change="
                  updateGroupName(
                    actionContext + 'Grp' + idx,
                    [...ingIndexes],
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
        <group-ingredients
          v-for="modelIdx in ingIndexes"
          :key="modelIdx"
          :model-idx="modelIdx"
          :can-drag="!isModified && ingCountByGroup(group) > 1"
          @onEvent="onEvent"
          @updated="$emit('updated')"
        />
        <div
          v-if="group == 'default' && !ingCountByGroup(group)"
          class="tip-wrapper centered mb-md"
        >
          <p class="tip">
            Here you can:<br />&bull; Add a new "named" Ingredients Group
            <br />&bull; Add ingredients to this "default" Group
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
              title="Adds an Ingredients Group for Mult-Part Recipes"
              @click="
                onEvent('addItem', {
                  prop: 'ingredients',
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
                title="adds an Ingredient to the default group"
                @click="onEvent('addItem', 'ingredients')"
              >
                <i class="material-icons left">add</i> Ingredient
              </button>
            </div>
          </template>
          <template v-else>
            <div class="col s12 center-align">
              <button
                class="btn btn-sm grey lighten-5"
                type="button"
                title="adds an Ingredient to this group"
                @click="onEvent('addItem', 'ingredients', undefined, { group })"
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
import GroupIngredients from './GroupIngredients';
import { mapGetters } from 'vuex';
// import { mapFields } from 'vuex-map-fields';
import { isEqual, isObject, debounce, keys } from 'lodash';

const updateGroupNamePrev = function(group, target) {
  this.$store.dispatch('updateIngredientsGroup', {
    from: group,
    to: target.value || 'Unnamed',
    focus: target
  });
  const id = target.id;
  id &&
    this.$nextTick(function() {
      this.$refs[target.id][0].focus();
    });
};

export default {
  components: {
    'group-ingredients': GroupIngredients,
    'notifs-local': NotificationsLocal
  },
  data() {
    return {
      // the local mirror
      groupNames: [...this.$store.getters.ingredientGroups],
      actionContext: 'ing-groups'
    };
  },
  computed: {
    ...mapGetters([
      'ingCountByGroup',
      'isModified',
      'groupedIngredients',
      'ingredientGroups'
    ]),
    // ...mapFields(['recipe.ingredients']),
    lastGroup: ({ ingredientGroups }) => [...ingredientGroups].pop()
  },
  watch: {
    // our locally mutable groupNames should mirror the ingredientGroups reactively
    ingredientGoups: function(val) {
      !isEqual(val, this.groupNames) && (this.groupNames = [...val]);
    }
  },
  created() {
    this.groupNames = keys(this.groupedIngredients);
    // similar to the way data should be a function that returns an object, each instance
    // needs its own debounce function if they are supposed to act independently.
    this.updateGroupNamePrev = debounce(updateGroupNamePrev, 700);
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
    updateGroupName(actionContext, ingIndexes, val) {
      return this.$store.dispatch('updateIngredientsGroup', {
        ingIndexes,
        toGroup: val || 'Unnamed',
        actionContext
      });
    }
  }
};
</script>
