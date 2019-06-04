<template lang="pug">
  w-page.w-page
    .row
      div(:class="{ 'offset-md-2': offset, 'col-md-8': offset }")
        .row.justify-between.items-end
          .text-page-title {{title}}
          slot(name="title-right")
        slot
    w-page-scroller(position="bottom-right" :scroll-offset="150" :offset="[18, 18]")
      w-btn(fab icon="mdi-chevron-double-up" color="accent")
</template>

<script>
import { WPage, WPageScroller } from "quasar";

export default {
  name: "WAppPage",
  props: {
    offset: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

