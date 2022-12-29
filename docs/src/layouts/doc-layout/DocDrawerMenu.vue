<template>
  <q-drawer
    v-model="docStore.state.value.menuDrawer"
    class="doc-drawer"
    behavior="mobile"
  >
    <div class="doc-drawer__header row justify-end no-wrap q-pt-sm q-pb-md q-px-md">
      <q-btn
        class="call-to-action-btn shadow-bottom-small"
        label="Close"
        no-caps
        @click="docStore.toggleMenuDrawer"
      />
    </div>
    <doc-page-menu class="q-mx-sm q-mb-lg" />
  </q-drawer>
</template>

<script setup>
import { useDocStore } from './store'

import DocPageMenu from './DocPageMenu'

const docStore = useDocStore()
</script>
