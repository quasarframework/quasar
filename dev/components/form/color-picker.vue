<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        <pre>{{model}}</pre>
      </div>

      <div>
        <q-color v-model="model" />

        <q-color v-model="model" readonly />

        <q-color v-model="model" disable />
      </div>
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
