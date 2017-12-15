<template>
  <div>
    <div class="layout-padding">
      <div class="row md-gutter" style="width: 550px">
        <div class="col-6">
          <q-color v-model="modelHex" />
          <div class="inline-block text-white" style="text-shadow: black 0px 0px 7px; padding: 10px" :style="{ backgroundColor: this.modelHex }">
            <pre>Hex: {{modelHex}}</pre>
          </div>
        </div>
        <div class="col-6">
          <q-color v-model="modelHexa" />
          <div class="inline-block text-white" style="text-shadow: black 0px 0px 7px; padding: 10px" :style="{ backgroundColor: this.modelHexa }">
            <pre>Hexa: {{modelHexa}}</pre>
          </div>
        </div>
        <div class="col-6">
          <q-color v-model="modelRgb" />
          <div class="inline-block text-white" style="text-shadow: black 0px 0px 7px; padding: 10px" :style="{ backgroundColor: rgb(this.modelRgb) }">
            <pre>RGB: {{modelRgb}}</pre>
          </div>
        </div>
        <div class="col-6">
          <q-color v-model="modelRgba" />
          <div class="inline-block text-white" style="text-shadow: black 0px 0px 7px; padding: 10px" :style="{ backgroundColor: rgb(this.modelRgba) }">
            <pre>RGBA: {{modelRgba}}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modelHex: '#FF00FF',
      modelHexa: '#FF00FFCC',
      modelRgb: { r: 0, g: 0, b: 0 },
      modelRgba: { r: 255, g: 0, b: 255, a: 100 }
    }
  },
  methods: {
    rgb (color) {
      console.log('COLOR', color)
      return `rgb${color.a !== void 0 ? 'a' : ''}(${color.r},${color.g},${color.b}${color.a !== void 0 ? `,${color.a / 100}` : ''})`
    }
  }
}
</script>
