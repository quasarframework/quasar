<template>
  <div class="doc-header-icon-links row no-wrap items-center">
    <q-btn
      v-for="(entry, index) in props.menu"
      :key="index"
      class="header-btn"
      flat
      round
      :icon="entry.icon"
      :to="entry.path"
      :href="entry.external ? entry.path : void 0"
      :target="entry.external ? '_blank' : void 0"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  menu: Array
})
</script>
