<template lang="pug">
  w-expansion-item.border.rounded-borders(v-model="showing" :header-class="headerClass")
    template(v-slot:header)
      w-item-section(side)
        w-icon(:name="iconName" :color="iconColor")
      w-item-section.text-bold {{label}}
      w-item-section(side)
        .row.items-center
          span Edit
    w-separator
    w-card
      w-card-section
        slot
</template>

<script>
import { WExpansionItem } from "quasar";

export default {
  name: "WCollapsible",
  mixins: [ WExpansionItem ],
  props: {
    label: {
      type: String,
      default: () => false,
    },
    completed: {
      type: Boolean,
      default: () => false,
    },
    icon: {
      type: String,
      default: null,
    },
    headerClass: {
      type: String,
      default: "bg-white",
    },
  },
  data() {
    return {
      showing: false,
    };
  },
  computed: {
    iconName() {
      let result;

      if (this.showing) {
        result = "mdi-pencil-outline";
      } else if (this.completed) {
        result = "mdi-check-circle";
      } else {
        result = this.icon;
      }

      return result;
    },
    iconColor() {
      let result;

      if (this.showing) {
        result = "grey-8";
      } else if (this.completed) {
        result = "positive";
      } else {
        result = "";
      }

      return result;
    },
  },
};
</script>

