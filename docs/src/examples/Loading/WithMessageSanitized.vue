<template>
  <div class="q-pa-md">
    <q-btn color="teal" @click="showLoading" label="Show Loading (Sanitized)" />
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

export default {
  setup () {
    const $q = useQuasar()
    let timer

    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer)
        $q.loading.hide()
      }
    })

    return {
      showLoading () {
        $q.loading.show({
          message: 'Some important <b>process</b> is in progress.<br/><span class="text-primary">Hang on...</span>',
          sanitize: true
        })

        // hiding in 3s
        timer = setTimeout(() => {
          $q.loading.hide()
          timer = void 0
        }, 3000)
      }
    }
  }
}
</script>
