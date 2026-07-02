<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showNotif" label="Show Notification" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function showNotif() {
  $q.notify({
    message: 'Jim pinged you.',
    icon: 'announcement'
  })
}
</script>
