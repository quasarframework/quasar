import { h, ref, computed, onBeforeUnmount, getCurrentInstance } from 'vue'

import TouchPan from '../../directives/TouchPan.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import { useFormProps } from '../../composables/private/use-form.js'

import { between } from '../../utils/format.js'
import { position, stopAndPrevent } from '../../utils/event.js'
import { isNumber } from '../../utils/private/is.js'
import { defineGetterObject } from '../../utils/private/inject-obj-prop.js'

const markerClass = 'q-slider__marker-labels'
const defaultMarkerConvertFn = v => ({ value: v })
const defaultMarkerLabelRenderFn = ({ marker }) => h('div', {
  key: marker.value,
  style: marker.style,
  class: marker.classes
}, marker.label)

// PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
export const keyCodes = [ 34, 37, 40, 33, 39, 38 ]

export const useSliderProps = {
  ...useDarkProps,
  ...useFormProps,

  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  innerMin: Number,
  innerMax: Number,

  step: {
    type: Number,
    default: 1,
    validator: v => v >= 0
  },

  snap: Boolean,

  vertical: Boolean,
  reverse: Boolean,

  color: String,

  label: Boolean,
  labelColor: String,
  labelTextColor: String,
  labelAlways: Boolean,
  switchLabelPosition: Boolean,

  markers: [ Boolean, Number ],
  markerLabels: [ Boolean, Array, Object, Function ],
  switchMarkerLabelsPosition: Boolean,

  trackSize: {
    type: String,
    default: '4px'
  },

  disable: Boolean,
  readonly: Boolean,
  dense: Boolean,

  tabindex: [ String, Number ],

  thumbColor: String,
  thumbPath: {
    type: String,
    default: 'M 4, 10 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0'
  }
}

export const useSliderEmits = [ 'pan', 'update:modelValue', 'change' ]

export default function ({ updateValue, updatePosition, getDragging }) {
  const { props, emit, slots, proxy: { $q } } = getCurrentInstance()
  const isDark = useDark(props, $q)

  const active = ref(false)
  const preventFocus = ref(false)
  const focus = ref(false)
  const dragging = ref(false)

  const axis = computed(() => (props.vertical === true ? '--v' : '--h'))
  const labelSide = computed(() => '-' + (props.switchLabelPosition === true ? 'switched' : 'standard'))

  const isReversed = computed(() => (
    props.vertical === true
      ? props.reverse === true
      : props.reverse !== ($q.lang.rtl === true)
  ))

  const innerMin = computed(() => (
    isNaN(props.innerMin) === true || props.innerMin < props.min
      ? props.min
      : props.innerMin
  ))

  const innerMax = computed(() => (
    isNaN(props.innerMax) === true || props.innerMax > props.max
      ? props.max
      : props.innerMax
  ))

  const editable = computed(() => (
    props.disable !== true && props.readonly !== true
    && innerMin.value < innerMax.value
  ))

  const classes = computed(() =>
    `q-slider q-slider${ axis.value } q-slider--${ active.value === true ? '' : 'in' }active`
    + ` ${ props.vertical === true ? 'column' : 'row' } items-center`
    + (isReversed.value === true ? ' q-slider--reversed' : '')
    + (props.disable === true ? ' disabled' : ' q-slider--enabled' + (editable.value === true ? ' q-slider--editable' : ''))
    + (focus.value === 'both' ? ' q-slider--focus' : '')
    + (props.label || props.labelAlways === true ? ' q-slider--label' : '')
    + (props.labelAlways === true ? ' q-slider--label-always' : '')
    + (isDark.value === true ? ' q-slider--dark' : '')
    + (props.dense === true ? ' q-slider--dense q-slider--dense' + axis.value : '')
  )

  const colorClass = computed(() => (props.color !== void 0 ? ` text-${ props.color }` : ''))

  const arrowClass = computed(() =>
    `q-slider__arrow absolute q-slider__arrow${ axis.value } q-slider__arrow${ axis.value }${ labelSide.value }`
  )
  const pinClass = computed(() =>
    `q-slider__pin absolute q-slider__pin${ axis.value } q-slider__pin${ axis.value }${ labelSide.value }`
  )
  const pinTextClass = computed(() =>
    `q-slider__pin-text-container q-slider__pin-text-container${ axis.value } q-slider__pin-text-container${ axis.value }${ labelSide.value }`
  )

  const decimals = computed(() => (String(props.step).trim('0').split('.')[ 1 ] || '').length)
  const step = computed(() => (props.step === 0 ? 1 : props.step))
  const innerTrackLen = computed(() => innerMax.value - innerMin.value)
  const trackLen = computed(() => props.max - props.min)

  function convertRatioToModel (ratio) {
    const { min, max, step } = props
    let model = min + ratio * (max - min)

    if (step > 0) {
      const modulo = (model - min) % step
      model += (Math.abs(modulo) >= step / 2 ? (modulo < 0 ? -1 : 1) * step : 0) - modulo
    }

    if (decimals.value > 0) {
      model = parseFloat(model.toFixed(decimals.value))
    }

    return between(model, innerMin.value, innerMax.value)
  }

  function convertModelToRatio (model) {
    return trackLen.value === 0
      ? 0
      : (model - props.min) / trackLen.value
  }

  function getDraggingRatio (evt, dragging) {
    const
      pos = position(evt),
      val = props.vertical === true
        ? between((pos.top - dragging.top) / dragging.height, 0, 1)
        : between((pos.left - dragging.left) / dragging.width, 0, 1)

    return between(
      isReversed.value === true ? 1.0 - val : val,
      innerMinRatio.value,
      innerMaxRatio.value
    )
  }

  const innerMinRatio = computed(() => convertModelToRatio(innerMin.value))
  const innerMaxRatio = computed(() => convertModelToRatio(innerMax.value))

  const markerStep = computed(() => (
    isNumber(props.markers) === true ? props.markers : step.value)
  )

  const markerStyle = computed(() => {
    if (innerTrackLen.value !== 0) {
      const size = 100 * markerStep.value / innerTrackLen.value

      return {
        ...innerTrackStyle.value,
        backgroundSize: props.vertical === true
          ? `2px ${ size }%`
          : `${ size }% 2px`
      }
    }

    return null
  })

  const markerTicks = computed(() => {
    const acc = []
    const step = markerStep.value
    const max = innerMax.value

    let value = innerMin.value
    do {
      acc.push(value)
      value += step
    } while (value < max)

    acc.push(max)
    return acc
  })

  function getMarkerList (def) {
    if (def === false) { return null }

    if (def === true) {
      return markerTicks.value.map(defaultMarkerConvertFn)
    }

    if (typeof def === 'function') {
      return markerTicks.value.map(value => {
        const item = def(value)
        return Object(item) === item ? { ...item, value } : { value, label: item }
      })
    }

    if (Array.isArray(def) === true) {
      return def.map(item => (Object(item) === item ? item : { value: item }))
    }

    return Object.keys(def).map(key => {
      const item = def[ key ]
      const value = Number(key)
      return Object(item) === item ? { ...item, value } : { value, label: item }
    })
  }

  const markerLabelClass = computed(() => {
    const prefix = ` ${ markerClass }${ axis.value }-`
    return markerClass
      + `${ prefix }${ props.switchMarkerLabelsPosition === true ? 'switched' : 'standard' }`
      + `${ prefix }${ isReversed.value === true ? 'rtl' : 'ltr' }`
  })

  const markerLabelsList = computed(() => {
    if (props.markerLabels === false) { return null }

    const len = trackLen.value
    return getMarkerList(props.markerLabels).map((entry, index) => ({
      index,
      value: entry.value,
      label: entry.label || entry.value,
      classes: markerLabelClass.value,
      style: {
        [ positionProp.value ]: `${ 100 * (entry.value - props.min) / len }%`,
        ...(entry.style || {})
      }
    }))
  })

  const markerLabelsMap = computed(() => {
    if (props.markerLabels === false) { return null }

    const acc = {}
    markerLabelsList.value.forEach(entry => {
      acc[ entry.value ] = entry
    })
    return acc
  })

  const markerLabelScope = defineGetterObject({
    markerList: () => markerLabelsList.value,
    markerMap: () => markerLabelsMap.value
  })

  function getMarkerLabelsContent () {
    if (slots[ 'marker-label-group' ] !== void 0) {
      return slots[ 'marker-label-group' ](markerLabelScope)
    }

    const fn = slots[ 'marker-label' ] || defaultMarkerLabelRenderFn
    return markerLabelsList.value.map(marker => fn({ marker, ...markerLabelScope }))
  }

  function getMarkerLabels () {
    return h(
      'div',
      {
        class: 'q-slider__marker-labels-container col no-pointer-events relative-position',
        onMousedownCapture: stopAndPrevent, onClick: stopAndPrevent, onTouchstart: stopAndPrevent
      },
      getMarkerLabelsContent()
    )
  }

  const tabindex = computed(() => (editable.value === true ? props.tabindex || 0 : -1))

  const positionProp = computed(() => (
    props.vertical === true
      ? (isReversed.value === true ? 'bottom' : 'top')
      : isReversed.value === true ? 'right' : 'left'
  ))

  const sizeProp = computed(() => (props.vertical === true ? 'height' : 'width'))
  const thicknessProp = computed(() => (props.vertical === true ? 'width' : 'height'))
  const orientation = computed(() => (props.vertical === true ? 'vertical' : 'horizontal'))

  const trackContainerStyle = computed(() => ({
    [ thicknessProp.value ]: props.trackSize
  }))

  const innerTrackStyle = computed(() => ({
    [ positionProp.value ]: `${ 100 * innerMinRatio.value }%`,
    [ sizeProp.value ]: `${ 100 * (innerMaxRatio.value - innerMinRatio.value) }%`
  }))

  const attributes = computed(() => {
    const acc = {
      role: 'slider',
      'aria-valuemin': props.min,
      'aria-valuemax': props.max,
      'aria-orientation': orientation.value,
      'data-step': props.step
    }

    if (props.disable === true) {
      acc[ 'aria-disabled' ] = 'true'
    }
    else if (props.readonly === true) {
      acc[ 'aria-readonly' ] = 'true'
    }

    return acc
  })

  const panDirective = computed(() => {
    // if editable.value === true
    return [ [
      TouchPan,
      onPan,
      void 0,
      {
        [ orientation.value ]: true,
        prevent: true,
        stop: true,
        mouse: true,
        mouseAllDir: true
      }
    ] ]
  })

  function getThumbSvg () {
    return h('svg', {
      class: 'q-slider__thumb absolute',
      viewBox: '0 0 20 20',
      width: '20',
      height: '20',
      'aria-hidden': 'true'
    }, [
      h('path', { d: props.thumbPath })
    ])
  }

  function getPinStyle (percent, ratio) {
    if (props.vertical === true) {
      return {}
    }

    const offset = `${ Math.ceil(20 * Math.abs(0.5 - ratio)) }px`
    return {
      pin: {
        transformOrigin: `${ $q.lang.rtl === true ? offset : `calc(100% - ${ offset })` } 50%`
      },

      pinTextContainer: {
        [ $q.lang.rtl === true ? 'left' : 'right' ]: `${ percent * 100 }%`,
        transform: `translateX(${ Math.ceil(($q.lang.rtl === true ? -1 : 1) * 20 * percent) }px)`
      }
    }
  }

  function onPan (event) {
    if (event.isFinal === true) {
      if (dragging.value !== void 0) {
        updatePosition(event.evt)
        // only if touch, because we also have mousedown/up:
        event.touch === true && updateValue(true)
        dragging.value = void 0
        emit('pan', 'end')
      }
      active.value = false
    }
    else if (event.isFirst === true) {
      dragging.value = getDragging(event.evt)
      updatePosition(event.evt)
      updateValue()
      active.value = true
      emit('pan', 'start')
    }
    else {
      updatePosition(event.evt)
      updateValue()
    }
  }

  function onBlur () {
    focus.value = false
  }

  function onActivate (evt) {
    updatePosition(evt, getDragging(evt))
    updateValue()

    preventFocus.value = true
    active.value = true

    document.addEventListener('mouseup', onDeactivate, true)
  }

  function onDeactivate () {
    preventFocus.value = false
    active.value = false

    updateValue(true)
    onBlur()

    document.removeEventListener('mouseup', onDeactivate, true)
  }

  function onMobileClick (evt) {
    updatePosition(evt, getDragging(evt))
    updateValue(true)
  }

  function onKeyup (evt) {
    if (keyCodes.includes(evt.keyCode)) {
      updateValue(true)
    }
  }

  onBeforeUnmount(() => {
    document.removeEventListener('mouseup', onDeactivate, true)
  })

  return {
    state: {
      active,
      focus,
      preventFocus,
      dragging,

      axis,
      arrowClass,
      pinClass,
      pinTextClass,
      isReversed,
      editable,
      classes,
      colorClass,
      decimals,
      innerMin,
      innerMinRatio,
      innerMax,
      innerMaxRatio,
      step,
      trackLen,
      markerStyle,
      trackContainerStyle,
      innerTrackStyle,
      tabindex,
      positionProp,
      sizeProp,
      attributes,
      panDirective
    },

    methods: {
      onActivate,
      onMobileClick,
      onBlur,
      onKeyup,
      getThumbSvg,
      getMarkerLabels,
      getPinStyle,
      convertRatioToModel,
      convertModelToRatio,
      getDraggingRatio
    }
  }
}
