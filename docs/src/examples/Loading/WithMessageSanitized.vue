<template>
  <div class="q-pa-md">
    <q-btn color="teal" @click="showLoading" label="Show Loading (Sanitized)" />
  </div>
</template>

<script>
export default {
  methods: {
    showLoading () {
      this.$q.loading.show({
        message: 'Some important <b>process</b> is in progress.<br/><span class="text-orange text-weight-bold">Hang on...</span>',
        sanitize: true
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
