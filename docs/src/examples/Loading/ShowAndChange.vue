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
      /* This is for Codepen (using UMD) to work */
      const spinner = typeof QSpinnerGears !== 'undefined'
        ? QSpinnerGears
        : Quasar.components.QSpinnerGears // eslint-disable-line
      /* End of Codepen workaround */

      this.$q.loading.show({
        message: 'First message. Gonna change it in 3 seconds...'
      })

      this.timer = setTimeout(() => {
        this.$q.loading.show({
          spinner,
          spinnerColor: 'red',
          messageColor: 'black',
          backgroundColor: 'yellow',
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
