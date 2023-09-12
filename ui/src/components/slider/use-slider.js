import { h, ref, computed, onBeforeUnmount, getCurrentInstance } from 'vue'

import TouchPan from '../../directives/TouchPan.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import { useFormProps, useFormInject } from '../../composables/private/use-form.js'

import { between } from '../../utils/format.js'
import { position } from '../../utils/event.js'
import { isNumber, isObject } from '../../utils/is.js'
import { hDir } from '../../utils/private/render.js'

const markerPrefixClass = 'q-slider__marker-labels'
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

  hideSelection: Boolean,

  color: String,
  markerLabelsClass: String,

  label: Boolean,
  labelColor: String,
  labelTextColor: String,
  labelAlways: Boolean,
  switchLabelSide: Boolean,

  markers: [ Boolean, Number ],
  markerLabels: [ Boolean, Array, Object, Function ],
  switchMarkerLabelsSide: Boolean,

  trackImg: String,
  trackColor: String,
  innerTrackImg: String,
  innerTrackColor: String,
  selectionColor: String,
  selectionImg: String,

  thumbSize: {
    type: String,
    default: '20px'
  },
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

export default function ({ updateValue, updatePosition, getDragging, formAttrs }) {
  const { props, emit, slots, proxy: { $q } } = getCurrentInstance()
  const isDark = useDark(props, $q)

  const injectFormInput = useFormInject(formAttrs)

  const active = ref(false)
  const preventFocus = ref(false)
  const focus = ref(false)
  const dragging = ref(false)

  const axis = computed(() => (props.vertical === true ? '--v' : '--h'))
  const labelSide = computed(() => '-' + (props.switchLabelSide === true ? 'switched' : 'standard'))

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

  const decimals = computed(() => (String(props.step).trim().split('.')[ 1 ] || '').length)
  const step = computed(() => (props.step === 0 ? 1 : props.step))
  const tabindex = computed(() => (editable.value === true ? props.tabindex || 0 : -1))

  const trackLen = computed(() => props.max - props.min)
  const innerBarLen = computed(() => innerMax.value - innerMin.value)

  const innerMinRatio = computed(() => convertModelToRatio(innerMin.value))
  const innerMaxRatio = computed(() => convertModelToRatio(innerMax.value))

  const positionProp = computed(() => (
    props.vertical === true
      ? (isReversed.value === true ? 'bottom' : 'top')
      : (isReversed.value === true ? 'right' : 'left')
  ))

  const sizeProp = computed(() => (props.vertical === true ? 'height' : 'width'))
  const thicknessProp = computed(() => (props.vertical === true ? 'width' : 'height'))
  const orientation = computed(() => (props.vertical === true ? 'vertical' : 'horizontal'))

  const attributes = computed(() => {
    const acc = {
      role: 'slider',
      'aria-valuemin': innerMin.value,
      'aria-valuemax': innerMax.value,
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

  const classes = computed(() =>
    `q-slider q-slider${ axis.value } q-slider--${ active.value === true ? '' : 'in' }active inline no-wrap `
    + (props.vertical === true ? 'row' : 'column')
    + (props.disable === true ? ' disabled' : ' q-slider--enabled' + (editable.value === true ? ' q-slider--editable' : ''))
    + (focus.value === 'both' ? ' q-slider--focus' : '')
    + (props.label || props.labelAlways === true ? ' q-slider--label' : '')
    + (props.labelAlways === true ? ' q-slider--label-always' : '')
    + (isDark.value === true ? ' q-slider--dark' : '')
    + (props.dense === true ? ' q-slider--dense q-slider--dense' + axis.value : '')
  )

  function getPositionClass (name) {
    const cls = 'q-slider__' + name
    return `${ cls } ${ cls }${ axis.value } ${ cls }${ axis.value }${ labelSide.value }`
  }
  function getAxisClass (name) {
    const cls = 'q-slider__' + name
    return `${ cls } ${ cls }${ axis.value }`
  }

  const selectionBarClass = computed(() => {
    const color = props.selectionColor || props.color
    return 'q-slider__selection absolute'
      + (color !== void 0 ? ` text-${ color }` : '')
  })
  const markerClass = computed(() => getAxisClass('markers') + ' absolute overflow-hidden')
  const trackContainerClass = computed(() => getAxisClass('track-container'))
  const pinClass = computed(() => getPositionClass('pin'))
  const labelClass = computed(() => getPositionClass('label'))
  const textContainerClass = computed(() => getPositionClass('text-container'))
  const markerLabelsContainerClass = computed(() =>
    getPositionClass('marker-labels-container')
    + (props.markerLabelsClass !== void 0 ? ` ${ props.markerLabelsClass }` : '')
  )

  const trackClass = computed(() =>
    'q-slider__track relative-position no-outline'
    + (props.trackColor !== void 0 ? ` bg-${ props.trackColor }` : '')
  )
  const trackStyle = computed(() => {
    const acc = { [ thicknessProp.value ]: props.trackSize }
    if (props.trackImg !== void 0) {
      acc.backgroundImage = `url(${ props.trackImg }) !important`
    }
    return acc
  })

  const innerBarClass = computed(() =>
    'q-slider__inner absolute'
    + (props.innerTrackColor !== void 0 ? ` bg-${ props.innerTrackColor }` : '')
  )
  const innerBarStyle = computed(() => {
    const innerDiff = innerMaxRatio.value - innerMinRatio.value
    const acc = {
      [ positionProp.value ]: `${ 100 * innerMinRatio.value }%`,
      [ sizeProp.value ]: innerDiff === 0
        ? '2px'
        : `${ 100 * innerDiff }%`
    }
    if (props.innerTrackImg !== void 0) {
      acc.backgroundImage = `url(${ props.innerTrackImg }) !important`
    }
    return acc
  })

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

  const markerStep = computed(() => (
    isNumber(props.markers) === true ? props.markers : step.value)
  )

  const markerTicks = computed(() => {
    const acc = []
    const step = markerStep.value
    const max = props.max

    let value = props.min
    do {
      acc.push(value)
      value += step
    } while (value < max)

    acc.push(max)
    return acc
  })

  const markerLabelClass = computed(() => {
    const prefix = ` ${ markerPrefixClass }${ axis.value }-`
    return markerPrefixClass
      + `${ prefix }${ props.switchMarkerLabelsSide === true ? 'switched' : 'standard' }`
      + `${ prefix }${ isReversed.value === true ? 'rtl' : 'ltr' }`
  })

  const markerLabelsList = computed(() => {
    if (props.markerLabels === false) { return null }

    return getMarkerList(props.markerLabels).map((entry, index) => ({
      index,
      value: entry.value,
      label: entry.label || entry.value,
      classes: markerLabelClass.value
        + (entry.classes !== void 0 ? ' ' + entry.classes : ''),
      style: {
        ...getMarkerLabelStyle(entry.value),
        ...(entry.style || {})
      }
    }))
  })

  const markerScope = computed(() => ({
    markerList: markerLabelsList.value,
    markerMap: markerLabelsMap.value,
    classes: markerLabelClass.value, // TODO ts definition
    getStyle: getMarkerLabelStyle
  }))

  const markerStyle = computed(() => {
    const size = innerBarLen.value === 0
      ? '2px'
      : 100 * markerStep.value / innerBarLen.value

    return {
      ...innerBarStyle.value,
      backgroundSize: props.vertical === true
        ? `2px ${ size }%`
        : `${ size }% 2px`
    }
  })

  function getMarkerList (def) {
    if (def === false) { return null }

    if (def === true) {
      return markerTicks.value.map(defaultMarkerConvertFn)
    }

    if (typeof def === 'function') {
      return markerTicks.value.map(value => {
        const item = def(value)
        return isObject(item) === true ? { ...item, value } : { value, label: item }
      })
    }

    const filterFn = ({ value }) => value >= props.min && value <= props.max

    if (Array.isArray(def) === true) {
      return def
        .map(item => (isObject(item) === true ? item : { value: item }))
        .filter(filterFn)
    }

    return Object.keys(def).map(key => {
      const item = def[ key ]
      const value = Number(key)
      return isObject(item) === true ? { ...item, value } : { value, label: item }
    }).filter(filterFn)
  }

  function getMarkerLabelStyle (val) {
    return { [ positionProp.value ]: `${ 100 * (val - props.min) / trackLen.value }%` }
  }

  const markerLabelsMap = computed(() => {
    if (props.markerLabels === false) { return null }

    const acc = {}
    markerLabelsList.value.forEach(entry => {
      acc[ entry.value ] = entry
    })
    return acc
  })

  function getMarkerLabelsContent () {
    if (slots[ 'marker-label-group' ] !== void 0) {
      return slots[ 'marker-label-group' ](markerScope.value)
    }

    const fn = slots[ 'marker-label' ] || defaultMarkerLabelRenderFn
    return markerLabelsList.value.map(marker => fn({
      marker,
      ...markerScope.value
    }))
  }

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
      focus.value = false
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

  function getTextContainerStyle (ratio) {
    if (props.vertical === true) { return null }

    const p = $q.lang.rtl !== props.reverse ? 1 - ratio : ratio
    return {
      transform: `translateX(calc(${ 2 * p - 1 } * ${ props.thumbSize } / 2 + ${ 50 - 100 * p }%))`
    }
  }

  function getThumbRenderFn (thumb) {
    const focusClass = computed(() => (
      preventFocus.value === false && (focus.value === thumb.focusValue || focus.value === 'both')
        ? ' q-slider--focus'
        : ''
    ))

    const classes = computed(() =>
      `q-slider__thumb q-slider__thumb${ axis.value } q-slider__thumb${ axis.value }-${ isReversed.value === true ? 'rtl' : 'ltr' } absolute non-selectable`
      + focusClass.value
      + (thumb.thumbColor.value !== void 0 ? ` text-${ thumb.thumbColor.value }` : '')
    )

    const style = computed(() => ({
      width: props.thumbSize,
      height: props.thumbSize,
      [ positionProp.value ]: `${ 100 * thumb.ratio.value }%`,
      zIndex: focus.value === thumb.focusValue ? 2 : void 0
    }))

    const pinColor = computed(() => (
      thumb.labelColor.value !== void 0
        ? ` text-${ thumb.labelColor.value }`
        : ''
    ))

    const textContainerStyle = computed(() => getTextContainerStyle(thumb.ratio.value))

    const textClass = computed(() => (
      'q-slider__text'
      + (thumb.labelTextColor.value !== void 0 ? ` text-${ thumb.labelTextColor.value }` : '')
    ))

    return () => {
      const thumbContent = [
        h('svg', {
          class: 'q-slider__thumb-shape absolute-full',
          viewBox: '0 0 20 20',
          'aria-hidden': 'true'
        }, [
          h('path', { d: props.thumbPath })
        ]),

        h('div', { class: 'q-slider__focus-ring fit' })
      ]

      if (props.label === true || props.labelAlways === true) {
        thumbContent.push(
          h('div', {
            class: pinClass.value + ' absolute fit no-pointer-events' + pinColor.value
          }, [
            h('div', {
              class: labelClass.value,
              style: { minWidth: props.thumbSize }
            }, [
              h('div', {
                class: textContainerClass.value,
                style: textContainerStyle.value
              }, [
                h('span', { class: textClass.value }, thumb.label.value)
              ])
            ])
          ])
        )

        if (props.name !== void 0 && props.disable !== true) {
          injectFormInput(thumbContent, 'push')
        }
      }

      return h('div', {
        class: classes.value,
        style: style.value,
        ...thumb.getNodeData()
      }, thumbContent)
    }
  }

  function getContent (selectionBarStyle, trackContainerTabindex, trackContainerEvents, injectThumb) {
    const trackContent = []

    props.innerTrackColor !== 'transparent' && trackContent.push(
      h('div', {
        key: 'inner',
        class: innerBarClass.value,
        style: innerBarStyle.value
      })
    )

    props.selectionColor !== 'transparent' && trackContent.push(
      h('div', {
        key: 'selection',
        class: selectionBarClass.value,
        style: selectionBarStyle.value
      })
    )

    props.markers !== false && trackContent.push(
      h('div', {
        key: 'marker',
        class: markerClass.value,
        style: markerStyle.value
      })
    )

    injectThumb(trackContent)

    const content = [
      hDir(
        'div',
        {
          key: 'trackC',
          class: trackContainerClass.value,
          tabindex: trackContainerTabindex.value,
          ...trackContainerEvents.value
        },
        [
          h('div', {
            class: trackClass.value,
            style: trackStyle.value
          }, trackContent)
        ],
        'slide',
        editable.value, () => panDirective.value
      )
    ]

    if (props.markerLabels !== false) {
      const action = props.switchMarkerLabelsSide === true
        ? 'unshift'
        : 'push'

      content[ action ](
        h('div', {
          key: 'markerL',
          class: markerLabelsContainerClass.value
        }, getMarkerLabelsContent())
      )
    }

    return content
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

      editable,
      classes,
      tabindex,
      attributes,

      step,
      decimals,
      trackLen,
      innerMin,
      innerMinRatio,
      innerMax,
      innerMaxRatio,
      positionProp,
      sizeProp,
      isReversed
    },

    methods: {
      onActivate,
      onMobileClick,
      onBlur,
      onKeyup,
      getContent,
      getThumbRenderFn,
      convertRatioToModel,
      convertModelToRatio,
      getDraggingRatio
    }
  }
}
