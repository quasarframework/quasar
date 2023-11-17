<template>
  <q-drawer
    id="toc-drawer"
    v-model="docStore.state.value.tocDrawer"
    side="right"
    class="doc-drawer"
    behavior="mobile"
    aria-labelledby="toc-drawer-title"
    role="navigation"
  >
    <div class="doc-drawer__header row justify-end no-wrap q-pt-sm q-pb-md q-px-sm">
      <q-btn
        :icon="mdiClose"
        round
        dense
        flat
        color="brand-accent"
        @click="docStore.toggleTocDrawer"
      />
    </div>

    <div id="toc-drawer-title" class="doc-drawer__title q-px-md text-weight-bold">On this page</div>
    <doc-page-toc class="q-pt-sm q-px-md q-pb-lg" />
  </q-drawer>
</template>

<script setup>
import { mdiClose } from '@quasar/extras/mdi-v6'

import { useDocStore } from './store/index.js'

import DocPageToc from './DocPageToc.vue'

const docStore = useDocStore()
</script>
