<template>
  <div class="q-pa-md">
    <q-btn no-caps color="purple" @click="showNotif" label="Show HTML Notification" />
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    return {
      showNotif () {
        $q.notify({
          message: '<em>I can</em> <span style="color: red">use</span> <strong>HTML</strong>',
          html: true
        })
      }
    }
  }
}
</script>
