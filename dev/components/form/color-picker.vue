<template>
  <div>
    <div class="layout-padding">
      <q-btn color="primary" label="Set to yellow" @click="setToYellow"/>

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

      <h4>Readonly</h4>
      <div class="row md-gutter" style="width: 550px">
        <div class="col-6">
          <q-color v-model="modelHex" readonly />
        </div>
        <div class="col-6">
          <q-color v-model="modelHexa" readonly />
        </div>
        <div class="col-6">
          <q-color v-model="modelRgb"  readonly />
        </div>
        <div class="col-6">
          <q-color v-model="modelRgba" readonly />
        </div>
      </div>

      <h4>Disable</h4>
      <div class="row md-gutter" style="width: 550px">
        <div class="col-6">
          <q-color v-model="modelHex" disable />
        </div>
        <div class="col-6">
          <q-color v-model="modelHexa" disable />
        </div>
        <div class="col-6">
          <q-color v-model="modelRgb"  disable />
        </div>
        <div class="col-6">
          <q-color v-model="modelRgba" disable />
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
      return `rgb${color.a !== void 0 ? 'a' : ''}(${color.r},${color.g},${color.b}${color.a !== void 0 ? `,${color.a / 100}` : ''})`
    },
    setToYellow () {
      this.modelHex = '#ffff00'
      this.modelHexa = '#ffff00FF'
      this.modelRgb = {r: 255, g: 255, b: 0}
      this.modelRgba = {r: 255, g: 255, b: 0, a: 100}
    }
  }
}
</script>
