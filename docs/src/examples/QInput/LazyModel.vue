<template>
  <div class="q-pa-md" style="max-width: 350px">
    <div class="q-gutter-md">
      <div>
        <q-badge color="teal">Model: "{{ name }}"</q-badge>
      </div>

      <q-input
        v-model.lazy="name"
        filled
        placeholder="Type, then hit Enter or move focus away"
        hint="Updates the model on change only"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
</script>
