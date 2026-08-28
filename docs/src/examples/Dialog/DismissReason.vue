<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Open dialog" color="primary" @click="show" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function show() {
  $q.dialog({
    title: 'Confirm',
    message:
      'Dismiss this dialog through the Cancel button, the backdrop or the ESC key.',
    cancel: true
  })
    .onOk(() => {
      console.log('OK')
    })
    .onCancel(reason => {
      // reason is 'cancel', 'backdrop', 'escape' or 'programmatic'
      console.log(`Dismissed through: ${reason}`)
    })
}
</script>
