<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input
      ref="inputRef"
      filled
      v-model="model"
      label="Required Field"
      :rules="[val => !!val || 'Field is required']"
    />

    <q-btn
      class="q-mt-sm"
      label="Reset Validation"
      @click="reset"
      color="primary"
    />
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

const inputRef = useTemplateRef('inputRef')
const model = ref('')

function reset() {
  inputRef.value.resetValidation()
}
</script>
