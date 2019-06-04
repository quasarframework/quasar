<template lang="pug">
  q-dialog.w-sidebar(position="right" v-model="visible__" full-height)
    w-card.w-sidebar-content.full-height(:style="style")
      w-card-section.row.items-center.justify-between
        .text-h6 {{title}}
        w-btn(icon="mdi-close" flat round dense v-close-popup)
      w-card-section
        slot
</template>

<script>
import { QDialog } from "quasar";

export default {
  components: { QDialog },
  props: {
    value: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: null,
    },
    minWidth: {
      type: String,
      default: null,
    },
  },
  computed: {
    style() {
      return {
        "min-width": this.minWidth,
      };
    },
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
