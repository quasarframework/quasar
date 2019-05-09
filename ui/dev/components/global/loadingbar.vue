<template>
  <div class="q-layout-padding">
    <div>Status: {{ this.$q.loadingBar.isActive ? 'active' : 'idle' }}</div>
    <h1>LoadingBar global</h1>
    <q-btn label="Add event" @click="add()" />
    <q-btn label="Remove event" @click="remove()" />
    <q-btn label="Change defaults" @click="changeDefaults()" />

    <h1>$q.loadingBar</h1>
    <q-btn label="Add event" @click="add(true)" />
    <q-btn label="Remove event" @click="remove(true)" />
    <q-btn label="Change defaults" @click="changeDefaults(true)" />
  </div>
</template>

<script>
import { LoadingBar } from 'quasar'

export default {
  methods: {
    add (withQ) {
      if (withQ) {
        this.$q.loadingBar.start()
      }
      else {
        LoadingBar.start()
      }
    },

    remove (withQ) {
      if (withQ) {
        this.$q.loadingBar.stop()
      }
      else {
        LoadingBar.stop()
      }
    },

    changeDefaults (withQ) {
      if (withQ) {
        this.$q.loadingBar.setDefaults({
          position: 'bottom',
          color: 'purple'
        })
      }
      else {
        LoadingBar.setDefaults({
          position: 'top',
          size: '15px',
          color: 'teal'
        })
      }
    }
  }
}
</script>
