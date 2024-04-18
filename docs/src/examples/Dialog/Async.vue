<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="hide await Async" color="primary" @click="openDialog" />
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    // Simulate an asynchronous task that takes two seconds to complete
    function mockAsyncJob () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 2000)
      })
    }

    function openDialog () {
      const dialog = $q.dialog({
        title: 'Confirm',
        message: 'Would you like to turn on the wifi?',
        ok: {
          push: true,
          loading: false,
          notHide: true // We don't want to close the dialog immediately after clicking the OK button
        },
        cancel: {
          push: true,
          color: 'negative'
          // notHide: true // we can also set not close the dialog immediately after clicking the Cancel button
        },
        persistent: true // we want the user to not be able to close it
      }).onOk(async () => {
        // console.log('>>>> OK')
        // We will manually close the dialog after waiting for the asynchronous task to complete
        dialog.update({
          ok: {
            label: 'connecting',
            loading: true
          }
        })
        await mockAsyncJob()
        dialog.update({
          ok: {
            loading: false
          }
        })
        dialog.hide()
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

    return { openDialog }
  }
}
</script>
