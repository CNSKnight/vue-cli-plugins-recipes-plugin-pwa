<template>
  <section class="preview">
    <header>
      <div>Preview</div>
      <h6 v-if="isModified" class="alert grey-text text-darken-2">
        <i class="material-icons grey-text">warning</i>
        Note: This preview will not reflect any unsaved changes.
      </h6>
    </header>
    <div v-if="(recipe = staged) && recipe.id" class="row flow-text">
      <div class="col s12">
        <div class="row">
          <div class="col s12">
            <h1>{{ recipe.title }}</h1>
            <h2 v-if="recipe.subTitle">{{ recipe.subTitle }}</h2>
            <h3>Recipe ID: {{ recipe.acapID }}</h3>
          </div>
        </div>
        <div class="row">
          <div class="col s12 light-green lighten-3 meta-bar">
            <div v-if="recipe.creator">
              <label>Created By:</label>
              {{ recipe.creator }}
            </div>
            <div>
              <template v-if="recipe.publishedDate">
                <label>Published</label>
                <span>{{
                  dateFormated(recipe.publishedDate, 'mmm/yyyy')
                }}</span>
              </template>
              <template v-else>
                <label>Un-Published</label>
                <i class="material-icons grey-text">visibility_off</i>
              </template>
            </div>
            <div v-if="updatedDate">
              <label>Updated</label>
              <span>{{ dateFormated(updatedDate, 'mmm/yyyy') }}</span>
            </div>
            <div v-if="recipe.originalUrl">
              <label>(Originally)</label>
              <a :href="recipe.originalUrl" target="_vegRDS_OUT"
                >Published Here</a
              >
            </div>
          </div>
        </div>
        <div v-if="recipe.description" class="row">
          <div
            class="col s12"
            v-html="transformMarkdown(recipe.description)"
          ></div>
        </div>
        <div v-if="recipe.tools && recipe.tools.length" class="row">
          <div class="col s12">
            <ul class="collection with-header">
              <li class="collection-header">
                <h5>You May Need</h5>
              </li>
              <li
                v-for="(tool, idx) in recipe.tools"
                :key="idx"
                class="collection-item"
              >
                <div v-if="tool.name">
                  {{ tool.name }}
                  <span v-if="tool.required" class="secondary-content"
                    >(Required)</span
                  >
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="recipe.ingredients.length" class="row">
          <div class="col s12">
            <table class="ing striped">
              <caption>
                {{
                  recipe.title
                }}
                Ingredients
              </caption>
              <thead>
                <tr>
                  <th title="Quantity of Units">Qty</th>
                  <th title="Unit of Measure">Units</th>
                  <th>Ingredient</th>
                  <th title="preparation">Prep</th>
                  <th title="Optional Ingredient">Opt?</th>
                </tr>
              </thead>
              <tbody
                v-for="(ingIndexes, group) in groupedIngredients"
                :key="group"
              >
                <tr v-if="ingredientGroups.length > 1 && ingIndexes.length">
                  <th colspan="5">
                    {{ group == 'default' ? 'Other' : group }}
                  </th>
                </tr>
                <tr v-for="(ing, idx) in ingsByGroup(group)" :key="idx">
                  <td>{{ ing.qty }}</td>
                  <td>{{ ing.unit }}</td>
                  <td>{{ ing.name }}</td>
                  <td>{{ ing.preparation }}</td>
                  <td>
                    <i
                      v-if="ing.optional"
                      class="material-icons light-green-text"
                      >check</i
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="recipe.methods.length" class="row">
          <div class="col s12">
            <h3>Preparation</h3>
            <div
              v-for="(metIndexes, group) in groupedMethods"
              :key="group"
              class="row"
            >
              <div class="col s12">
                <h4 v-if="group != 'default'">{{ group }}</h4>
                <dl v-for="(met, idx) in metsByGroup(group)" :key="idx">
                  <dt>Step {{ met.step }}:</dt>
                  <dd v-html="transformMarkdown(met.text)"></dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div v-if="filteredVariations.length" class="row">
          <div class="col s12">
            <ul class="collection with-header">
              <li class="collection-header">
                <h5>Variations</h5>
              </li>
              <li
                v-for="(variation, idx) in filteredVariations"
                :key="idx"
                class="collection-item"
                v-html="transformMarkdown(variation.text)"
              ></li>
            </ul>
          </div>
        </div>
        <div v-if="recipe.notes" class="row">
          <div class="col s12">
            <h3>Notes:</h3>
            <div class="notes" v-html="transformMarkdown(recipe.notes)" />
          </div>
        </div>
        <div v-if="filteredTags.length" class="row">
          <div class="col s12">
            <p>
              <span
                v-for="(tag, idx) in filteredTags"
                :key="idx"
                class="chip light-green lighten-3"
                >#{{ tag.text }}</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="closer" @click="closePreview">
      <i class="material-icons">close</i>
    </div>
  </section>
</template>

<script>
import dateFormat from 'dateformat';
import { mapGetters } from 'vuex';
import { filter, isEmpty } from 'lodash/fp';
export default {
  props: {
    transformMarkdown: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'isModified',
      'staged',
      'updatedDate',
      'ingredientGroups',
      'groupedIngredients',
      'methodGroups',
      'groupedMethods',
      'ingCountByGroup',
      'filteredVariations',
      'filteredTags',
    ]),
    ingsByGroup:
      ({ staged: { ingredients } }) =>
      (group) =>
        filter(['group', group == 'default' ? '' : group])(ingredients),
    metsByGroup:
      ({ staged: { methods } }) =>
      (group) =>
        filter(['group', group == 'default' ? '' : group])(methods),
  },
  methods: {
    dateFormated: (date, format) => dateFormat(date, format),
    closePreview() {
      this.$store.dispatch('closePreview');
    },
    isInGroup(item, group) {
      return item.group == group || (isEmpty(item.group) && group == 'default');
    },
  },
};
</script>
