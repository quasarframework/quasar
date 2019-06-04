<template lang="pug">
  q-dialog(v-model="visible__")
    w-card.q-pa-sm.q-ma-xl.relative-position(style="overflow: visible")
      w-card-section
        .row.justify-between.items-center
          slot(name="header")
            .text-h6.text-bold {{title}}
        w-btn.text-grey-10.absolute.w-dialog-close-button(v-close-popup round dense color="white" size="lg")
          w-icon(name="mdi-close" style="font-size: 1.4rem;")
      w-card-section
        slot(name="body")
      w-card-section
        slot(name="actions")
</template>

<script>
import { QDialog } from "quasar";

export default {
  components: { QDialog },
  name: "WDialog",
  props: {
    title: {
      type: String,
      default: () => null,
    },
    value: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    visible__: {
      get() {
        return this.value || false;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>
