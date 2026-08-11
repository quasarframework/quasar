<template>
  <div class="q-pa-md">
    <q-btn color="primary" @click="showLoading" label="Show Loading" />
  </div>
</template>

<script setup>
import { QSpinnerGears, useQuasar } from 'quasar'
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
    message: 'First message. Gonna change it in 3 seconds...'
  })

  timer = setTimeout(() => {
    $q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      messageColor: 'black',
      backgroundColor: 'yellow',
      message: 'Updated message'
    })

    timer = setTimeout(() => {
      $q.loading.hide()
      timer = void 0
    }, 2000)
  }, 2000)
}
</script>
