<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-input
        filled
        v-model="id"
        label="Special ID"
        mask="###/##"
        fill-mask
        hint="Mask: ###/##"
      />

      <q-input
        filled
        v-model="phone"
        label="Phone"
        mask="(###) ### - ####"
        fill-mask
        hint="Mask: (###) ### - ####"
      />

      <q-input
        filled
        v-model="card"
        label="Card"
        mask="#### #### #### ####"
        fill-mask="#"
        hint="Mask: #### #### #### ####, FillMask: #"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      id: ref(null),
      phone: ref(null),
      card: ref(null)
    }
  }
}
</script>
