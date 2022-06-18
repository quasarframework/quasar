<template>
  <div class="q-layout-padding">
    <div class="q-gutter-md">
      <q-input v-model="copyText" outlined />
      <q-btn push label="Copy to clipboard" color="primary" @click="copy" />
      <q-input v-model="pasteText" type="textarea" outlined />
    </div>
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'

export default {
  data () {
    return {
      copyText: 'Fill me',
      pasteText: 'Hit btn above then paste here'
    }
  },

  methods: {
    copy () {
      copyToClipboard(this.copyText)
        .then(() => {
          this.$q.notify('Copied to clipboard')
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            message: 'Failed to copy to clipboard'
          })
        })
    }
  }
}
</script>
