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
import { useMeta } from 'quasar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { mdiCodeTags } from '@quasar/extras/mdi-v5'

import getMeta from 'assets/get-meta.js'

export default {
  name: 'LayoutGalleryPage',

  setup () {
    const $route = useRoute()
    const sourceLink = computed(() => $route.meta.sourceLink)

    useMeta(() => {
      const title = $route.meta.title + ' Layout'

      return {
        title,
        meta: getMeta(
          title + ' | Quasar Framework',
          `Example of a Quasar layout that looks like ${$route.meta.title}`
        )
      }
    })

    return {
      mdiCodeTags,
      sourceLink
    }
  }
}
</script>
