<template>
  <div class="q-pa-md flex flex-center">
    <q-circular-progress
      v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
      :key="size"
      :size="size"
      :value="value"
      color="orange"
      class="q-ma-md"
    />
  </div>
</template>

<script setup>
const value = 71
</script>
