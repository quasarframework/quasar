<template>
  <q-list class="doc-page__toc">
    <q-item
      v-for="tocItem in docStore.state.value.toc"
      :key="tocItem.id"
      :id="`toc--${ tocItem.id }`"
      clickable
      class="doc-layout__item"
      active-class="doc-layout__item--active"
      v-ripple
      :active="docStore.state.value.activeToc === tocItem.id"
      @click="tocItem.onClick"
    >
      <q-item-section v-if="tocItem.sub === true" side />
      <q-item-section>{{ tocItem.title }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { useDocStore } from './store'
const docStore = useDocStore()
</script>
