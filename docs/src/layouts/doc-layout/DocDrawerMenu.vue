<template>
  <q-drawer
    id="menu-drawer"
    v-model="docStore.state.value.menuDrawer"
    @before-show="onShow"
    @hide="onHide"
    @pan="onPan"
    class="doc-drawer"
    behavior="mobile"
    :width="330"
    aria-label="Sidebar"
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

    <nav v-if="showMenu" aria-label="Main menu">
      <DocPageMenu class="q-mx-xs q-mb-lg" />
    </nav>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { mdiClose } from '@quasar/extras/mdi-v7'

import { useDocStore } from './store/index.js'

import DocPageMenu from './DocPageMenu.js'

const docStore = useDocStore()

// the mobile drawer menu is mounted only when really needed;
// this avoids unnecessary computations while not in use
const showMenu = ref(false)

function onShow() {
  showMenu.value = true
}

function onHide() {
  showMenu.value = false
}

function onPan({ type, stage }) {
  if (type === 'open') {
    showMenu.value = stage !== 'cancel'
  }
}
</script>
