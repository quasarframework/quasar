<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        <pre>{{model}}</pre>
      </div>

      <q-inline-color-picker v-model="model" />
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      model: {
        hex: '#194d33',
        hsl: {
          h: 150,
          s: 0.5,
          l: 0.2,
          a: 1
        },
        hsv: {
          h: 150,
          s: 0.66,
          v: 0.30,
          a: 1
        },
        rgba: {
          r: 25,
          g: 77,
          b: 51,
          a: 1
        },
        a: 1
      }
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', val)
    }
  }
}
</script>
