<template lang="pug">
  q-page.w-page(:padding="padding")
    .row(:class="{ 'offset-md-2': offset, 'col-md-8': offset }")
      .row.justify-between.items-end
        .text-page-title {{title}}
        slot(name="title-right")
      slot
    w-page-scroller(position="bottom-right" :scroll-offset="150" :offset="[18, 18]")
      w-btn(fab icon="mdi-chevron-double-up" color="accent")
</template>

<script>
import { QPage, WPageScroller } from "quasar";

export default {
  components: { QPage },
  name: "WPage",
  props: {
    offset: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    padding: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

