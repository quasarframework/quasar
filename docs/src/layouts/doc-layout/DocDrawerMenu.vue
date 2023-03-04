<template>
  <q-drawer
    v-model="docStore.state.value.menuDrawer"
    class="doc-drawer"
    behavior="mobile"
    :width="330"
  >
    <div class="doc-drawer__header row justify-end no-wrap q-pt-sm q-pb-md q-px-xs">
      <q-btn
        :icon="mdiClose"
        round
        dense
        flat
        color="brand-accent"
        @click="docStore.toggleMenuDrawer"
      />
    </div>
    <doc-page-menu class="q-mx-xs q-mb-lg" />
  </q-drawer>
</template>

<script setup>
import { mdiClose } from '@quasar/extras/mdi-v6'

import { useDocStore } from './store'

import DocPageMenu from './DocPageMenu'

const docStore = useDocStore()
</script>
