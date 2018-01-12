import { QBtn } from '../btn'
import { QSlider } from '../slider'
import TouchPan from '../../directives/touch-pan'
import { stopAndPrevent } from '../../utils/event'
import throttle from '../../utils/throttle'
import extend from '../../utils/extend'
import clone from '../../utils/clone'
import { hexToRgb, rgbToHex, rgbToHsv, hsvToRgb } from '../../utils/colors'

export default {
  name: 'q-color-picker',
  directives: {
    TouchPan
  },
  props: {
    value: {
      type: [String, Object],
      required: true
    },
    color: {
      type: String,
      default: 'primary'
    },
    disable: Boolean,
    readonly: Boolean
  },
  data () {
    return {
      view: !this.value || typeof this.value === 'string' ? 'hex' : 'rgb',
      model: this.__parseModel(this.value),
      inputError: {
        hex: false,
        r: false,
        g: false,
        b: false
      }
    }
  },
  watch: {
    value: {
      handler (v) {
        if (this.avoidModelWatch) {
          this.avoidModelWatch = false
          return
        }
        const model = this.__parseModel(v)
        if (model.hex !== this.model.hex) {
          this.model = model
        }
      },
      deep: true
    }
  },
  computed: {
    isHex () {
      return typeof this.value === 'string'
    },
    isRgb () {
      return !this.isHex
    },
    editable () {
      return !this.disable && !this.readonly
    },
    hasAlpha () {
      return this.isHex
        ? this.value.length > 7
        : this.value.a !== void 0
    },
    swatchStyle () {
      return {
        backgroundColor: `rgba(${this.model.r},${this.model.g},${this.model.b},${this.model.a / 100})`
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
        left: `${this.model.s}%`
      }
    },
    inputsArray () {
      const inp = ['r', 'g', 'b']
      if (this.hasAlpha) {
        inp.push('a')
      }
      return inp
    },
    rgbColor () {
      return `rgb(${this.model.r},${this.model.g},${this.model.b})`
    }
  },
  created () {
    this.__saturationChange = throttle(this.__saturationChange, 20)
  },
  render (h) {
    return h('div', {
      staticClass: 'q-color',
      'class': { disabled: this.disable }
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
          h('div', { staticClass: 'q-color-saturation-circle' })
        ])
      ])
    },
    __getSliders (h) {
      return h('div', {
        staticClass: 'q-color-sliders row items-center'
      }, [
        h('div', {
          staticClass: 'q-color-swatch q-mt-sm q-ml-sm q-mb-sm non-selectable overflow-hidden',
          style: this.swatchStyle
        }),
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
                change: val => { this.__onHueChange(val, true) }
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
                  input: value => {
                    this.__onNumericChange({ target: { value } }, 'a', 100)
                  },
                  change: value => {
                    this.__onNumericChange({ target: { value } }, 'a', 100, true)
                  }
                }
              })
            ])
            : null
        ])
      ])
    },
    __getNumericInputs (h) {
      return this.inputsArray.map(type => {
        const max = type === 'a' ? 100 : 255
        return h('div', { staticClass: 'col q-color-padding' }, [
          h('input', {
            attrs: {
              type: 'number',
              min: 0,
              max,
              readonly: !this.editable
            },
            staticClass: 'full-width text-center q-color-number',
            domProps: {
              value: Math.round(this.model[type])
            },
            on: {
              input: evt => {
                this.__onNumericChange(evt, type, max)
              },
              blur: evt => {
                this.__onNumericChange(evt, type, max, true)
              }
            }
          }),
          h('div', { staticClass: 'q-color-label text-center uppercase' }, [
            type
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
              attrs: { readonly: !this.editable },
              on: {
                input: this.__onHexChange,
                blur: evt => { console.log('blur'); this.__onHexChange(evt, true) }
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
              color: 'grey-7'
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
      const
        panel = this.$refs.saturation,
        width = panel.clientWidth,
        height = panel.clientHeight,
        rect = panel.getBoundingClientRect(),
        x = Math.min(width, Math.max(0, left - rect.left)),
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
    __onNumericChange (evt, type, max, change) {
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
        r: type === 'r' ? val : this.model.r,
        g: type === 'g' ? val : this.model.g,
        b: type === 'b' ? val : this.model.b,
        a: this.hasAlpha
          ? (type === 'a' ? val : this.model.a)
          : void 0
      }
      if (type !== 'a') {
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
      // update internally
      this.model.hex = hex
      this.model.r = rgb.r
      this.model.g = rgb.g
      this.model.b = rgb.b
      if (this.hasAlpha) {
        this.model.a = rgb.a
      }

      // avoid recomputing
      this.avoidModelWatch = true

      // emit new value
      const val = this.isHex ? hex : rgb

      this.$emit('input', val)
      if (change) {
        this.$emit('change', val)
      }
    },
    __nextInputView () {
      this.view = this.view === 'hex' ? 'rgba' : 'hex'
    },
    __parseModel (v) {
      let model
      if (typeof v === 'string') {
        model = hexToRgb(v)
        model.hex = v
      }
      else {
        model = clone(v)
        model.hex = rgbToHex(v)
      }
      return extend({ a: 100 }, model, rgbToHsv(model))
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
      this.saturationDragging = false
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
      this.__onSaturationChange(
        evt.pageX - window.pageXOffset,
        evt.pageY - window.pageYOffset
      )
    }
  }
}
