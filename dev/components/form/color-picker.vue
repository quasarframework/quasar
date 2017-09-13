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
      model: { h: 0, s: 0, v: 0, r: 0, g: 0, b: 0, a: 1, hex: '#000000' }
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', val)
    }
  }
}
</script>
