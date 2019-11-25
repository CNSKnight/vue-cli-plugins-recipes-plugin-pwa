<template>
  <section class="preview">
    <header>
      <div>Preview</div>
      <h6 v-if="isModified" class="alert grey-text text-darken-2">
        <i class="material-icons grey-text">warning</i>
        Note: This preview will not reflect any unsaved changes.
      </h6>
    </header>
    <div v-if="recipe && recipe.id" class="row flow-text">
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
        <div class="row" v-if="recipe.description">
          <div
            class="col s12"
            v-html="transformMarkdown(recipe.description)"
          ></div>
        </div>
        <div v-if="recipe.tools && recipe.tools.length" class="row ">
          <div class="col s12 ">
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
        <div v-if="ingredientGroups.length" class="row">
          <div class="col s12 ">
            <table class="ing striped">
              <caption>
                {{
                  recipe.title
                }}
                Ingredients
              </caption>
              <thead>
                <tr>
                  <th>Qty</th>
                  <th>Units</th>
                  <th>Ingredient</th>
                  <th>Prep</th>
                  <th>Optional</th>
                </tr>
              </thead>
              <template>
                <tbody v-for="(group, idx) in ingredientGroups" :key="idx">
                  <tr
                    v-if="ingredientGroups.length > 1 && ingCountByGroup(group)"
                  >
                    <th colspan="5">
                      {{ group == 'default' ? 'Other' : group }}
                    </th>
                  </tr>
                  <tr
                    v-for="(ing, idx) in recipe.ingredients"
                    v-if="isInGroup(ing, group) && ing.name"
                    :key="idx"
                  >
                    <td>{{ ing.qty }}</td>
                    <td>{{ ing.unit }}</td>
                    <td>{{ ing.name }}</td>
                    <td>{{ ing.preparation }}</td>
                    <td>
                      <i
                        v-if="ing.optional"
                        class="material-icons light-green-text "
                        >check</i
                      >
                    </td>
                  </tr>
                </tbody>
              </template>
            </table>
          </div>
        </div>
        <div v-if="methodGroups.length" class="row ">
          <div class="col s12">
            <h3>Preparation</h3>
            <div v-for="(group, idx) in methodGroups" :key="idx" class="row">
              <div class="col s12">
                <h4 v-if="group != 'default'">{{ group }}</h4>
                <dl
                  v-for="(met, idx) in recipe.methods"
                  v-if="isInGroup(met, group) && met.text"
                  :key="idx"
                >
                  <dt>Step {{ met.step }}:</dt>
                  <dd v-html="transformMarkdown(met.text)"></dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div v-if="recipe.variations && recipe.variations.length" class="row ">
          <div class="col s12 ">
            <ul class="collection with-header">
              <li class="collection-header">
                <h5>Variations</h5>
              </li>
              <li
                v-for="(variation, idx) in recipe.variations"
                :key="idx"
                v-if="variation.text"
                class="collection-item"
                v-html="transformMarkdown(variation.text)"
              ></li>
            </ul>
          </div>
        </div>
        <div v-if="recipe.notes" class="row ">
          <div class="col s12">
            <h3>Notes:</h3>
            <div class="notes" v-html="transformMarkdown(recipe.notes)" />
          </div>
        </div>
        <div v-if="recipe.tags && recipe.tags.length" class="row ">
          <div class="col s12 ">
            <p>
              <span
                v-for="(tag, idx) in recipe.tags"
                v-if="tag.text"
                :key="idx"
                class="chip light-green lighten-3"
                >#{{ tag.text }}</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="closer" @click="$emit('close')">
      <i class="material-icons">close</i>
    </div>
  </section>
</template>

<script>
import dateFormat from 'dateformat';
import { mapGetters } from 'vuex';
import { isEmpty } from 'lodash';
export default {
  props: {
    transformMarkdown: Function
  },
  computed: {
    ...mapGetters({
      isModified,
      recipe: 'staged',
      updatedDate,
      ingredientGroups,
      methodGroups,
      ingCountByGroup,
      filteredTags,
      filteredVariations,
      groupedMethods
    }),
    tags:
  },
  methods: {
    dateFormated: (date, format) => dateFormat(date, format),
    isInGroup(item, group) {
      return item.group == group || (isEmpty(item.group) && group == 'default');
    }
  }
};
</script>
