<template>
  <div id="ing-groups">
    <div
      class="row"
      v-for="(ingredients, group) in groupedIngredients"
      :key="group"
    >
      <fieldset class="col s12">
        <legend
          v-text="group !== 'default' ? 'Ingredients Group' : 'Ingredients'"
        />
        <template v-if="group !== 'default'">
          <div class="row group">
            <div class="input-field col s12">
              <input
                :id="'group-' + group"
                :value="group == 'Unnamed' ? '' : group"
                @input="updateGroupName(group, $event.target.value)"
                :idx="group"
                type="text"
                placeholder="Unnamed Group"
              />
              <label :for="'group-' + group" class="sr-only sr-only-focusable"
                >Group Name</label
              >
            </div>
          </div>
        </template>
        <group-ingredients
          v-for="(ingredient, idx) in ingredients"
          :key="idx"
          :ingredient="ingredient"
          :idx="idx"
          :canDrag="!isModified && ingCountByGroup(group) > 1"
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
        <div class="row">
          <div v-if="group == lastGroup" class="col s12">
            <notifs-local />
          </div>
          <div v-if="group == lastGroup" class="col s6 center-align">
            <button
              class="btn btn-sm grey lighten-5"
              type="button"
              @click="onEvent('addItem', 'ingredients', 'group')"
              title="Adds an Ingredients Group for Mult-Part Recipes"
            >
              <i class="material-icons left">add</i> Group
            </button>
          </div>
          <template v-if="group == lastGroup">
            <div class="col s6 center-align">
              <button
                class="btn btn-sm grey lighten-5"
                type="button"
                @click="onEvent('addItem', 'ingredients')"
                title="adds an Ingredient to the default group"
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
                @click="
                  onEvent('addItem', 'ingredients', undefined, { group: group })
                "
                title="adds an Ingredient to this group"
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
import NotificationsLocal from "@/components/notifications/NotificationsLocal";
import GroupIngredients from "./GroupIngredients";
import { mapGetters } from "vuex";
import { mapFields } from "vuex-map-fields";
import { isEqual, isObject, debounce, keys } from "lodash";

const updateGroupName = function(groupName, val) {
  const payload = {
    from: this.groupNames[groupName],
    to: val || "Unnamed"
  };
  this.$store.dispatch("updateIngredientsGroup", payload);
};

export default {
  components: {
    "group-ingredients": GroupIngredients,
    "notifs-local": NotificationsLocal
  },
  data() {
    return {
      // the local mirror
      groupNames: [...this.$store.getters.ingredientGroups]
    };
  },
  computed: {
    ...mapGetters([
      "ingCountByGroup",
      "isModified",
      "groupedIngredients",
      "ingredientGroups"
    ]),
    ...mapFields(["recipe.ingredients"]),
    lastGroup: ({ ingredientGroups }) => [...ingredientGroups].pop()
  },
  created() {
    this.groupNames = keys(this.groupedIngredients);
  },
  methods: {
    updateGroupName: debounce(updateGroupName, 700),
    isInGroup(group, test) {
      return test == group || (!test && group == "default");
    },
    // Remember! the parent component must be listening for the 'event' via @event="parentHandler"
    // we also don't otherwise need to define that 'event' on our props
    onEvent(event, prop, attr, val) {
      const payload = isObject(prop) ? { ...prop } : { prop, attr, val };
      // cannot send a $el ref into the store
      this.$el.id && (payload.actionContext = this.$el.id);
      this.$emit(event, payload);
    }
  },
  watch: {
    // our locally mutable groupNames should mirror the ingredientGroups reactively
    ingredientGoups: function(val) {
      !isEqual(val, this.groupNames) && (this.groupNames = [...val]);
    }
  }
};
</script>
