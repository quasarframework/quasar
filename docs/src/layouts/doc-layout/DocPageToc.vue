<template>
  <div class="doc-page__toc">
    <a
      v-for="tocItem in docStore.state.value.toc"
      :key="tocItem.id"
      :id="`toc--${tocItem.id}`"
      :href="`#${tocItem.id}`"
      class="doc-item"
      :class="{ 'doc-item--active': activeTocId === tocItem.id }"
      @click.prevent="tocItem.onClick"
    >
      {{ tocItem.title }}
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDocStore } from './store/index.js'

const docStore = useDocStore()
const activeTocId = computed(() => docStore.state.value.activeToc)
</script>
