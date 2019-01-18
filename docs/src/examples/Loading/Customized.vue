<template>
  <div class="q-pa-md">
    <q-btn color="red" @click="showLoading" label="Show Loading" />
  </div>
</template>

<script>
import { QSpinnerFacebook } from 'quasar'

export default {
  methods: {
    showLoading () {
      /* This is for Codepen (using UMD) to work */
      const spinner = typeof QSpinnerFacebook !== 'undefined'
        ? QSpinnerFacebook // Non-UMD, imported above
        : Quasar.components.QSpinnerFacebook // eslint-disable-line
      /* End of Codepen workaround */

      this.$q.loading.show({
        spinner,
        spinnerColor: 'yellow',
        spinnerSize: 140,
        backgroundColor: 'purple',
        message: 'Some important process is in progress. Hang on...',
        messageColor: 'black'
      })

      // hiding in 3s
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = void 0
      }, 3000)
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
