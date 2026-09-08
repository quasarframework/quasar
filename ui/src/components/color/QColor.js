import {
  computed,
  getCurrentInstance,
  h,
  nextTick,
  ref,
  shallowRef,
  watch,
  withDirectives
} from 'vue'

import TouchPan from '../../directives/touch-pan/TouchPan.js'

import QSlider from '../slider/QSlider.js'
import QIcon from '../icon/QIcon.js'

import QTabs from '../tabs/QTabs.js'
import QTab from '../tabs/QTab.js'
import QTabPanels from '../tab-panels/QTabPanels.js'
import QTabPanel from '../tab-panels/QTabPanel.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useRenderCache from '../../composables/use-render-cache/use-render-cache.js'
import {
  useFormInject,
  useFormProps
} from '../../composables/use-form/private.use-form.js'

import { createComponent } from '../../utils/private.create/create.js'
import { testPattern } from '../../utils/patterns/patterns.js'
import throttle from '../../utils/throttle/throttle.js'
import { between } from '../../utils/format/format.js'
import { stop, stopAndPrevent } from '../../utils/event/event.js'
import {
  hexToRgb,
  hsvToRgb,
  luminosity,
  rgbToHex,
  rgbToHsv,
  rgbToString,
  textToRgb
} from '../../utils/colors/colors.js'

const palette = [
  'rgb(255,204,204)',
  'rgb(255,230,204)',
  'rgb(255,255,204)',
  'rgb(204,255,204)',
  'rgb(204,255,230)',
  'rgb(204,255,255)',
  'rgb(204,230,255)',
  'rgb(204,204,255)',
  'rgb(230,204,255)',
  'rgb(255,204,255)',
  'rgb(255,153,153)',
  'rgb(255,204,153)',
  'rgb(255,255,153)',
  'rgb(153,255,153)',
  'rgb(153,255,204)',
  'rgb(153,255,255)',
  'rgb(153,204,255)',
  'rgb(153,153,255)',
  'rgb(204,153,255)',
  'rgb(255,153,255)',
  'rgb(255,102,102)',
  'rgb(255,179,102)',
  'rgb(255,255,102)',
  'rgb(102,255,102)',
  'rgb(102,255,179)',
  'rgb(102,255,255)',
  'rgb(102,179,255)',
  'rgb(102,102,255)',
  'rgb(179,102,255)',
  'rgb(255,102,255)',
  'rgb(255,51,51)',
  'rgb(255,153,51)',
  'rgb(255,255,51)',
  'rgb(51,255,51)',
  'rgb(51,255,153)',
  'rgb(51,255,255)',
  'rgb(51,153,255)',
  'rgb(51,51,255)',
  'rgb(153,51,255)',
  'rgb(255,51,255)',
  'rgb(255,0,0)',
  'rgb(255,128,0)',
  'rgb(255,255,0)',
  'rgb(0,255,0)',
  'rgb(0,255,128)',
  'rgb(0,255,255)',
  'rgb(0,128,255)',
  'rgb(0,0,255)',
  'rgb(128,0,255)',
  'rgb(255,0,255)',
  'rgb(245,0,0)',
  'rgb(245,123,0)',
  'rgb(245,245,0)',
  'rgb(0,245,0)',
  'rgb(0,245,123)',
  'rgb(0,245,245)',
  'rgb(0,123,245)',
  'rgb(0,0,245)',
  'rgb(123,0,245)',
  'rgb(245,0,245)',
  'rgb(214,0,0)',
  'rgb(214,108,0)',
  'rgb(214,214,0)',
  'rgb(0,214,0)',
  'rgb(0,214,108)',
  'rgb(0,214,214)',
  'rgb(0,108,214)',
  'rgb(0,0,214)',
  'rgb(108,0,214)',
  'rgb(214,0,214)',
  'rgb(163,0,0)',
  'rgb(163,82,0)',
  'rgb(163,163,0)',
  'rgb(0,163,0)',
  'rgb(0,163,82)',
  'rgb(0,163,163)',
  'rgb(0,82,163)',
  'rgb(0,0,163)',
  'rgb(82,0,163)',
  'rgb(163,0,163)',
  'rgb(92,0,0)',
  'rgb(92,46,0)',
  'rgb(92,92,0)',
  'rgb(0,92,0)',
  'rgb(0,92,46)',
  'rgb(0,92,92)',
  'rgb(0,46,92)',
  'rgb(0,0,92)',
  'rgb(46,0,92)',
  'rgb(92,0,92)',
  'rgb(255,255,255)',
  'rgb(205,205,205)',
  'rgb(178,178,178)',
  'rgb(153,153,153)',
  'rgb(127,127,127)',
  'rgb(102,102,102)',
  'rgb(76,76,76)',
  'rgb(51,51,51)',
  'rgb(25,25,25)',
  'rgb(0,0,0)'
]

const thumbPath = 'M5 5 h10 v10 h-10 v-10 z'
const alphaTrackImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAH0lEQVQoU2NkYGAwZkAFZ5G5jPRRgOYEVDeB3EBjBQBOZwTVugIGyAAAAABJRU5ErkJggg=='

const numericRE = /^[0-9]+$/
const hexRE = /^#[0-9A-Fa-f]+$/
const rgbRE = /^rgb\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)$/
const rgbaRE =
  /^rgba\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},(0|0\.[0-9]+[1-9]|0\.[1-9]+|1)\)$/

export default /*#__PURE__*/ createComponent({
  name: 'QColor',

  props: {
    ...useDarkProps,
    ...useFormProps,

    modelValue: String,

    defaultValue: String,
    defaultView: {
      type: String,
      default: 'spectrum',
      validator: v => ['spectrum', 'tune', 'palette'].includes(v)
    },

    formatModel: {
      type: String,
      default: 'auto',
      validator: v => ['auto', 'hex', 'rgb', 'hexa', 'rgba'].includes(v)
    },

    palette: Array,

    noHeader: Boolean,
    noHeaderTabs: Boolean,
    noFooter: Boolean,

    square: Boolean,
    flat: Boolean,
    bordered: Boolean,

    disable: Boolean,
    readonly: Boolean
  },

  emits: ['update:modelValue', 'change'],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const $q = useQuasar()

    const isDark = useDark(props, $q)
    const { getCache } = useRenderCache()

    const spectrumRef = shallowRef(null)
    const errorIconRef = shallowRef(null)
    const swatchRoverRef = shallowRef(null)

    // roving tabindex for the palette swatches: the swatch that
    // currently owns the palette's single Tab stop
    const focusedSwatch = ref(null)

    const forceHex = computed(() =>
      props.formatModel === 'auto' ? null : props.formatModel.includes('hex')
    )

    const forceAlpha = computed(() =>
      props.formatModel === 'auto' ? null : props.formatModel.includes('a')
    )

    const topView = ref(
      props.formatModel === 'auto'
        ? props.modelValue === void 0 ||
          props.modelValue === null ||
          props.modelValue === '' ||
          props.modelValue.startsWith('#')
          ? 'hex'
          : 'rgb'
        : props.formatModel.startsWith('hex')
          ? 'hex'
          : 'rgb'
    )

    const view = ref(props.defaultView)
    const model = ref(parseModel(props.modelValue || props.defaultValue))

    const editable = computed(() => !props.disable && !props.readonly)

    const isHex = computed(
      () =>
        props.modelValue === void 0 ||
        props.modelValue === null ||
        props.modelValue === '' ||
        props.modelValue.startsWith('#')
    )

    const isOutputHex = computed(() =>
      forceHex.value !== null ? forceHex.value : isHex.value
    )

    const formAttrs = () => ({
      type: 'hidden',
      name: props.name,
      value: model.value[isOutputHex.value ? 'hex' : 'rgb']
    })

    const injectFormInput = useFormInject(formAttrs)

    const hasAlpha = computed(() =>
      forceAlpha.value !== null ? forceAlpha.value : model.value.a !== void 0
    )

    const currentBgColor = computed(() => ({
      backgroundColor: model.value.rgb || '#000'
    }))

    const headerClass = computed(() => {
      const light =
        model.value.a !== void 0 && model.value.a < 65
          ? true
          : luminosity(model.value) > 0.4

      return (
        'q-color-picker__header-content' +
        ` q-color-picker__header-content--${light ? 'light' : 'dark'}`
      )
    })

    const spectrumStyle = computed(() => ({
      background: `hsl(${model.value.h},100%,50%)`
    }))

    const spectrumPointerStyle = computed(() => ({
      top: `${100 - model.value.v}%`,
      [$q.lang.rtl ? 'right' : 'left']: `${model.value.s}%`
    }))

    const computedPalette = computed(() =>
      props.palette !== void 0 && props.palette.length !== 0
        ? props.palette
        : palette
    )

    const paletteRgb = computed(() =>
      computedPalette.value.map(color =>
        typeof color === 'string' &&
        testPattern.anyColor(color.replaceAll(' ', ''))
          ? textToRgb(color)
          : null
      )
    )

    // alpha is ignored: picking a swatch without one keeps the model's
    function isModelColor(rgb) {
      return (
        rgb !== null &&
        model.value.hex !== void 0 &&
        rgb.r === model.value.r &&
        rgb.g === model.value.g &&
        rgb.b === model.value.b
      )
    }

    const selectedSwatch = computed(() =>
      paletteRgb.value.findIndex(isModelColor)
    )

    const swatchRover = computed(() => {
      if (
        focusedSwatch.value !== null &&
        focusedSwatch.value < computedPalette.value.length
      ) {
        return focusedSwatch.value
      }

      return selectedSwatch.value !== -1 ? selectedSwatch.value : 0
    })

    const classes = computed(
      () =>
        'q-color-picker' +
        (props.bordered ? ' q-color-picker--bordered' : '') +
        (props.square ? ' q-color-picker--square no-border-radius' : '') +
        (props.flat ? ' q-color-picker--flat no-shadow' : '') +
        (props.disable ? ' disabled' : '') +
        (isDark() ? ' q-color-picker--dark q-dark' : '')
    )

    const attributes = computed(() =>
      props.disable ? { 'aria-disabled': 'true' } : {}
    )

    // the spectrum is a WAI-ARIA slider over two axes: aria-valuenow
    // carries the saturation, aria-valuetext spells out both
    const spectrumAttrs = computed(() => {
      const acc = {
        role: 'slider',
        tabindex: editable.value ? 0 : -1,
        'aria-label': $q.lang.colorPicker?.spectrum,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': model.value.s,
        'aria-valuetext':
          model.value.hex === void 0
            ? $q.lang.label.noValue
            : getSpectrumValueText()
      }

      if (props.disable) {
        acc['aria-disabled'] = 'true'
      } else if (props.readonly) {
        acc['aria-readonly'] = 'true'
      }

      return acc
    })

    const spectrumDirective = computed(() => [
      [
        TouchPan,
        // TouchPan only acquires gestures while its value is a function;
        // detaching the directive instead would re-create the spectrum
        // markup on every disable/readonly toggle
        editable.value ? onSpectrumPan : void 0,
        void 0,
        { prevent: true, stop: true, mouse: true }
      ]
    ])

    watch(
      () => props.modelValue,
      v => {
        const localModel = parseModel(v || props.defaultValue)
        if (localModel.hex !== model.value.hex) {
          model.value = localModel
        }
      }
    )

    watch(
      () => props.defaultValue,
      v => {
        if (!props.modelValue && v) {
          const localModel = parseModel(v)
          if (localModel.hex !== model.value.hex) {
            model.value = localModel
          }
        }
      }
    )

    function updateModel(rgb, change) {
      // update internally
      model.value.hex = rgbToHex(rgb)
      model.value.rgb = rgbToString(rgb)
      model.value.r = rgb.r
      model.value.g = rgb.g
      model.value.b = rgb.b
      model.value.a = rgb.a

      const value = model.value[isOutputHex.value ? 'hex' : 'rgb']

      // emit new value
      emit('update:modelValue', value)
      if (change) emit('change', value)
    }

    function parseModel(v) {
      const alpha =
        forceAlpha.value !== void 0
          ? forceAlpha.value
          : props.formatModel === 'auto'
            ? null
            : props.formatModel.includes('a')

      if (
        typeof v !== 'string' ||
        v.length === 0 ||
        !testPattern.anyColor(v.replaceAll(' ', ''))
      ) {
        return {
          h: 0,
          s: 0,
          v: 0,
          r: 0,
          g: 0,
          b: 0,
          a: alpha ? 100 : void 0,
          hex: void 0,
          rgb: void 0
        }
      }

      const localModel = textToRgb(v)

      if (alpha && localModel.a === void 0) {
        localModel.a = 100
      }

      localModel.hex = rgbToHex(localModel)
      localModel.rgb = rgbToString(localModel)

      return Object.assign(localModel, rgbToHsv(localModel))
    }

    function changeSpectrum(left, top, change) {
      const panel = spectrumRef.value
      if (panel === null) return

      const width = panel.clientWidth,
        height = panel.clientHeight,
        rect = panel.getBoundingClientRect()

      let x = Math.min(width, Math.max(0, left - rect.left))
      if ($q.lang.rtl) x = width - x

      const y = Math.min(height, Math.max(0, top - rect.top))

      setSpectrum(
        Math.round((100 * x) / width),
        Math.round(100 * Math.max(0, Math.min(1, -(y / height) + 1))),
        change
      )
    }

    function setSpectrum(s, v, change) {
      const rgb = hsvToRgb({
        h: model.value.h,
        s,
        v,
        a: hasAlpha.value ? model.value.a : void 0
      })

      model.value.s = s
      model.value.v = v
      updateModel(rgb, change)
    }

    function getSpectrumValueText() {
      const lang = $q.lang.colorPicker
      const fmt = $q.lang.formatNumber
      const s = String(model.value.s)
      const v = String(model.value.v)
      const sText = (fmt?.(s) ?? s) + '%'
      const vText = (fmt?.(v) ?? v) + '%'

      // a language pack predating the axis labels still gets the numbers
      return lang?.saturation !== void 0 && lang.brightness !== void 0
        ? `${lang.saturation} ${sText}, ${lang.brightness} ${vText}`
        : `${sText}, ${vText}`
    }

    // keyboard edits step the spectrum in place; like QSlider, "change"
    // fires once on keyup so key repeat does not flood it
    let spectrumKeyPending = false

    function onSpectrumKeydown(e) {
      const { keyCode } = e

      if (keyCode < 33 || keyCode > 40) return

      stopAndPrevent(e)

      let { s, v } = model.value
      const step = e.shiftKey ? 10 : 1

      if (keyCode === 36 /* Home */) {
        s = 0
      } else if (keyCode === 35 /* End */) {
        s = 100
      } else if (keyCode === 33 /* PageUp */) {
        v += 10
      } else if (keyCode === 34 /* PageDown */) {
        v -= 10
      } else if (keyCode === 38 /* Up */) {
        v += step
      } else if (keyCode === 40 /* Down */) {
        v -= step
      } else {
        // Left/Right follow the visual direction, like QSlider does
        s += (keyCode === 39 ? 1 : -1) * ($q.lang.rtl === true ? -1 : 1) * step
      }

      s = between(s, 0, 100)
      v = between(v, 0, 100)

      if (s === model.value.s && v === model.value.v) return

      spectrumKeyPending = true
      setSpectrum(s, v)
    }

    function onSpectrumKeyup(e) {
      if (spectrumKeyPending && e.keyCode >= 33 && e.keyCode <= 40) {
        spectrumKeyPending = false
        emit('change', model.value[isOutputHex.value ? 'hex' : 'rgb'])
      }
    }

    function onHue(val, change) {
      const hue = Math.round(val)
      const rgb = hsvToRgb({
        h: hue,
        s: model.value.s,
        v: model.value.v,
        a: hasAlpha.value ? model.value.a : void 0
      })

      model.value.h = hue
      updateModel(rgb, change)
    }

    function onHueChange(val) {
      onHue(val, true)
    }

    function onNumericChange(value, formatModel, max, evt, change) {
      if (evt !== void 0) stop(evt)

      if (!numericRE.test(value)) {
        if (change) proxy.$forceUpdate()
        return
      }

      const val = Math.floor(Number(value))

      if (val < 0 || val > max) {
        if (change) proxy.$forceUpdate()
        return
      }

      const rgb = {
        r: formatModel === 'r' ? val : model.value.r,
        g: formatModel === 'g' ? val : model.value.g,
        b: formatModel === 'b' ? val : model.value.b,
        a: hasAlpha.value ? (formatModel === 'a' ? val : model.value.a) : void 0
      }

      if (formatModel !== 'a') {
        const hsv = rgbToHsv(rgb)
        model.value.h = hsv.h
        model.value.s = hsv.s
        model.value.v = hsv.v
      }

      updateModel(rgb, change)

      if (!change && evt?.target.selectionEnd !== void 0) {
        const index = evt.target.selectionEnd
        nextTick(() => {
          evt.target.setSelectionRange(index, index)
        })
      }
    }

    function onEditorChange(evt, change) {
      let rgb
      const inp = evt.target.value

      stop(evt)

      if (topView.value === 'hex') {
        if (inp.length !== (hasAlpha.value ? 9 : 7) || !hexRE.test(inp)) {
          return true
        }

        rgb = hexToRgb(inp)
      } else {
        let localModel

        if (!inp.endsWith(')')) {
          return true
        } else if (!hasAlpha.value && inp.startsWith('rgb(')) {
          localModel = inp
            .slice(4, -1)
            .split(',')
            .map(n => Number.parseInt(n, 10))

          if (localModel.length !== 3 || !rgbRE.test(inp)) {
            return true
          }
        } else if (hasAlpha.value && inp.startsWith('rgba(')) {
          localModel = inp.slice(5, -1).split(',')

          if (localModel.length !== 4 || !rgbaRE.test(inp)) {
            return true
          }

          for (let i = 0; i < 3; i++) {
            const v = Number.parseInt(localModel[i], 10)
            if (v < 0 || v > 255) {
              return true
            }
            localModel[i] = v
          }

          const v = Number.parseFloat(localModel[3])
          if (v < 0 || v > 1) {
            return true
          }
          localModel[3] = v
        } else {
          return true
        }

        if (
          localModel[0] < 0 ||
          localModel[0] > 255 ||
          localModel[1] < 0 ||
          localModel[1] > 255 ||
          localModel[2] < 0 ||
          localModel[2] > 255 ||
          (hasAlpha.value && (localModel[3] < 0 || localModel[3] > 1))
        ) {
          return true
        }

        rgb = {
          r: localModel[0],
          g: localModel[1],
          b: localModel[2],
          a: hasAlpha.value ? localModel[3] * 100 : void 0
        }
      }

      const hsv = rgbToHsv(rgb)
      model.value.h = hsv.h
      model.value.s = hsv.s
      model.value.v = hsv.v

      updateModel(rgb, change)

      if (!change) {
        const index = evt.target.selectionEnd
        nextTick(() => {
          evt.target.setSelectionRange(index, index)
        })
      }
    }

    function onPalettePick(color) {
      if (!editable.value) return

      const def = parseModel(color)
      const rgb = { r: def.r, g: def.g, b: def.b, a: def.a }

      if (rgb.a === void 0) {
        rgb.a = model.value.a
      }

      model.value.h = def.h
      model.value.s = def.s
      model.value.v = def.v

      updateModel(rgb, true)
    }

    function onSpectrumPan(evt) {
      if (evt.isFinal) {
        changeSpectrum(evt.position.left, evt.position.top, true)
      } else {
        onSpectrumChange(evt)
      }
    }

    const onSpectrumChange = throttle(evt => {
      changeSpectrum(evt.position.left, evt.position.top)
    }, 20)

    function onSpectrumClick(evt) {
      changeSpectrum(
        evt.pageX - window.scrollX,
        evt.pageY - window.scrollY,
        true
      )
    }

    function onActivate(evt) {
      changeSpectrum(evt.pageX - window.scrollX, evt.pageY - window.scrollY)
    }

    function updateErrorIcon(val) {
      // we MUST avoid vue triggering a render,
      // so manually changing this
      if (errorIconRef.value !== null) {
        errorIconRef.value.$el.style.opacity = val ? 1 : 0
      }
    }

    function setTopView(val) {
      topView.value = val
    }

    function onSwatchKeydown(e, index) {
      const { keyCode } = e

      if (keyCode < 35 || keyCode > 40) return

      stopAndPrevent(e)

      const last = computedPalette.value.length - 1
      let target

      if (keyCode === 36 /* Home */) {
        target = 0
      } else if (keyCode === 35 /* End */) {
        target = last
      } else {
        let step

        if (keyCode === 38 /* Up */ || keyCode === 40 /* Down */) {
          // one visual row; measured so a restyled swatch width still
          // lands on the swatch straight above/below
          const el = e.target
          const cols =
            Math.max(
              1,
              Math.round(el.parentNode.clientWidth / el.offsetWidth)
            ) || 1
          step = (keyCode === 38 ? -1 : 1) * cols
        } else {
          // Left/Right follow the visual direction
          step = (keyCode === 37 ? -1 : 1) * ($q.lang.rtl === true ? -1 : 1)
        }

        target = index + step
        if (target < 0 || target > last) return
      }

      focusedSwatch.value = target
      nextTick(() => {
        swatchRoverRef.value?.focus()
      })
    }

    function getHeader() {
      const child = []

      if (!props.noHeaderTabs) {
        child.push(
          h(
            QTabs,
            {
              class: 'q-color-picker__header-tabs',
              modelValue: topView.value,
              dense: true,
              align: 'justify',
              'onUpdate:modelValue': setTopView
            },
            () => [
              h(QTab, {
                label: 'HEX' + (hasAlpha.value ? 'A' : ''),
                name: 'hex',
                ripple: false
              }),

              h(QTab, {
                label: 'RGB' + (hasAlpha.value ? 'A' : ''),
                name: 'rgb',
                ripple: false
              })
            ]
          )
        )
      }

      child.push(
        h(
          'div',
          {
            class: 'q-color-picker__header-banner row flex-center no-wrap'
          },
          [
            h('input', {
              class: 'fit',
              'aria-label': $q.lang.colorPicker?.value,
              value: model.value[topView.value],
              ...(editable.value ? {} : { readonly: true }),
              ...getCache('topIn', {
                onInput: evt => {
                  updateErrorIcon(onEditorChange(evt))
                },
                onChange: stop,
                onBlur: evt => {
                  if (onEditorChange(evt, true)) proxy.$forceUpdate()
                  updateErrorIcon(false)
                }
              })
            }),

            h(QIcon, {
              ref: errorIconRef,
              class: 'q-color-picker__error-icon absolute no-pointer-events',
              name: $q.iconSet.type.negative
            })
          ]
        )
      )

      return h(
        'div',
        {
          class: 'q-color-picker__header relative-position overflow-hidden'
        },
        [
          h('div', { class: 'q-color-picker__header-bg absolute-full' }),

          h(
            'div',
            {
              class: headerClass.value,
              style: currentBgColor.value
            },
            child
          )
        ]
      )
    }

    function getContent() {
      return h(
        QTabPanels,
        {
          modelValue: view.value,
          animated: true
        },
        () => [
          // every view carries its own Tab stop, so the panels' default
          // one (there for panels without focusable content) is noise
          h(
            QTabPanel,
            {
              class: 'q-color-picker__spectrum-tab overflow-hidden',
              name: 'spectrum',
              tabindex: -1
            },
            getSpectrumTab
          ),

          h(
            QTabPanel,
            {
              class: 'q-pa-md q-color-picker__tune-tab',
              name: 'tune',
              tabindex: -1
            },
            getTuneTab
          ),

          h(
            QTabPanel,
            {
              class: 'q-color-picker__palette-tab',
              name: 'palette',
              tabindex: -1
            },
            getPaletteTab
          )
        ]
      )
    }

    function setView(val) {
      view.value = val
    }

    function getFooter() {
      return h(
        'div',
        {
          class: 'q-color-picker__footer relative-position overflow-hidden'
        },
        [
          h(
            QTabs,
            {
              class: 'absolute-full',
              modelValue: view.value,
              dense: true,
              align: 'justify',
              'onUpdate:modelValue': setView
            },
            () => [
              h(QTab, {
                icon: $q.iconSet.colorPicker.spectrum,
                name: 'spectrum',
                ripple: false,
                'aria-label': $q.lang.colorPicker?.spectrum
              }),

              h(QTab, {
                icon: $q.iconSet.colorPicker.tune,
                name: 'tune',
                ripple: false,
                'aria-label': $q.lang.colorPicker?.tune
              }),

              h(QTab, {
                icon: $q.iconSet.colorPicker.palette,
                name: 'palette',
                ripple: false,
                'aria-label': $q.lang.colorPicker?.palette
              })
            ]
          )
        ]
      )
    }

    function getSpectrumTab() {
      const data = {
        ref: spectrumRef,
        class:
          'q-color-picker__spectrum non-selectable relative-position cursor-pointer' +
          (editable.value ? '' : ' readonly'),
        style: spectrumStyle.value,
        ...spectrumAttrs.value,
        ...(editable.value
          ? {
              onClick: onSpectrumClick,
              onMousedown: onActivate,
              onKeydown: onSpectrumKeydown,
              onKeyup: onSpectrumKeyup
            }
          : {})
      }

      const child = [
        h('div', { style: { paddingBottom: '100%' } }),
        h('div', { class: 'q-color-picker__spectrum-white absolute-full' }),
        h('div', { class: 'q-color-picker__spectrum-black absolute-full' }),
        h(
          'div',
          {
            class: 'absolute',
            style: spectrumPointerStyle.value
          },
          [
            model.value.hex !== void 0
              ? h('div', { class: 'q-color-picker__spectrum-circle' })
              : null
          ]
        )
      ]

      const sliders = [
        h(QSlider, {
          class: 'q-color-picker__hue non-selectable',
          modelValue: model.value.h,
          min: 0,
          max: 360,
          trackSize: '8px',
          innerTrackColor: 'transparent',
          selectionColor: 'transparent',
          readonly: !editable.value,
          thumbPath,
          'aria-label': $q.lang.colorPicker?.hue,
          'onUpdate:modelValue': onHue,
          onChange: onHueChange
        })
      ]

      if (hasAlpha.value) {
        sliders.push(
          h(QSlider, {
            class: 'q-color-picker__alpha non-selectable',
            modelValue: model.value.a,
            min: 0,
            max: 100,
            trackSize: '8px',
            trackColor: 'white',
            innerTrackColor: 'transparent',
            selectionColor: 'transparent',
            trackImg: alphaTrackImg,
            readonly: !editable.value,
            thumbPath,
            'aria-label': $q.lang.colorPicker?.alpha,
            ...getCache('alphaSlide', {
              'onUpdate:modelValue': value => onNumericChange(value, 'a', 100),
              onChange: value => onNumericChange(value, 'a', 100, void 0, true)
            })
          })
        )
      }

      return [
        withDirectives(h('div', data, child), spectrumDirective.value),
        h('div', { class: 'q-color-picker__sliders' }, sliders)
      ]
    }

    function getTuneTab() {
      return [
        h('div', { class: 'row items-center no-wrap' }, [
          h('div', 'R'),
          h(QSlider, {
            modelValue: model.value.r,
            min: 0,
            max: 255,
            color: 'red',
            dark: isDark(),
            readonly: !editable.value,
            ...getCache('rSlide', {
              'onUpdate:modelValue': value => onNumericChange(value, 'r', 255),
              onChange: value => onNumericChange(value, 'r', 255, void 0, true)
            })
          }),
          h('input', {
            value: model.value.r,
            maxlength: 3,
            readonly: !editable.value,
            onChange: stop,
            ...getCache('rIn', {
              onInput: evt => onNumericChange(evt.target.value, 'r', 255, evt),
              onBlur: evt =>
                onNumericChange(evt.target.value, 'r', 255, evt, true)
            })
          })
        ]),

        h('div', { class: 'row items-center no-wrap' }, [
          h('div', 'G'),
          h(QSlider, {
            modelValue: model.value.g,
            min: 0,
            max: 255,
            color: 'green',
            dark: isDark(),
            readonly: !editable.value,
            ...getCache('gSlide', {
              'onUpdate:modelValue': value => onNumericChange(value, 'g', 255),
              onChange: value => onNumericChange(value, 'g', 255, void 0, true)
            })
          }),
          h('input', {
            value: model.value.g,
            maxlength: 3,
            readonly: !editable.value,
            onChange: stop,
            ...getCache('gIn', {
              onInput: evt => onNumericChange(evt.target.value, 'g', 255, evt),
              onBlur: evt =>
                onNumericChange(evt.target.value, 'g', 255, evt, true)
            })
          })
        ]),

        h('div', { class: 'row items-center no-wrap' }, [
          h('div', 'B'),
          h(QSlider, {
            modelValue: model.value.b,
            min: 0,
            max: 255,
            color: 'blue',
            readonly: !editable.value,
            dark: isDark(),
            ...getCache('bSlide', {
              'onUpdate:modelValue': value => onNumericChange(value, 'b', 255),
              onChange: value => onNumericChange(value, 'b', 255, void 0, true)
            })
          }),
          h('input', {
            value: model.value.b,
            maxlength: 3,
            readonly: !editable.value,
            onChange: stop,
            ...getCache('bIn', {
              onInput: evt => onNumericChange(evt.target.value, 'b', 255, evt),
              onBlur: evt =>
                onNumericChange(evt.target.value, 'b', 255, evt, true)
            })
          })
        ]),

        hasAlpha.value
          ? h('div', { class: 'row items-center no-wrap' }, [
              h('div', 'A'),
              h(QSlider, {
                modelValue: model.value.a,
                color: 'grey',
                readonly: !editable.value,
                dark: isDark(),
                ...getCache('aSlide', {
                  'onUpdate:modelValue': value =>
                    onNumericChange(value, 'a', 100),
                  onChange: value =>
                    onNumericChange(value, 'a', 100, void 0, true)
                })
              }),
              h('input', {
                value: model.value.a,
                maxlength: 3,
                readonly: !editable.value,
                onChange: stop,
                ...getCache('aIn', {
                  onInput: evt =>
                    onNumericChange(evt.target.value, 'a', 100, evt),
                  onBlur: evt =>
                    onNumericChange(evt.target.value, 'a', 100, evt, true)
                })
              })
            ])
          : null
      ]
    }

    function getPaletteTab() {
      if (slots.palette !== void 0) {
        return slots.palette({
          palette: computedPalette.value,
          select: onPalettePick,
          editable: editable.value
        })
      }

      const rover = swatchRover.value

      const fn = (color, index) =>
        h('button', {
          type: 'button',
          class: 'q-color-picker__cube col-auto',
          style: { backgroundColor: color },
          tabindex: editable.value && index === rover ? 0 : -1,
          ref: index === rover ? swatchRoverRef : void 0,
          'aria-label': color,
          'aria-pressed': isModelColor(paletteRgb.value[index])
            ? 'true'
            : 'false',
          ...(editable.value
            ? getCache('palette#' + index, {
                onClick: () => {
                  onPalettePick(computedPalette.value[index])
                },
                onFocus: () => {
                  focusedSwatch.value = index
                },
                onKeydown: e => {
                  onSwatchKeydown(e, index)
                }
              })
            : {})
        })

      return [
        h(
          'div',
          {
            class:
              'row items-center q-color-picker__palette-rows' +
              (editable.value ? ' q-color-picker__palette-rows--editable' : ''),
            role: 'group',
            'aria-label': $q.lang.colorPicker?.palette
          },
          computedPalette.value.map(fn)
        )
      ]
    }

    return () => {
      const child = [getContent()]

      if (props.name !== void 0 && !props.disable) {
        injectFormInput(child, 'push')
      }

      if (!props.noHeader) child.unshift(getHeader())
      if (!props.noFooter) child.push(getFooter())

      return h(
        'div',
        {
          class: classes.value,
          ...attributes.value
        },
        child
      )
    }
  }
})
