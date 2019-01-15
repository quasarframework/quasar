import Vue from 'vue'

import { testPattern } from '../../utils/patterns.js'
import { stopAndPrevent } from '../../utils/event.js'
import throttle from '../../utils/throttle.js'
import { hexToRgb, rgbToHex, rgbToString, stringToRgb, rgbToHsv, hsvToRgb, luminosity } from '../../utils/colors.js'

import TouchPan from '../../directives/TouchPan.js'

import QSlider from '../slider/QSlider.js'
import QIcon from '../icon/QIcon.js'

import QTabs from '../tabs/QTabs.js'
import QTab from '../tabs/QTab.js'
import QTabPanels from '../tabs/QTabPanels.js'
import QTabPanel from '../tabs/QTabPanel.js'

const palette = [
  'rgb(255,204,204)', 'rgb(255,230,204)', 'rgb(255,255,204)', 'rgb(204,255,204)', 'rgb(204,255,230)', 'rgb(204,255,255)', 'rgb(204,230,255)', 'rgb(204,204,255)', 'rgb(230,204,255)', 'rgb(255,204,255)',
  'rgb(255,153,153)', 'rgb(255,204,153)', 'rgb(255,255,153)', 'rgb(153,255,153)', 'rgb(153,255,204)', 'rgb(153,255,255)', 'rgb(153,204,255)', 'rgb(153,153,255)', 'rgb(204,153,255)', 'rgb(255,153,255)',
  'rgb(255,102,102)', 'rgb(255,179,102)', 'rgb(255,255,102)', 'rgb(102,255,102)', 'rgb(102,255,179)', 'rgb(102,255,255)', 'rgb(102,179,255)', 'rgb(102,102,255)', 'rgb(179,102,255)', 'rgb(255,102,255)',
  'rgb(255,51,51)', 'rgb(255,153,51)', 'rgb(255,255,51)', 'rgb(51,255,51)', 'rgb(51,255,153)', 'rgb(51,255,255)', 'rgb(51,153,255)', 'rgb(51,51,255)', 'rgb(153,51,255)', 'rgb(255,51,255)',
  'rgb(255,0,0)', 'rgb(255,128,0)', 'rgb(255,255,0)', 'rgb(0,255,0)', 'rgb(0,255,128)', 'rgb(0,255,255)', 'rgb(0,128,255)', 'rgb(0,0,255)', 'rgb(128,0,255)', 'rgb(255,0,255)',
  'rgb(245,0,0)', 'rgb(245,123,0)', 'rgb(245,245,0)', 'rgb(0,245,0)', 'rgb(0,245,123)', 'rgb(0,245,245)', 'rgb(0,123,245)', 'rgb(0,0,245)', 'rgb(123,0,245)', 'rgb(245,0,245)',
  'rgb(214,0,0)', 'rgb(214,108,0)', 'rgb(214,214,0)', 'rgb(0,214,0)', 'rgb(0,214,108)', 'rgb(0,214,214)', 'rgb(0,108,214)', 'rgb(0,0,214)', 'rgb(108,0,214)', 'rgb(214,0,214)',
  'rgb(163,0,0)', 'rgb(163,82,0)', 'rgb(163,163,0)', 'rgb(0,163,0)', 'rgb(0,163,82)', 'rgb(0,163,163)', 'rgb(0,82,163)', 'rgb(0,0,163)', 'rgb(82,0,163)', 'rgb(163,0,163)',
  'rgb(92,0,0)', 'rgb(92,46,0)', 'rgb(92,92,0)', 'rgb(0,92,0)', 'rgb(0,92,46)', 'rgb(0,92,92)', 'rgb(0,46,92)', 'rgb(0,0,92)', 'rgb(46,0,92)', 'rgb(92,0,92)',
  'rgb(255,255,255)', 'rgb(205,205,205)', 'rgb(178,178,178)', 'rgb(153,153,153)', 'rgb(127,127,127)', 'rgb(102,102,102)', 'rgb(76,76,76)', 'rgb(51,51,51)', 'rgb(25,25,25)', 'rgb(0,0,0)'
]

export default Vue.extend({
  name: 'QColor',

  directives: {
    TouchPan
  },

  props: {
    value: String,

    defaultValue: String,

    formatModel: {
      type: String,
      default: 'auto',
      validator: v => ['auto', 'hex', 'rgb', 'hexa', 'rgba'].includes(v)
    },

    disable: Boolean,
    readonly: Boolean,
    inline: Boolean,
    dark: Boolean
  },

  data () {
    return {
      topView: this.formatModel === 'auto'
        ? (
          (this.value === void 0 || this.value === null || this.value === '' || this.value.startsWith('#'))
            ? 'hex'
            : 'rgb'
        )
        : (this.formatModel.startsWith('hex') ? 'hex' : 'rgb'),
      view: 'spectrum',
      model: this.__parseModel(this.value || this.defaultValue)
    }
  },

  watch: {
    value (v) {
      const model = this.__parseModel(v || this.defaultValue)
      if (model.hex !== this.model.hex) {
        this.model = model
      }
    },

    defaultValue (v) {
      if (!this.value && v) {
        const model = this.__parseModel(v)
        if (model.hex !== this.model.hex) {
          this.model = model
        }
      }
    }
  },

  computed: {
    editable () {
      return this.disable !== true && this.readonly !== true
    },

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
      return this.value === void 0 || this.value === null || this.value === '' || this.value.startsWith('#')
    },

    isOutputHex () {
      return this.forceHex !== null
        ? this.forceHex
        : this.isHex
    },

    hasAlpha () {
      if (this.forceAlpha !== null) {
        return this.forceAlpha
      }
      return this.model.a !== void 0
    },

    currentBgColor () {
      return {
        backgroundColor: this.model.rgb || '#000'
      }
    },

    headerClass () {
      const light = this.model.a !== void 0 && this.model.a < 65
        ? true
        : luminosity(this.model) > 0.4

      return `q-color-picker__header-content--${light ? 'light' : 'dark'}`
    },

    spectrumStyle () {
      return {
        background: `hsl(${this.model.h},100%,50%)`
      }
    },

    spectrumPointerStyle () {
      return {
        top: `${101 - this.model.v}%`,
        [this.$q.lang.rtl ? 'right' : 'left']: `${this.model.s}%`
      }
    },

    inputsArray () {
      const inp = ['r', 'g', 'b']
      if (this.hasAlpha === true) {
        inp.push('a')
      }
      return inp
    }
  },

  created () {
    this.__spectrumChange = throttle(this.__spectrumChange, 20)
  },

  render (h) {
    return h('div', {
      staticClass: 'q-color-picker',
      class: {
        disabled: this.disable,
        'q-color-picker--dark': this.dark,
        'inline-block': this.inline
      }
    }, [
      this.__getHeader(h),
      this.__getContent(h),
      this.__getFooter(h)
    ])
  },

  methods: {
    __getHeader (h) {
      return h('div', {
        staticClass: 'q-color-picker__header relative-position overflow-hidden'
      }, [
        h('div', { staticClass: 'q-color-picker__header-bg absolute-full' }),

        h('div', {
          staticClass: 'q-color-picker__header-content absolute-full',
          class: this.headerClass,
          style: this.currentBgColor
        }, [
          h(QTabs, {
            props: {
              value: this.topView,
              dense: true,
              align: 'justify'
            },
            on: {
              input: val => { this.topView = val }
            }
          }, [
            h(QTab, {
              props: {
                label: 'HEX' + (this.hasAlpha === true ? 'A' : ''),
                name: 'hex',
                ripple: false
              }
            }),

            h(QTab, {
              props: {
                label: 'RGB' + (this.hasAlpha === true ? 'A' : ''),
                name: 'rgb',
                ripple: false
              }
            })
          ]),

          h('div', {
            staticClass: 'q-color-picker__header-banner row flex-center no-wrap'
          }, [
            h('input', {
              staticClass: 'fit',
              domProps: { value: this.model[this.topView] },
              attrs: !this.editable ? {
                readonly: true
              } : null,
              on: {
                input: evt => {
                  this.__updateErrorIcon(this.__onEditorChange(evt) === true)
                },
                blur: evt => {
                  this.__onEditorChange(evt, true) === true && this.$forceUpdate()
                  this.__updateErrorIcon(false)
                }
              }
            }),

            h(QIcon, {
              ref: 'errorIcon',
              staticClass: 'q-color-picker__error-icon absolute no-pointer-events',
              props: { name: this.$q.icon.type.negative }
            })
          ])
        ])
      ])
    },

    __getContent (h) {
      return h(QTabPanels, {
        props: {
          value: this.view,
          animated: true
        }
      }, [
        h(QTabPanel, {
          staticClass: 'q-pa-sm q-color-picker__spectrum-tab',
          props: { name: 'spectrum' }
        }, this.__getSpectrumTab(h)),

        h(QTabPanel, {
          staticClass: 'q-pa-md q-color-picker__tune-tab',
          props: { name: 'tune' }
        }, this.__getTuneTab(h)),

        h(QTabPanel, {
          staticClass: 'q-pa-sm q-color-picker__palette-tab',
          props: { name: 'palette' }
        }, this.__getPaletteTab(h))
      ])
    },

    __getFooter (h) {
      return h(QTabs, {
        staticClass: 'q-color-picker__footer',
        props: {
          value: this.view,
          dense: true,
          align: 'justify'
        },
        on: {
          input: val => { this.view = val }
        }
      }, [
        h(QTab, {
          props: {
            icon: this.$q.icon.colorPicker.spectrum,
            name: 'spectrum',
            ripple: false
          }
        }),

        h(QTab, {
          props: {
            icon: this.$q.icon.colorPicker.tune,
            name: 'tune',
            ripple: false
          }
        }),

        h(QTab, {
          props: {
            icon: this.$q.icon.colorPicker.palette,
            name: 'palette',
            ripple: false
          }
        })
      ])
    },

    __getSpectrumTab (h) {
      return [
        h('div', {
          ref: 'spectrum',
          staticClass: 'q-color-picker__spectrum non-selectable relative-position cursor-pointer',
          style: this.spectrumStyle,
          class: { readonly: !this.editable },
          on: this.editable
            ? { click: this.__spectrumClick }
            : null,
          directives: this.editable
            ? [{
              name: 'touch-pan',
              modifiers: {
                mightPrevent: true
              },
              value: this.__spectrumPan
            }]
            : null
        }, [
          h('div', { style: { paddingBottom: '100%' } }),
          h('div', { staticClass: 'q-color-picker__spectrum-white absolute-full' }),
          h('div', { staticClass: 'q-color-picker__spectrum-black absolute-full' }),
          h('div', {
            staticClass: 'absolute',
            style: this.spectrumPointerStyle
          }, [
            this.model.hex !== void 0 ? h('div', { staticClass: 'q-color-picker__spectrum-circle' }) : null
          ])
        ]),

        h('div', {
          staticClass: 'q-color-picker__sliders'
        }, [
          h('div', { staticClass: 'q-color-picker__hue q-mx-sm non-selectable' }, [
            h(QSlider, {
              props: {
                value: this.model.h,
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
          this.hasAlpha === true
            ? h('div', { staticClass: 'q-mx-sm q-color-picker__alpha non-selectable' }, [
              h(QSlider, {
                props: {
                  value: this.model.a,
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
      ]
    },

    __getTuneTab (h) {
      return [
        h('div', { staticClass: 'row items-center no-wrap' }, [
          h('div', ['R']),
          h(QSlider, {
            props: {
              value: this.model.r,
              min: 0,
              max: 255,
              color: 'red',
              dark: this.dark,
              readonly: !this.editable
            },
            on: {
              input: value => this.__onNumericChange({ target: { value } }, 'r', 255)
            }
          }),
          h('input', {
            domProps: {
              value: this.model.r
            },
            attrs: {
              maxlength: 3,
              readonly: !this.editable
            },
            on: {
              input: evt => this.__onNumericChange(evt, 'r', 255),
              blur: evt => this.__onNumericChange(evt, 'r', 255, true)
            }
          })
        ]),

        h('div', { staticClass: 'row items-center no-wrap' }, [
          h('div', ['G']),
          h(QSlider, {
            props: {
              value: this.model.g,
              min: 0,
              max: 255,
              color: 'green',
              dark: this.dark,
              readonly: !this.editable
            },
            on: {
              input: value => this.__onNumericChange({ target: { value } }, 'g', 255)
            }
          }),
          h('input', {
            domProps: {
              value: this.model.g
            },
            attrs: {
              maxlength: 3,
              readonly: !this.editable
            },
            on: {
              input: evt => this.__onNumericChange(evt, 'g', 255),
              blur: evt => this.__onNumericChange(evt, 'g', 255, true)
            }
          })
        ]),

        h('div', { staticClass: 'row items-center no-wrap' }, [
          h('div', ['B']),
          h(QSlider, {
            props: {
              value: this.model.b,
              min: 0,
              max: 255,
              color: 'blue',
              readonly: !this.editable,
              dark: this.dark
            },
            on: {
              input: value => this.__onNumericChange({ target: { value } }, 'b', 255)
            }
          }),
          h('input', {
            domProps: {
              value: this.model.b
            },
            attrs: {
              maxlength: 3,
              readonly: !this.editable
            },
            on: {
              input: evt => this.__onNumericChange(evt, 'b', 255),
              blur: evt => this.__onNumericChange(evt, 'b', 255, true)
            }
          })
        ]),

        this.hasAlpha === true ? h('div', { staticClass: 'row items-center no-wrap' }, [
          h('div', ['A']),
          h(QSlider, {
            props: {
              value: this.model.a,
              color: 'grey',
              readonly: !this.editable,
              dark: this.dark
            },
            on: {
              input: value => this.__onNumericChange({ target: { value } }, 'a', 100)
            }
          }),
          h('input', {
            domProps: {
              value: this.model.a
            },
            attrs: {
              maxlength: 3,
              readonly: !this.editable
            },
            on: {
              input: evt => this.__onNumericChange(evt, 'a', 100),
              blur: evt => this.__onNumericChange(evt, 'a', 100, true)
            }
          })
        ]) : null
      ]
    },

    __getPaletteTab (h) {
      return [
        h('div', {
          staticClass: 'row items-center',
          class: this.editable ? 'cursor-pointer' : null
        }, palette.map(color => h('div', {
          staticClass: 'q-color-picker__cube col-1',
          style: { backgroundColor: color },
          on: this.editable ? {
            click: () => {
              this.__onPalettePick(color)
            }
          } : null
        })))
      ]
    },

    __onSpectrumChange (left, top, change) {
      const panel = this.$refs.spectrum
      if (panel === void 0) { return }

      const
        width = panel.clientWidth,
        height = panel.clientHeight,
        rect = panel.getBoundingClientRect()

      let x = Math.min(width, Math.max(0, left - rect.left))

      if (this.$q.lang.rtl) {
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
          a: this.hasAlpha === true ? this.model.a : void 0
        })

      this.model.s = s
      this.model.v = v
      this.__update(rgb, change)
    },

    __onHueChange (h, change) {
      h = Math.round(h)
      const rgb = hsvToRgb({
        h,
        s: this.model.s,
        v: this.model.v,
        a: this.hasAlpha === true ? this.model.a : void 0
      })

      this.model.h = h
      this.__update(rgb, change)
    },

    __onNumericChange (evt, formatModel, max, change) {
      if (!/^[0-9]+$/.test(evt.target.value)) {
        change && this.$forceUpdate()
        return
      }

      const val = Math.floor(Number(evt.target.value))

      if (val < 0 || val > max) {
        change && this.$forceUpdate()
        return
      }

      const rgb = {
        r: formatModel === 'r' ? val : this.model.r,
        g: formatModel === 'g' ? val : this.model.g,
        b: formatModel === 'b' ? val : this.model.b,
        a: this.hasAlpha === true
          ? (formatModel === 'a' ? val : this.model.a)
          : void 0
      }

      if (formatModel !== 'a') {
        const hsv = rgbToHsv(rgb)
        this.model.h = hsv.h
        this.model.s = hsv.s
        this.model.v = hsv.v
      }

      this.__update(rgb, change)

      if (change !== true && evt.target.selectionEnd !== void 0) {
        const index = evt.target.selectionEnd
        this.$nextTick(() => {
          evt.target.setSelectionRange(index, index)
        })
      }
    },

    __onEditorChange (evt, change) {
      let rgb
      const inp = evt.target.value

      if (this.topView === 'hex') {
        if (
          inp.length !== (this.hasAlpha === true ? 9 : 7) ||
          !/^#[0-9A-Fa-f]+$/.test(inp)
        ) {
          return true
        }

        rgb = hexToRgb(inp)
      }
      else {
        let model

        if (!inp.endsWith(')')) {
          return true
        }
        else if (this.hasAlpha !== true && inp.startsWith('rgb(')) {
          model = inp.substring(4, inp.length - 1).split(',').map(n => parseInt(n, 10))

          if (
            model.length !== 3 ||
            !/^rgb\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)$/.test(inp)
          ) {
            return true
          }
        }
        else if (this.hasAlpha === true && inp.startsWith('rgba(')) {
          model = inp.substring(5, inp.length - 1).split(',')

          if (
            model.length !== 4 ||
            !/^rgba\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},(0|0\.[0-9]+[1-9]|0\.[1-9]+|1)\)$/.test(inp)
          ) {
            return true
          }

          for (let i = 0; i < 3; i++) {
            const v = parseInt(model[i], 10)
            if (v < 0 || v > 255) {
              return true
            }
            model[i] = v
          }

          const v = parseFloat(model[3])
          if (v < 0 || v > 1) {
            return true
          }
          model[3] = v
        }
        else {
          return true
        }

        if (
          model[0] < 0 || model[0] > 255 ||
          model[1] < 0 || model[1] > 255 ||
          model[2] < 0 || model[2] > 255 ||
          (this.hasAlpha === true && (model[3] < 0 || model[3] > 1))
        ) {
          return true
        }

        rgb = {
          r: model[0],
          g: model[1],
          b: model[2],
          a: this.hasAlpha === true
            ? model[3] * 100
            : void 0
        }
      }

      const hsv = rgbToHsv(rgb)
      this.model.h = hsv.h
      this.model.s = hsv.s
      this.model.v = hsv.v

      this.__update(rgb, change)

      if (change !== true) {
        const index = evt.target.selectionEnd
        this.$nextTick(() => {
          evt.target.setSelectionRange(index, index)
        })
      }
    },

    __onPalettePick (color) {
      const model = color.substring(4, color.length - 1).split(',')

      const rgb = {
        r: parseInt(model[0], 10),
        g: parseInt(model[1], 10),
        b: parseInt(model[2], 10),
        a: this.model.a
      }

      const hsv = rgbToHsv(rgb)
      this.model.h = hsv.h
      this.model.s = hsv.s
      this.model.v = hsv.v

      this.__update(rgb, true)
    },

    __update (rgb, change) {
      // update internally
      this.model.hex = rgbToHex(rgb)
      this.model.rgb = rgbToString(rgb)
      this.model.r = rgb.r
      this.model.g = rgb.g
      this.model.b = rgb.b
      this.model.a = rgb.a

      const value = this.model[this.isOutputHex === true ? 'hex' : 'rgb']

      // emit new value
      this.$emit('input', value)
      change && value !== this.value && this.$emit('change', value)
    },

    __updateErrorIcon (val) {
      // we MUST avoid vue triggering a render,
      // so manually changing this
      this.$refs.errorIcon.$el.style.opacity = val ? 1 : 0
    },

    __parseModel (v) {
      const forceAlpha = this.forceAlpha !== void 0
        ? this.forceAlpha
        : (
          this.formatModel === 'auto'
            ? null
            : this.formatModel.indexOf('a') > -1
        )

      if (v === null || v === void 0 || v === '' || testPattern.anyColor(v) !== true) {
        return {
          h: 0,
          s: 0,
          v: 0,
          r: 0,
          g: 0,
          b: 0,
          a: forceAlpha === true ? 100 : void 0,
          hex: void 0,
          rgb: void 0
        }
      }

      let model = stringToRgb(v)

      if (forceAlpha === true && model.a === void 0) {
        model.a = 100
      }

      model.hex = rgbToHex(model)
      model.rgb = rgbToString(model)

      return Object.assign(model, rgbToHsv(model))
    },

    __spectrumPan (evt) {
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

      this.spectrumDragging = true
      this.__spectrumChange(event)
    },

    __dragMove (event) {
      if (!this.spectrumDragging) {
        return
      }
      stopAndPrevent(event.evt)

      this.__spectrumChange(event)
    },

    __dragStop (event) {
      stopAndPrevent(event.evt)
      setTimeout(() => {
        this.spectrumDragging = false
      }, 100)
      this.__onSpectrumChange(
        event.position.left,
        event.position.top,
        true
      )
    },

    __spectrumChange (evt) {
      this.__onSpectrumChange(
        evt.position.left,
        evt.position.top
      )
    },

    __spectrumClick (evt) {
      if (this.spectrumDragging) {
        return
      }
      this.__onSpectrumChange(
        evt.pageX - window.pageXOffset,
        evt.pageY - window.pageYOffset,
        true
      )
    }
  }
})
