<template>
  <q-page class="flex flex-center" padding>
    <q-btn
      :icon="mdiCodeTags"
      label="Source code"
      no-caps
      push
      color="white"
      text-color="brand-primary"
      :href="sourceLink"
      target="_blank"
      rel="noopener"
    />
  </q-page>
</template>

<script setup>
import { useMeta } from 'quasar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { mdiCodeTags } from '@quasar/extras/mdi-v6'

import getMeta from 'assets/get-meta.js'

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
</script>
