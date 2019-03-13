<template>
  <div class="q-pa-md">
    <q-input type="textarea" v-model="message" label="What message to show while loading" />

    <q-btn color="teal" @click="showLoading" label="Show Loading (Sanitized)" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: 'Some important <b>process</b> is in progress.<br/><span class="text-primary">Hang on...</span>'
    }
  },
  methods: {
    showLoading () {
      this.$q.loading.show({
        message: this.message,
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
