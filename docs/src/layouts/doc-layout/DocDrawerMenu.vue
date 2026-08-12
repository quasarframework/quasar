<template>
  <q-drawer
    id="menu-drawer"
    v-model="docStore.state.value.menuDrawer"
    class="doc-drawer"
    behavior="mobile"
    :width="330"
    aria-label="Sidebar Navigation"
    role="navigation"
  >
    <div
      class="doc-drawer__header row justify-end no-wrap q-pt-sm q-pb-md q-px-xs"
    >
      <q-btn
        :icon="mdiClose"
        round
        dense
        flat
        color="brand-accent"
        aria-label="Close menu"
        @click="docStore.toggleMenuDrawer"
      />
    </div>
    <DocPageMenu class="q-mx-xs q-mb-lg" />
  </q-drawer>
</template>

<script setup>
import { mdiClose } from '@quasar/extras/mdi-v7'

import { useDocStore } from './store/index.js'

import DocPageMenu from './DocPageMenu.js'

const docStore = useDocStore()
</script>
