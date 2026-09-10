<template>
  <!-- every entry is interactive, so a "list" role would own no
       listitem children (invalid ARIA) - the items stand on their own -->
  <q-list class="doc-page__toc" role="none">
    <q-item
      v-for="tocItem in docStore.state.value.toc"
      :key="tocItem.id"
      :id="`toc--${tocItem.id}`"
      class="doc-layout__item"
      :class="`doc-page__toc--${tocItem.sub ? 'sub' : 'main'}`"
      active-class="doc-layout__item--active"
      v-ripple
      :active="activeTocId === tocItem.id"
      @click="tocItem.onClick"
    >
      {{ tocItem.title }}
    </q-item>
  </q-list>
</template>

<script setup>
import { computed } from 'vue'
import { useDocStore } from './store/index.js'

const docStore = useDocStore()
const activeTocId = computed(() => docStore.state.value.activeToc)
</script>
