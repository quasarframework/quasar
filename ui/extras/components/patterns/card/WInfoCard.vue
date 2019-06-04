<template lang="pug">
  w-card.w-info-card(flat bordered)
    w-card-section.details(v-for="(detail, detailIndex) in details" :key="detailIndex")
      .row
        .subtitle {{detail.label}}
      .row.q-mt-xs.q-gutter-sm
        w-icon.icon(:name="detail.icon")
        .text-caption {{detail.text}}
    slot(name="actions")
</template>

<script>
import { WCard } from "quasar";

export default {
  name: "WInfoCard",
  mixins: [ WCard ],
  props: {
    details: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
