<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input
      ref="inputRef"
      filled
      v-model="model"
      label="Maximum 3 characters"
      :rules="[ val => val.length <= 3 || 'Please use maximum 3 characters']"
    />

    <q-btn class="q-mt-sm" label="Reset Validation" @click="reset" color="primary"/>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const inputRef = ref(null)

    return {
      model: ref(''),
      inputRef,

      reset () {
        inputRef.value.resetValidation()
      }
    }
  }
}
</script>
