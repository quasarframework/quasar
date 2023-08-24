<template>
  <div class="q-pa-md">
    <q-btn color="primary" @click="showLoading" label="Show Loading" />
  </div>
</template>

<script>
import { useQuasar, QSpinnerGears } from 'quasar'
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
    }
  }
}
</script>
