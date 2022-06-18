<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-field
      ref="fieldRef"
      filled
      v-model="date"
      label="Required Field"
      stack-label
      :rules="[val => !!val || 'Field is required']"
    >
      <template v-slot:control>
        <q-date class="q-mt-sm full-width" style="width: 300px" minimal v-model="date" />
      </template>
    </q-field>

    <div class="q-mt-sm">
      <div class="q-gutter-sm">
        <q-btn label="Reset Validation" @click="resetValidation" color="primary"/>
        <q-btn label="Reset Date" @click="resetDate" color="primary"/>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const date = ref('')
    const fieldRef = ref(null)

    return {
      date,
      fieldRef,

      resetValidation () {
        fieldRef.value.resetValidation()
      },

      resetDate () {
        date.value = ''
      }
    }
  }
}
</script>
