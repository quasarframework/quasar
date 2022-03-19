<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-uploader
        style="max-width: 300px"
        url="http://localhost:4444/upload"
        label="Filtered (for <2k size)"
        multiple
        :filter="checkFileSize"
        @rejected="onRejected"
      />

      <q-uploader
        style="max-width: 300px"
        url="http://localhost:4444/upload"
        label="Filtered (png only)"
        multiple
        :filter="checkFileType"
        @rejected="onRejected"
      />
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    function checkFileSize (files) {
      return files.filter(file => file.size < 2048)
    }

    function checkFileType (files) {
      return files.filter(file => file.type === 'image/png')
    }

    function onRejected (rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      $q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    }

    return {
      checkFileSize,
      checkFileType,
      onRejected
    }
  }
}
</script>
