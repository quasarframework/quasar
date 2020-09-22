<template>
  <q-layout view="hHh lpr fFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          Header
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding class="column flex-center">
        <div v-for="i in 50" :key="i">
          1.{{ i }}
        </div>

        <div>
          {{ $q.screen.width }} x {{ $q.screen.height }}
          <q-menu v-model="menu" persistent>
            <div class="q-pa-md bg-white text-black" @click="menu = false">
              Menu
            </div>
          </q-menu>
        </div>
        <div>
          <pre>{{ viewport }}</pre>
          <input>
        </div>

        <div v-for="i in 50" :key=" 100 + i">
          2.{{ i }}
        </div>

        <div>
          <input>
        </div>

        <div v-for="i in 50" :key="200 + i">
          3.{{ i }}
        </div>
      </q-page>
    </q-page-container>

    <q-footer>
      <q-toolbar>
        <q-toolbar-title>
          Footer
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      menu: false,
      viewport: null
    }
  },

  mounted () {
    if (typeof window !== 'undefined' && window.visualViewport !== void 0) {
      const keys = [
        'width',
        'height',
        'scale',
        'offsetLeft',
        'offsetTop',
        'pageLeft',
        'pageTop'
      ]

      this.timer = setInterval(() => {
        this.viewport = keys.map(k => k + ': ' + window.visualViewport[k])
      }, 500)
    }
  },

  beforeUnmount () {
    clearInterval(this.timer)
  }
}
</script>
