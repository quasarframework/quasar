<template>
  <div class="q-pa-md">
    <q-btn color="primary" @click="showLoading" label="Show Loading" />
  </div>
</template>

<script>
import { QSpinnerGears } from 'quasar'

export default {
  methods: {
    showLoading () {
      this.$q.loading.show({
        message: 'First message. Gonna change it in 3 seconds...'
      })

      this.timer = setTimeout(() => {
        this.$q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'red',
          message: 'Updated message'
        })

        this.timer = setTimeout(() => {
          this.$q.loading.hide()
          this.timer = void 0
        }, 2000)
      }, 2000)
    }
  },

  beforeDestroy () {
    if (this.timer !== void 0) {
      clearTimeout(this.timer)
      this.$q.loading.hide()
    }
  }
}
</script>
