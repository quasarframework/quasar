import { computed, getCurrentInstance, h, onBeforeUnmount, ref } from 'vue'

import TouchPan from '../../directives/touch-pan/TouchPan.js'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import {
  useFormInject,
  useFormProps
} from '../../composables/use-form/private.use-form.js'

import { between } from '../../utils/format/format.js'
import { position } from '../../utils/event/event.js'
import { isNumber, isObject } from '../../utils/is/is.js'
import { hDir } from '../../utils/private.render/render.js'

const markerPrefixClass = 'q-slider__marker-labels'
const defaultMarkerConvertFn = v => ({ value: v })
const defaultMarkerLabelRenderFn = ({ marker }) =>
  h(
    'div',
    {
      key: marker.value,
      style: marker.style,
      class: marker.classes
    },
    marker.label
  )

// PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
export const keyCodes = [34, 37, 40, 33, 39, 38]

export const useSliderProps = {
  ...useDarkProps,
  ...useFormProps,

  /**
   * Minimum value of the model; Set track's minimum value
   *
   * @api prop min
   * @type {Number}
   * @default 0
   * @category model
   */
  min: {
    type: Number,
    default: 0
  },

  /**
   * Maximum value of the model; Set track's maximum value
   *
   * @api prop max
   * @type {Number}
   * @default 100
   * @category model
   */
  max: {
    type: Number,
    default: 100
  },

  /**
   * Inner minimum value of the model; Use in case you need the model value to be inside of the track's min-max values; Defaults to 'min' prop
   *
   * @api prop inner-min
   * @type {Number}
   * @category model
   * @added-in v2.4
   */
  innerMin: Number,

  /**
   * Inner maximum value of the model; Use in case you need the model value to be inside of the track's min-max values; Defaults to 'max' prop
   *
   * @api prop inner-max
   * @type {Number}
   * @category model
   * @added-in v2.4
   */
  innerMax: Number,

  /**
   * Specify step amount between valid values (> 0.0); When step equals to 0 it defines infinite granularity
   *
   * @api prop step
   * @type {Number}
   * @default 1
   * @category model
   */
  step: {
    type: Number,
    default: 1,
    validator: v => v >= 0
  },

  /**
   * Snap on valid values, rather than sliding freely; Suggestion: use with 'step' prop
   *
   * @api prop snap
   * @type {Boolean}
   * @category behavior
   */
  snap: Boolean,

  /**
   * Display in vertical direction
   *
   * @api prop vertical
   * @type {Boolean}
   * @category behavior
   */
  vertical: Boolean,

  /**
   * Work in reverse (changes direction)
   *
   * @api prop reverse
   * @type {Boolean}
   * @category behavior
   */
  reverse: Boolean,

  /**
   * Color name for component from the Quasar Color Palette
   *
   * @api prop color
   * @type {String}
   * @ts-type NamedColor
   * @category style
   * @example 'primary'
   * @example 'teal'
   * @example 'teal-10'
   */
  color: String,

  /**
   * CSS class(es) to apply to the marker labels container
   *
   * @api prop marker-labels-class
   * @type {String}
   * @category style
   * @added-in v2.4
   * @example 'text-orange'
   */
  markerLabelsClass: String,

  /**
   * Popup a label when user clicks/taps on the slider thumb and moves it
   *
   * @api prop label
   * @type {Boolean}
   * @category content
   */
  label: Boolean,

  /**
   * Color name for the label background from the Quasar Color Palette
   *
   * @api prop label-color
   * @type {String}
   * @ts-type NamedColor
   * @category style
   */
  labelColor: String,

  /**
   * Color name for the label text from the Quasar Color Palette
   *
   * @api prop label-text-color
   * @type {String}
   * @ts-type NamedColor
   * @category style
   */
  labelTextColor: String,

  /**
   * Always display the label
   *
   * @api prop label-always
   * @type {Boolean}
   * @category behavior|content
   */
  labelAlways: Boolean,

  /**
   * Switch the position of the label (top <-> bottom or left <-> right)
   *
   * @api prop switch-label-side
   * @type {Boolean}
   * @category style
   * @added-in v2.4
   */
  switchLabelSide: Boolean,

  /**
   * Display markers on the track, one for each possible value for the model or using a custom step
   *
   * @api prop markers
   * @type {Boolean|Number}
   * @category content
   * @example 5
   * @example true
   */
  markers: [Boolean, Number],

  /**
   * Configure the marker labels (or show the default ones if 'true')
   *
   * @api prop marker-labels
   * @type {Boolean|Array|Object|Function}
   * @ts-type SliderMarkerLabels
   * @category content
   * @added-in v2.4
   * @example true
   * @example [{ value: 0, label: '0%' }, { value: 5, classes: 'my-class', style: { width: '24px' } }]
   * @example { 0: '0%', 5: { label: '5%', classes: 'my-class', style: { width: '24px' } } }
   * @example val => (10 * val) + '%'
   * @example val => ({ label: (10 * val) + '%', classes: 'my-class', style: { width: '24px' } })
   */
  markerLabels: [Boolean, Array, Object, Function],

  /**
   * Switch the position of the marker labels (top <-> bottom or left <-> right)
   *
   * @api prop switch-marker-labels-side
   * @type {Boolean}
   * @category style
   * @added-in v2.4
   */
  switchMarkerLabelsSide: Boolean,

  /**
   * Apply a pattern image on the track
   *
   * @api prop track-img
   * @type {String}
   * @category style
   * @transform-asset-urls
   * @added-in v2.4
   * @example '~@/assets/my-pattern.png'
   */
  trackImg: String,

  /**
   * Color name for the track from the Quasar Color Palette
   *
   * @api prop track-color
   * @type {String}
   * @ts-type NamedColor
   * @category style
   * @added-in v2.4
   */
  trackColor: String,

  /**
   * Apply a pattern image on the inner track
   *
   * @api prop inner-track-img
   * @type {String}
   * @category style
   * @transform-asset-urls
   * @added-in v2.4
   * @example '~@/assets/my-pattern.png'
   */
  innerTrackImg: String,

  /**
   * Color name for the inner track from the Quasar Color Palette
   *
   * @api prop inner-track-color
   * @type {String}
   * @ts-type NamedColor
   * @category style
   * @added-in v2.4
   */
  innerTrackColor: String,

  /**
   * Color name for the selection bar from the Quasar Color Palette
   *
   * @api prop selection-color
   * @type {String}
   * @ts-type NamedColor
   * @category style
   * @added-in v2.4
   */
  selectionColor: String,

  /**
   * Apply a pattern image on the selection bar
   *
   * @api prop selection-img
   * @type {String}
   * @category style
   * @transform-asset-urls
   * @added-in v2.4
   * @example '~@/assets/my-pattern.png'
   */
  selectionImg: String,

  /**
   * Thumb size (including CSS unit)
   *
   * @api prop thumb-size
   * @type {String}
   * @default '20px'
   * @category style
   * @added-in v2.4
   * @example '20px'
   */
  thumbSize: {
    type: String,
    default: '20px'
  },

  /**
   * Track size (including CSS unit)
   *
   * @api prop track-size
   * @type {String}
   * @default '4px'
   * @category style
   * @added-in v2.4
   * @example '35px'
   */
  trackSize: {
    type: String,
    default: '4px'
  },

  /**
   * Put component in disabled mode
   *
   * @api prop disable
   * @type {Boolean}
   * @category state
   */
  disable: Boolean,

  /**
   * Put component in readonly mode
   *
   * @api prop readonly
   * @type {Boolean}
   * @category state
   */
  readonly: Boolean,

  /**
   * Dense mode; occupies less space
   *
   * @api prop dense
   * @type {Boolean}
   * @category style
   */
  dense: Boolean,

  /**
   * Tabindex HTML attribute value
   *
   * @api prop tabindex
   * @type {String|Number}
   * @category general
   */
  tabindex: [String, Number],

  /**
   * Color name for the thumb from the Quasar Color Palette
   *
   * @api prop thumb-color
   * @type {String}
   * @ts-type NamedColor
   * @category style
   * @added-in v2.4
   */
  thumbColor: String,

  /**
   * Set custom thumb svg path
   *
   * @api prop thumb-path
   * @type {String}
   * @default 'M 4, 10 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0'
   * @category style
   * @example 'M5 5 h10 v10 h-10 v-10'
   */
  thumbPath: {
    type: String,
    default: 'M 4, 10 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0'
  }
}

/**
 * @api event change
 * @extends update:model-value
 * @desc Emitted on lazy model value change (after user slides then releases the thumb)
 */
/**
 * @api event pan
 * @desc Triggered when user starts panning on the component
 * @param {'start'|'end'} phase Phase of panning
 */
export const useSliderEmits = ['pan', 'update:modelValue', 'change']

export default function useSlider({
  updateValue,
  updatePosition,
  getDragging,
  formAttrs
}) {
  const {
    props,
    emit,
    slots,
    proxy: { $q }
  } = getCurrentInstance()
  const isDark = useDark(props, $q)

  const injectFormInput = useFormInject(formAttrs)

  const active = ref(false)
  const preventFocus = ref(false)
  const focus = ref(false)
  const dragging = ref(false)

  const axis = computed(() => (props.vertical ? '--v' : '--h'))
  const labelSide = computed(
    () => '-' + (props.switchLabelSide ? 'switched' : 'standard')
  )

  const isReversed = computed(() =>
    props.vertical ? props.reverse : props.reverse !== ($q.lang.rtl === true)
  )

  const innerMin = computed(() =>
    !Number.isFinite(props.innerMin) || props.innerMin < props.min
      ? props.min
      : props.innerMin
  )
  const innerMax = computed(() =>
    !Number.isFinite(props.innerMax) || props.innerMax > props.max
      ? props.max
      : props.innerMax
  )

  const editable = computed(
    () => !props.disable && !props.readonly && innerMin.value < innerMax.value
  )

  const roundValueFn = computed(() => {
    if (props.step === 0) return v => v

    const decimals = (String(props.step).trim().split('.')[1] || '').length
    return v => Number.parseFloat(v.toFixed(decimals))
  })

  const keyStep = computed(() => (props.step === 0 ? 1 : props.step))
  const tabindex = computed(() => (editable.value ? props.tabindex || 0 : -1))

  const trackLen = computed(() => props.max - props.min)
  const innerBarLen = computed(() => innerMax.value - innerMin.value)

  const innerMinRatio = computed(() => convertModelToRatio(innerMin.value))
  const innerMaxRatio = computed(() => convertModelToRatio(innerMax.value))

  const positionProp = computed(() =>
    props.vertical
      ? isReversed.value
        ? 'bottom'
        : 'top'
      : isReversed.value
        ? 'right'
        : 'left'
  )

  const sizeProp = computed(() => (props.vertical ? 'height' : 'width'))
  const thicknessProp = computed(() => (props.vertical ? 'width' : 'height'))
  const orientation = computed(() =>
    props.vertical ? 'vertical' : 'horizontal'
  )

  const attributes = computed(() => {
    const acc = {
      role: 'slider',
      'aria-valuemin': innerMin.value,
      'aria-valuemax': innerMax.value,
      'aria-orientation': orientation.value,
      'data-step': props.step
    }

    if (props.disable) {
      acc['aria-disabled'] = 'true'
    } else if (props.readonly) {
      acc['aria-readonly'] = 'true'
    }

    return acc
  })

  const classes = computed(
    () =>
      `q-slider q-slider${axis.value} q-slider--${active.value ? '' : 'in'}active inline no-wrap ` +
      (props.vertical ? 'row' : 'column') +
      (props.disable
        ? ' disabled'
        : ' q-slider--enabled' +
          (editable.value ? ' q-slider--editable' : '')) +
      (focus.value === 'both' ? ' q-slider--focus' : '') +
      (props.label || props.labelAlways ? ' q-slider--label' : '') +
      (props.labelAlways ? ' q-slider--label-always' : '') +
      (isDark.value ? ' q-slider--dark' : '') +
      (props.dense ? ' q-slider--dense q-slider--dense' + axis.value : '')
  )

  function getPositionClass(name) {
    const cls = 'q-slider__' + name
    return `${cls} ${cls}${axis.value} ${cls}${axis.value}${labelSide.value}`
  }
  function getAxisClass(name) {
    const cls = 'q-slider__' + name
    return `${cls} ${cls}${axis.value}`
  }

  const selectionBarClass = computed(() => {
    const color = props.selectionColor || props.color
    return (
      'q-slider__selection absolute' +
      (color !== void 0 ? ` text-${color}` : '')
    )
  })
  const markerClass = computed(
    () => getAxisClass('markers') + ' absolute overflow-hidden'
  )
  const trackContainerClass = computed(() => getAxisClass('track-container'))
  const pinClass = computed(() => getPositionClass('pin'))
  const labelClass = computed(() => getPositionClass('label'))
  const textContainerClass = computed(() => getPositionClass('text-container'))
  const markerLabelsContainerClass = computed(
    () =>
      getPositionClass('marker-labels-container') +
      (props.markerLabelsClass !== void 0 ? ` ${props.markerLabelsClass}` : '')
  )

  const trackClass = computed(
    () =>
      'q-slider__track relative-position no-outline' +
      (props.trackColor !== void 0 ? ` bg-${props.trackColor}` : '')
  )
  const trackStyle = computed(() => {
    const acc = { [thicknessProp.value]: props.trackSize }
    if (props.trackImg !== void 0) {
      acc.backgroundImage = `url(${props.trackImg}) !important`
    }
    return acc
  })

  const innerBarClass = computed(
    () =>
      'q-slider__inner absolute' +
      (props.innerTrackColor !== void 0 ? ` bg-${props.innerTrackColor}` : '')
  )
  const innerBarStyle = computed(() => {
    const innerDiff = innerMaxRatio.value - innerMinRatio.value
    const acc = {
      [positionProp.value]: `${100 * innerMinRatio.value}%`,
      [sizeProp.value]: innerDiff === 0 ? '2px' : `${100 * innerDiff}%`
    }
    if (props.innerTrackImg !== void 0) {
      acc.backgroundImage = `url(${props.innerTrackImg}) !important`
    }
    return acc
  })

  function convertRatioToModel(ratio) {
    const { min, max, step } = props
    let model = min + ratio * (max - min)

    if (step > 0) {
      const modulo = (model - innerMin.value) % step
      model +=
        (Math.abs(modulo) >= step / 2 ? (modulo < 0 ? -1 : 1) * step : 0) -
        modulo
    }

    model = roundValueFn.value(model)

    return between(model, innerMin.value, innerMax.value)
  }

  function convertModelToRatio(model) {
    return trackLen.value === 0 ? 0 : (model - props.min) / trackLen.value
  }

  function getDraggingRatio(evt, draggingInfo) {
    const pos = position(evt),
      val = props.vertical
        ? between((pos.top - draggingInfo.top) / draggingInfo.height, 0, 1)
        : between((pos.left - draggingInfo.left) / draggingInfo.width, 0, 1)

    return between(
      isReversed.value ? 1 - val : val,
      innerMinRatio.value,
      innerMaxRatio.value
    )
  }

  const markerStep = computed(() =>
    isNumber(props.markers) ? props.markers : keyStep.value
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
    const prefix = ` ${markerPrefixClass}${axis.value}-`
    return (
      markerPrefixClass +
      `${prefix}${props.switchMarkerLabelsSide ? 'switched' : 'standard'}` +
      `${prefix}${isReversed.value ? 'rtl' : 'ltr'}`
    )
  })

  const markerLabelsList = computed(() => {
    if (props.markerLabels === false) return null

    return getMarkerList(props.markerLabels).map((entry, index) => ({
      index,
      value: entry.value,
      label: entry.label || entry.value,
      classes:
        markerLabelClass.value +
        (entry.classes !== void 0 ? ' ' + entry.classes : ''),
      style: {
        ...getMarkerLabelStyle(entry.value),
        ...entry.style
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
    const size =
      innerBarLen.value === 0
        ? '2px'
        : (100 * markerStep.value) / innerBarLen.value

    return {
      ...innerBarStyle.value,
      backgroundSize: props.vertical ? `2px ${size}%` : `${size}% 2px`
    }
  })

  function getMarkerList(def) {
    if (def === false) return null

    if (def === true) {
      return markerTicks.value.map(defaultMarkerConvertFn)
    }

    if (typeof def === 'function') {
      return markerTicks.value.map(value => {
        const item = def(value)
        return isObject(item) ? { ...item, value } : { value, label: item }
      })
    }

    const filterFn = ({ value }) => value >= props.min && value <= props.max

    if (Array.isArray(def)) {
      return def
        .map(item => (isObject(item) ? item : { value: item }))
        .filter(filterFn)
    }

    return Object.keys(def)
      .map(key => {
        const item = def[key]
        const value = Number(key)
        return isObject(item) ? { ...item, value } : { value, label: item }
      })
      .filter(filterFn)
  }

  function getMarkerLabelStyle(val) {
    return {
      [positionProp.value]: `${(100 * (val - props.min)) / trackLen.value}%`
    }
  }

  const markerLabelsMap = computed(() => {
    if (props.markerLabels === false) return null

    const acc = {}
    markerLabelsList.value.forEach(entry => {
      acc[entry.value] = entry
    })
    return acc
  })

  function getMarkerLabelsContent() {
    if (slots['marker-label-group'] !== void 0) {
      return slots['marker-label-group'](markerScope.value)
    }

    const fn = slots['marker-label'] || defaultMarkerLabelRenderFn
    return markerLabelsList.value.map(marker =>
      fn({
        marker,
        ...markerScope.value
      })
    )
  }

  const panDirective = computed(() => [
    [
      TouchPan,
      onPan,
      void 0,
      {
        [orientation.value]: true,
        prevent: true,
        stop: true,
        mouse: true,
        mouseAllDir: true
      }
    ]
  ])

  function onPan(event) {
    if (event.isFinal) {
      if (dragging.value !== void 0) {
        updatePosition(event.evt)
        // only if touch, because we also have mousedown/up:
        if (event.touch) updateValue(true)
        dragging.value = void 0
        emit('pan', 'end')
      }
      active.value = false
      focus.value = false
    } else if (event.isFirst) {
      dragging.value = getDragging(event.evt)
      updatePosition(event.evt)
      updateValue()
      active.value = true
      emit('pan', 'start')
    } else {
      updatePosition(event.evt)
      updateValue()
    }
  }

  function onBlur() {
    focus.value = false
  }

  function onActivate(evt) {
    updatePosition(evt, getDragging(evt))
    updateValue()

    preventFocus.value = true
    active.value = true

    document.addEventListener('mouseup', onDeactivate, true)
  }

  function onDeactivate() {
    preventFocus.value = false
    active.value = false

    updateValue(true)
    onBlur()

    document.removeEventListener('mouseup', onDeactivate, true)
  }

  function onMobileClick(evt) {
    updatePosition(evt, getDragging(evt))
    updateValue(true)
  }

  function onKeyup(evt) {
    if (keyCodes.includes(evt.keyCode)) {
      updateValue(true)
    }
  }

  function getTextContainerStyle(ratio) {
    if (props.vertical) return null

    const p = $q.lang.rtl !== props.reverse ? 1 - ratio : ratio
    return {
      transform: `translateX(calc(${2 * p - 1} * ${props.thumbSize} / 2 + ${50 - 100 * p}%))`
    }
  }

  function getThumbRenderFn(thumb) {
    const focusClass = computed(() =>
      !preventFocus.value &&
      (focus.value === thumb.focusValue || focus.value === 'both')
        ? ' q-slider--focus'
        : ''
    )

    const thumbClasses = computed(
      () =>
        `q-slider__thumb q-slider__thumb${axis.value} q-slider__thumb${axis.value}-${isReversed.value ? 'rtl' : 'ltr'} absolute non-selectable` +
        focusClass.value +
        (thumb.thumbColor.value !== void 0
          ? ` text-${thumb.thumbColor.value}`
          : '')
    )

    const style = computed(() => ({
      width: props.thumbSize,
      height: props.thumbSize,
      [positionProp.value]: `${100 * thumb.ratio.value}%`,
      zIndex: focus.value === thumb.focusValue ? 2 : void 0
    }))

    const pinColor = computed(() =>
      thumb.labelColor.value !== void 0 ? ` text-${thumb.labelColor.value}` : ''
    )

    const textContainerStyle = computed(() =>
      getTextContainerStyle(thumb.ratio.value)
    )

    const textClass = computed(
      () =>
        'q-slider__text' +
        (thumb.labelTextColor.value !== void 0
          ? ` text-${thumb.labelTextColor.value}`
          : '')
    )

    return () => {
      const thumbContent = [
        h(
          'svg',
          {
            class: 'q-slider__thumb-shape absolute-full',
            viewBox: '0 0 20 20',
            'aria-hidden': 'true'
          },
          [h('path', { d: props.thumbPath })]
        ),

        h('div', { class: 'q-slider__focus-ring fit' })
      ]

      if (props.label || props.labelAlways) {
        thumbContent.push(
          h(
            'div',
            {
              class:
                pinClass.value +
                ' absolute fit no-pointer-events' +
                pinColor.value
            },
            [
              h(
                'div',
                {
                  class: labelClass.value,
                  style: { minWidth: props.thumbSize }
                },
                [
                  h(
                    'div',
                    {
                      class: textContainerClass.value,
                      style: textContainerStyle.value
                    },
                    [h('span', { class: textClass.value }, thumb.label.value)]
                  )
                ]
              )
            ]
          )
        )

        if (props.name !== void 0 && !props.disable) {
          injectFormInput(thumbContent, 'push')
        }
      }

      return h(
        'div',
        {
          class: thumbClasses.value,
          style: style.value,
          ...thumb.getNodeData()
        },
        thumbContent
      )
    }
  }

  function getContent(
    selectionBarStyle,
    trackContainerTabindex,
    trackContainerEvents,
    injectThumb
  ) {
    const trackContent = []

    if (props.innerTrackColor !== 'transparent') {
      trackContent.push(
        h('div', {
          key: 'inner',
          class: innerBarClass.value,
          style: innerBarStyle.value
        })
      )
    }

    if (props.selectionColor !== 'transparent') {
      trackContent.push(
        h('div', {
          key: 'selection',
          class: selectionBarClass.value,
          style: selectionBarStyle.value
        })
      )
    }

    if (props.markers !== false) {
      trackContent.push(
        h('div', {
          key: 'marker',
          class: markerClass.value,
          style: markerStyle.value
        })
      )
    }

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
          h(
            'div',
            {
              class: trackClass.value,
              style: trackStyle.value
            },
            trackContent
          )
        ],
        'slide',
        editable.value,
        () => panDirective.value
      )
    ]

    if (props.markerLabels !== false) {
      const action = props.switchMarkerLabelsSide ? 'unshift' : 'push'

      content[action](
        h(
          'div',
          {
            key: 'markerL',
            class: markerLabelsContainerClass.value
          },
          getMarkerLabelsContent()
        )
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

      roundValueFn,
      keyStep,
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
