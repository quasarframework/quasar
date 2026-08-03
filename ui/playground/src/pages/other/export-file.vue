<template>
  <div class="q-layout-padding">
    <div class="q-gutter-md">
      <q-input v-model="copyText" outlined type="textarea" />
      <q-btn push label="Export file" color="primary" @click="exportMe" />
    </div>
  </div>
</template>

<script setup>
import { exportFile, useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()

const copyText = ref('Fill me')
const pasteText = ref('Hit btn above then paste here')

function exportMe() {
  const status = exportFile('some-file.txt', copyText.value) // [...Array(8000000).keys()].join('--')

  if (status === true) {
    $q.notify('Success')
  } else {
    $q.notify({
      color: 'negative',
      message: 'Failed: ' + status
    })
  }
}
</script>
