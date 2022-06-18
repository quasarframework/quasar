<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showNotif" label="Show Notifications" />
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
          message: 'Jim just pinged you.',
          color: 'primary',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          actions: [
            { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
          ]
        })

        $q.notify({
          message: 'Jim just pinged you.',
          color: 'primary',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          actions: [
            { label: 'Reply', color: 'yellow', handler: () => { /* ... */ } },
            { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
          ]
        })
      }
    }
  }
}
</script>
