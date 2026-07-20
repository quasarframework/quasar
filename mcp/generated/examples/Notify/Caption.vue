<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showNotif" label="Show with caption" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function showNotif() {
  $q.notify({
    message: 'Jim pinged you.',
    caption: '5 minutes ago',
    color: 'secondary'
  })
}
</script>
