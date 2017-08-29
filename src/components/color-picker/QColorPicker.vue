<template>
  <div
    class="q-color-picker non-selectable"
  >
    <q-saturation-value-picker :value="saturationAndValue" :hue="this.value.hsv.h" @input="__onSaturationAndValueChange" />

    <q-field stack-label="Hue">
      <q-hue-slider :value="hue" @input="__onHueChange" />
    </q-field>
    <q-field stack-label="Hue">
      <q-alpha-slider :value="alpha" @input="__onAlphaChange" />
      </q-item>
    </q-field>
  </div>
</template>

<script>
import QField from '../field/QField'
import QSaturationValuePicker from './QSaturationValuePicker.vue'
import QHueSlider from './QHueSlider.vue'
import QAlphaSlider from './QAlphaSlider.vue'
import TouchPan from '../../directives/touch-pan'
import { colorChange } from './color-picker-utils'
export default {
  name: 'q-color-picker',
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
    QField,
    QSaturationValuePicker,
    QHueSlider,
    QAlphaSlider
  },
  data () {
    let data = {
      dragging: false,
      hue: 0.0,
      alpha: 0.0
    }
    data.hue = this.value.hsv ? this.value.hsv.h : 0.0
    data.alpha = this.value.hsv ? this.value.hsv.a * 100 : 0.0
    return data
  },
  computed: {
    saturationAndValue () { return { s: this.value.hsv.s, v: this.value.hsv.v } }
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

      this.__changeColor(colorChange(newValue.hsv, this.value.hsv.h))
    },
    __onHueChange (hue) {
      this.hue = hue
      const newValue = Object.assign(
        this.value,
        {
          hsl: {
            h: hue,
            s: this.value.hsl.s,
            l: this.value.hsl.l,
            a: this.value.hsl.a
          }
        })

      this.__changeColor(colorChange(newValue.hsl, this.value.hsv.h))
    },
    __onAlphaChange (alpha) {
      this.alpha = alpha
      const newValue = Object.assign(
        this.value,
        {
          hsl: {
            h: this.value.hsl.h,
            s: this.value.hsl.s,
            l: this.value.hsl.l,
            a: alpha / 100
          }
        })

      this.__changeColor(colorChange(newValue.hsl, this.value.hsv.h))
    },
    __changeColor (color) {
      this.$emit('input', color)
      this.$emit('change', color)
    }
  }
}
</script>
