<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input
      ref="inputRef"
      filled
      v-model="model"
      label="Required Field *"
      :rules="[myRule]"
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

function myRule(val) {
  // simulating a delay

  return new Promise(resolve => {
    setTimeout(() => {
      // call
      //  resolve(true)
      //     --> content is valid
      //  resolve(false)
      //     --> content is NOT valid, no error message
      //  resolve(error_message)
      //     --> content is NOT valid, we have error message
      resolve(Boolean(val) || '* Required')

      // calling reject(...) will also mark the input
      // as having an error, but there will not be any
      // error message displayed below the input
      // (only in browser console)
    }, 1000)
  })
}

function reset() {
  inputRef.value.resetValidation()
}
</script>
