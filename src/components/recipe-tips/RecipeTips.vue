<template>
  <div>
    <ul
      materialize="collapsible"
      class="collapsible"
      data-collapsible="accordion"
    >
      <li v-for="{ val, idx } in values" :key="idx">
        <div class="collapsible-header">
          Common Measures, Units, and Abbreviations
        </div>
        <div class="collapsible-body">
          <p>{{ value }}</p>
        </div>
      </li>
      <li v-for="{ val, idx } in values" :key="idx">
        <div class="collapsible-header">
          General Tips
        </div>
        <div class="collapsible-body">
          <ul>
            <li>
              <a href="https://www.thekitchn.com/how-to-write-a-recipe-58522"
                >How to write a recipe.</a
              >
            </li>
            <li>
              See the Common Mesures, Units, and Abbreviations above, or feel
              free to write out eg tablespoons, fluid ounces, litre, etc.
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      values: {}
    };
  }
};
</script>

<style scoped></style>
