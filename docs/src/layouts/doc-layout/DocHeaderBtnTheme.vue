<template>
  <div class="doc-header-icon-links row no-wrap items-center">
    <q-btn
      flat
      round
      :icon="mdiCompare"
      :disable="disabled"
      @click="docStore.toggleDark"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { mdiCompare } from '@quasar/extras/mdi-v6'

import { useDocStore } from './store'

const docStore = useDocStore()
const disabled = computed(() => docStore.$route.meta?.dark === true)
</script>
