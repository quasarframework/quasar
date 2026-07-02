<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-input
        filled
        v-model="id"
        label="Special ID"
        mask="###/##"
        hint="Mask: ###/##"
      />

      <q-input
        filled
        v-model="phone"
        label="Phone"
        mask="(###) ### - ####"
        hint="Mask: (###) ### - ####"
      />

      <q-input
        filled
        v-model="serialNumber"
        label="Serial number"
        mask="AAAA - #### - #### - SSS"
        hint="Mask: AAAA - #### - #### - SSS"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const id = ref(null)
const phone = ref(null)
const serialNumber = ref(null)
</script>
