<template>
  <div>
    <div class="layout-padding">
      <div class="label text-white" style="text-shadow: black 0px 0px 7px" :style="{ backgroundColor: this.model.hex }">
        <pre>{{model}}</pre>
      </div>

      <div>
        <q-color v-model="model" />
        <q-color v-model="model" no-alpha />
      </div>
      <div class="q-mt-xs">
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
