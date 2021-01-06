<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm">
      <q-btn color="purple" @click="showDefault" label="Default spinner" />
      <q-btn color="purple" @click="showCustom" label="Custom spinner" />
    </div>
  </div>
</template>

<script>
import { QSpinnerGears } from 'quasar'

export default {
  methods: {
    showDefault () {
      this.$q.notify({
        spinner: true,
        message: 'Please wait...',
        timeout: 2000
      })
    },

    showCustom () {
      this.$q.notify({
        spinner: QSpinnerGears,
        message: 'Working...',
        timeout: 2000
      })
    }
  }
}
</script>
