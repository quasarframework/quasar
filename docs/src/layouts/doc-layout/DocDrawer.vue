<template>
  <q-drawer
    v-model="docStore.state.value.drawer"
    class="doc-drawer"
    behavior="mobile"
  >
    <div class="doc-drawer__header row justify-end no-wrap q-pt-sm q-pb-md q-px-md">
      <q-btn color="brand-primary" outline rounded label="Close" no-caps @click="docStore.toggleDrawer" />
    </div>
    <doc-page-menu class="q-mx-sm q-mb-lg" />
  </q-drawer>
</template>

<script setup>
import { useDocStore } from './store'

import DocPageMenu from './DocPageMenu'

const docStore = useDocStore()
</script>

<style lang="sass">
.doc-drawer
  box-shadow: $shadow--primary
  &__header
    position: sticky
    top: 0
    z-index: 1
    .q-btn
      letter-spacing: $letter-spacing
      background-color: #fff !important

body.body--dark .doc-drawer
  &__header
    .q-btn
      background-color: $dark !important
</style>
