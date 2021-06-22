<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-file
        style="max-width: 300px"
        v-model="filesMaxSize"
        filled
        label="Filtered (for <2k size)"
        multiple
        :filter="checkFileSize"
        @rejected="onRejected"
      />

      <q-file
        style="max-width: 300px"
        v-model="filesPng"
        rounded
        outlined
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
import { ref } from 'vue'

export default {
  setup () {
    const $q = useQuasar()

    return {
      filesMaxSize: ref(null),
      filesPng: ref(null),

      checkFileSize (files) {
        return files.filter(file => file.size < 2048)
      },

      checkFileType (files) {
        return files.filter(file => file.type === 'image/png')
      },

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
