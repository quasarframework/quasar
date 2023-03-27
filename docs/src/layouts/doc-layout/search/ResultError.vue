<template>
  <div class="app-search-warning q-my-lg q-mx-md q-pa-md text-center">
    <q-icon :name="mdiAlert" color="negative" size="4em" />
    <div class="q-mt-md">It's not you, it's me.</div>
    <div>Could not connect with our search service...</div>
  </div>
</template>

<script setup>
import { mdiAlert } from '@quasar/extras/mdi-v6'
</script>
