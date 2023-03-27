<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showNotif" label="Show with caption" />
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
          caption: '5 minutes ago',
          color: 'secondary'
        })
      }
    }
  }
}
</script>
