<template>
  <div class="app-search-warning q-my-lg q-mx-md q-pa-md text-center">
    <q-icon :name="mdiTextBoxSearchOutline" color="brand-primary" size="4em" />
    <div class="q-my-md">
      We searched for it but couldn't find it... It may exist and not yet indexed.
    </div>
    <div>
      Please refine your search terms.
    </div>
  </div>
</template>

<script setup>
import { mdiTextBoxSearchOutline } from '@quasar/extras/mdi-v6'
</script>
