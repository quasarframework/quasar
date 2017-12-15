import { QBtn } from '../btn'
import { QSlider } from '../slider'
import TouchPan from '../../directives/touch-pan'
import { prevent } from '../../utils/event'
import throttle from '../../utils/throttle'
import getColor from './get-color'

export default {
  name: 'q-color',
  directives: {
    TouchPan
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      default: 'primary'
    },
    dark: Boolean,
    disable: Boolean,
    readonly: Boolean
  },
  computed: {
    swatchStyle () {
      return {
        backgroundColor: `rgba(${this.value.r},${this.value.g},${this.value.b},${this.value.a})`
      }
    },
    saturationStyle () {
      return {
        background: `hsl(${this.value.h},100%,50%)`
      }
    },
    saturationPointerStyle () {
      return {
        top: `${this.value.v * -100 + 101}%`,
        left: `${this.value.s * 100}%`
      }
    },
    editable () {
      return !this.disable && !this.readonly
    }
  },
  data: () => ({
    view: 'hex'
  }),
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
        'class': { readonly: this.readonly },
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
                value: this.value.h,
                color: 'none',
                min: 0,
                max: 360,
                fillHandleAlways: true,
                readonly: !this.editable
              },
              style: {
                color: this.value.hex
              },
              on: {
                input: this.__onHueChange
              }
            })
          ]),
          h('div', { staticClass: 'q-color-alpha non-selectable' }, [
            h(QSlider, {
              props: {
                value: this.value.a * 100,
                color: 'none',
                min: 0,
                max: 100,
                fillHandleAlways: true,
                readonly: this.readonly
              },
              style: {
                color: this.value.hex
              },
              on: {
                input: value => {
                  this.__onPropChange({ target: { value } }, 'a', 100)
                }
              }
            })
          ])
        ])
      ])
    },
    __getNumericInputs (h) {
      return ['r', 'g', 'b', 'a'].map(type => {
        const max = type === 'a' ? 100 : 255
        return h('div', { staticClass: 'col q-color-padding' }, [
          h('input', {
            attrs: {
              type: 'number',
              min: 0,
              max,
              readonly: !this.editable
            },
            staticClass: 'full-width text-center',
            domProps: {
              value: (type === 'a' ? 100 : 1) * this.value[type]
            },
            on: {
              input: evt => {
                this.__onPropChange(evt, type, max)
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
              domProps: { value: this.value.hex },
              attrs: { readonly: this.readonly },
              on: { input: this.__onHexChange },
              staticClass: 'full-width text-center uppercase'
            }),
            h('div', { staticClass: 'q-color-label text-center' }, [
              'HEX'
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

    __onSaturationChange ({ s, v }) {
      this.__update({
        h: this.value.h,
        s: s,
        v: v,
        a: this.value.a
      })
    },
    __onHueChange (h) {
      this.__update({
        h: h,
        s: this.value.s,
        v: this.value.v,
        a: this.value.a
      })
    },
    __onPropChange (evt, type, max) {
      let val = Number(evt.target.value)
      if (!isNaN(val) && val >= 0 && val <= max) {
        val = Math.floor(val)
        this.__update({
          r: type === 'r' ? val : this.value.r,
          g: type === 'g' ? val : this.value.g,
          b: type === 'b' ? val : this.value.b,
          a: type === 'a' ? val / 100 : this.value.a
        })
      }
    },
    __onHexChange (evt) {
      this.__update({
        hex: evt.target.value,
        a: this.value.a
      })
    },
    __update (color, change) {
      // todo is different?
      this.$emit(change ? 'change' : 'input', getColor(color))
    },
    __nextInputView () {
      this.view = this.view === 'hex' ? 'rgba' : 'hex'
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
      prevent(event.evt)

      this.saturationDragging = true
      this.__saturationChange(event)
    },
    __dragMove (event) {
      if (!this.saturationDragging) {
        return
      }
      prevent(event.evt)

      this.__saturationChange(event)
    },
    __dragStop (event) {
      prevent(event.evt)
      this.saturationDragging = false
    },
    __saturationChange (evt) {
      this.__onSaturationChange(
        this.__getSaturationValue(
          evt.position.left,
          evt.position.top
        )
      )
    },
    __saturationClick (evt) {
      this.__onSaturationChange(
        this.__getSaturationValue(
          evt.pageX - window.pageXOffset,
          evt.pageY - window.pageYOffset
        )
      )
    },
    __getSaturationValue (x, y) {
      const
        panel = this.$refs.saturation,
        width = panel.clientWidth,
        height = panel.clientHeight,
        rect = panel.getBoundingClientRect(),
        left = Math.min(width, Math.max(0, x - rect.left)),
        top = Math.min(height, Math.max(0, y - rect.top))

      return {
        s: left / width,
        v: Math.max(0, Math.min(1, -(top / height) + 1))
      }
    }
  }
}
