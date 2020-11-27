<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Default progress" color="primary" @click="showDefault" />
    <q-btn label="Custom progress" color="primary" @click="showCustom" />
  </div>
</template>

<script>
import { useQuasar, QSpinnerGears } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    function showDefault () {
      const dialog = $q.dialog({
        message: 'Uploading... 0%',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      // we simulate some progress here...
      let percentage = 0
      const interval = setInterval(() => {
        percentage = Math.min(100, percentage + Math.floor(Math.random() * 22))

        // we update the dialog
        dialog.update({
          message: `Uploading... ${percentage}%`
        })

        // if we are done, we're gonna close it
        if (percentage === 100) {
          clearInterval(interval)
          setTimeout(() => {
            dialog.hide()
          }, 350)
        }
      }, 500)
    }

    function showCustom () {
      const dialog = $q.dialog({
        title: 'Uploading...',
        dark: true,
        message: '0%',
        progress: {
          spinner: QSpinnerGears,
          color: 'amber'
        },
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      // we simulate some progress here...
      let percentage = 0
      const interval = setInterval(() => {
        percentage = Math.min(100, percentage + Math.floor(Math.random() * 22))

        // we update the dialog
        dialog.update({
          message: `${percentage}%`
        })

        // if we are done...
        if (percentage === 100) {
          clearInterval(interval)

          dialog.update({
            title: 'Done!',
            message: 'Upload completed successfully',
            progress: false,
            ok: true
          })
        }
      }, 500)
    }

    return { showDefault, showCustom }
  }
}
</script>
