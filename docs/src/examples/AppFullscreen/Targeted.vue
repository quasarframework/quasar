<template>
  <div class="q-pa-md">
    <q-btn
      color="secondary"
      @click="toggle"
      :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      :label="$q.fullscreen.isActive ? 'Exit Fullscreen' : 'Go Fullscreen'"
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function toggle(e) {
  const target = e.target.parentNode.parentNode.parentNode

  $q.fullscreen
    .toggle(target)
    .then(() => {
      // success!
    })
    .catch(err => {
      // uh, oh, error!!
      alert(err)
      console.error(err)
    })
}
</script>
