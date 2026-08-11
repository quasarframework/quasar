<template>
  <div class="q-pa-md">
    <q-checkbox
      v-model="val"
      checked-icon="star"
      unchecked-icon="star_border"
      indeterminate-icon="help"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const val = ref(true)
</script>
