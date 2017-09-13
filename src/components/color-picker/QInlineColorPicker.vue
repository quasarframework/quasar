<template>
  <div
    class="q-inline-color-picker non-selectable"
  >
    <div class="row">
      <q-color-swatch :value="value" />
      <q-input class="col" :value="hex" @change="__onHexChange" stack-label="HEX" />
      <q-input class="col-xs-4" :value="a" @input="__onAlphaChange" stack-label="Alpha" type="number" :min="0" :max="100" />
    </div>
    <div class="row">
      <q-input class="col" :value="r" @input="__onRChange" stack-label="Red" type="number" :min="0" :max="255" />
      <q-input class="col" :value="g" @input="__onGChange" stack-label="Green" type="number" :min="0" :max="255" />
      <q-input class="col" :value="b" @input="__onBChange" stack-label="Blue" type="number" :min="0" :max="255" />
    </div>
    <q-saturation-value-picker :value="saturationAndValue" :hue="this.value.h" @input="__onSaturationAndValueChange" />
    <q-hue-slider :value="h" @input="__onHueChange" />
    <q-alpha-slider :value="a" @input="__onAlphaChange" />
  </div>
</template>

<script>
import QInput from '../input/QInput'
import QField from '../field/QField'
import QColorSwatch from './QColorSwatch.vue'
import QSaturationValuePicker from './QSaturationValuePicker.vue'
import QHueSlider from './QHueSlider.vue'
import QAlphaSlider from './QAlphaSlider.vue'
import TouchPan from '../../directives/touch-pan'
import { colorChange } from './color-picker-utils'
export default {
  name: 'q-inline-color-picker',
  directives: {
    TouchPan
  },
  mixins: [],
  props: {
    value: {
      type: Object,
      default: colorChange({ hex: '#000000' }),
      required: true
    }
  },
  components: {
    QInput,
    QField,
    QColorSwatch,
    QSaturationValuePicker,
    QHueSlider,
    QAlphaSlider
  },
  data () {
    let data = {
      dragging: false
    }
    return data
  },
  computed: {
    saturationAndValue () { return { s: this.value.s, v: this.value.v } },
    r () { return Math.floor(this.value.r) },
    g () { return Math.floor(this.value.g) },
    b () { return Math.floor(this.value.b) },
    a () { return Math.floor(this.value.a * 100) },
    h () { return Math.floor(this.value.h) },
    hex () { return this.value.hex }
  },
  methods: {
    __onSaturationAndValueChange ({s, v}) {
      this.__changeColor(colorChange({
        h: this.value.h,
        s: s,
        v: v,
        a: this.value.a
      }))
    },
    __onHueChange (h) {
      this.__changeColor(colorChange({
        h: h,
        s: this.value.s,
        v: this.value.v,
        a: this.value.a
      }))
    },
    __onRChange (r) {
      if (r && r >= 0 && r <= 255) {
        this.__changeColor(colorChange({
          r: r,
          g: this.value.g,
          b: this.value.b,
          a: this.value.a
        }))
      }
    },
    __onGChange (g) {
      if (g && g >= 0 && g <= 255) {
        this.__changeColor(colorChange({
          r: this.value.r,
          g: g,
          b: this.value.b,
          a: this.value.a
        }))
      }
    },
    __onBChange (b) {
      if (b && b >= 0 && b <= 255) {
        this.__changeColor(colorChange({
          r: this.value.r,
          g: this.value.g,
          b: b,
          a: this.value.a
        }))
      }
    },
    __onAlphaChange (a) {
      if (a && a >= 0 && a <= 100) {
        this.__changeColor(colorChange({
          h: this.value.h,
          s: this.value.s,
          v: this.value.v,
          a: a / 100
        }))
      }
    },
    __onHexChange (hex) {
      this.__changeColor(colorChange({
        hex: hex,
        a: this.value.a
      }))
    },
    __changeColor (color) {
      this.$emit('input', color)
      this.$emit('change', color)
    }
  }
}
</script>
