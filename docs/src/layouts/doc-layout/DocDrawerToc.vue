<template>
  <q-drawer
    id="toc-drawer"
    v-model="docStore.state.value.tocDrawer"
    side="right"
    class="doc-drawer"
    behavior="mobile"
    aria-labelledby="toc-drawer-title"
  >
    <div
      class="doc-drawer__header row justify-end no-wrap q-pt-sm q-pb-md q-px-sm"
    >
      <q-btn
        :icon="mdiClose"
        round
        dense
        flat
        color="brand-accent"
        aria-label="Close table of contents"
        @click="docStore.toggleTocDrawer"
      />
    </div>

    <!-- navigation is not an allowed role on the <aside> the drawer
         renders, so the nav landmark is an inner element -->
    <nav aria-labelledby="toc-drawer-title">
      <div
        id="toc-drawer-title"
        class="doc-drawer__title q-px-md text-weight-bold"
        >On this page</div
      >
      <DocPageToc class="q-pt-sm q-px-md q-pb-lg" />
    </nav>
  </q-drawer>
</template>

<script setup>
import { mdiClose } from '@quasar/extras/mdi-v7'

import { useDocStore } from './store/index.js'

import DocPageToc from './DocPageToc.vue'

const docStore = useDocStore()
</script>
