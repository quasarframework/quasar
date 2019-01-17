<template>
  <div class="q-pa-md">
    <q-btn color="teal" @click="showLoading" label="Show Loading" />
  </div>
</template>

<script>
export default {
  methods: {
    showLoading () {
      this.$q.loading.show({
        message: 'Some important process is in progress. Hang on...'
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
