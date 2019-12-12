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
