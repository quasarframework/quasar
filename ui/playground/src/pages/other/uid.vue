<template>
  <div class="q-layout-padding">
    <pre>{{ uidResult }}</pre>
  </div>
</template>

<script setup>
import { uid } from 'quasar'
import { onMounted, ref } from 'vue'

// generated on the client only: uid() output differs between the
// server and client render passes, so it must not be server-rendered
const uidResult = ref('generating...')

onMounted(() => {
  const uids = []
  for (let i = 0; i < 100; i++) {
    uids.push(uid())
  }
  uidResult.value = JSON.stringify(uids, null, 2)
})
</script>
