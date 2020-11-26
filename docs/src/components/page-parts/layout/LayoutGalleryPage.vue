<template lang="pug">
q-page.flex.flex-center(padding)
  q-btn(
    :icon="mdiCodeTags"
    label="Source code"
    no-caps
    push
    color="white"
    text-color="primary"
    type="a"
    :href="sourceLink"
    target="_blank"
    rel="noopener"
  )
</template>

<script>
// TODO vue3 - re-enable createMetaMixin when composition api is available
// import { createMetaMixin } from 'quasar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { mdiCodeTags } from '@quasar/extras/mdi-v5'

// import getMeta from 'assets/get-meta.js'

export default {
  name: 'LayoutGalleryPage',

  // mixins: [
  //   createMetaMixin(() => {
  //     const title = this.$route.meta.title + ' Layout'

  //     return {
  //       title,

  //       meta: getMeta(
  //         title + ' | Quasar Framework',
  //         `Example of a Quasar layout that looks like ${this.$route.meta.title}`
  //       )
  //     }
  //   })
  // ],

  setup () {
    const route = useRoute()
    const sourceLink = computed(() => route.meta.sourceLink)

    return {
      mdiCodeTags,
      sourceLink
    }
  }
}
</script>
