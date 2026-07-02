<template>
  <div class="q-pa-md">
    <q-linear-progress stripe size="10px" :value="progress1" />

    <q-linear-progress
      stripe
      rounded
      size="20px"
      :value="progress2"
      color="warning"
      class="q-mt-sm"
    />
  </div>
</template>

<script setup>
const progress1 = 0.4
const progress2 = 0.725
</script>
