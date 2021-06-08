<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-uploader
        style="max-width: 300px"
        url="http://localhost:4444/upload"
        label="Restricted to images"
        multiple
        accept=".jpg, image/*"
        @rejected="onRejected"
      />

      <q-uploader
        style="max-width: 300px"
        url="http://localhost:4444/upload"
        label="Max file size (2k)"
        multiple
        max-file-size="2048"
        @rejected="onRejected"
      />

      <q-uploader
        style="max-width: 300px"
        url="http://localhost:4444/upload"
        label="Max total upload size (4k)"
        multiple
        max-total-size="4096"
        @rejected="onRejected"
      />

      <q-uploader
        style="max-width: 300px"
        url="http://localhost:4444/upload"
        label="Max number of files (3)"
        multiple
        max-files="3"
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

    function onRejected (rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      $q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    }

    return { onRejected }
  }
}
</script>
