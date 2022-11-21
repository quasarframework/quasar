<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Prompt (1-10, step 2)" color="primary" @click="prompt" />
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    function prompt () {
      $q.dialog({
        title: 'Prompt with native attributes',
        message: 'Please type a value between 0 and 10:',
        prompt: {
          model: 2,
          type: 'number',

          // native attributes:
          min: 0,
          max: 10,
          step: 2
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        // console.log('>>>> OK, received', data)
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

    return { prompt }
  }
}
</script>
