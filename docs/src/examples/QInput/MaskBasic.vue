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
        v-model="id"
        label="Special ID"
        mask="###/##"
        hint="Mask: ###/##"
        fill-mask
        clearable
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
        v-model="phone"
        label="Phone"
        mask="(###) ### - ####"
        hint="Mask: (###) ### - ####"
        fill-mask
        clearable
      />

      <q-input
        filled
        v-model="serialNumber"
        label="Serial number"
        mask="AAAA - #### - #### - SSS"
        hint="Mask: AAAA - #### - #### - SSS"
      />

      <q-input
        filled
        v-model="serialNumber"
        label="Serial number"
        mask="AAAA - #### - #### - SSS"
        hint="Mask: AAAA - #### - #### - SSS"
        fill-mask
        clearable
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: null,
      phone: null,
      serialNumber: null
    }
  }
}
</script>
