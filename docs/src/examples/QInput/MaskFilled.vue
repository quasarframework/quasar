<template>
<div class="q-pa-md q-gutter-md">
    <div class="row justify-start gutter-sm">
      <div class="col-xs-12 col-md-6">
        <q-input v-model="maskedInput" label="Datetime" hint="####/##/## ##:##" fill-mask mask="datetime"/>
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
