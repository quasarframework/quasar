<template>
  <div class="q-pa-md">
    <div class="cursor-pointer">
      {{ label }}
      <q-popup-edit v-model="label" auto-save v-slot="scope">
        <q-input
          v-model="scope.value"
          dense
          autofocus
          counter
          @keyup.enter="scope.set"
        />
      </q-popup-edit>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const label = ref('Click me')
</script>
