<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input v-model="text" filled type="textarea" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
</script>
