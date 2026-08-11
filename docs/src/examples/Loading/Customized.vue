<template>
  <div class="q-pa-md">
    <q-btn color="red" @click="showLoading" label="Show Loading" />
  </div>
</template>

<script setup>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

const $q = useQuasar()
let timer

onBeforeUnmount(() => {
  if (timer !== void 0) {
    clearTimeout(timer)
    $q.loading.hide()
  }
})

function showLoading() {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: 'yellow',
    spinnerSize: 140,
    backgroundColor: 'purple',
    message: 'Some important process is in progress. Hang on...',
    messageColor: 'black'
  })

  // hiding in 3s
  timer = setTimeout(() => {
    $q.loading.hide()
    timer = void 0
  }, 3000)
}
</script>
