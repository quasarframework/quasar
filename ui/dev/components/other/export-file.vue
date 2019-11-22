<template>
  <div class="q-layout-padding">
    <div class="q-gutter-md">
      <q-input v-model="copyText" outlined type="textarea" />
      <q-btn push label="Export file" color="primary" @click="exportMe" />
    </div>
  </div>
</template>

<script>
import { exportFile } from 'quasar'

export default {
  data () {
    return {
      copyText: 'Fill me',
      pasteText: 'Hit btn above then paste here'
    }
  },

  methods: {
    exportMe () {
      const status = exportFile('some-file.txt', this.copyText) // [...Array(8000000).keys()].join('--')

      if (status === true) {
        this.$q.notify('Success')
      }
      else {
        this.$q.notify({
          color: 'negative',
          message: 'Failed: ' + status
        })
      }
    }
  }
}
</script>
