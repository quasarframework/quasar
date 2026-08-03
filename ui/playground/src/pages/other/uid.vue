<template>
  <div class="q-layout-padding">
    <pre>{{ uidResult }}</pre>
  </div>
</template>

<script setup>
import { uid } from 'quasar'

const uids = []
for (let i = 0; i < 100; i++) {
  uids.push(uid())
}
const uidResult = JSON.stringify(uids, null, 2)
</script>
