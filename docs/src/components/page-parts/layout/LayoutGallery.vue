<template lang="pug">
  .row.items-center.q-col-gutter-md
    .col-xs-12.col-md-6(
      v-for="layout in list"
      :key="layout.name"
    )
      q-card(flat, bordered)
        .row.items-center.no-wrap.q-px-md.q-py-sm
          div {{ layout.name }}
          q-space
          q-btn(type="a", :href="layout.demoLink", target="_blank", size="12px" flat, round, color="brand-primary", :icon="mdiOpenInNew")
          q-btn(type="a", :href="layout.sourceLink", , target="_blank", size="12px" flat, round, color="grey-7", :icon="mdiCodeTags")

        q-separator

        .overflow-hidden
          a(:href="layout.demoLink", target="_blank")
            q-img(alt="Layout Screenshot", :src="layout.screenshot", :ratio="1.95")

</template>

<script>
import { mdiCodeTags, mdiOpenInNew } from '@quasar/extras/mdi-v5'

import list from 'assets/layout-gallery.js'

export default {
  name: 'LayoutGallery',

  created () {
    this.list = list

    this.mdiCodeTags = mdiCodeTags
    this.mdiOpenInNew = mdiOpenInNew
  }
}
</script>
