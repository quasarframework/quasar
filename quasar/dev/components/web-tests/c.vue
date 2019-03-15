<template>
  <div class="q-layout-padding">
    <span>CCC</span>
    <q-btn @click="$router.replace('/web-tests/a')">
      Go to A
    </q-btn>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  beforeRouteLeave (to, from, next) {
    const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
    if (answer) {
      next()
    }
    else {
      next(false)
    }
  }
})
</script>
