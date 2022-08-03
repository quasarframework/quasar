<template>
  <div class="q-layout-padding">
    <div>Status: {{ loadingState }}</div>
    <h1>LoadingBar global</h1>
    <div class="q-gutter-sm">
      <q-btn color="primary" label="Add event" @click="add()" />
      <q-btn color="primary" label="Remove event" @click="remove()" />
      <q-btn color="primary" label="Change defaults" @click="changeDefaults()" />
      <q-btn color="primary" label="xhr" @click="triggerXhr" no-caps />
    </div>

    <h1>$q.loadingBar</h1>
    <div class="q-gutter-sm">
      <q-btn color="primary" label="Add event" @click="add(true)" />
      <q-btn color="primary" label="Remove event" @click="remove(true)" />
      <q-btn color="primary" label="Change defaults" @click="changeDefaults(true)" />
      <q-btn color="primary" label="xhr" @click="triggerXhr" no-caps />
    </div>
  </div>
</template>

<script>
import { LoadingBar } from 'quasar'

function sendXhr (url) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.send(null)
}

export default {
  computed: {
    loadingState () {
      return LoadingBar.isActive === true ? 'active' : 'idle'
    }
  },

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
    },

    triggerXhr () {
      sendXhr(`https://deelay.me/${ Math.ceil(5000 + Math.random() * 20000) }/server`)
    }
  }
}
</script>
