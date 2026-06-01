<template>
  <q-card flat bordered>
    <div class="relative-position copybtn-hover">
      <div v-html="rawVariablesHtml" />
      <CopyButton />
    </div>
  </q-card>
</template>

<script setup>
import CopyButton from '@/components/CopyButton.vue'
import rawVariablesHtml from 'quasar/src/css/variables.sass?highlighted'
</script>
