<template>
  <div class="q-layout-padding">
    <div>Click "Start" then use QInput</div>
    <div>{{ i }}</div>
    <div class="q-gutter-md">
      <q-btn label="start" @click="start" />
      <q-btn label="stop" @click="stop" />
    </div>
    <q-input filled v-model="text" debounce="300" label="Label" />

    <div class="q-mt-xl">
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      i: 0
    }
  },
  methods: {
    start () {
      this.stop()
      this.timer = setInterval(() => {
        this.i++
      }, 100)
    },

    stop () {
      clearInterval(this.timer)
    }
  },

  beforeUnmount () {
    this.stop()
  }
}
</script>
