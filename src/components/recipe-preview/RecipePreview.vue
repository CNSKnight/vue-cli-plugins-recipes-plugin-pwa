<template>
    <section class="preview">
        <header>
            <div>Preview</div>
        </header>
        <div v-if="recipe && recipe.id" class="row recipe-bloc flow-text">
            <div class="col s12">
                <div class="row">
                    <div class="col s12">
                        <h1>{{recipe.title}}</h1>
                        <h2 v-if="recipe.subTitle">{{recipe.subTitle}}</h2>
                        <h3>Recipe ID: {{recipe.acapID}}</h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 light-green lighten-3 meta-bar">
                        <div v-if="recipe.creator">
                            <label>Created By:</label>
                            {{recipe.creator}}
                        </div>
                        <div>
                            <template v-if="recipe.publishedDate">
                                <label>Published</label>
                                <span>{{dateFormated(recipe.publishedDate, 'mmm/yyyy')}}</span>
                            </template>
                            <template v-else>
                                <label>Un-Published</label>
                            </template>
                        </div>
                        <div v-if="updatedDate">
                            <label>Updated</label>
                            <span>{{dateFormated(updatedDate, 'mmm/yyyy')}}</span>
                        </div>
                        <div v-if="recipe.originalUrl">
                            <label>(Originally)</label>
                            <a :href="recipe.originalUrl" target="_vegRDS_OUT">Published Here</a>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="recipe.description">
                    <div class="col s12" :html="transformMarkdown(recipe.description)"></div>
                </div>
                <div v-if="recipe.ingredients && recipe.ingredients.length" class="row">
                    <div class="col s12 ">
                        <table class="ing striped">
                            <caption>{{recipe.title}} Ingredients</caption>
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
                                    <tr v-if="ingredientGroups.length > 1 && ingCountByGroup(group)">
                                        <th colspan="5">{{group == 'default' ? 'Other' : group}}</th>
                                    </tr>
                                    <tr v-for="(ing, idx) in recipe.ingredients" v-if="ing.group == group" :key="idx">
                                        <td>{{ing.qty}}</td>
                                        <td>{{ing.unit}}</td>
                                        <td>{{ing.name}}</td>
                                        <td>{{ing.preparation}}</td>
                                        <td>
                                            <i v-if="ing.optional" class="material-icons light-green-text ">check</i>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </table>
                    </div>
                </div>
                <div v-if="recipe.method && recipe.method.length" class="row ">
                    <div class="col s12 ">
                        <dl v-for="(method, idx) in recipe.method" :key="idx">
                            <dt>Step {{method.step}}:</dt>
                            <dd :html="transformMarkdown(method.text)"></dd>
                        </dl>
                    </div>
                </div>
                <div v-if="recipe.variations && recipe.variations.length" class="row ">
                    <div class="col s12 ">
                        <ul class="collection with-header">
                            <li class="collection-header">
                                <h5>Variations</h5>
                            </li>
                            <li v-for="(variation, idx) in recipe.variations" :key="idx" class="collection-item"
                                :html="transformMarkdown(variation.text)">
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-if="recipe.notes" class="row ">
                    <div class="col s12" :html="transformMarkdown(recipe.notes)"></div>
                </div>
                <div v-if="recipe.tags && recipe.tags.length" class="row ">
                    <div class="col s12 ">
                        <p>
                            <span v-for="(tag, idx) in recipe.tags" :key="idx" class="chip light-green lighten-3">#{{tag.text}}</span>
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
export default {
  props: {
    transformMarkdown: Function
  },
  computed: {
    ...mapGetters([
      'recipe',
      'updatedDate',
      'ingredientGroups',
      'ingCountByGroup'
    ])
  },
  methods: {
    dateFormated: (date, format) => dateFormat(date, format)
  }
};
</script>

<style scoped>
.preview {
  position: relative;
  padding-right: 0.8em;
  background-color: rgba(251, 251, 251, 0.9);
}
header {
  text-align: center;
  font-size: 2em;
  color: rgb(158, 157, 36);
}
.closer {
  position: absolute;
  width: 1.5em;
  height: 100%;
  top: 0;
  right: 0;
  background-color: rgba(211, 211, 211, 0.7);
}
.closer i {
  position: absolute;
  top: 50%;
  color: rgb(158, 157, 36);
}
.closer:hover {
  background-color: rgba(211, 211, 211, 0.9);
  cursor: pointer;
}
table.ing td:nth-child(5) {
  text-align: center;
}
table.ing caption {
  color: rgb(158, 157, 36);
}
</style>
