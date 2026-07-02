<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showLoading" label="Show Loading" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
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
    message: 'Doing something. Please wait...',
    boxClass: 'bg-grey-2 text-grey-9',
    spinnerColor: 'primary'
  })

  // hiding in 3s
  timer = setTimeout(() => {
    $q.loading.hide()
    timer = void 0
  }, 3000)
}
</script>
