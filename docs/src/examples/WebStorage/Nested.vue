<template>
  <div class="q-pa-md q-gutter-y-md">
    <div>
      Every toggle writes into the same stored object; reload to see the
      settings survive.
    </div>

    <q-toggle
      v-model="$q.localStorage.items.mySettings.notifications"
      label="Notifications"
    />
    <q-toggle
      v-model="$q.localStorage.items.mySettings.sounds"
      label="Sounds"
    />

    <div>
      The stored object is
      <q-badge :label="JSON.stringify($q.localStorage.items.mySettings)" />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

// stores the default the first time, keeps what is there afterwards
$q.localStorage.items.mySettings ??= {
  notifications: true,
  sounds: false
}
</script>
