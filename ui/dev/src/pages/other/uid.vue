<template>
  <div class="q-layout-padding">
    <pre>{{ uidResult }}</pre>
  </div>
</template>

<script>
import { uid } from 'quasar'

export default {
  setup () {
    const uids = []
    for (let i = 0; i < 100; i++) {
      uids.push(uid())
    }
    return { uidResult: JSON.stringify(uids, null, 2) }
  }
}
</script>
