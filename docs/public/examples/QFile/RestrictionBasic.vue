<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-file
        style="max-width: 300px"
        v-model="filesImages"
        filled
        rounded
        label="Restricted to images"
        multiple
        accept=".jpg, image/*"
        @rejected="onRejected"
      />

      <q-file
        style="max-width: 300px"
        v-model="filesMaxSize"
        outlined
        label="Max file size (2k)"
        multiple
        max-file-size="2048"
        @rejected="onRejected"
      />

      <q-file
        style="max-width: 300px"
        v-model="filesMaxTotalSize"
        standout
        label="Max total upload size (4k)"
        multiple
        max-total-size="4096"
        @rejected="onRejected"
      />

      <q-file
        style="max-width: 300px"
        v-model="filesMaxNumber"
        standout
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
import { ref } from 'vue'

export default {
  setup () {
    const $q = useQuasar()

    return {
      filesImages: ref(null),
      filesMaxSize: ref(null),
      filesMaxTotalSize: ref(null),
      filesMaxNumber: ref(null),

      onRejected (rejectedEntries) {
        // Notify plugin needs to be installed
        // https://quasar.dev/quasar-plugins/notify#Installation
        $q.notify({
          type: 'negative',
          message: `${rejectedEntries.length} file(s) did not pass validation constraints`
        })
      }
    }
  }
}
</script>
