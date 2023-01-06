<template>
  <div class="row no-wrap items-center">
    <q-btn
      v-for="(entry, index) in props.menu"
      :key="index"
      flat
      class="header-btn doc-header-text-links__item text-weight-bold"
      :class="`${ props.mqPrefix }-${ entry.mq || 'none' } ${ props.navClass }`"
      :padding="entry.children ? '8px 8px 8px 16px' : '8px 12px'"
      :label="entry.name"
      no-caps
      no-wrap
      :icon-right="entry.children ? mdiMenuDown : void 0"
      :to="entry.path"
      :href="entry.external ? entry.path : void 0"
      :target="entry.external ? '_blank' : void 0"
    >
      <doc-header-menu v-if="entry.children" :elements="entry.children" :mq-prefix="props.mqPrefix" />
    </q-btn>
  </div>
</template>

<script setup>
import { mdiMenuDown } from '@quasar/extras/mdi-v6'

import DocHeaderMenu from './DocHeaderMenu'

const props = defineProps({
  menu: Array,
  mqPrefix: String,
  navClass: String
})
</script>
