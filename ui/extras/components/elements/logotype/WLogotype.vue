<template lang="pug">
  //- w-btn.q-ma-none.q-pa-none(flat)
  .w-logotype.row.non-selectable(:class="{ 'logotype-margin': !!text }")
    .column(v-if="orientation === 'vertical'")
      img.self-end(v-if="dark" src="../../../assets/logo/wywm-dark.svg")
      img.self-end(v-else src="../../../assets/logo/wywm-light.svg")
      .text-h4.text-product-name.self-end(v-if="text") {{text}}
    .row(v-else)
      img.self-end(v-if="dark" src="../../../assets/logo/wywm-dark.svg")
      img.self-end(v-else src="../../../assets/logo/wywm-light.svg")
      .separator
      .text-h4.text-product-name.self-center(v-if="text") {{text}}
</template>

<script>
export default {
  name: "WLogotype",
  props: {
    orientation: {
      type: String,
      default: "vertical",
    },
    text: {
      type: String,
      default: null,
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
