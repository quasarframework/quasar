<template>
  <div class="relative-position copybtn-hover">
    <Suspense @resolve="ready = true">
      <template #default>
        <DocCodeHighlight :lang="props.lang" :code="props.code" />
      </template>

      <template #fallback>
        <div class="doc-code">
          <code>
            <q-skeleton type="text" width="60%" />
            <q-skeleton type="text" width="80%" />
            <q-skeleton type="text" width="45%" />
            <q-skeleton type="text" width="70%" />
            <q-skeleton type="text" width="55%" />
          </code>
        </div>
      </template>
    </Suspense>

    <CopyButton v-if="ready" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'

import CopyButton from './CopyButton.vue'

const props = defineProps({
  code: String,
  lang: {
    type: String,
    default: 'js'
  }
})

const DocCodeHighlight = defineAsyncComponent(
  () => import('./DocCodeHighlight.js')
)

const ready = ref(false)
</script>
