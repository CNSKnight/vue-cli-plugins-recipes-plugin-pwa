<template>
  <i
    v-tooltip
    class="hinter-icon material-icons mdIcon"
    alt="You can use Markdown here icon."
    data-position="left"
    data-delay="50"
    data-tooltip="Tip! You can use Markdown here!"
  />
</template>

<script>
const jQ = window.jQuery;
export default {
  name: 'MdIcon',
  directives: {
    tooltip: {
      bind: el => {
        jQ && jQ(el).tooltip();
      },
      unbind: el => {
        jQ && jQ(el).tooltip('remove');
      }
    }
  },
  data: () => ({
    jQ: window.jQuery
  })
};
</script>
