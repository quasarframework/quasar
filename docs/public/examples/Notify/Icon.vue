<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showNotif" label="Show Notification" />
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
          message: 'Jim pinged you.',
          icon: 'announcement'
        })
      }
    }
  }
}
</script>
