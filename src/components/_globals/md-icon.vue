<template>
  <i
    v-tooltip="uiFlavour"
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
      unbind: function(el, { value }) {
        jQ && jQ(el).tooltip(value == 'BS' ? 'destroy' : 'remove');
      }
    }
  },
  data: () => ({
    jQ: window.jQuery,
    uiFlavour: window
      .jQuery(document.body)
      .find('[data-flavour]')
      .data('flavour')
  })
};
</script>
