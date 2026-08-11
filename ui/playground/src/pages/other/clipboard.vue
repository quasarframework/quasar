<template>
  <div class="q-layout-padding">
    <div class="q-gutter-md">
      <q-input v-model="copyText" outlined />
      <q-btn push label="Copy to clipboard" color="primary" @click="copy" />
      <q-input v-model="pasteText" type="textarea" outlined />
    </div>
  </div>
</template>

<script setup>
import { copyToClipboard, useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()

const copyText = ref('Fill me')
const pasteText = ref('Hit btn above then paste here')

function copy() {
  copyToClipboard(copyText.value)
    .then(() => {
      $q.notify('Copied to clipboard')
    })
    .catch(() => {
      $q.notify({
        color: 'negative',
        message: 'Failed to copy to clipboard'
      })
    })
}
</script>
