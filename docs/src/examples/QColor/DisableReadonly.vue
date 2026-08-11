<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-color v-model="color" disable class="my-picker" />

      <q-color v-model="color" readonly class="my-picker" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color = ref('#ff00ff')
</script>

<style lang="sass" scoped>
.my-picker
  max-width: 250px
</style>
