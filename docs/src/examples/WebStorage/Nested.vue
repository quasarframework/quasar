<template>
  <div class="q-pa-md q-gutter-y-md">
    <div>
      Every toggle writes into the same stored object; reload to see the
      settings survive.
    </div>

    <q-toggle v-model="settings.notifications" label="Notifications" />
    <q-toggle v-model="settings.sounds" label="Sounds" />

    <div>
      The stored object is
      <q-badge :label="JSON.stringify(settings)" />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

const settings = $q.localStorage.useItem('mySettings', {
  default: { notifications: true, sounds: false }
})
</script>
