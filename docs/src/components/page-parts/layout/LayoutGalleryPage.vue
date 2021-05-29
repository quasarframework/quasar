<template lang="pug">
  q-page.flex.flex-center(padding)
    q-btn(
      :icon="mdiCodeTags"
      label="Source code"
      no-caps
      push
      color="white"
      text-color="brand-primary"
      type="a"
      :href="sourceLink"
      target="_blank"
      rel="noopener"
    )
</template>

<script>
import { mdiCodeTags } from '@quasar/extras/mdi-v5'

import getMeta from 'assets/get-meta.js'

export default {
  name: 'LayoutGalleryPage',

  meta () {
    const title = this.$route.meta.title + ' Layout'

    return {
      title,

      meta: getMeta(
        title + ' | Quasar Framework',
        `Example of a Quasar layout that looks like ${this.$route.meta.title}`
      )
    }
  },

  created () {
    this.sourceLink = this.$route.meta.sourceLink
    this.mdiCodeTags = mdiCodeTags
  }
}
</script>
