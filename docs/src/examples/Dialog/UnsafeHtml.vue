<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Show HTML Dialog" color="primary" @click="showDialog" />
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    return {
      showDialog () {
        $q.dialog({
          title: 'Alert<em>!</em>',
          message: '<em>I can</em> <span class="text-red">use</span> <strong>HTML</strong>',
          html: true
        }).onOk(() => {
          // console.log('OK')
        }).onCancel(() => {
          // console.log('Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
      }
    }
  }
}
</script>
