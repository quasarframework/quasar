<template>
  <div class="q-layout-padding">
    <div class="q-pa-md">
      <div class="q-gutter-md" style="max-width: 300px">
        <q-input v-model="text" label="Standard" autofocus />

        <button @mousedown.prevent @touchstart.prevent @keydown.enter.space.prevent @click="log('button prevented', $event)">
          Click me - preventing mousedown works here
        </button>

        <q-btn label="Click me - preventing!" @keydown.enter.space.prevent @mousedown.prevent @touchstart.prevent @click="log('q-btn prevented', $event)" />
        <q-btn label="Click me - not preventing" @click="log('q-btn', $event)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: ''
    }
  },

  methods: {
    log (src, evt) {
      console.log(src, evt)
    }
  }
}
</script>
