<template>
<div class="q-pa-md q-gutter-md">
    <div class="row justify-start gutter-sm">
      <div class="col-xs-12 col-md-6">
        <q-input v-model="maskedInput" label="Credit Card" unmasked-value hint="Don't type a real card number, just for example." mask="card"/>
      </div>
      <div class="col-xs-12 col-md-6">
        <q-input v-model="maskedInput" label="Returned Value" readonly />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    maskedInput: ''
  })
}
</script>
