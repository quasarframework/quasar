<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showMultipleGroups" label="Show Multiple Groups" />
  </div>
</template>

<script>
export default {
  methods: {
    showMultipleGroups () {
      const first = this.$q.loading.show({
        group: 'first',
        message: 'This is first group',
        spinnerColor: 'amber',
        messageColor: 'amber'
      })

      // hiding in 2s
      this.timer = setTimeout(() => {
        const second = this.$q.loading.show({
          group: 'second',
          message: 'This is second group'
        })

        this.timer = setTimeout(() => {
          // we hide second one (only); but we will still have the first one active
          second()

          // we update 'first' group message (just highlighting how it can be done);
          // note that updating here is not required to show the remaining 'first' group
          first({
            message: 'We hid the second group and updated the first group message'
          })

          this.timer = setTimeout(() => {
            // we hide all that may be showing
            this.$q.loading.hide()
            this.timer = void 0
          }, 2000)
        }, 2000)
      }, 1500)
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
