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
    <q-saturation-value-picker :value="saturationAndValue" :hue="this.value.hsv.h" @input="__onSaturationAndValueChange" />
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
      default: colorChange('#000000'),
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
    saturationAndValue () { return { s: this.value.hsv.s, v: this.value.hsv.v } },
    r () { return this.value.rgba.r },
    g () { return this.value.rgba.g },
    b () { return this.value.rgba.b },
    a () { return Math.floor(this.value.rgba.a * 100) },
    h () { return Math.floor(this.value.hsv.h) },
    hex () { return this.value.hex }
  },
  methods: {
    __onSaturationAndValueChange ({s, v}) {
      const newValue = Object.assign(
        this.value,
        {
          hsv: {
            h: this.value.hsv.h,
            s: s,
            v: v,
            a: this.value.hsv.a
          }
        })

      this.__changeColor(colorChange(newValue.hsv))
    },
    __onHueChange (h) {
      this.__changeColor(colorChange({
        h: h,
        s: this.value.hsl.s,
        l: this.value.hsl.l,
        a: this.value.hsl.a
      }))
    },
    __onRChange (r) {
      this.__changeColor(colorChange({
        r: r,
        g: this.value.rgba.g,
        b: this.value.rgba.b,
        a: this.value.rgba.a
      }))
    },
    __onGChange (g) {
      this.__changeColor(colorChange({
        r: this.value.rgba.r,
        g: g,
        b: this.value.rgba.b,
        a: this.value.rgba.a
      }))
    },
    __onBChange (b) {
      this.__changeColor(colorChange({
        r: this.value.rgba.r,
        g: this.value.rgba.g,
        b: b,
        a: this.value.rgba.a
      }))
    },
    __onAlphaChange (a) {
      this.__changeColor(colorChange({
        h: this.value.hsl.h,
        s: this.value.hsl.s,
        l: this.value.hsl.l,
        a: a / 100
      }))
    },
    __onHexChange (hex) {
      this.__changeColor(colorChange({
        hex: hex,
        a: this.value.rgba.a
      }))
    },
    __changeColor (color) {
      this.$emit('input', color)
      this.$emit('change', color)
    }
  }
}
</script>
