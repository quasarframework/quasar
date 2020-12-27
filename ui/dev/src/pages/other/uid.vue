<template>
  <div class="q-layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <pre>{{ JSON.stringify(uids, null, 2) }}</pre>
  </div>
</template>

<script>
/* eslint-disable */
import { uid } from 'quasar'

export default {
  data () {
    const uids = []
    for (let i = 0; i < 100; i++) {
      uids.push(uid())
    }
    return { uids }
  }
}
</script>
