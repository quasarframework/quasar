import { h, ref, computed, onBeforeUnmount, getCurrentInstance } from 'vue'

import TouchPan from '../../directives/TouchPan.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import { between } from '../../utils/format.js'
import { position } from '../../utils/event.js'
import { isNumber } from '../../utils/private/is.js'

// PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
export const keyCodes = [ 34, 37, 40, 33, 39, 38 ]

export function getRatio (evt, dragging, reverse, vertical) {
  const
    pos = position(evt),
    val = vertical === true
      ? between((pos.top - dragging.top) / dragging.height, 0, 1)
      : between((pos.left - dragging.left) / dragging.width, 0, 1)

  return reverse === true ? 1.0 - val : val
}

export function getModel (ratio, min, max, step, decimals) {
  let model = min + ratio * (max - min)

  if (step > 0) {
    const modulo = (model - min) % step
    model += (Math.abs(modulo) >= step / 2 ? (modulo < 0 ? -1 : 1) * step : 0) - modulo
  }

  if (decimals > 0) {
    model = parseFloat(model.toFixed(decimals))
  }

  return between(model, min, max)
}

export const useSliderProps = {
  ...useDarkProps,

  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1,
    validator: v => v >= 0
  },

  color: String,

  labelColor: String,
  labelTextColor: String,
  dense: Boolean,

  label: Boolean,
  labelAlways: Boolean,
  markers: [ Boolean, Number ],
  snap: Boolean,

  vertical: Boolean,
  reverse: Boolean,

  disable: Boolean,
  readonly: Boolean,
  tabindex: [ String, Number ],

  thumbPath: {
    type: String,
    default: 'M 4, 10 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0'
  }
}

export const useSliderEmits = [ 'pan', 'update:modelValue', 'change' ]

export default function ({ updateValue, updatePosition, getDragging }) {
  const { props, emit, proxy: { $q } } = getCurrentInstance()
  const isDark = useDark(props, $q)

  const active = ref(false)
  const preventFocus = ref(false)
  const focus = ref(false)
  const dragging = ref(false)

  const axis = computed(() => (props.vertical === true ? '--v' : '--h'))

  const isReversed = computed(() => (
    props.vertical === true
      ? props.reverse === true
      : props.reverse !== ($q.lang.rtl === true)
  ))

  const editable = computed(() => props.disable !== true && props.readonly !== true && props.min < props.max)

  const classes = computed(() =>
    `q-slider q-slider${ axis.value } q-slider--${ active.value === true ? '' : 'in' }active`
    + (isReversed.value === true ? ' q-slider--reversed' : '')
    + (props.color !== void 0 ? ` text-${ props.color }` : '')
    + (props.disable === true ? ' disabled' : ' q-slider--enabled' + (editable.value === true ? ' q-slider--editable' : ''))
    + (focus.value === 'both' ? ' q-slider--focus' : '')
    + (props.label || props.labelAlways === true ? ' q-slider--label' : '')
    + (props.labelAlways === true ? ' q-slider--label-always' : '')
    + (isDark.value === true ? ' q-slider--dark' : '')
    + (props.dense === true ? ' q-slider--dense q-slider--dense' + axis.value : '')
  )

  const decimals = computed(() => (String(props.step).trim('0').split('.')[ 1 ] || '').length)
  const step = computed(() => (props.step === 0 ? 1 : props.step))
  const minMaxDiff = computed(() => props.max - props.min)

  const markerStep = computed(() => (
    isNumber(props.markers) === true ? props.markers : step.value)
  )

  const markerStyle = computed(() => {
    if (minMaxDiff.value !== 0) {
      const size = 100 * markerStep.value / minMaxDiff.value

      return {
        backgroundSize: props.vertical === true
          ? `2px ${ size }%`
          : `${ size }% 2px`
      }
    }

    return null
  })

  const tabindex = computed(() => (editable.value === true ? props.tabindex || 0 : -1))

  const positionProp = computed(() => (
    props.vertical === true
      ? (isReversed.value === true ? 'bottom' : 'top')
      : isReversed.value === true ? 'right' : 'left'
  ))

  const sizeProp = computed(() => (props.vertical === true ? 'height' : 'width'))

  const orientation = computed(() => (props.vertical === true ? 'vertical' : 'horizontal'))

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
    if (event.isFinal) {
      if (dragging.value !== void 0) {
        updatePosition(event.evt)
        // only if touch, because we also have mousedown/up:
        event.touch === true && updateValue(true)
        dragging.value = void 0
        emit('pan', 'end')
      }
      active.value = false
    }
    else if (event.isFirst) {
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

    if (dragging.value === void 0) {
      active.value = false
    }

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
      isReversed,
      editable,
      classes,
      decimals,
      step,
      minMaxDiff,
      markerStyle,
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
      getPinStyle
    }
  }
}
