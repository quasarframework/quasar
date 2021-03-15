<template>
  <div class="q-pa-md q-gutter-md">
    <q-btn color="primary" @click="showLoading" label="Show Loading" />

    <q-btn color="primary" @click="showLoadingCounter" label="Show Loading Without Transition" />
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
          messageColor: 'black',
          backgroundColor: 'yellow',
          message: 'Updated message'
        })

        this.timer = setTimeout(() => {
          this.$q.loading.hide()
          this.timer = void 0
        }, 2000)
      }, 2000)
    },

    async showLoadingCounter () {
      for (let i = 5; i > 0; i--) {
        this.$q.loading.show({
          message: `Message gonna hide in ${i} second${i > 1 ? 's' : ''}...`,
          delay: 0,
          update: true
        })

        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      this.$q.loading.hide()
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
