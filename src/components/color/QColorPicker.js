import QBtn from '../btn/QBtn.js'
import QSlider from '../slider/QSlider.js'
import ParentFieldMixin from '../../mixins/parent-field.js'
import TouchPan from '../../directives/touch-pan.js'
import { stopAndPrevent } from '../../utils/event.js'
import throttle from '../../utils/throttle.js'
import clone from '../../utils/clone.js'
import { hexToRgb, rgbToHex, rgbToHsv, hsvToRgb } from '../../utils/colors.js'

export default {
  name: 'QColorPicker',
  mixins: [ParentFieldMixin],
  directives: {
    TouchPan
  },
  props: {
    value: [String, Object],
    defaultValue: {
      type: [String, Object],
      default: null
    },
    formatModel: {
      type: String,
      default: 'auto',
      validator: v => ['auto', 'hex', 'rgb', 'hexa', 'rgba'].includes(v)
    },
    disable: Boolean,
    readonly: Boolean,
    dark: Boolean
  },
  data () {
    return {
      view: !this.value || typeof this.value === 'string' ? 'hex' : 'rgb',
      model: this.__parseModel(this.value || this.defaultValue)
    }
  },
  watch: {
    value: {
      handler (v) {
        const model = this.__parseModel(v || this.defaultValue)
        if (model.hex !== this.model.hex) {
          this.model = model
        }
      },
      deep: true
    }
  },
  computed: {
    forceHex () {
      return this.formatModel === 'auto'
        ? null
        : this.formatModel.indexOf('hex') > -1
    },
    forceAlpha () {
      return this.formatModel === 'auto'
        ? null
        : this.formatModel.indexOf('a') > -1
    },
    isHex () {
      return typeof this.value === 'string'
    },
    isOutputHex () {
      return this.forceHex !== null
        ? this.forceHex
        : this.isHex
    },
    editable () {
      return !this.disable && !this.readonly
    },
    hasAlpha () {
      if (this.forceAlpha !== null) {
        return this.forceAlpha
      }
      return this.isHex
        ? this.value.trim().length > 7
        : this.value && this.value.a !== void 0
    },
    swatchColor () {
      return {
        backgroundColor: `rgba(${this.model.r},${this.model.g},${this.model.b},${(this.model.a === void 0 ? 100 : this.model.a) / 100})`
      }
    },
    saturationStyle () {
      return {
        background: `hsl(${this.model.h},100%,50%)`
      }
    },
    saturationPointerStyle () {
      return {
        top: `${101 - this.model.v}%`,
        [this.$q.i18n.rtl ? 'right' : 'left']: `${this.model.s}%`
      }
    },
    inputsArray () {
      const inp = ['r', 'g', 'b']
      if (this.hasAlpha) {
        inp.push('a')
      }
      return inp
    },
    __needsBorder () {
      return true
    }
  },
  created () {
    this.__saturationChange = throttle(this.__saturationChange, 20)
  },
  render (h) {
    return h('div', {
      staticClass: 'q-color',
      'class': { disabled: this.disable, 'q-color-dark': this.dark }
    }, [
      this.__getSaturation(h),
      this.__getSliders(h),
      this.__getInputs(h)
    ])
  },
  methods: {
    __getSaturation (h) {
      return h('div', {
        ref: 'saturation',
        staticClass: 'q-color-saturation non-selectable relative-position overflow-hidden cursor-pointer',
        style: this.saturationStyle,
        'class': { readonly: !this.editable },
        on: this.editable
          ? { click: this.__saturationClick }
          : null,
        directives: this.editable
          ? [{
            name: 'touch-pan',
            modifiers: {
              mightPrevent: true
            },
            value: this.__saturationPan
          }]
          : null
      }, [
        h('div', { staticClass: 'q-color-saturation-white absolute-full' }),
        h('div', { staticClass: 'q-color-saturation-black absolute-full' }),
        h('div', {
          staticClass: 'absolute',
          style: this.saturationPointerStyle
        }, [
          this.model.hex !== void 0 ? h('div', { staticClass: 'q-color-saturation-circle' }) : null
        ])
      ])
    },
    __getSliders (h) {
      return h('div', {
        staticClass: 'q-color-sliders row items-center'
      }, [
        h('div', {
          staticClass: 'q-color-swatch q-mt-sm q-ml-md q-mb-sm non-selectable overflow-hidden'
        }, [
          h('div', { style: this.swatchColor, staticClass: 'fit' })
        ]),
        h('div', { staticClass: 'col q-pa-sm' }, [
          h('div', { staticClass: 'q-color-hue non-selectable' }, [
            h(QSlider, {
              props: {
                value: this.model.h,
                color: 'white',
                min: 0,
                max: 360,
                fillHandleAlways: true,
                readonly: !this.editable
              },
              on: {
                input: this.__onHueChange,
                dragend: val => this.__onHueChange(val, true)
              }
            })
          ]),
          this.hasAlpha
            ? h('div', { staticClass: 'q-color-alpha non-selectable' }, [
              h(QSlider, {
                props: {
                  value: this.model.a,
                  color: 'white',
                  min: 0,
                  max: 100,
                  fillHandleAlways: true,
                  readonly: !this.editable
                },
                on: {
                  input: value => this.__onNumericChange({ target: { value } }, 'a', 100),
                  dragend: value => this.__onNumericChange({ target: { value } }, 'a', 100, true)
                }
              })
            ])
            : null
        ])
      ])
    },
    __getNumericInputs (h) {
      return this.inputsArray.map(formatModel => {
        const max = formatModel === 'a' ? 100 : 255
        return h('div', { staticClass: 'col q-color-padding' }, [
          h('input', {
            attrs: {
              type: 'number',
              min: 0,
              max,
              readonly: !this.editable,
              tabindex: this.editable ? 0 : -1
            },
            staticClass: 'full-width text-center q-no-input-spinner',
            domProps: {
              value: this.model.hex === void 0 ? '' : Math.round(this.model[formatModel])
            },
            on: {
              input: evt => this.__onNumericChange(evt, formatModel, max),
              blur: evt => this.editable && this.__onNumericChange(evt, formatModel, max, true)
            }
          }),
          h('div', { staticClass: 'q-color-label text-center uppercase' }, [
            formatModel
          ])
        ])
      })
    },
    __getInputs (h) {
      const inputs = this.view === 'hex'
        ? [
          h('div', { staticClass: 'col' }, [
            h('input', {
              domProps: { value: this.model.hex },
              attrs: {
                readonly: !this.editable,
                tabindex: this.editable ? 0 : -1
              },
              on: {
                change: this.__onHexChange,
                blur: evt => this.editable && this.__onHexChange(evt, true)
              },
              staticClass: 'full-width text-center uppercase'
            }),
            h('div', { staticClass: 'q-color-label text-center' }, [
              `HEX${this.hasAlpha ? ' / A' : ''}`
            ])
          ])
        ]
        : this.__getNumericInputs(h)

      return h('div', {
        staticClass: 'q-color-inputs row items-center q-px-sm q-pb-sm'
      }, [
        h('div', { staticClass: 'col q-mr-sm row no-wrap' }, inputs),
        h('div', [
          h(QBtn, {
            props: {
              flat: true,
              disable: this.disable
            },
            on: {
              click: this.__nextInputView
            },
            staticClass: 'q-pa-none'
          }, [
            h('svg', {
              attrs: {
                viewBox: '0 0 24 24'
              },
              style: {width: '24px', height: '24px'}
            }, [
              h('path', {
                attrs: {
                  fill: 'currentColor',
                  d: 'M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z'
                }
              })
            ])
          ])
        ])
      ])
    },

    __onSaturationChange (left, top, change) {
      const panel = this.$refs.saturation
      if (!panel) {
        return
      }
      const
        width = panel.clientWidth,
        height = panel.clientHeight,
        rect = panel.getBoundingClientRect()
      let x = Math.min(width, Math.max(0, left - rect.left))

      if (this.$q.i18n.rtl) {
        x = width - x
      }

      const
        y = Math.min(height, Math.max(0, top - rect.top)),
        s = Math.round(100 * x / width),
        v = Math.round(100 * Math.max(0, Math.min(1, -(y / height) + 1))),
        rgb = hsvToRgb({
          h: this.model.h,
          s,
          v,
          a: this.hasAlpha ? this.model.a : void 0
        })

      this.model.s = s
      this.model.v = v
      this.__update(rgb, rgbToHex(rgb), change)
    },
    __onHueChange (h, change) {
      h = Math.round(h)
      const val = hsvToRgb({
        h,
        s: this.model.s,
        v: this.model.v,
        a: this.hasAlpha ? this.model.a : void 0
      })

      this.model.h = h
      this.__update(val, rgbToHex(val), change)
    },
    __onNumericChange (evt, formatModel, max, change) {
      let val = Number(evt.target.value)
      if (isNaN(val)) {
        return
      }

      val = Math.floor(val)
      if (val < 0 || val > max) {
        if (change) {
          this.$forceUpdate()
        }
        return
      }

      const rgb = {
        r: formatModel === 'r' ? val : this.model.r,
        g: formatModel === 'g' ? val : this.model.g,
        b: formatModel === 'b' ? val : this.model.b,
        a: this.hasAlpha
          ? (formatModel === 'a' ? val : this.model.a)
          : void 0
      }
      if (formatModel !== 'a') {
        const hsv = rgbToHsv(rgb)
        this.model.h = hsv.h
        this.model.s = hsv.s
        this.model.v = hsv.v
      }
      this.__update(rgb, rgbToHex(rgb), change)
    },
    __onHexChange (evt, change) {
      let
        hex = evt.target.value,
        len = hex.length,
        edges = this.hasAlpha ? [5, 9] : [4, 7]

      if (len !== edges[0] && len !== edges[1]) {
        if (change) {
          this.$forceUpdate()
        }
        return
      }

      const
        rgb = hexToRgb(hex),
        hsv = rgbToHsv(rgb)

      this.model.h = hsv.h
      this.model.s = hsv.s
      this.model.v = hsv.v
      this.__update(rgb, hex, change)
    },
    __update (rgb, hex, change) {
      const value = this.isOutputHex ? hex : rgb

      // update internally
      this.model.hex = hex
      this.model.r = rgb.r
      this.model.g = rgb.g
      this.model.b = rgb.b
      this.model.a = this.hasAlpha ? rgb.a : void 0

      // emit new value
      this.$emit('input', value)
      this.$nextTick(() => {
        if (change && JSON.stringify(value) !== JSON.stringify(this.value)) {
          this.$emit('change', value)
        }
      })
    },
    __nextInputView () {
      this.view = this.view === 'hex' ? 'rgba' : 'hex'
    },
    __parseModel (v) {
      if (v === null || v === void 0) {
        return { h: 0, s: 0, v: 0, r: 0, g: 0, b: 0, hex: void 0, a: 100 }
      }

      let model = typeof v === 'string' ? hexToRgb(v.trim()) : clone(v)
      if (this.forceAlpha === (model.a === void 0)) {
        model.a = this.forceAlpha ? 100 : void 0
      }
      model.hex = rgbToHex(model)
      return Object.assign({ a: 100 }, model, rgbToHsv(model))
    },

    __saturationPan (evt) {
      if (evt.isFinal) {
        this.__dragStop(evt)
      }
      else if (evt.isFirst) {
        this.__dragStart(evt)
      }
      else {
        this.__dragMove(evt)
      }
    },
    __dragStart (event) {
      stopAndPrevent(event.evt)

      this.saturationDragging = true
      this.__saturationChange(event)
    },
    __dragMove (event) {
      if (!this.saturationDragging) {
        return
      }
      stopAndPrevent(event.evt)

      this.__saturationChange(event)
    },
    __dragStop (event) {
      stopAndPrevent(event.evt)
      setTimeout(() => {
        this.saturationDragging = false
      }, 100)
      this.__onSaturationChange(
        event.position.left,
        event.position.top,
        true
      )
    },
    __saturationChange (evt) {
      this.__onSaturationChange(
        evt.position.left,
        evt.position.top
      )
    },
    __saturationClick (evt) {
      if (this.saturationDragging) {
        return
      }
      this.__onSaturationChange(
        evt.pageX - window.pageXOffset,
        evt.pageY - window.pageYOffset,
        true
      )
    }
  }
}
