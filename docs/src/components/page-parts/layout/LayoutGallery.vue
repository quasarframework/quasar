<template lang="pug">
  .row.items-center.q-col-gutter-md
    .col-xs-12.col-md-6(
      v-for="layout in list"
      :key="layout.name"
    )
      q-card(flat, bordered)
        q-card-section {{ layout.name }}

        q-img(alt="Layout Screenshot", :src="layout.screenshot", :ratio="1")

        q-card-actions(align="right")
          q-btn(type="a", :href="layout.demoLink", target="_blank", flat, round, icon="open_in_new")
          q-btn(type="a", :href="layout.sourceLink", , target="_blank", flat, round, icon="code")
</template>

<script>
import list from 'assets/layout-gallery.js'

export default {
  name: 'LayoutGallery',

  created () {
    this.list = list
  }
}
</script>
